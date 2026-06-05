"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={`${className}`}>
      {value ? (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="oshudpati_unsigned"
          options={{
            folder: "oshudpati",
            sources: ["local", "camera"],
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess={(result: any) => {
            setIsUploading(false);
            if (result?.info?.secure_url) {
              onChange(result.info.secure_url);
            }
          }}
          onQueuesStart={() => setIsUploading(true)}
          onError={() => setIsUploading(false)}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[10px] font-medium text-slate-500">
                    Upload Image
                  </span>
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
