import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = {
  label?: string;
  showLabel?: boolean;
  type?: React.HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  disabled?: boolean;
  inputClassName?: string;
  accept?: string;
  multiple?: boolean;
  showPreview?: boolean; // si quieres mostrar vista previa para imágenes
};

export const Input = ({
  label = "",
  showLabel = true,
  type = "text",
  name,
  placeholder = "",
  value = "",
  onChange,
  error = "",
  className = "",
  required = false,
  min,
  max,
  step,
  disabled = false,
  inputClassName = "",
  accept,
  multiple = false,
  showPreview = false,
}: InputProps) => {
  const baseInputClasses =
    "w-full mt-1 p-2 border rounded-xl focus:outline-none focus:border-[#48BD28]";
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  const combinedInputClasses = twMerge(baseInputClasses, errorClasses, inputClassName);
  const combinedContainerClasses = `w-full ${className}`;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Limpia la URL del objeto al desmontar o al cambiar de archivo
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "file" && showPreview) {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
    onChange(e);
  };

  return (
    <div className={combinedContainerClasses}>
      {showLabel && (
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        type={type}
        name={name}
        placeholder={type !== "file" ? placeholder : undefined}
        value={type !== "file" ? value : undefined}
        onChange={type === "file" ? handleFileChange : onChange}
        className={combinedInputClasses}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        accept={type === "file" ? accept : undefined}
        multiple={type === "file" ? multiple : undefined}
      />

      {showPreview && previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="max-w-xs max-h-40 rounded-lg border"
          />
        </div>
      )}

      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
