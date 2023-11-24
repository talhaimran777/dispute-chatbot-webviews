"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [isUploaded, setUploaded] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploaded(false);

      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const request = new Request(
        "https://2655-182-181-144-255.ngrok-free.app/dialogflow/submit-proof",
        { method: "POST", body: formData },
      );

      const response = await fetch(request);

      if (response.ok) {
        setUploaded(true);
        const data = await response.json();
        callEvent(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md my-10">
        <h1 className="text-2xl font-extrabold mb-4 text-center">
          Upload Proof
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-600"
            >
              Choose an image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          {previewUrl && (
            <div className="flex justify-center items-center mb-4 py-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 rounded-md shadow-md"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className={`bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none ${
                !selectedFile ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={!selectedFile}
            >
              {isUploading
                ? "Uploading..."
                : isUploaded
                ? "Uploaded"
                : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUpload;

const callEvent = (data: any) => {
  if (typeof window.postMessage !== undefined) {
    const message = {
      eventData: {
        message: data.message,
      },
      eventName: data.event,
    };

    window.parent.postMessage(message, "*");
  }
};
