import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, uploadFile } from "../../services/firebase";
import { IDPFormData, IDPFormInput, StatusType } from "../../types/idp";
import { useForm, SubmitHandler } from "react-hook-form";
import { FileUpload } from "../../components/FileUpload";

export const IDPEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasExpired, setHasExpired] = useState(false);

    // State for upload progress
    const [personalPhotoProgress, setPersonalPhotoProgress] = useState(0);
    const [licenseFrontPhotoProgress, setLicenseFrontPhotoProgress] = useState(0);
    const [licenseBackPhotoProgress, setLicenseBackPhotoProgress] = useState(0);

    // State for preview URLs
    const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string | undefined>(undefined);
    const [licenseFrontPhotoPreview, setLicenseFrontPhotoPreview] = useState<string | undefined>(undefined);
    const [licenseBackPhotoPreview, setLicenseBackPhotoPreview] = useState<string | undefined>(undefined);

    // State for uploaded URLs
    const [personalPhotoUrl, setPersonalPhotoUrl] = useState<string | null>(null);
    const [licenseFrontPhotoUrl, setLicenseFrontPhotoUrl] = useState<string | null>(null);
    const [licenseBackPhotoUrl, setLicenseBackPhotoUrl] = useState<string | null>(null);

    // State for file errors
    const [photoErrors, setPhotoErrors] = useState({
        personalPhoto: "",
        licenseFrontPhoto: "",
        licenseBackPhoto: ""
    });

    // State for upload status
    const [uploading, setUploading] = useState({
        personalPhoto: false,
        licenseFrontPhoto: false,
        licenseBackPhoto: false
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<IDPFormInput & { status: StatusType }>({
        defaultValues: {
            id: "",
            name: "",
            familyName: "",
            phoneNumber: "",
            gender: "Male",
            birthDate: "",
            birthPlace: "",
            licenseNumber: "",
            licenseClass: [],
            issuerCountry: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            residenceCountry: "",
            duration: "1 YEAR - $50",
            requestIdCard: "No",
            personalPhoto: null,
            licenseFrontPhoto: null,
            licenseBackPhoto: null,
            status: "approved"
        },
    });

    // Watch for status changes
    const formStatus = watch("status");

    useEffect(() => {
        const fetchApplication = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const docRef = doc(db, "idps", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as IDPFormData;

                    // Set form data with react-hook-form
                    Object.entries(data).forEach(([key, value]) => {
                        if (key !== 'personalPhoto' && key !== 'licenseFrontPhoto' && key !== 'licenseBackPhoto') {
                            setValue(key as keyof (IDPFormInput & { status: StatusType }), value);
                        }
                    });

                    // Set status (default to 'approved' if not set)
                    const status = data.status || 'approved';
                    setValue('status', status as StatusType);

                    // Set up image previews and URLs
                    if (data.personalPhoto) {
                        setPersonalPhotoPreview(data.personalPhoto);
                        setPersonalPhotoUrl(data.personalPhoto);
                    }

                    if (data.licenseFrontPhoto) {
                        setLicenseFrontPhotoPreview(data.licenseFrontPhoto);
                        setLicenseFrontPhotoUrl(data.licenseFrontPhoto);
                    }

                    if (data.licenseBackPhoto) {
                        setLicenseBackPhotoPreview(data.licenseBackPhoto);
                        setLicenseBackPhotoUrl(data.licenseBackPhoto);
                    }

                    // Check if the IDP has expired
                    if (data.createdAt) {
                        const issueDate = new Date((data.createdAt as any).seconds * 1000);
                        const expirationDate = new Date(issueDate);
                        if (data.duration.includes("1 YEAR")) {
                            expirationDate.setFullYear(issueDate.getFullYear() + 1);
                        } else if (data.duration.includes("3 YEAR")) {
                            expirationDate.setFullYear(issueDate.getFullYear() + 3);
                        } else if (data.duration.includes("5 YEAR")) {
                            expirationDate.setFullYear(issueDate.getFullYear() + 5);
                        } else if (data.duration.includes("10 YEAR")) {
                            expirationDate.setFullYear(issueDate.getFullYear() + 10);
                        } else {
                            // Legacy format handling
                            if (data.duration === "1 year") {
                                expirationDate.setFullYear(issueDate.getFullYear() + 1);
                            } else if (data.duration === "3 years") {
                                expirationDate.setFullYear(issueDate.getFullYear() + 3);
                            }
                        }
                        setHasExpired(new Date() > expirationDate);
                    }
                } else {
                    setError("Application not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load application");
                console.error("Error loading application:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [id, setValue]);

    // Upload a single file and update state
    const uploadSingleFile = async (
        file: File,
        fileType: 'personalPhoto' | 'licenseFrontPhoto' | 'licenseBackPhoto'
    ) => {
        if (!file || !id) return;

        try {
            // Set uploading state
            setUploading(prev => ({ ...prev, [fileType]: true }));

            // Clear any previous errors
            setPhotoErrors(prev => ({ ...prev, [fileType]: "" }));

            // Create a path for the file
            const path = `idps/${id}/${fileType}-${Date.now()}`;

            // Determine which progress setter to use
            const progressSetter =
                fileType === 'personalPhoto' ? setPersonalPhotoProgress :
                    fileType === 'licenseFrontPhoto' ? setLicenseFrontPhotoProgress :
                        setLicenseBackPhotoProgress;

            // Upload the file
            const downloadUrl = await uploadFile(file, path, progressSetter);

            // Store the download URL
            if (fileType === 'personalPhoto') {
                setPersonalPhotoUrl(downloadUrl);
            } else if (fileType === 'licenseFrontPhoto') {
                setLicenseFrontPhotoUrl(downloadUrl);
            } else {
                setLicenseBackPhotoUrl(downloadUrl);
            }

            return downloadUrl;
        } catch (error) {
            console.error(`Error uploading ${fileType}:`, error);
            setPhotoErrors(prev => ({
                ...prev,
                [fileType]: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
            return null;
        } finally {
            setUploading(prev => ({ ...prev, [fileType]: false }));
        }
    };

    // Handle file selection for each upload
    const handlePersonalPhotoSelect = async (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPersonalPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file immediately
            await uploadSingleFile(file, 'personalPhoto');
        } else {
            // Keep the existing URL if no new file is selected
            setPersonalPhotoPreview(personalPhotoUrl ?? '');
            setPersonalPhotoProgress(0);
        }
    };

    const handleLicenseFrontPhotoSelect = async (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLicenseFrontPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file immediately
            await uploadSingleFile(file, 'licenseFrontPhoto');
        } else {
            // Keep the existing URL if no new file is selected
            setLicenseFrontPhotoPreview(licenseFrontPhotoUrl ?? '');
            setLicenseFrontPhotoProgress(0);
        }
    };

    const handleLicenseBackPhotoSelect = async (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLicenseBackPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file immediately
            await uploadSingleFile(file, 'licenseBackPhoto');
        } else {
            // Keep the existing URL if no new file is selected
            setLicenseBackPhotoPreview(licenseBackPhotoUrl ?? '');
            setLicenseBackPhotoProgress(0);
        }
    };

    const validatePhotoUrls = () => {
        let isValid = true;
        const newErrors = { ...photoErrors };

        if (!personalPhotoUrl) {
            newErrors.personalPhoto = "Personal photo is required";
            isValid = false;
        }

        if (!licenseFrontPhotoUrl) {
            newErrors.licenseFrontPhoto = "License front photo is required";
            isValid = false;
        }

        if (!licenseBackPhotoUrl) {
            newErrors.licenseBackPhoto = "License back photo is required";
            isValid = false;
        }

        setPhotoErrors(newErrors);
        return isValid;
    };

    const onSubmit: SubmitHandler<any> = async (data) => {
        if (!id) return;

        // Check if any uploads are in progress
        if (uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto) {
            setError("Please wait for all file uploads to complete before submitting");
            return;
        }

        // Validate that all photos have been uploaded
        if (!validatePhotoUrls()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Initialize the update data with the current form data
            const updateData: Partial<IDPFormData> = {
                ...data,
                personalPhoto: personalPhotoUrl!,
                licenseFrontPhoto: licenseFrontPhotoUrl!,
                licenseBackPhoto: licenseBackPhotoUrl!,
                status: data.status
            };

            // Update the document
            const docRef = doc(db, "idps", id);
            await updateDoc(docRef, updateData);

            // Navigate to the view page instead of index
            navigate(`/idp/view/${id}`);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update application");
            console.error("Error updating application:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get status color
    const getStatusColor = (status: StatusType) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Edit IDP Application</h1>
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Loading application data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit International Driving Permit Application</h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Status Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">IDP Status</h2>
                    <div className="flex items-center mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${getStatusColor(formStatus)}`}>
                            {formStatus.toUpperCase()}
                        </div>
                        {hasExpired && formStatus === 'approved' && (
                            <div className="text-xs text-orange-500">
                                (Note: Expiration date has passed, but status remains APPROVED)
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium mb-2">Change Status</p>
                        <div className="flex flex-wrap gap-3">
                            <label className={`flex items-center px-4 py-2 rounded-md border ${formStatus === 'approved' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                                <input
                                    type="radio"
                                    value="approved"
                                    {...register("status")}
                                    className="mr-2"
                                />
                                Approved
                            </label>
                            <label className={`flex items-center px-4 py-2 rounded-md border ${formStatus === 'canceled' ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                                <input
                                    type="radio"
                                    value="canceled"
                                    {...register("status")}
                                    className="mr-2"
                                />
                                Canceled
                            </label>
                            <label className={`flex items-center px-4 py-2 rounded-md border ${formStatus === 'expired' ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
                                <input
                                    type="radio"
                                    value="expired"
                                    {...register("status")}
                                    className="mr-2"
                                />
                                Expired
                            </label>
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block font-medium">
                                First Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name", { required: "First name is required", maxLength: 50 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="familyName" className="block font-medium">
                                Family Name *
                            </label>
                            <input
                                id="familyName"
                                type="text"
                                {...register("familyName", { required: "Family name is required", maxLength: 50 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.familyName && (
                                <p className="text-red-500 text-sm">{errors.familyName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="block font-medium">
                                Phone Number *
                            </label>
                            <input
                                id="phoneNumber"
                                type="text"
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                    minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                                    maxLength: { value: 15, message: "Phone number must not exceed 15 digits" }
                                })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gender" className="block font-medium">
                                Gender *
                            </label>
                            <select
                                id="gender"
                                {...register("gender", { required: "Gender is required" })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm">{errors.gender.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="birthDate" className="block font-medium">
                                Birth Date *
                            </label>
                            <input
                                id="birthDate"
                                type="date"
                                {...register("birthDate", { required: "Birth date is required" })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.birthDate && (
                                <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="birthPlace" className="block font-medium">
                                Birth Place *
                            </label>
                            <input
                                id="birthPlace"
                                type="text"
                                {...register("birthPlace", { required: "Birth place is required", maxLength: 100 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.birthPlace && (
                                <p className="text-red-500 text-sm">{errors.birthPlace.message}</p>
                            )}
                        </div>

                        {/* Personal Photo */}
                        <div className="col-span-2">
                            <FileUpload
                                id="personalPhoto"
                                label="Recent Passport-style Photo"
                                onFileSelect={handlePersonalPhotoSelect}
                                uploadProgress={personalPhotoProgress}
                                previewUrl={personalPhotoPreview}
                                error={photoErrors.personalPhoto}
                            />
                        </div>
                    </div>
                </div>

                {/* License Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">License Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="licenseNumber" className="block font-medium">
                                License Number *
                            </label>
                            <input
                                id="licenseNumber"
                                type="text"
                                {...register("licenseNumber", { required: "License number is required", maxLength: 50 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.licenseNumber && (
                                <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">
                                License Class * (Select all that apply)
                            </label>
                            <div className="grid grid-cols-5 gap-4">
                                {["A", "B", "C", "D", "E"].map((licenseType) => (
                                    <div key={licenseType} className="border rounded p-4 hover:bg-gray-50">
                                        <label className="flex flex-col items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={licenseType}
                                                {...register("licenseClass", { 
                                                    required: "At least one license class is required",
                                                    validate: value => value.length > 0 || "At least one license class is required"
                                                })}
                                                className="h-6 w-6 mb-2"
                                            />
                                            <span className="text-center">Class<br/>{licenseType}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.licenseClass && (
                                <p className="text-red-500 text-sm">{errors.licenseClass.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="issuerCountry" className="block font-medium">
                                Issuer Country *
                            </label>
                            <input
                                id="issuerCountry"
                                type="text"
                                {...register("issuerCountry", { required: "Issuer country is required", maxLength: 100 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.issuerCountry && (
                                <p className="text-red-500 text-sm">{errors.issuerCountry.message}</p>
                            )}
                        </div>
                    </div>

                    {/* License Photos */}
                    <div className="mt-6">
                        <h3 className="font-medium mb-4">License Photos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FileUpload
                                id="licenseFrontPhoto"
                                label="License Front Photo"
                                onFileSelect={handleLicenseFrontPhotoSelect}
                                uploadProgress={licenseFrontPhotoProgress}
                                previewUrl={licenseFrontPhotoPreview}
                                error={photoErrors.licenseFrontPhoto}
                            />
                            <FileUpload
                                id="licenseBackPhoto"
                                label="License Back Photo"
                                onFileSelect={handleLicenseBackPhotoSelect}
                                uploadProgress={licenseBackPhotoProgress}
                                previewUrl={licenseBackPhotoPreview}
                                error={photoErrors.licenseBackPhoto}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="addressLine1" className="block font-medium">
                                Address Line 1 *
                            </label>
                            <input
                                id="addressLine1"
                                type="text"
                                {...register("addressLine1", { required: "Address line 1 is required", maxLength: 100 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.addressLine1 && (
                                <p className="text-red-500 text-sm">{errors.addressLine1.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="addressLine2" className="block font-medium">
                                Address Line 2 (Optional)
                            </label>
                            <input
                                id="addressLine2"
                                type="text"
                                {...register("addressLine2", { maxLength: 100 })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.addressLine2 && (
                                <p className="text-red-500 text-sm">{errors.addressLine2.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="city" className="block font-medium">
                                    City *
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    {...register("city", { required: "City is required", maxLength: 50 })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="state" className="block font-medium">
                                    State/Province *
                                </label>
                                <input
                                    id="state"
                                    type="text"
                                    {...register("state", { required: "State is required", maxLength: 50 })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-sm">{errors.state.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="zipCode" className="block font-medium">
                                    Zip/Postal Code *
                                </label>
                                <input
                                    id="zipCode"
                                    type="text"
                                    {...register("zipCode", {
                                        required: "Zip code is required",
                                        minLength: { value: 5, message: "Zip code must be at least 5 characters" },
                                        maxLength: { value: 10, message: "Zip code must not exceed 10 characters" }
                                    })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.zipCode && (
                                    <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country" className="block font-medium">
                                    Country *
                                </label>
                                <input
                                    id="country"
                                    type="text"
                                    {...register("country", { required: "Country is required", maxLength: 50 })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm">{errors.country.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="residenceCountry" className="block font-medium">
                                    Country of Residence *
                                </label>
                                <input
                                    id="residenceCountry"
                                    type="text"
                                    {...register("residenceCountry", { required: "Country of residence is required", maxLength: 50 })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.residenceCountry && (
                                    <p className="text-red-500 text-sm">{errors.residenceCountry.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* IDP Options Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">IDP Options</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium mb-2">Duration *</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        value="1 YEAR - $50"
                                        {...register("duration", { required: "Duration is required" })}
                                        className="mr-2"
                                    />
                                    <span>1 YEAR - $50</span>
                                </label>
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        value="3 YEAR - $70"
                                        {...register("duration", { required: "Duration is required" })}
                                        className="mr-2"
                                    />
                                    <span>3 YEAR - $70</span>
                                </label>
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        value="5 YEAR - $115"
                                        {...register("duration", { required: "Duration is required" })}
                                        className="mr-2"
                                    />
                                    <span>5 YEAR - $115</span>
                                </label>
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        value="10 YEAR - $200"
                                        {...register("duration", { required: "Duration is required" })}
                                        className="mr-2"
                                    />
                                    <span>10 YEAR - $200</span>
                                </label>
                            </div>
                            {errors.duration && (
                                <p className="text-red-500 text-sm">{errors.duration.message}</p>
                            )}
                        </div>

                        <div>
                            <p className="font-medium mb-2">Request ID Card</p>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="requestIdCard"
                                    {...register("requestIdCard")}
                                    className="mr-2 h-5 w-5"
                                    onChange={(e) => {
                                        const value = e.target.checked ? "Yes" : "No";
                                        // Need to manually set the value since we're using a checkbox for a string field
                                        e.target.value = value;
                                    }}
                                    defaultChecked={(register("requestIdCard") as any).value === "Yes"}
                                />
                                <label htmlFor="requestIdCard">Yes, I want an ID card</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/idp/view/${id}`)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSubmitting
                            ? "Saving..."
                            : uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto
                                ? "Uploading..."
                                : "Save Changes"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IDPEdit; 