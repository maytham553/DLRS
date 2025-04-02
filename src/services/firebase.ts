import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

// Auth state listener
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Firestore functions
export const addIdpApplication = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "idps"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error };
  }
};

// Updated getUserIdpApplications to fetch up to 250 records with optional search
export const getUserIdpApplications = async (searchTerm = "") => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // If there's a search term, filter by name or familyName
    if (searchTerm) {
      // Firebase doesn't support OR conditions directly in queries,
      // so we'll need to do multiple queries and combine results
      const nameQuery = query(
        collection(db, "idps"),
        orderBy("name"),
        // Use startAt and endAt with the search term to get partial matches
        startAt(searchTerm.toLowerCase()),
        endAt(searchTerm.toLowerCase() + "\uf8ff"),
        limit(250)
      );

      const familyNameQuery = query(
        collection(db, "idps"),
        orderBy("familyName"),
        startAt(searchTerm.toLowerCase()),
        endAt(searchTerm.toLowerCase() + "\uf8ff"),
        limit(250)
      );

      // Execute both queries
      const nameSnapshot = await getDocs(nameQuery);
      const familyNameSnapshot = await getDocs(familyNameQuery);

      // Combine and deduplicate results
      const nameResults = nameSnapshot.docs;
      const familyNameResults = familyNameSnapshot.docs;

      // Use Map to deduplicate by document ID
      const uniqueDocs = new Map();
      [...nameResults, ...familyNameResults].forEach((doc) => {
        uniqueDocs.set(doc.id, doc);
      });

      // Convert to array (limited to 250 records max)
      const resultDocs = Array.from(uniqueDocs.values()).slice(0, 250);

      const applications = resultDocs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
      }));

      return {
        applications,
        error: null,
      };
    } else {
      // If no search term, get all records (limited to 250)
      const idpsQuery = query(
        collection(db, "idps"),
        orderBy("createdAt", "desc"),
        limit(250)
      );

      const querySnapshot = await getDocs(idpsQuery);
      const applications = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
      }));

      return {
        applications,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error fetching IDP applications:", error);
    return {
      applications: [],
      error,
    };
  }
};

// Storage functions
export const uploadFile = (
  file: File,
  path: string,
  onProgressUpdate: (progress: number) => void
) => {
  return new Promise<string>((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgressUpdate(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export { auth, db, storage };
