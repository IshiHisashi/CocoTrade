import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NavList from "./NavList";
import CtaBtn from "../btn/CtaBtn.jsx";

const Nav = (props) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <nav className="bg-[#243037] fixed h-screen top-0 bottom-0 left-0 w-52">
      <h1 className="text-center text-4xl p-4">
        <Link to="/">CocoTrade</Link>
      </h1>
      <ul>
        <NavList page="dashboard" />
        <NavList page="inventory" />
        <NavList page="purchase" />
        <NavList page="sales" />
        <NavList page="finances" />
      </ul>
      <div className="bg-[#224F55] rounded-2xl text-white">
        <p>Need help?</p>
        <p>Get in touch and let us know how we can help</p>
        <CtaBtn
          size="S"
          level="P"
          innerTxt="Contact us"
          onClickFnc={() => {}}
        />
      </div>
    </nav>
  );
};

export default Nav;
