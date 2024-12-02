import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState({
    data: [],
    purposes: [],
    institutions: [],
    duration: 12,
    privacyLevel: {
      incentive: 5,
      highRisk: 50,
      lowRisk: 50,
    },
    reputation: 50,
    incentives: [],
    consumers: [],
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

  const setPrivacyIncentive = (value) => {
    setForm({ ...form, privacyLevel: { ...form.privacyLevel, incentive: value } });
  }

  const setPrivacyHighRisk = (value) => {
    setForm({ ...form, privacyLevel: { ...form.privacyLevel, highRisk: value } });
  }

  const setPrivacyLowRisk = (value) => {
    setForm({ ...form, privacyLevel: { ...form.privacyLevel, lowRisk: value } });
  }

  const setReputation = (value) => {
    setForm({ ...form, reputation: value });
  }

  const submitForm = () => {
    console.log(form);

    // TODO
  }

  return (
    <FormContext.Provider value={{
      form,
      toggleFormSelected,
      setDuration,
      setPrivacyIncentive,
      setPrivacyHighRisk,
      setPrivacyLowRisk,
      setReputation,
      submitForm,
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
