import React, { createContext, useEffect, useState } from "react";

export const URLContext = createContext();

const URLContextProvider = ({ children }) => {
  const url = "http://localhost:5555";
  console.log(url);

  return <URLContext.Provider value={url}>{children}</URLContext.Provider>;
};

export default URLContext;
