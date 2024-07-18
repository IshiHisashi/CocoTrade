import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Profile from "./Profile";
import Preference from "./Preference";
import Security from "./Security";
import Billing from "./Billing";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const Setting = ({ URL }) => {
  const userId = useContext(UserIdContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch user data
    axios
      .get(`${URL}/user/${userId}`)
      .then((response) => {
        setUserInfo(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [userId, URL])

  return (
    <>
      <p>Settings Page</p>
      <Profile userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} />
      <Preference userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} />
      <Security userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} />
      <Billing userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} />
    </>
  )
};

export default Setting;
