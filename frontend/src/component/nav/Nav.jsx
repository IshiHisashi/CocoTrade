import React from "react";
import { Link } from "react-router-dom";

const Nav = (props) => {
  return (
    <nav className="bg-orange-300 fixed h-screen w-52">
      <p>
        <Link to="/">CocoTrade</Link>
      </p>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/purchase">Purchase</Link>
        </li>
        <li>
          <Link to="/sale">Sales</Link>
        </li>
        <li>
          <Link to="/finance">Finances</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
