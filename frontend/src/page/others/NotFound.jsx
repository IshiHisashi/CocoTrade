import React from "react";
import { useNavigate } from "react-router-dom";
import CtaBtn from "../../component/btn/CtaBtn";
import useMediaQuery from "../../hook/useMediaQuery";

const NotFound = () => {
  const navigate = useNavigate();
  const isLargerScreen = useMediaQuery("(min-width:640px)");
  const handleGoHome = () => {
    navigate("/");
  };
  return (
    <div className="bg-neutral-600 h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <img src="./images/404.svg" alt="" className="w-[250px] sm:w-[500px]" />
        <h4 className="text-white p14 sm:h4-sans-uppercase mb-[44px] text-center">
          THE PAGE YOU WERE LOOKING FOR DOESN’T EXIST.
        </h4>
        <CtaBtn
          innerTxt="Go to homepage"
          onClickFnc={handleGoHome}
          size={isLargerScreen ? "L" : "M"}
        />
      </div>
    </div>
  );
};

export default NotFound;
