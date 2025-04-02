import { useState, useRef, ChangeEvent } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadProps {
    id: string;
    label: string;
    onFileSelect: (file: File | null) => void;
    uploadProgress?: number;
    previewUrl?: string;
    error?: string;
}

export const FileUpload = ({
    id,
    label,
    onFileSelect,
    uploadProgress = 0,
    previewUrl,
    error
}: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        validateAndUpload(file);
    };

    const validateAndUpload = (file: File | null) => {
        setFileError(null);

        if (!file) {
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setFileError(`File is too large. Maximum size is 5MB.`);
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setFileError("Please upload an image file.");
            return;
        }

        onFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block font-medium">
                {label} *
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer transition ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                    } ${error || fileError ? "border-red-500 bg-red-50" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    id={id}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={previewUrl}
                            alt="Uploaded file"
                            className="max-h-full max-w-full object-contain"
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect(null);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ) : uploadProgress > 0 && uploadProgress < 100 ? (
                    <div className="text-center">
                        <div className="mb-2">Uploading... {Math.round(uploadProgress)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <svg
                            className="h-10 w-10 text-gray-400 mb-3"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm text-gray-500">
                            Drag and drop, or click to select file
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                    </>
                )}
            </div>

            {(fileError || error) && (
                <p className="text-red-500 text-sm">{fileError || error}</p>
            )}
        </div>
    );
}; 