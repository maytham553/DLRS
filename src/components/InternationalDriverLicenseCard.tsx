import { useState, useRef } from "react";
import { IDPFormData } from "../types/idp";
import html2canvas from "html2canvas";

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

    // Format dates for display
    const formattedIssueDate = issueDate ? 
        `${issueDate.getFullYear()}-${(issueDate.getMonth() + 1).toString().padStart(2, '0')}-${issueDate.getDate().toString().padStart(2, '0')}` : 
        'YYYY-MM-DD';
    
    const formattedExpiryDate = expiryDate ? 
        `${expiryDate.getFullYear()}-${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}-${expiryDate.getDate().toString().padStart(2, '0')}` : 
        'YYYY-MM-DD';

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
                <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .card-container {
                        width: 85mm; /* Card width */
                        height: 54mm; /* Standard ID card height */
                    }
                    /* Card styles */
                    .idl-card {
                        border: none;
                        width: 100%;
                        height: 100%;
                        background-color: white;
                        box-shadow: none;
                        page-break-inside: avoid;
                        position: relative;
                    }
                    /* Ensure text and layout is preserved in print */
                    .idl-card * {
                        visibility: visible;
                        color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    td {
                        padding: 2px 5px;
                        font-size: 12px;
                    }
                    .card-header {
                        background-color: #2C3E50;
                        color: white;
                        text-align: center;
                        padding: 5px 0;
                        font-weight: bold;
                    }
                    .photo-container {
                        width: 25mm;
                        height: 32mm;
                        overflow: hidden;
                        border: 1px solid #ccc;
                    }
                    .photo-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .label {
                        font-weight: bold;
                        color: #2C3E50;
                        font-size: 10px;
                    }
                    .value {
                        font-size: 11px;
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .logo {
                        position: absolute;
                        bottom: 5px;
                        right: 5px;
                        width: 15mm;
                        height: 15mm;
                        opacity: 0.2;
                    }
                </style>
            </head>
            <body>
                <div class="card-container">
                    ${cardHTML}
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

    // Simple export as image function
    const exportAsImage = async () => {
        if (!idCardRef.current) return;
        
        try {
            setExportingImage(true);
            
            // Using html2canvas with simpler configuration
            const canvas = await html2canvas(idCardRef.current, { 
                backgroundColor: '#FFFFFF'
            });
            
            // Open image in a new tab
            const imageUrl = canvas.toDataURL('image/png');
            const newTab = window.open();
            if (newTab) {
                newTab.document.write(`
                    <html>
                    <head>
                        <title>International Driver License - Image</title>
                        <style>
                            body {
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                background-color: #f0f0f0;
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                text-align: center;
                            }
                            img {
                                max-width: 100%;
                                border: 1px solid #ddd;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            p {
                                margin-top: 20px;
                                color: #555;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="${imageUrl}" alt="International Driver License" />
                            <p>Right-click on the image and select "Save Image As..." to save it to your device</p>
                        </div>
                    </body>
                    </html>
                `);
                newTab.document.close();
            } else {
                alert('Please allow popups to view the exported image');
            }
        } catch (error) {
            console.error('Error exporting image:', error);
            alert('Failed to export image. Please try again.');
        } finally {
            setExportingImage(false);
        }
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
                            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex justify-center">
                                <div className="w-full max-w-md" ref={idCardRef}>
                                    {/* Simple rectangular ID card design */}
                                    <div className="idl-card border border-gray-300">
                                        {/* Card Header */}
                                        <div className="card-header bg-[#2C3E50] text-white text-center py-1 font-bold">
                                            INTERNATIONAL DRIVER'S LICENSE
                                        </div>
                                        
                                        {/* Card Content */}
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td rowSpan={6} style={{ width: '30%' }}>
                                                        <div className="photo-container">
                                                            {application.personalPhoto && (
                                                                <img 
                                                                    src={application.personalPhoto} 
                                                                    alt="Personal Photo" 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td colSpan={2}>
                                                        <span className="label">LICENSE No: </span>
                                                        <span className="value bold text-red-600">IDL-{application.id}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <span className="label">NAME: </span>
                                                        <span className="value bold">{application.name.toUpperCase()} {application.familyName.toUpperCase()}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="label">NATIONALITY: </span>
                                                        <span className="value">{application.country}</span>
                                                    </td>
                                                    <td>
                                                        <span className="label">GENDER: </span>
                                                        <span className="value">{application.gender}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="label">DOB: </span>
                                                        <span className="value">{application.birthDate}</span>
                                                    </td>
                                                    <td>
                                                        <span className="label">PLACE: </span>
                                                        <span className="value">{application.birthPlace}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="label">ISSUED: </span>
                                                        <span className="value">{formattedIssueDate}</span>
                                                    </td>
                                                    <td>
                                                        <span className="label">EXPIRES: </span>
                                                        <span className="value text-red-600">{formattedExpiryDate}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <span className="label">CLASS: </span>
                                                        <span className="value bold text-green-600">A, B</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3} className="text-center text-xs italic text-gray-500 pt-2">
                                                        This license is valid only when presented with the original driver's license
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        
                                        {/* Watermark Logo */}
                                        <div className="logo">
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#2C3E50" strokeWidth="2" />
                                                <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#2C3E50">IDL</text>
                                            </svg>
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
                                {exportingImage ? 'Exporting...' : 'Export as Image'}
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