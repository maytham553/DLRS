import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { IDPFormData, IDPFormInput } from "../../types/idp";
import { generateIdpId, generateImageId } from "../../utils/idGenerator";
import { addIdpApplication, uploadFile } from "../../services/firebase";
import { FileUpload } from "../../components/FileUpload";
import CountrySelect from "../../components/CountrySelect";
import { useNavigate } from "react-router-dom";

export const IDPApplication = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [idpId] = useState(generateIdpId());
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);
    const [issueDate] = useState<Date>(new Date()); // Current date as issue date

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
        watch
    } = useForm<IDPFormInput>({
        defaultValues: {
            id: idpId,
            name: "Maytham",
            familyName: "Al-Qahtani",
            phoneNumber: "0505050505",
            gender: "Male",
            birthDate: "1990-01-01",
            birthPlace: "Saudi Arabia",
            licenseNumber: "1234567890",
            licenseClass: [],
            issuerCountry: "Saudi Arabia",
            addressLine1: "123 Main St",
            addressLine2: "Apt 1",
            city: "Riyadh",
            state: "Riyadh",
            zipCode: "12345",
            country: "Saudi Arabia",
            residenceCountry: "Saudi Arabia",
            duration: "1 YEAR - $50",
            requestIdCard: "No",
            personalPhoto: null,
            licenseFrontPhoto: null,
            licenseBackPhoto: null,
            isCanceled: false // Default is not canceled
        },
    });

    const navigate = useNavigate();

    // Calculate expiry date based on duration
    const calculateExpiryDate = (durationString: string): Date => {
        const now = new Date();
        const result = new Date(now);
        
        if (durationString.includes("1 YEAR")) {
            result.setFullYear(now.getFullYear() + 1);
        } else if (durationString.includes("3 YEAR")) {
            result.setFullYear(now.getFullYear() + 3);
        } else if (durationString.includes("5 YEAR")) {
            result.setFullYear(now.getFullYear() + 5);
        } else if (durationString.includes("10 YEAR")) {
            result.setFullYear(now.getFullYear() + 10);
        }
        
        return result;
    };

    // Watch for duration changes and update expiry date
    const selectedDuration = watch("duration");
    useEffect(() => {
        if (selectedDuration) {
            setExpiryDate(calculateExpiryDate(selectedDuration));
        }
    }, [selectedDuration]);

    // Upload a single file and update state
    const uploadSingleFile = async (
        file: File,
        fileType: 'personalPhoto' | 'licenseFrontPhoto' | 'licenseBackPhoto'
    ) => {
        if (!file) return;

        try {
            // Set uploading state
            setUploading(prev => ({ ...prev, [fileType]: true }));

            // Clear any previous errors
            setPhotoErrors(prev => ({ ...prev, [fileType]: "" }));

            // Create a path for the file
            // get auth firebase user id 

            const path = `idps/${idpId}/${fileType}-${generateImageId()}`;

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
        // Create a preview if a file is selected
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPersonalPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload the file immediately
            await uploadSingleFile(file, 'personalPhoto');
        } else {
            // Clear preview and URL if file is removed
            setPersonalPhotoPreview(undefined);
            setPersonalPhotoUrl(null);
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
            setLicenseFrontPhotoPreview(undefined);
            setLicenseFrontPhotoUrl(null);
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
            setLicenseBackPhotoPreview(undefined);
            setLicenseBackPhotoUrl(null);
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
            // Prepare data with photo URLs for Firestore
            const idpData: IDPFormData = {
                ...data,
                personalPhoto: personalPhotoUrl!,
                licenseFrontPhoto: licenseFrontPhotoUrl!,
                licenseBackPhoto: licenseBackPhotoUrl!,
                isCanceled: false, // New applications are not canceled
                expiryDate: expiryDate ? {
                    seconds: Math.floor(expiryDate.getTime() / 1000),
                    nanoseconds: 0
                } : undefined,
                issueDate: {
                    seconds: Math.floor(issueDate.getTime() / 1000),
                    nanoseconds: 0
                }
            };

            // Submit form data to Firestore
            const result = await addIdpApplication(idpData);

            if (result.error) {
                throw new Error("Failed to submit application");
            }

            // Redirect to the index page
            navigate("/idp");

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold">New IDP Application</h1>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate("/idp")}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Back to List
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded">
                    {error}
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
                            <CountrySelect
                                id="birthPlace"
                                {...register("birthPlace", { required: "Birth place is required" })}
                                required
                                error={errors.birthPlace?.message}
                            />
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
                            <CountrySelect
                                id="issuerCountry"
                                {...register("issuerCountry", { required: "Issuer country is required" })}
                                required
                                error={errors.issuerCountry?.message}
                            />
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
                                        maxLength: { value: 10, message: "Zip code must not exceed 10 characters" },
                                        pattern: { value: /^\d+$/, message: "Zip code must contain only numbers" }
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
                                <CountrySelect
                                    id="country"
                                    {...register("country", { required: "Country is required" })}
                                    required
                                    error={errors.country?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="residenceCountry" className="block font-medium">
                                    Country of Residence *
                                </label>
                                <CountrySelect
                                    id="residenceCountry"
                                    {...register("residenceCountry", { required: "Country of residence is required" })}
                                    required
                                    error={errors.residenceCountry?.message}
                                />
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
                            {expiryDate && (
                                <p className="text-green-600 text-sm mt-2">
                                    Expires on: {expiryDate.toISOString().split('T')[0]}
                                </p>
                            )}
                            <p className="text-blue-600 text-sm mt-2">
                                Issue date: {issueDate.toISOString().split('T')[0]}
                            </p>
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
        </div>
    );
};