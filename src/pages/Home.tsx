import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-20  h-full px-10">
            {/* Hero Section */}
            <div className="max-w-3xl mx-auto">
                <div className="inline-block mb-6 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium text-primary">Digital License Registration System</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Secure Digital Licensing Made <span className="text-primary">Simple</span>
                </h2>

                <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                    Welcome to DLRS, the comprehensive solution for digital license registration and management. Secure, efficient, and user-friendly.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    {user ? (
                        <>
                            <Link to="/idp">
                                <Button size="lg" className="h-12 px-8">
                                    IDP Management
                                </Button>
                            </Link>
                            <Link to="/verify-idp">
                                <Button size="lg" variant="outline" className="h-12 px-8">
                                    Verify
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/verify-idp">
                                <Button size="lg" variant="outline" className="h-12 px-8">
                                    Verify IDP
                                </Button>
                            </Link>
                            <Link to="/public-idp-application">
                                <Button size="lg" className="h-12 px-8">
                                    Apply for IDP
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Trusted Car Rental Companies Section */}
            <div className="w-full my-12 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="container mx-auto">
                    <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto text-center">
                        We advise international driving license users to rent cars from trusted companies.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4">
                        <img src="/logos/Budget-Logo.png" alt="Budget" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Thrifty-car-rental-logo.jpg" alt="Thrifty" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Hertz_logo.jpg" alt="Hertz" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/dollar.7a3cc7e0.svg" alt="Dollar" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/png-transparent-national-car-rental-enterprise-rent-a-car-budget-rent-a-car-car-rental-text-logo-car.png" alt="National" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Sixt-Logo.jpg" alt="Sixt" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Alamo_Rent_a_Car_(logo).svg.png" alt="Alamo" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/AVIS_logo_2012.svg.png" alt="Avis" className="h-12 md:h-16 object-contain" />
                        <img src="/logos/Europcar-Logo.svg.png" alt="Europcar" className="h-12 md:h-16 object-contain" />
                    </div>
                </div>
            </div>

            {/* Application Process Section */}
            <div id="why" className="w-full my-20 py-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 text-left px-6">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Complete Your IDP Application in Just 5 Minutes
                            </h2>
                            <p className="text-lg text-foreground/70 mb-8">
                                An International Driving Permit (IDP) is essential for driving abroad, complementing your native license.
                                Our streamlined digital process ensures quick issuance, helping you meet international driving requirements
                                with confidence and legal compliance in over 150 countries worldwide.
                            </p>
                            <Link to="/public-idp-application">
                                <Button size="lg" className="h-12 px-8">
                                    APPLY NOW
                                </Button>
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img
                                src="/home_image_1.jpeg"
                                alt="International Driver's Permit"
                                className="max-w-full h-auto rounded-lg shadow-lg"
                                width="586"
                                height="678"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Requirements and Benefits Section */}
            <div className="w-full my-20 py-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Requirements Column */}
                        <div className="w-full md:w-1/2 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="mr-2 text-primary">•</span>
                                    <span>You must be 18 years or older to apply</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-primary">•</span>
                                    <span>You must have a valid driver's license from your country</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-primary">•</span>
                                    <span>No driving test is required</span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link to="/public-idp-application">
                                    <Button className="h-12 px-8">
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Benefits Column */}
                        <div className="w-full md:w-1/2">
                            <div className="mb-6">
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src="https://automobiledrivingclub.org.uk/wp-content/uploads/2022/04/istockphoto-1307382585-612x612-1.jpg"
                                        alt="International Driving"
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                    <div className="mb-4 text-primary text-xl">
                                        <i className="far fa-snowflake"></i>
                                    </div>
                                    <p className="text-foreground/70">
                                        Valid for 1-3 years with fast worldwide shipping options
                                    </p>
                                </div>
                                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                    <div className="mb-4 text-primary text-xl">
                                        <i className="fas fa-tools"></i>
                                    </div>
                                    <p className="text-foreground/70">
                                        Quick application process with fast approval
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is IDP Section */}
            <div className="w-full my-20 py-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl" id="idp">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* What is IDP Column */}
                        <div className="w-full md:w-1/2 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">WHAT IS IDP</h2>
                            <p className="text-foreground/70 mb-6">
                                The International Driving Permit <strong>(IDP)</strong> is an official document that helps you drive overseas using your existing valid driver's license.
                                It's commonly required by car rental agencies and frequently requested by traffic authorities when you present your foreign driver's license.
                            </p>
                            <div className="flex justify-center mt-8">
                                <Link to="/public-idp-application">
                                    <Button className="h-12 px-8">
                                        <span className="mr-2">Learn More</span>
                                        <span>→</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* How It Works Column */}
                        <div className="w-full md:w-1/2 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">HOW IT WORKS</h2>
                            <p className="text-foreground/70 mb-6">
                                An IDP translates your driver's license into a format that's recognized internationally.
                                It's designed to be universally understood, bridging language barriers and ensuring your driving credentials
                                are recognized in over 150 countries worldwide.
                            </p>
                            <div className="flex justify-center mt-8">
                                <Link to="/verify-idp">
                                    <Button className="h-12 px-8">
                                        <span className="mr-2">Learn More</span>
                                        <span>→</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full mt-20 md:mt-32">
                <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Key Features</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-sm transition-all">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <span className="text-lg text-primary">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-foreground/70">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="w-full my-20 py-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-xl">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Select the IDP duration that best fits your travel needs. Both options provide comprehensive coverage for international driving.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
                        {/* 1 Year Plan */}
                        <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                            <div className="p-6 bg-primary/10 border-b border-border">
                                <h3 className="text-2xl font-bold text-center">1 Year Plan</h3>
                            </div>
                            <div className="p-8">
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Printed Booklet</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>100% Money Back Guarantee</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Express International Delivery</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>IDP Translated to 26 Languages</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3 Year Plan */}
                        <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border-2 border-primary relative transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                BEST VALUE
                            </div>
                            <div className="p-6 bg-primary/20 border-b border-border">
                                <h3 className="text-2xl font-bold text-center">3 Year Plan</h3>
                            </div>
                            <div className="p-8">
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Printed Booklet</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Digital Document</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>100% Money Back Guarantee</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Express International Delivery</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Digital Document in Under 24 Hours</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>IDP Translated to 26 Languages</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

const features = [
    {
        icon: "🔒",
        title: "Secure Licensing",
        description: "Advanced encryption and security protocols ensure your license data is protected at all times."
    },
    {
        icon: "📱",
        title: "Mobile Support",
        description: "Access and manage your licenses from any device with our responsive, user-friendly interface."
    },
    {
        icon: "⚡",
        title: "Fast Processing",
        description: "Streamlined workflows enable quick license issuance and renewal with minimal waiting time."
    }
];
