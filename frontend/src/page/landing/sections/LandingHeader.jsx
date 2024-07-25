/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable-next-line no-underscore-dangle */
/* eslint-disable no-plusplus */

import React, { useState, useEffect } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
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

  const hundleClickNav = () => {
    if (isHamburgerOpen) setIsHumbergerOpen(!isHamburgerOpen);
  };

  const hundleToggle = () => {
    setIsHumbergerOpen(!isHamburgerOpen);
  };

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-[auto_1fr] lg:gap-[53px] lg:px-[3%] xl-[5%] 2xl-[10%] bg-white sticky top-0 ${isHamburgerOpen ? "fixed top-0 left-0 w-full h-full" : ""}`}
    >
      <img src="./images/logo.svg" alt="logo" className="pl-[26px] py-6" />
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
        className={`col-span-2 lg:col-start-2 lg:col-end-3 lg:flex justify-between ${isHamburgerOpen ? "bg-neutral-600 gap-10" : "hidden"}`}
      >
        <ul
          className={`h3-sans lg:p16 lg:flex items-center gap-[40px] xl:gap-[60px] ${isHamburgerOpen ? "text-white pb-[150px]" : ""}`}
        >
          <AnchorLink href="#benefit" offset="-50">
            <li
              className={` cursor-pointer ${isHamburgerOpen ? "py-[36px] mx-6 border-b border-neutral-400" : ""}`}
              onClick={() => hundleClickNav()}
            >
              Benefits
            </li>
          </AnchorLink>
          <AnchorLink href="#features" offset="-50">
            <li
              className={`cursor-pointer ${isHamburgerOpen ? "py-[36px] mx-6 border-b border-neutral-400" : ""}`}
              onClick={() => hundleClickNav()}
            >
              Features
            </li>
          </AnchorLink>
          <AnchorLink href="#team" offset="-50">
            <li
              className={`cursor-pointer ${isHamburgerOpen ? "py-[36px] mx-6 border-b border-neutral-400" : ""}`}
              onClick={() => hundleClickNav()}
            >
              Team
            </li>
          </AnchorLink>
          <AnchorLink href="#contact" offset="-50">
            <li
              className={`cursor-pointer ${isHamburgerOpen ? "py-[36px] mx-6 border-b border-neutral-400" : ""}`}
              onClick={() => hundleClickNav()}
            >
              Contact
            </li>
          </AnchorLink>
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
              className={`border-[1.5px] rounded ${isHamburgerOpen ? "p18-bold border border-neutral-200 h-16 w-96  hover:bg-white hover:text-neutral-600 active:bg-bluegreen-500 text-white active:text-neutral-0 " : " border-neutral-800 h-14 w-24 hover:bg-bluegreen-100 active:bg-bluegreen-500 active:text-neutral-0"}`}
            >
              Log In
            </button>
          </li>
          <li>
            <button
              type="submit"
              onClick={() => {
                setAuthType("signup");
                setIsAuthModalOpen(true);
              }}
              className={`${isHamburgerOpen ? "h-16 w-96" : "h-14 w-52"} bg-[#FF5b04]  hover:bg-[#FF8340]
  active:bg-[#FE2E00] text-white
  active:text-white
  font-semibold
  text-[16px]
  dm-sans
  rounded
  border-0 border-bluegreen-700`}
            >
              Free 14-day trial
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingHeader;
