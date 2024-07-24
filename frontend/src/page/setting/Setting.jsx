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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[])

  useEffect(() => {
    // Fetch user data
    axios
      .get(`${URL}/user/${userId}`)
      .then((response) => {
        setUserInfo(response.data.data);
        // console.log("User info: ", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [userId, URL])

  return (
    <div className="sm:pl-[34px]">
      <p>Here is gonna be a small nav</p>
      <Profile userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/>
      <Preference userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/>
      {/* <Security userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} /> */}
      <Billing userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/>
    </div>
  )
};

export default Setting;
