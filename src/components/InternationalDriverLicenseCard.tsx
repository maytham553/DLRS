import { useState, useRef } from "react";
import { IDPFormData } from "../types/idp";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";

interface InternationalDriverLicenseCardProps {
    application: IDPFormData;
    issueDate: Date | null;
    expiryDate: Date | null;
}

const InternationalDriverLicenseCard = ({
    application,
    issueDate,
    expiryDate
}: InternationalDriverLicenseCardProps) => {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const idCardRef = useRef<HTMLDivElement>(null);
    const [exportingImage, setExportingImage] = useState(false);
    // Format dates for display - DD/MM/YYYY format
    const formattedIssueDate = issueDate ?
        `${issueDate.getDate().toString().padStart(2, '0')}/${(issueDate.getMonth() + 1).toString().padStart(2, '0')}/${issueDate.getFullYear()}` :
        'DD/MM/YYYY';

    const formattedExpiryDate = expiryDate ?
        `${expiryDate.getDate().toString().padStart(2, '0')}/${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear()}` :
        'DD/MM/YYYY';


    // Domain for QR code
    const myCurrentDomain = window.location.hostname;
    const qrCodeValue = `https://${myCurrentDomain}/verify-idp`;


    // Download as image function
    const exportAsImage = async () => {
        if (!idCardRef.current) return;

        try {
            setExportingImage(true);

            // Using html2canvas with 2x scale for higher resolution
            const canvas = await html2canvas(idCardRef.current, {
                allowTaint: true,
                useCORS: true,
                logging: true,
                scale: 3 // Scale the image by 2x for better quality
            });

            // Get image data URL
            const imageUrl = canvas.toDataURL('image/png');

            // Create download link
            const downloadLink = document.createElement('a');
            const fileName = `${application.name}_${application.licenseNumber}.png`;

            downloadLink.href = imageUrl;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error('Error exporting image:', error);
            alert('Failed to export image. Please try again.');
        } finally {
            setExportingImage(false);
        }
    };

    // Print handler function
    const handlePrint = () => {
        if (!idCardRef.current) return;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups for this website to print your International Driver\'s License card.');
            return;
        }

        // Get the content of the card
        const cardHTML = idCardRef.current.innerHTML;

        // Create a centered card for printing
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>International Driver's License Print</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <div class="max-w-md">
                    ${cardHTML}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);

        printWindow.document.close();
    };

    return (
        <>
            <button
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                International Driver License
            </button>

            {/* Print Modal */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">International Driver License</h2>
                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="border border-gray-300 overflow-scroll p-4 rounded-lg bg-gray-50 flex justify-center">
                                <div
                                    className="w-full max-w-md min-w-md overflow-hidden"
                                    style={{ maxWidth: '30rem' }}
                                    ref={idCardRef}
                                >
                                    {/* Card container with empty card background */}
                                    <div
                                        className="relative w-full aspect-[16/10] "
                                        style={{
                                            fontFamily: 'Arial, sans-serif',
                                        }}
                                    >
                                        {/* Empty card background image */}
                                        <img
                                            src="/card_bg.png"
                                            alt="International Driver's License Template"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />

                                        {/* Content overlays */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-full ">
                                            {/* Main content area (positioned to match the empty card) */}
                                            <div
                                                className="absolute top-[38%] left-[28%] right-[4%]  font-bold text-xs flex flex-col gap-[3px]">
                                                <div className="text-[#011843]" >
                                                    INTERNATIONAL DRIVING PERMIT
                                                </div>
                                                <div>
                                                    <span className="text-[#9a0404]">License number : </span>
                                                    <span className="text-[#06489f] uppercase">{application.id}</span>
                                                </div>

                                                <div >
                                                    <span className="text-[#9a0404]">Surname : </span>
                                                    <span className="text-black uppercase">{application.familyName}</span>
                                                </div>

                                                <div   >
                                                    <span className="text-[#9a0404]">Given name : </span>
                                                    <span className="text-black uppercase">{application.name}</span>
                                                </div>

                                                <div>
                                                    <span className="text-[#9a0404]">Date of birth : </span>
                                                    <span className="text-black">{application.birthDate}</span>
                                                </div>

                                                <div>
                                                    <span className="text-[#9a0404]">Place of birth : </span>
                                                    <span className="text-black uppercase">{application.birthPlace}</span>
                                                </div>

                                                <div>
                                                    <span className="text-[#9a0404]">Address : </span>
                                                    <span className="text-black uppercase">{application.country}</span>
                                                </div>

                                                {/* City and zip code area */}
                                                <div className="text-black uppercase">
                                                    {application.zipCode} {application.city}
                                                </div>
                                                {/* classes  */}
                                                <div className="text-black ">
                                                    <span className="text-[#19b669]">Class : </span>
                                                    <span className="text-black">{application.licenseClass.join(', ')}</span>
                                                </div>
                                            </div>

                                            {/* Photo area */}
                                            <div
                                                className="absolute top-[38%] left-[2%] w-[105px] h-[125px] overflow-hidden"  >
                                                {application.personalPhoto ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={application.personalPhoto}
                                                        alt="Personal Photo" />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center bg-gray-200"
                                                    >
                                                        <span className="text-gray-500 text-xs">No Photo</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Barcode area - positioned at bottom of personal image */}
                                            <div className="absolute bottom-[9%] left-[2%] w-[105px] h-[0px] flex justify-center items-center bg-white">
                                                <Barcode
                                                    value={application.id.toUpperCase()}
                                                    textMargin={5}
                                                    fontSize={35}
                                                />
                                            </div>

                                            {/* QR Code with react-qr-code */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '4%',
                                                    right: '20%',
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: 'white',
                                                    padding: '2px',
                                                    borderRadius: '2px',
                                                    border: '1px solid #eee',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 3
                                                }}
                                            >
                                                <QRCode
                                                    value={qrCodeValue}
                                                    size={46}
                                                    level="L"
                                                    bgColor="#FFFFFF"
                                                    fgColor="#000000"
                                                    style={{ maxWidth: "100%", height: "auto" }}
                                                />
                                            </div>

                                            {/* Personal photo with low opacity in bottom right corner */}
                                            {application.personalPhoto && (
                                                <div
                                                    className="absolute bottom-[12%] right-[2%] w-[45px] h-[60px] overflow-hidden  opacity-25 z-20">
                                                    <img
                                                        src={application.personalPhoto}
                                                        alt="Watermark"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Issue & Expiry Dates in bottom right with very small text */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '4%',
                                                    right: '2%',
                                                    textAlign: 'left',
                                                    zIndex: 3
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '8px',
                                                        color: '#006600',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Issue : {formattedIssueDate}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '8px',
                                                        color: '#cc0000',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Expiry : {formattedExpiryDate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={exportAsImage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                disabled={exportingImage}
                            >
                                {exportingImage ? 'Downloading...' : 'Download as Image'}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InternationalDriverLicenseCard;