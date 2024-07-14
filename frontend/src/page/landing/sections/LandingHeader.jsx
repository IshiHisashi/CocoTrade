import React, { useState, useEffect } from "react";
import CtaBtn from "../../../component/btn/CtaBtn";
import Hamburger from "../../../assets/icons/Hamburger.svg";

const LandingHeader = ({ setAuthType, setIsAuthModalOpen }) => {
  const [isHamburgerOpen, setIsHumbergerOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    // Handler function to update state based on media query match
    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        setIsHumbergerOpen(false);
      }
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    if (mediaQuery.matches) {
      setIsHumbergerOpen(false);
    }
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const hundleToggle = () => {
    setIsHumbergerOpen(!isHamburgerOpen);
  };

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-[auto_1fr] lg:gap-[53px] lg:px-[3%] xl-[5%] 2xl-[10%] bg-white ${isHamburgerOpen ? "fixed top-0 left-0  w-full h-full" : ""}`}
    >
      <img src="./images/logo-b.png" alt="logo" className="pl-[26px] py-6" />
      <div
        className={`flex justify-end pr-[35px] ${isHamburgerOpen ? "bg-neutral-600" : ""} lg:hidden`}
      >
        <p
          className={`p18 self-center text-center ${isHamburgerOpen ? "text-white" : "text-neutral-600"}`}
        >
          Menu
        </p>
        <button
          type="button"
          className="block my-4 ml-4 "
          onClick={() => hundleToggle()}
        >
          <img
            src={isHamburgerOpen ? "./images/Hamburger-w.png" : Hamburger}
            alt="toggle navigation menu"
          />
        </button>
      </div>
      <div
        className={`col-span-2 lg:col-start-2 lg:col-end-3 lg:flex justify-between gap-10 ${isHamburgerOpen ? "bg-neutral-600" : "hidden"}`}
      >
        <ul
          className={`h3-sans lg:p16 lg:flex items-center gap-[40px] xl:gap-[60px] ${isHamburgerOpen ? "text-white pb-[260px]" : ""}`}
        >
          <li
            className={` cursor-pointer ${isHamburgerOpen ? "py-[45px] mx-6 border-b border-neutral-400" : ""}`}
          >
            Benefits
          </li>
          <li
            className={`cursor-pointer ${isHamburgerOpen ? "py-[45px] mx-6 border-b border-neutral-400" : ""}`}
          >
            Features
          </li>
          <li
            className={`cursor-pointer ${isHamburgerOpen ? "py-[45px] mx-6 border-b border-neutral-400" : ""}`}
          >
            Team
          </li>
          <li
            className={`cursor-pointer ${isHamburgerOpen ? "py-[45px] mx-6 border-b border-neutral-400" : ""}`}
          >
            Contact
          </li>
        </ul>
        <ul
          className={`flex items-center gap-[15px] p16 ${isHamburgerOpen ? "flex-col-reverse pb-[45px]" : ""}`}
        >
          <li>
            <button
              type="submit"
              onClick={() => {
                setAuthType("login");
                setIsAuthModalOpen(true);
              }}
              className={`border-[1.5px] rounded ${isHamburgerOpen ? "p18-bold border border-neutral-200 h-16 w-96 text-white" : " border-neutral-800 h-14 w-24 "}`}
            >
              Log In
            </button>
          </li>
          <li>
            <CtaBtn
              innerTxt="Free 14-day trial"
              size={`${isHamburgerOpen ? "L" : "M"}`}
              onClickFnc={() => {
                setAuthType("signup");
                setIsAuthModalOpen(true);
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingHeader;
