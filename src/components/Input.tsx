import React from "react";

type InputProps = {
  label: string;
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
};

export const Input = ({
  label,
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
}: InputProps) => {
  const inputClasses = `w-full mt-1 p-2 border rounded-xl focus:outline-none focus:border-[#48BD28] ${error ? "border-red-500" : "border-gray-300"
    } ${className}`;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};