import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";

// Create the context
const LoadingContext = createContext();

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((count) => count - 1);
  }, []);

  useEffect(() => {
    setLoading(loadingCount > 0);
  }, [loadingCount]);

  const value = useMemo(
    () => ({
      loading,
      startLoading,
      stopLoading,
    }),
    [loading, startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

// Custom hook to use the LoadingContext
export const useLoading = () => useContext(LoadingContext);
