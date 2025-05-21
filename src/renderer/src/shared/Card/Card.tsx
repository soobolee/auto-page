import {JSX, ReactNode, memo} from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "stage";
  className?: string;
}

const Card = memo(function Card({children, variant = "default", className = ""}: CardProps): JSX.Element {
  const baseStyles = "bg-white rounded-2xl border-2";
  const variantStyles = {
    default: "p-4",
    stage: "p-2",
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
});

export default Card;
