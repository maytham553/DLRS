import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CountrySelect from "../components/CountrySelect";
import { IDPFormInput } from "../types/idp";
import { generateIdpId } from "../utils/idGenerator";
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
    } = useForm<IDPFormInput>();

    // Form state
    const [error, setError] = useState<string | null>(null);
    const [whatsappReady, setWhatsappReady] = useState(false);
    const [applicationData, setApplicationData] = useState<any | null>(null);
    const onSubmit: SubmitHandler<IDPFormInput> = async (data) => {
        setError(null);

        try {
            // Create timestamp for Firestore
            const timestamp = {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: 0
            };

            // Ensure licenseClass is an array
            if (!Array.isArray(data.licenseClass)) {
                data.licenseClass = [data.licenseClass];
            }

            const formData: any = {
                ...data,
                id: idpId,
                createdAt: timestamp
            };

            // Save application data for WhatsApp
            setApplicationData(formData);

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
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}

*Personal Information:*
Name: ${applicationData.name} ${applicationData.familyName}
Phone: ${applicationData.phoneNumber}
Country Code: ${applicationData.countryCode}
Gender: ${applicationData.gender}
Birth Date: ${formatDate(applicationData.birthDate)}
Birth Place: ${applicationData.birthPlace}

*License Information:*
License Number: ${applicationData.licenseNumber}
License Class: ${Array.isArray(applicationData.licenseClass) ? applicationData.licenseClass.join(', ') : applicationData.licenseClass}
Issuer Country: ${applicationData.issuerCountry}

*Address Information:*
Address Line1: ${applicationData.addressLine1}
Address Line2: ${applicationData.addressLine2 || "N/A"}
City: ${applicationData.city}
State: ${applicationData.state}
Zip Code: ${applicationData.zipCode}
Country: ${applicationData.country}
Country of Residence: ${applicationData.residenceCountry}

*IDP Options:*
Duration: ${applicationData.duration}
Price: ${getDurationPrice(applicationData.duration)}
ID Card Requested: ${applicationData.requestIdCard}
`;

        console.log("WhatsApp Message:", message);
        return encodeURIComponent(message);
    };

    // Helper function to get the price based on duration
    const getDurationPrice = (duration: string) => {
        switch (duration) {
            case "1 year": return "$50";
            case "3 years": return "$70";
            case "5 years": return "$115";
            case "10 years": return "$200";
            default: return "Price not available";
        }
    };

    const handleSendToWhatsApp = () => {
        if (!applicationData) return;

        // Use the user's phone number if available, otherwise use a default
        const targetPhone = "+9647811235937";
        const message = formatWhatsAppMessage();

        // Open WhatsApp with the pre-filled message
        window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {whatsappReady ? (
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
                                    <div className="flex">
                                        <select
                                            id="countryCode"
                                            className="p-2 border rounded-l focus:ring-2 focus:ring-blue-500 border-r-0"
                                            onChange={(e) => {
                                                const code = e.target.value;
                                                setValue("countryCode", code);
                                            }}
                                        >
                                            <option value="964">+964 (Iraq)</option>
                                            <option value="1">+1 (USA/Canada)</option>
                                            <option value="7">+7 (Russia)</option>
                                            <option value="20">+20 (Egypt)</option>
                                            <option value="27">+27 (South Africa)</option>
                                            <option value="30">+30 (Greece)</option>
                                            <option value="31">+31 (Netherlands)</option>
                                            <option value="32">+32 (Belgium)</option>
                                            <option value="33">+33 (France)</option>
                                            <option value="34">+34 (Spain)</option>
                                            <option value="36">+36 (Hungary)</option>
                                            <option value="39">+39 (Italy)</option>
                                            <option value="40">+40 (Romania)</option>
                                            <option value="41">+41 (Switzerland)</option>
                                            <option value="43">+43 (Austria)</option>
                                            <option value="44">+44 (UK)</option>
                                            <option value="45">+45 (Denmark)</option>
                                            <option value="46">+46 (Sweden)</option>
                                            <option value="47">+47 (Norway)</option>
                                            <option value="48">+48 (Poland)</option>
                                            <option value="49">+49 (Germany)</option>
                                            <option value="51">+51 (Peru)</option>
                                            <option value="52">+52 (Mexico)</option>
                                            <option value="54">+54 (Argentina)</option>
                                            <option value="55">+55 (Brazil)</option>
                                            <option value="56">+56 (Chile)</option>
                                            <option value="57">+57 (Colombia)</option>
                                            <option value="58">+58 (Venezuela)</option>
                                            <option value="60">+60 (Malaysia)</option>
                                            <option value="61">+61 (Australia)</option>
                                            <option value="62">+62 (Indonesia)</option>
                                            <option value="63">+63 (Philippines)</option>
                                            <option value="64">+64 (New Zealand)</option>
                                            <option value="65">+65 (Singapore)</option>
                                            <option value="66">+66 (Thailand)</option>
                                            <option value="81">+81 (Japan)</option>
                                            <option value="82">+82 (South Korea)</option>
                                            <option value="84">+84 (Vietnam)</option>
                                            <option value="86">+86 (China)</option>
                                            <option value="90">+90 (Turkey)</option>
                                            <option value="91">+91 (India)</option>
                                            <option value="92">+92 (Pakistan)</option>
                                            <option value="93">+93 (Afghanistan)</option>
                                            <option value="94">+94 (Sri Lanka)</option>
                                            <option value="95">+95 (Myanmar)</option>
                                            <option value="98">+98 (Iran)</option>
                                            <option value="212">+212 (Morocco)</option>
                                            <option value="213">+213 (Algeria)</option>
                                            <option value="216">+216 (Tunisia)</option>
                                            <option value="218">+218 (Libya)</option>
                                            <option value="220">+220 (Gambia)</option>
                                            <option value="221">+221 (Senegal)</option>
                                            <option value="222">+222 (Mauritania)</option>
                                            <option value="223">+223 (Mali)</option>
                                            <option value="234">+234 (Nigeria)</option>
                                            <option value="249">+249 (Sudan)</option>
                                            <option value="254">+254 (Kenya)</option>
                                            <option value="256">+256 (Uganda)</option>
                                            <option value="260">+260 (Zambia)</option>
                                            <option value="263">+263 (Zimbabwe)</option>
                                            <option value="351">+351 (Portugal)</option>
                                            <option value="352">+352 (Luxembourg)</option>
                                            <option value="353">+353 (Ireland)</option>
                                            <option value="358">+358 (Finland)</option>
                                            <option value="359">+359 (Bulgaria)</option>
                                            <option value="380">+380 (Ukraine)</option>
                                            <option value="420">+420 (Czech Republic)</option>
                                            <option value="421">+421 (Slovakia)</option>
                                            <option value="961">+961 (Lebanon)</option>
                                            <option value="962">+962 (Jordan)</option>
                                            <option value="963">+963 (Syria)</option>
                                            <option value="964">+964 (Iraq)</option>
                                            <option value="965">+965 (Kuwait)</option>
                                            <option value="966">+966 (Saudi Arabia)</option>
                                            <option value="967">+967 (Yemen)</option>
                                            <option value="968">+968 (Oman)</option>
                                            <option value="970">+970 (Palestine)</option>
                                            <option value="971">+971 (UAE)</option>
                                            <option value="973">+973 (Bahrain)</option>
                                            <option value="974">+974 (Qatar)</option>
                                            <option value="975">+975 (Bhutan)</option>
                                            <option value="976">+976 (Mongolia)</option>
                                            <option value="977">+977 (Nepal)</option>
                                            <option value="994">+994 (Azerbaijan)</option>
                                            <option value="995">+995 (Georgia)</option>
                                            <option value="998">+998 (Uzbekistan)</option>
                                        </select>
                                        <input
                                            id="phoneNumber"
                                            type="text"
                                            {...register("phoneNumber", {
                                                required: "WhatsApp number is required",
                                            })}
                                            className="flex-1 p-2 border rounded-r focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                                    )}
                                    <p className="text-xs text-gray-500">Select a country code and enter your phone number</p>
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
                                    <div className="grid grid-cols-5 gap-2">
                                        {["A", "B", "C", "D", "E"].map((licenseType) => (
                                            <label key={licenseType} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    value={licenseType}
                                                    {...register("licenseClass", { 
                                                        required: "At least one license class is required",
                                                        validate: value => value.length > 0 || "At least one license class is required"
                                                    })}
                                                    className="h-4 w-4"
                                                />
                                                <span>Class {licenseType}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.licenseClass && (
                                        <p className="text-red-500 text-sm">{errors.licenseClass.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <CountrySelect
                                        id="issuerCountry"
                                        label="Issuer Country"
                                        required
                                        {...register("issuerCountry", { required: "Issuer country is required" })}
                                        error={errors.issuerCountry?.message}
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

                                    <CountrySelect
                                        id="country"
                                        label="Country"
                                        required
                                        {...register("country", { required: "Country is required" })}
                                        error={errors.country?.message}
                                    />

                                    <CountrySelect
                                        id="residenceCountry"
                                        label="Country of Residence"
                                        required
                                        {...register("residenceCountry", { required: "Country of residence is required" })}
                                        error={errors.residenceCountry?.message}
                                    />
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
                                                value="1 year"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            <span className="flex-1">1 YEAR</span>
                                            <span className="font-medium text-green-600">$50</span>
                                        </label>
                                        <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value="3 years"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            <span className="flex-1">3 YEARS</span>
                                            <span className="font-medium text-green-600">$70</span>
                                        </label>
                                        <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value="5 years"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            <span className="flex-1">5 YEARS</span>
                                            <span className="font-medium text-green-600">$115</span>
                                        </label>
                                        <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                value="10 years"
                                                {...register("duration", { required: "Duration is required" })}
                                                className="mr-2"
                                            />
                                            <span className="flex-1">10 YEARS</span>
                                            <span className="font-medium text-green-600">$200</span>
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
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {isSubmitting
                                    ? "Submitting..." : "Submit Application"
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