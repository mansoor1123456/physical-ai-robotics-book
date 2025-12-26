import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api';

const BackendStatusContext = createContext();

export const useBackendStatus = () => {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error('useBackendStatus must be used within a BackendStatusProvider');
  }
  return context;
};

export const BackendStatusProvider = ({ children }) => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  // Function to check backend status
  const checkBackendStatus = async () => {
    try {
      const available = await apiService.isBackendAvailable();
      setIsBackendAvailable(available);
      setLastChecked(new Date());
      return available;
    } catch (error) {
      setIsBackendAvailable(false);
      setLastChecked(new Date());
      return false;
    }
  };

  // Check status on component mount and periodically
  useEffect(() => {
    // Initial check
    checkBackendStatus();

    // Set up periodic checks (every 30 seconds)
    const intervalId = setInterval(async () => {
      await checkBackendStatus();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BackendStatusContext.Provider value={{
      isBackendAvailable,
      lastChecked,
      checkBackendStatus
    }}>
      {children}
    </BackendStatusContext.Provider>
  );
};