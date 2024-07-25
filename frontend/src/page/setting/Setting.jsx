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
  const [settingsId, setSettingsId] = useState(0);
  // Initial value 0 shows initial menu screen for a small screen. And for a larger screen it just shows profile.

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
      <div id="navigation">
        <button
          type="button"
          onClick={() => {
            setSettingsId(1);
          }}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => {
            setSettingsId(2);
          }}
        >
          Preference
        </button>
        <button
          type="button"
          onClick={() => {
            setSettingsId(3);
          }}
        >
          Billing
        </button>
      </div>
      {
        settingsId === 1 || settingsId === 0 ? 
        <Profile userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/> : null
      }
      {
        settingsId === 2 ? 
        <Preference userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/> : 
        null
      }
      {
        settingsId === 3 ? 
        <Billing userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} winWidth={windowWidth}/> :
        null
      }
      {/* <Security userId={userId} URL={URL} userInfo={userInfo} setUserInfo={setUserInfo} /> */}
    </div>
  )
};

export default Setting;
