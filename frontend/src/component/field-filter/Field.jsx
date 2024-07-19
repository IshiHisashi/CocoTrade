import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import React, { useEffect, useState } from "react";
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
  error = false,
  errorText = "",
  adornmentEnd = "",
  min,
  max,
  step,

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

  // (From Aki to Prathibha: I added this for EditSaleModal.jsx. I believe this is not gonna cause any issues in other areas. It's difficult to tell what I'm trying to do here. So pls let me explain tmr)
  useEffect(() => {
    if (disabled !== isDisabled) {
      setIsDisabled(!isDisabled);
    }
  }, [disabled, isDisabled]);

  switch (type) {
    case "number":
      inputElement = (
        <FormControl fullWidth>
          <TextField
            labelColor = {name}
            className="border border-solid border-gray-300 rounded p-4 my-2"
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            sx={{
              py: 1
            }}
            InputProps={{
              inputProps: { min, max, step },
              startAdornment: adornment === "start" && (
                <InputAdornment position="start">{unit}</InputAdornment>
              ),
              endAdornment: (
                <>
                  {adornmentEnd && (
                    <InputAdornment position="end">
                      {adornmentEnd}
                    </InputAdornment>
                  )}
                  {adornment === "end" && (
                    <InputAdornment position="end">{unit}</InputAdornment>
                  )}
                </>
              ),
            }}
            error={error}
            
            helperText={error && errorText}
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
          className="disabled:bg-gray-100 disabled:text-gray-500"
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            sx={{
              py: 1,
              '& .MuiInputBase-input.Mui-disabled': {
                backgroundColor: 'rgb(243 244 246)', // equivalent to bg-gray-100 in Tailwind CSS
                color: 'rgb(107 114 128)', // equivalent to text-gray-500 in Tailwind CSS
              },
              '& .Mui-disabled .MuiInputAdornment-root': {
                color: 'rgb(107 114 128)', // equivalent to text-gray-500 for adornment
              },
            }}
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
            className="border border-solid border-gray-300 rounded p-4 my-2"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm basis-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-[56px] mt-2"
          disabled={isDisabled}
          required={required}
          max={
            name === "purchase_date"
              ? new Date().toISOString().split("T")[0]
              : undefined
          }
        />
      );
      break;
      case "dropdown":
        inputElement = (
          <FormControl fullWidth>
            <select
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              required={required}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm h-[56px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isShowInfoText && <FormHelperText>{infoText}</FormHelperText>}
          </FormControl>
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
          className="block text-sm font-medium text-neutral-600 label16"
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
