import { useState, useRef } from "react";
import { IDPFormData } from "../types/idp";
import QRCode from "react-qr-code";

interface PrintIDPCardProps {
    application: IDPFormData;
    issueDate: Date | null;
    expiryDate: Date | null;
}

const PrintIDPCard = ({ application }: PrintIDPCardProps) => {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [cardPosition, setCardPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');
    const printCardRef = useRef<HTMLDivElement>(null);

    // Domain for QR code
    const qrCodeValue = "https://yourdomain.com";

    // Print card handler function
    const handlePrint = () => {
        if (!printCardRef.current) return;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups for this website to print your IDP card.');
            return;
        }

        // Get the content of the card
        const cardHTML = printCardRef.current.innerHTML;

        // Create a CSS-positioned card on an A4 page
        printWindow.document.writeln(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>IDP Card Print</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                    .a4-page {
                        width: 210mm;
                        height: 297mm;
                        position: relative;
                        background: white;
                        overflow: hidden;
                    }
                    .card-container {
                        position: absolute;
                        width: 85mm; /* Card width */
                        height: 125mm; /* Card height */
                        ${cardPosition === 'top-left' ? 'top: 10mm; left: 10mm;' :
                cardPosition === 'top-right' ? 'top: 10mm; right: 10mm;' :
                    cardPosition === 'bottom-left' ? 'bottom: 10mm; left: 10mm;' :
                        'bottom: 10mm; right: 10mm;'}
                    }
                    /* Additional print styles for the card */
                    .idp-card {
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        overflow: hidden;
                        width: 100%;
                        height: 100%;
                        background: white;
                        box-shadow: none;
                    }
                    /* Ensure text and layout is preserved in print */
                    .idp-card * {
                        visibility: visible;
                        color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    /* Card header */
                    .card-header {
                        background-color: #1f2937 !important;
                        color: white !important;
                        padding: 12px;
                    }
                    .photo-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    /* Ensure content flows around the image */
                    .card-body {
                        overflow: hidden;
                    }
                    .info-section {
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="a4-page">
                    <div class="card-container">
                        ${cardHTML}
                    </div>
                </div>
                <script>
                    // Print and close the window once loaded
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
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
                Print IDP Card
            </button>

            {/* Print Modal */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Print IDP Card</h2>
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
                            <h3 className="font-medium mb-2">Select card position on A4 paper:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* A4 Paper Visual Representation */}
                                <div className="border border-gray-300 rounded-lg p-2 bg-white relative" style={{ aspectRatio: '210/297' }}>
                                    <div className="text-xs text-gray-400 text-center mb-2">A4 Paper Preview</div>
                                    {/* Card position indicator */}
                                    <div
                                        className="absolute border-2 border-primary rounded-sm bg-primary/10"
                                        style={{
                                            width: '40%',
                                            height: '40%',
                                            ...(cardPosition === 'top-left' ? { top: '10%', left: '10%' } :
                                                cardPosition === 'top-right' ? { top: '10%', right: '10%' } :
                                                    cardPosition === 'bottom-left' ? { bottom: '10%', left: '10%' } :
                                                        { bottom: '10%', right: '10%' })
                                        }}
                                    ></div>
                                </div>

                                {/* Position Selection */}
                                <div className="grid grid-cols-2 gap-2">
                                    <label className={`border rounded-lg p-2 flex items-center cursor-pointer ${cardPosition === 'top-left' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="position"
                                            value="top-left"
                                            checked={cardPosition === 'top-left'}
                                            onChange={() => setCardPosition('top-left')}
                                            className="mr-2"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">Top Left</div>
                                        </div>
                                    </label>

                                    <label className={`border rounded-lg p-2 flex items-center cursor-pointer ${cardPosition === 'top-right' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="position"
                                            value="top-right"
                                            checked={cardPosition === 'top-right'}
                                            onChange={() => setCardPosition('top-right')}
                                            className="mr-2"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">Top Right</div>
                                        </div>
                                    </label>

                                    <label className={`border rounded-lg p-2 flex items-center cursor-pointer ${cardPosition === 'bottom-left' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="position"
                                            value="bottom-left"
                                            checked={cardPosition === 'bottom-left'}
                                            onChange={() => setCardPosition('bottom-left')}
                                            className="mr-2"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">Bottom Left</div>
                                        </div>
                                    </label>

                                    <label className={`border rounded-lg p-2 flex items-center cursor-pointer ${cardPosition === 'bottom-right' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                                        <input
                                            type="radio"
                                            name="position"
                                            value="bottom-right"
                                            checked={cardPosition === 'bottom-right'}
                                            onChange={() => setCardPosition('bottom-right')}
                                            className="mr-2"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">Bottom Right</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Card Preview:</h3>
                            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex justify-center">
                                <div className="w-full max-w-md" ref={printCardRef}>
                                    {/* IDP Card Preview */}
                                    <div className="idp-card bg-white border border-gray-300 rounded-lg shadow overflow-hidden relative" style={{
                                        width: '8cm',
                                        height: '11cm'
                                    }}>
                                        {/* Card Body */}
                                        <div className="p-4 card-body">
                                            {/* Barcode Section */}
                                            <div className="flex items-end mt-4 float-right flex-col align-center gap-2 justify-between" style={{ height: '8.9cm' }}>
                                                <div style={{ width: '2cm', height: '2cm' }} className="bg-white p-1 rounded border border-gray-300 flex justify-center items-center">
                                                    <QRCode
                                                        value={qrCodeValue}
                                                        size={40}
                                                        level="L"
                                                        bgColor="#FFFFFF"
                                                        fgColor="#000000"
                                                        style={{ width: '2cm', height: '2cm' }}
                                                    />
                                                </div>

                                                <div className="photo-container float-right rounded border-none overflow-hidden" style={{ width: '3cm' }}>
                                                    {application.personalPhoto && (
                                                        <img
                                                            src={application.personalPhoto}
                                                            alt="Personal Photo"
                                                            className="w-full h-full object-cover border-none"
                                                        />
                                                    )}
                                                </div>

                                            </div>

                                            {/* ID Section - Single line format */}
                                            <p className="text-sm mb-1"><span className="text-black text-bold"></span> <span>{application.id}</span></p>

                                            {/* Personal Info - Single line format */}
                                            <div className="space-y-1 mb-3 info-section text-xs">
                                                <p><span className="text-gray-500">Last Name</span></p>
                                                <p><span className="text-sm">{application.familyName}</span></p>
                                                <p><span className="text-gray-500">First Name:</span></p>
                                                <p><span className="text-sm">{application.name}</span></p>
                                                <p><span className="text-gray-500">Birth Date</span>: <span className="text-sm">{application.birthDate}</span></p>
                                                <p><span className="text-gray-500">Birth Place</span>: <span className="text-sm">{application.birthPlace}</span></p>
                                                <p><span className="text-gray-500">Adderss</span></p>
                                                <p><span className="text-sm">{application.addressLine1}</span></p>
                                                <p><span className="text-gray-500">Permit Class</span>: <span className="text-sm">{application.licenseClass.join(",")}</span></p>
                                                <p><span className="text-gray-500">Original ID</span></p>
                                                <p style={{ maxWidth: '4.5cm', overflow: 'hidden' }}><span className="text-sm">{application.licenseNumber}</span></p>
                                                <p style={{ maxWidth: '4.5cm', overflow: 'hidden' }}><span className="text-gray-500">Issue Date</span> <span className="text-sm">{application.issueDate ? new Date((application.issueDate as any).seconds * 1000).toISOString().split('T')[0] : 'N/A'}</span></p>
                                                <p style={{ maxWidth: '4.5cm', overflow: 'hidden' }}><span className="text-gray-500">Expiry Date</span> <span className="text-sm">{application.expiryDate ? new Date((application.expiryDate as any).seconds * 1000).toISOString().split('T')[0] : 'N/A'}</span></p>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-3 py-3 text-xs text-gray-600">
                                            <p>Holder Signature: </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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

export default PrintIDPCard;