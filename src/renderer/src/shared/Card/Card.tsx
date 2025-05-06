import {JSX, ReactNode} from "react";

interface CardPorps {
  children: ReactNode;
  variant?: string;
  className?: string;
}

function Card({children, variant = "default", className = ""}: CardPorps): JSX.Element {
  const baseStyles: string = "text-white";
  const variantStyles: {[key: string]: string} = {
    default: "w-full p-2 m-1 overflow-ellipsis overflow-hidden font-bold whitespace-nowrap bg-sub rounded-4xl",
    stage: "shrink-0 border",
    content: "w-95 h-48 rounded-2xl m-5",
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
}

export default Card;
