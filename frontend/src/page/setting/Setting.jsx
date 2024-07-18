import React, { useContext } from "react";
import Profile from "./Profile";
import Preference from "./Preference";
import Security from "./Security";
import Billing from "./Billing";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const Setting = ({ URL }) => {
  const userId = useContext(UserIdContext);


  return (
    <>
      <p>Settings Page</p>
      <Profile userId={userId} URL={URL} />
      <Preference userId={userId} URL={URL} />
      <Security userId={userId} URL={URL} />
      <Billing userId={userId} URL={URL} />
    </>
  )
};

export default Setting;
