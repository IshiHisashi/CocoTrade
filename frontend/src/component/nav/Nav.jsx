import React, { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import NavList from "./NavList";
import CtaBtn from "../btn/CtaBtn.jsx";
import Support from "../../assets/icons/support.svg";
import LogoForDarkBg from "../../assets/CocoTradeLogoForDarkBg.svg";
import Exit from "../../assets/icons/Exit-White.svg";
import hideScrollbar from "../../styles/HideScrollbar.module.css";

const Nav = (props) => {
  const { fnToOpenFormModal, translateX, fnToToggleNav } = props;

  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <nav
      className={`bg-[#243037] ${translateX} sm:translate-x-0 transition-all sm:transition-none ease-in-out fixed h-screen top-0 bottom-0 left-0 w-full sm:w-64 z-10 grid grid-rows-[auto_1fr_auto] overflow-scroll ${hideScrollbar.nav}`}
    >
      <div className="w-full sm:w-64 h-24 flex justify-between sm:justify-center items-center px-8 sticky top-0 bg-[#243037]">
        <NavLink
          to="/dashboard"
          onClick={() => fnToToggleNav("-translate-x-full")}
        >
          <img src={LogoForDarkBg} alt="CocoTrade" />
        </NavLink>
        <button
          type="button"
          className="block sm:hidden"
          onClick={() => fnToToggleNav("-translate-x-full")}
        >
          <img src={Exit} alt="close nav" />
        </button>
      </div>

      <ul>
        <NavList page="dashboard" fnToToggleNav={fnToToggleNav} />
        <NavList page="inventory" fnToToggleNav={fnToToggleNav} />
        <NavList page="purchase" fnToToggleNav={fnToToggleNav} />
        <NavList page="sales" fnToToggleNav={fnToToggleNav} />
        <NavList page="finances" fnToToggleNav={fnToToggleNav} />
      </ul>

      <div className="bg-[#224F55] rounded-2xl text-white m-8 sm:m-4 px-4 py-6  bottom-0 left-0 right-0 flex sm:block items-start gap-4 max-w-96">
        <img src={Support} alt="" className="mb-4" aria-hidden />
        <div>
          <h6 className="h3-sans">Need help?</h6>
          <p className="p16 mb-4">
            Get in touch and let us know how we can help
          </p>
          <CtaBtn
            size="S"
            level="P"
            innerTxt="Contact us"
            onClickFnc={() => {
              fnToOpenFormModal(true);
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
