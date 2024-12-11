import {createContext, useContext, useState} from 'react';


const FormOptionsContext = createContext();

export const FormOptionsProvider = ({ children }) => {
  const [formOptions, setFormOptions] = useState({
    incentives: [],
    purposes: [],
  });

  const setIncentives = (incentives) => {
    setFormOptions((prevFormOptions) => ({
      ...prevFormOptions,
      incentives,
    }));
  };

  const setPurposes = (purposes) => {
    setFormOptions((prevFormOptions) => ({
      ...prevFormOptions,
      purposes,
    }));
  };

  return (
    <FormOptionsContext.Provider value={{
      formOptions,
      setIncentives,
      setPurposes,
    }}>
      {children}
    </FormOptionsContext.Provider>
  );
}

export const useFormOptions = () => useContext(FormOptionsContext);
