import React from "react";

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  disabled = false,
  required = false,
}) => {
  let inputElement = null;

  switch (type) {
    case "text":
    case "number":
    case "date":
    case "email":
    case "password":
      inputElement = (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={disabled}
          required={required}
        />
      );
      break;
    case "dropdown":
      inputElement = (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          required={required}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = null;
  }

  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-[#FE2E00]">*</span>}
        </label>
      )}
      {inputElement}
    </div>
  );
};

export default Field;
