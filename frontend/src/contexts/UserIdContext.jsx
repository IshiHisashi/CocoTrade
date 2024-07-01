import React, { createContext, useEffect, useState } from "react";
import auth from "../../firebase-config";

const UserIdContext = createContext();

const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  }, []);

  return (
    <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
  );
};

export default UserIdProvider;
