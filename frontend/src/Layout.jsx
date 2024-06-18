import React from "react";
import Nav from "./component/nav/Nav";

const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <Nav />
      <main className="ml-52">{children}</main>
    </>
  );
};

export default Layout;
