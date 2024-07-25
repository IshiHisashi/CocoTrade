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
      <div 
        id="navigation"
        className={ windowWidth >= 640 ? 
          "flex gap-2" :
          ""
        }
      >
        {windowWidth < 640 && settingsId === 0 ?
          <div id="settings-nav-2" className="bg-white">
            <button
              type="button"
              onClick={() => {
                setSettingsId(1);
              }}
              className=
                "w-full p-6 flex justify-between items-center"
            >
              Profile
              <img src="./btn-imgs/right.svg" alt="" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSettingsId(2);
              }}
              className=
                "w-full p-6 flex justify-between items-center"
            >
              Preference
              <img src="./btn-imgs/right.svg" alt="" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSettingsId(3);
              }}
              className=
                "w-full p-6 flex justify-between items-center"
            >
              Billing
              <img src="./btn-imgs/right.svg" alt="" />
            </button>
          </div>:
          null
        }
        {windowWidth < 640 && settingsId !== 1 ? 
          null :
          <button
            type="button"
            onClick={() => {
              if( windowWidth >= 640 ) {
                setSettingsId(1)
              } else {
                setSettingsId(0)
              };
            }}
            className={ windowWidth >= 640 ? 
              "p-4" :
              "p-6 flex items-center gap-2"
            }
          >
            { windowWidth >= 640 ? null : <img src="./btn-imgs/left.svg" alt="" /> }
            Profile
          </button>
        }
        {windowWidth < 640 && settingsId !== 2 ? 
          null :
          <button
            type="button"
            onClick={() => {
              if( windowWidth >= 640 ) {
                setSettingsId(2)
              } else {
                setSettingsId(0)
              };
            }}
            className={ windowWidth >= 640 ? 
              "p-4" :
              "p-6 flex items-center gap-2"
            }
          >
            { windowWidth >= 640 ? null : <img src="./btn-imgs/left.svg" alt="" /> }          
            Preference
          </button>
        }        
        {windowWidth < 640 && settingsId !== 3 ? 
          null :
          <button
            type="button"
            onClick={() => {
              if( windowWidth >= 640 ) {
                setSettingsId(3)
              } else {
                setSettingsId(0)
              };
            }}
            className={ windowWidth >= 640 ? 
              "p-4" :
              "p-6 flex items-center gap-2"
            }
          >
            { windowWidth >= 640 ? null : <img src="./btn-imgs/left.svg" alt="" /> }
            Billing
          </button>
        }
      </div>
      {
        settingsId === 1 || windowWidth >= 640 && settingsId === 0 ? 
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
