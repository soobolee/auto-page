function Button({buttonText, buttonColor, onClick}) {
  return (
    <button type="button" className={`w-28 h-14 mx-2 ${buttonColor} text-white text-xl rounded-2xl cursor-pointer`} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default Button;
