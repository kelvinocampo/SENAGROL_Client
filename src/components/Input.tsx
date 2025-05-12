import React from "react";

type InputProps = {
  label?: {
    show?: boolean;
    text: string;
  };
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
};

export const Input = ({
  label = { show: true, text: "" },
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
}: InputProps) => {
  // Clases base para el input
  const baseInputClasses = "w-full mt-1 p-2 border rounded-xl focus:outline-none focus:border-[#48BD28]";
  
  // Clases condicionales
  const errorClasses = error ? "border-red-500" : "border-gray-300";
  
  // Combinación de clases
  const combinedInputClasses = `${baseInputClasses} ${errorClasses} ${inputClassName}`;
  const combinedContainerClasses = `w-full ${className}`;

  return (
    <div className={combinedContainerClasses}>
      {label.show && (
        <label htmlFor={name} className="block text-sm font-medium">
          {label.text}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={combinedInputClasses}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};