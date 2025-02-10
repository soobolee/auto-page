function Button({buttonText, buttonColor}) {
  return <button className={`w-34 h-18 bg-${buttonColor} text-white text-xl rounded-2xl cursor-pointer`}>{buttonText}</button>;
}

export default Button;
