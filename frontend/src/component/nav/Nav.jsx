import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NavList from "./NavList";
import CtaBtn from "../btn/CtaBtn.jsx";
import Support from "../../assets/icons/support.svg";
import LogoForDarkBg from "../../assets/CocoTradeLogoForDarkBg.svg";

const Nav = (props) => {
  const { fnToOpenFormModal, translateX, fnToToggleNav } = props;

  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <nav
      className={`bg-[#243037] ${translateX} sm:translate-x-0 transition-all sm:transition-none ease-in-out absolute sm:fixed sm:h-screen top-[60px] sm:top-0 bottom-0 left-0 w-full sm:w-64 z-10`}
    >
      <div className="w-64 h-24 hidden sm:block">
        <img
          src={LogoForDarkBg}
          alt="CocoTrade"
          className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        />
      </div>
      {/* <h1 className="text-center text-4xl p-4">
        <Link to="/">CocoTrade</Link>
      </h1> */}

      <ul>
        <NavList page="dashboard" fnToToggleNav={fnToToggleNav} />
        <NavList page="inventory" fnToToggleNav={fnToToggleNav} />
        <NavList page="purchase" fnToToggleNav={fnToToggleNav} />
        <NavList page="sales" fnToToggleNav={fnToToggleNav} />
        <NavList page="finances" fnToToggleNav={fnToToggleNav} />
      </ul>

      <div className="bg-[#224F55] rounded-2xl text-white m-4 px-4 py-6 absolute bottom-0 left-0 right-0">
        <img src={Support} alt="" aria-hidden />
        <h6 className="mt-4">Need help?</h6>
        <p className="text-sm mb-4">
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
    </nav>
  );
};

export default Nav;
