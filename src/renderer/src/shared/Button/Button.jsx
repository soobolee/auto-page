import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Button({children, variant = "default", size = "medium", color = "sub", onClick, icon, isActive}) {
  const baseStyles = "cursor-pointer";
  const variantStyles = {
    default: "rounded-2xl",
    circle: "rounded-4xl",
  };
  const sizeStyles = {
    small: "w-8 h-8 my-1 mx-1.5",
    medium: "w-28 h-14 mx-2",
  };
  const colorStyles = {
    sub: "bg-sub",
    green: "bg-green",
    red: "bg-red",
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${colorStyles[color]} text-white text-xl hover:hover-big`}
      onClick={onClick}
    >
      {icon ? <FontAwesomeIcon className={isActive ? "text-white" : "text-black"} icon={icon} /> : children}
    </button>
  );
}

export default Button;
