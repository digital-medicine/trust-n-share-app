import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState({
    data: [],
    purposes: [],
    institutions: [],
    duration: 12,
  });

  const toggleFormSelected = (category, key) => {
    if (form[category] === undefined) {
      throw new Error(`Invalid category: ${category}`);
    }

    let newForm = { ...form };
    if (newForm[category].includes(key)) {
      newForm[category] = newForm[category].filter((item) => item !== key);
    }
    else {
      newForm[category] = [...newForm[category], key];
    }

    setForm(newForm);
  }

  const setDuration = (months) => {
    setForm({ ...form, duration: months });
  }

  return (
    <FormContext.Provider value={{ form, toggleFormSelected, setDuration }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
