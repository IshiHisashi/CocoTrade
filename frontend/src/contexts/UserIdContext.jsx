import React, { createContext, useEffect, useState } from "react";
import auth from "../../firebase-config";

export const UserIdContext = createContext();

const UserIdProvider = ({ children }) => {
  // --Version.1
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log(user.uid);
  //       setUserId(user.uid);
  //     } else {
  //       setUserId(null);
  //     }
  //   });
  // }, []);

  // return (
  //   <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
  // );

  // --Version.2
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
  );
};

export default UserIdProvider;
