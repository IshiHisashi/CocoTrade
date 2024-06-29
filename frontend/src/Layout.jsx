import React from "react";
import Nav from "./component/nav/Nav";
import Header from "./component/header/Header";

const Layout = (props) => {
  const { children } = props;

  return (
    <div>
      <Header />
      <Nav />
      <main className="ml-52">{children}</main>
    </div>
  );
};

export default Layout;
