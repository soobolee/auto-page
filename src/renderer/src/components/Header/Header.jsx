import {useNavigate} from "react-router";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="h-[10%] flex flex-col justify-center items-center border">
      <div className="h-[60%] w-full" style={{WebkitAppRegion: "drag"}}></div>
      <div className="h-[40%] w-full text-center">
        <h3 className="text-white text-2xl" onClick={handleLogoClick}>
          Auto Pape
        </h3>
      </div>
    </header>
  );
}

export default Header;
