import React, { createContext, useState, useEffect, useContext } from 'react';
import fetchHealthData, {HealthData} from '../utils/fetchHealthData';

const HealthDataContext = createContext();

export const HealthDataProvider = ({ children }) => {
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthData, setHealthData] = useState(new HealthData());

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await fetchHealthData();
      setHealthData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <HealthDataContext.Provider value={{ healthData, fetchHealth, healthLoading }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => useContext(HealthDataContext);
