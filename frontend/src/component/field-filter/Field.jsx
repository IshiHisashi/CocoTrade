import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import React, { useState } from "react";
import VisibilityOn from "../../assets/icons/Eye-On.svg";
import VisibilityOff from "../../assets/icons/Eye-Off.svg";
import Info from "../../assets/icons/Information.svg";

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  disabled = false,
  required = false,
  showChangeButton = false,
  unit = "",
  adornment = "end",
  info = false,
  infoText = "",
}) => {
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [isShowChangeButton, setIsShowChangeButton] =
    useState(showChangeButton);
  const [isShowInfoText, setIsShowInfoText] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  let inputElement = null;

  switch (type) {
    case "number":
      inputElement = (
        <FormControl fullWidth>
          <TextField
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            sx={{ py: 1 }}
            InputProps={
              adornment === "end"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">{unit}</InputAdornment>
                    ),
                  }
                : {
                    startAdornment: (
                      <InputAdornment position="start">{unit}</InputAdornment>
                    ),
                  }
            }
          />
          {isShowInfoText && <FormHelperText>{infoText}</FormHelperText>}
        </FormControl>
      );
      break;
    case "text":
    case "email":
      inputElement = (
        <FormControl fullWidth>
          <TextField
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            // wanna customize disabled style
            sx={isDisabled ? { py: 1 } : { py: 1 }}
          />
          {isShowInfoText && <FormHelperText>{infoText}</FormHelperText>}
        </FormControl>
      );
      break;
    case "password":
      inputElement = (
        <TextField
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={required}
          sx={{ py: 1 }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="start"
                >
                  {showPassword ? (
                    <img src={VisibilityOff} alt="visibility off" />
                  ) : (
                    <img src={VisibilityOn} alt="visibility on" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <FormControl fullWidth>
          <TextareaAutosize
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required={required}
            minRows={5}
          />
        </FormControl>
      );
      break;
    case "date":
      inputElement = (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm basis-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isDisabled}
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
    <div className="mb-4 w-full flex flex-wrap justify-between content-start">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-[#FE2E00]">*</span>}
          {info && (
            <button
              type="button"
              className="mx-2"
              onClick={() => setIsShowInfoText(!isShowInfoText)}
            >
              <img
                src={Info}
                alt="toggle helper text"
                className="inline-block"
              />
            </button>
          )}
        </label>
      )}
      {isShowChangeButton && (
        <button
          type="button"
          className="block text-sm font-medium text-gray-700 underline"
          onClick={() => {
            setIsDisabled(false);
            setIsShowChangeButton(false);
          }}
        >
          Change
        </button>
      )}
      {inputElement}
    </div>
  );
};

export default Field;
