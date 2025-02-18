"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import RemoveButton from "@/app/components/RemoveButton";

export default function BlockImage({ value, onChange, onRemove }) {
  const [imageUrl, setImageUrl] = useState(value || "");

  return (
    // <div className="relative border p-2 mb-2">
    //   <input
    //     value={value}
    //     onChange={(e) => onChange(e.target.value)}
    //     className="border p-2 w-full text-gray-700"
    //     placeholder="Image URL (.jpg/.png/)"
    //     pattern="https?:\/\/.*\.(jpg|jpeg|png|webp)(\?.*)?$"
    //     title="Enter a valid image URL ending in .jpg, or .png"
    //   />

    //   <RemoveButton onRemove={onRemove} />
    // </div>
    <div className="relative border p-2 mb-2">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">Image Upload</h3>
      </div>

      {!imageUrl ? (
        <CldUploadWidget
          signatureEndpoint="../../api/signed"
          options={{ folder: "Testing" }}
          onSuccess={(result) => {
            const url = result.info.secure_url;
            console.log(result);
            setImageUrl(url);
            onChange(url);
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="bg-blue-500 text-white px-4 py-2 mt-2"
            >
              Upload Image
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="mt-2 w-80 h-auto rounded"
        />
      )}

      <RemoveButton onRemove={onRemove} />
    </div>
  );
}
