import React from "react";
import { cn } from "../util/twMerge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
} 
const Button = ({
  children,
  className,
  type,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <>
      <button
        className={cn(
          "block bg-primary-orange text-nowrap  text-[.9rem] rounded-[8px] w-full  md:px-[51px]  md:text-body2",
          className,
          disabled ? "hover:shadow-0" : ""
        )}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
