import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IDPFormData, IDPFormInput, StatusType } from "../types/idp";
import { generateIdpId } from "../utils/idGenerator";
import { addIdpApplication, uploadFile } from "../services/firebase";
import { FileUpload } from "../components/FileUpload";
import { useNavigate } from "react-router-dom";

const PublicIDPApplication = () => {
    const navigate = useNavigate();

    // Generate ID first so it can be used in the form
    const [idpId] = useState(generateIdpId());

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<IDPFormInput>({
        defaultValues: {
            id: idpId,
            name: "John Doe",
            familyName: "Doe",
            phoneNumber: "+1234567890",
            gender: "Male",
            birthDate: "1990-01-01",
            birthPlace: "City, Country",
            licenseNumber: "ABC123456",
            licenseClass: "A",
            issuerCountry: "Country",
            addressLine1: "123 Main St",
            addressLine2: "Apt 4B",
            city: "Metropolis",
            state: "State",
            zipCode: "12345",
            country: "Country",
            residenceCountry: "Country",
            duration: "1 year",
            requestIdCard: "No",
            personalPhoto: null,
            licenseFrontPhoto: null,
            licenseBackPhoto: null
        }
    });

    // Form state
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [whatsappReady, setWhatsappReady] = useState(false);
    const [applicationData, setApplicationData] = useState<any | null>(null);

    // Photo upload states
    const [personalPhotoUrl, setPersonalPhotoUrl] = useState<string | null>(null);
    const [licenseFrontPhotoUrl, setLicenseFrontPhotoUrl] = useState<string | null>(null);
    const [licenseBackPhotoUrl, setLicenseBackPhotoUrl] = useState<string | null>(null);

    const [personalPhotoProgress, setPersonalPhotoProgress] = useState(0);
    const [licenseFrontPhotoProgress, setLicenseFrontPhotoProgress] = useState(0);
    const [licenseBackPhotoProgress, setLicenseBackPhotoProgress] = useState(0);

    const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string | undefined>(undefined);
    const [licenseFrontPhotoPreview, setLicenseFrontPhotoPreview] = useState<string | undefined>(undefined);
    const [licenseBackPhotoPreview, setLicenseBackPhotoPreview] = useState<string | undefined>(undefined);

    const [uploading, setUploading] = useState({
        personalPhoto: false,
        licenseFrontPhoto: false,
        licenseBackPhoto: false
    });

    const [photoErrors, setPhotoErrors] = useState({
        personalPhoto: "",
        licenseFrontPhoto: "",
        licenseBackPhoto: ""
    });

    // Handle file uploads
    const uploadSingleFile = async (
        file: File,
        path: string,
        progressSetter: React.Dispatch<React.SetStateAction<number>>,
        urlSetter: React.Dispatch<React.SetStateAction<string | null>>,
        previewSetter: React.Dispatch<React.SetStateAction<string | undefined>>,
        uploadType: keyof typeof uploading
    ) => {
        // Set upload status
        setUploading(prev => ({ ...prev, [uploadType]: true }));

        // Clear any previous errors
        setPhotoErrors(prev => ({ ...prev, [uploadType]: "" }));

        try {
            // Create a preview
            const reader = new FileReader();
            reader.onload = () => {
                previewSetter(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Firebase
            const downloadUrl = await uploadFile(file, path, progressSetter);
            urlSetter(downloadUrl);
            return downloadUrl;
        } catch (error) {
            console.error(`Error uploading ${uploadType}:`, error);
            setPhotoErrors(prev => ({
                ...prev,
                [uploadType]: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
            return null;
        } finally {
            setUploading(prev => ({ ...prev, [uploadType]: false }));
        }
    };

    // Handle file selection
    const handlePersonalPhotoSelect = (file: File | null) => {
        if (file) {
            uploadSingleFile(
                file,
                `idp_applications/personal_${generateIdpId()}`,
                setPersonalPhotoProgress,
                setPersonalPhotoUrl,
                setPersonalPhotoPreview,
                "personalPhoto"
            );
        } else {
            // Clear preview and URL if file is removed
            setPersonalPhotoPreview(undefined);
            setPersonalPhotoUrl(null);
            setPersonalPhotoProgress(0);
        }
    };

    const handleLicenseFrontPhotoSelect = (file: File | null) => {
        if (file) {
            uploadSingleFile(
                file,
                `idp_applications/license_front_${generateIdpId()}`,
                setLicenseFrontPhotoProgress,
                setLicenseFrontPhotoUrl,
                setLicenseFrontPhotoPreview,
                "licenseFrontPhoto"
            );
        } else {
            // Clear preview and URL if file is removed
            setLicenseFrontPhotoPreview(undefined);
            setLicenseFrontPhotoUrl(null);
            setLicenseFrontPhotoProgress(0);
        }
    };

    const handleLicenseBackPhotoSelect = (file: File | null) => {
        if (file) {
            uploadSingleFile(
                file,
                `idp_applications/license_back_${generateIdpId()}`,
                setLicenseBackPhotoProgress,
                setLicenseBackPhotoUrl,
                setLicenseBackPhotoPreview,
                "licenseBackPhoto"
            );
        } else {
            // Clear preview and URL if file is removed
            setLicenseBackPhotoPreview(undefined);
            setLicenseBackPhotoUrl(null);
            setLicenseBackPhotoProgress(0);
        }
    };

    // Validate all required photos
    const validatePhotos = (): boolean => {
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

    const onSubmit: SubmitHandler<IDPFormInput> = async (data) => {
        // Check if any uploads are in progress
        if (uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto) {
            setError("Please wait for all file uploads to complete before submitting");
            return;
        }

        // Validate that all photos have been uploaded
        if (!validatePhotos()) {
            return;
        }

        setError(null);

        try {
            // Prepare data with photo URLs for Firestore
            const photoUrls = {
                personalPhoto: personalPhotoUrl!,
                licenseFrontPhoto: licenseFrontPhotoUrl!,
                licenseBackPhoto: licenseBackPhotoUrl!
            };

            // Create timestamp for Firestore
            const timestamp = {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: 0
            };

            const formData: IDPFormData = {
                ...data,
                id: idpId,
                status: "Pending" as StatusType,
                personalPhoto: photoUrls.personalPhoto,
                licenseFrontPhoto: photoUrls.licenseFrontPhoto,
                licenseBackPhoto: photoUrls.licenseBackPhoto,
                createdAt: timestamp
            };

            // Save application data for WhatsApp
            setApplicationData(formData);

            // Submit form data to Firestore
            const result = await addIdpApplication(formData);

            if (result.error) {
                throw new Error("Failed to submit application");
            }

            // Show success message and WhatsApp button
            setSuccessMessage("Your application has been submitted successfully!");
            setWhatsappReady(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    const formatWhatsAppMessage = () => {
        if (!applicationData) return "";

        // Format date in a readable way
        const formatDate = (dateString: string) => {
            if (!dateString) return "N/A";
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                return dateString;
            }
        };

        const message = `
🔷 *NEW IDP APPLICATION* 🔷

*Application Details:*
📋 ID: ${applicationData.id}
📅 Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}

*Personal Information:*
👤 Name: ${applicationData.name} ${applicationData.familyName}
📱 Phone: ${applicationData.phoneNumber}
⚧ Gender: ${applicationData.gender}
🎂 Birth Date: ${formatDate(applicationData.birthDate)}
🌍 Birth Place: ${applicationData.birthPlace}

*License Information:*
🪪 License Number: ${applicationData.licenseNumber}
🔠 License Class: ${applicationData.licenseClass}
🏳️ Issuer Country: ${applicationData.issuerCountry}

*Address Information:*
📍 Address: ${applicationData.addressLine1}${applicationData.addressLine2 ? ', ' + applicationData.addressLine2 : ''}
🏙️ City: ${applicationData.city}
🏙️ State: ${applicationData.state}
📮 Zip Code: ${applicationData.zipCode}
🌐 Country: ${applicationData.country}
🏠 Country of Residence: ${applicationData.residenceCountry}

*IDP Options:*
⏱️ Duration: ${applicationData.duration}
💳 ID Card Requested: ${applicationData.requestIdCard}

*Application Photos:*
To view the application photos, please visit the links below:
👤 Personal Photo: ${applicationData.personalPhoto}
🪪 License Front: ${applicationData.licenseFrontPhoto}
🪪 License Back: ${applicationData.licenseBackPhoto}

Application status: PENDING

Thank you for your application!
`;

        return encodeURIComponent(message);
    };

    const handleSendToWhatsApp = () => {
        if (!applicationData) return;

        // Use the user's phone number if available, otherwise use a default
        const targetPhone = "966505050505"; // Replace with your actual business WhatsApp number
        const message = formatWhatsAppMessage();

        // Open WhatsApp with the pre-filled message
        window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {successMessage ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-500 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                        <p className="text-gray-600 mb-6">Your IDP application has been successfully submitted. Your application ID is: <span className="font-semibold">{applicationData?.id}</span></p>

                        <p className="text-gray-600 mb-4">Click the button below to send your application details via WhatsApp for faster processing:</p>

                        <button
                            onClick={handleSendToWhatsApp}
                            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                            </svg>
                            Send to WhatsApp
                        </button>

                        <div className="mt-8">
                            <button
                                onClick={() => navigate("/")}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <div className="inline-block mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                            <span className="text-sm font-medium text-primary">Digital License Registration System</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-4">Apply for International Driving Permit</h1>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Fill out the form below to apply for your International Driving Permit.
                            All fields marked with an asterisk (*) are required.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {successMessage && !whatsappReady && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-300 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                                        WhatsApp Number *
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        placeholder="e.g. 966505050505"
                                        {...register("phoneNumber", {
                                            required: "WhatsApp number is required",
                                            minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                                            maxLength: { value: 15, message: "Phone number must not exceed 15 digits" },
                                            pattern: { value: /^\d+$/, message: "Phone number must contain only digits" }
                                        })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                                    )}
                                    <p className="text-xs text-gray-500">Please include country code (e.g. 966 for Saudi Arabia)</p>
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
                                    <label htmlFor="licenseClass" className="block font-medium">
                                        License Class *
                                    </label>
                                    <select
                                        id="licenseClass"
                                        {...register("licenseClass", { required: "License class is required" })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                    </select>
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
                                            {...register("zipCode", { required: "Zip code is required", maxLength: 10 })}
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
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="1 year"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            1 year
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="3 years"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            3 years
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
                                                setValue("requestIdCard", e.target.checked ? "Yes" : "No");
                                            }}
                                        />
                                        <label htmlFor="requestIdCard">Yes, I want an ID card</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : uploading.personalPhoto || uploading.licenseFrontPhoto || uploading.licenseBackPhoto
                                        ? "Uploading..."
                                        : "Submit Application"
                                }
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default PublicIDPApplication; 