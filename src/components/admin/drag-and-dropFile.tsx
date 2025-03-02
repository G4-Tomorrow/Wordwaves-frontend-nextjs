import { IconX } from "@tabler/icons-react";
import { Button } from "antd";
import React, { useState } from "react";

interface DragAndDropFileProps {
  onFileChange: (file: File | null) => void;
}

export default function DragAndDropFile({
  onFileChange,
}: DragAndDropFileProps) {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setThumbnail(files[0]);
      onFileChange(files[0]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnail(event.target.files[0]);
      onFileChange(event.target.files[0]);
    }
  };

  const handleDeleteImage = () => {
    setThumbnail(null);
    onFileChange(null);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {thumbnail ? (
        <>
          <img
            src={URL.createObjectURL(thumbnail)}
            alt="Thumbnail"
            className="w-48 h-48 object-cover rounded-md mb-4"
          />
          <Button
            onClick={handleDeleteImage}
            className="absolute top-[5%] right-[35%] px-4 py-2 dark:text-white rounded"
          >
            <IconX size={16} />
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-gray-500 mb-2 text-center">
            Drag and drop an image here, or click to upload
          </span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-blue-500 underline"
      >
        Add Image
      </label>
    </div>
  );
}
