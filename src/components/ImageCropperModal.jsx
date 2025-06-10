import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Crop } from "lucide-react";

const ImageCropperModal = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  isLoading,
}) => {
  const cropperRef = useRef(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCroppedImagePreview(null);
      setIsPreviewing(false);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const handleCroppedImgPreview = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      toast.error("Cropper not ready for preview.");
      return;
    }

    if (!isPreviewing) {
      setCroppedImagePreview(cropper.getCroppedCanvas().toDataURL());
      setIsPreviewing(true);
    } else {
      setIsPreviewing(false);
      setCroppedImagePreview(null);
    }
  };

  const handleCropAndUpload = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      toast.error("Cropper not ready for upload.");
      return;
    }

    cropper.getCroppedCanvas().toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
          setIsPreviewing(false);
          setCroppedImagePreview(null);
        } else {
          toast.error("Failed to crop image.");
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-semibold">Edit Event Image</h5>
          <button
            onClick={() => {
              onClose();
              setIsPreviewing(false);
              setCroppedImagePreview(null);
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center">
          {imageSrc ? (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
              {isPreviewing && croppedImagePreview ? (
                <img
                  src={croppedImagePreview}
                  alt="Cropped Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Cropper
                  ref={cropperRef}
                  src={imageSrc}
                  style={{ height: "100%", width: "100%" }}
                  initialAspectRatio={16 / 9}
                  guides={true}
                  aspectRatio={16 / 9}
                  viewMode={1}
                  dragMode="move"
                  scalable={true}
                  cropBoxMovable={true}
                  cropBoxResizable={true}
                  className="border border-gray-300"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-500">
              No image selected for cropping.
            </div>
          )}

          <div className="flex gap-4 mt-5">
            {imageSrc && (
              <button
                onClick={handleCroppedImgPreview}
                className="bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                {isPreviewing ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-left"
                    >
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    Edit
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCropAndUpload}
              disabled={isLoading || !imageSrc}
              className={`bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center transition-colors ${
                isLoading || !imageSrc
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Crop/>
                  Crop
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
