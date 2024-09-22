import React from "react";
import { cn } from "../util/twMerge";


interface InputProp {
  className?: string;
  labelClassname?: string;
  label?: string|React.ReactNode;
  htmlFor?: string;
  type: string;
  placeholder?: string;
  inputClassName?: any;
  id: string;
  name: string;
  value: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;min?:number|string;
}
const Input = ({
  className,
  labelClassname,
  label,
  htmlFor,
  type,
  placeholder,
  inputClassName,
  id,
  name,
  value,
  required,
  onChange,
  min,
  disabled,
}: InputProp) => {
  return (
    <div className={cn("my-[16px]", className)}>
      <label
        className={cn(
          "block text-[#3E3E3E] text-[1rem]  md:[1.3rem]",
          labelClassname
        )}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <input
        disabled={disabled}
        min={min}
        className={cn(
          "border-b-[3px] bg-transparent  border-[#808080] pt-4 pb-0 rounded-[4px] pl-[10px] pr-[5px] w-full mt-[2px] hj-[28px] text-[1.1rem] outline-0 ",
          inputClassName,
          disabled ? "opacity-60" : ""
        )}
        onChange={onChange}
        type={type}
        required={required}
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
      />
    </div>
  );
};

export default Input;
