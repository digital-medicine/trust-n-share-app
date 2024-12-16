import React, { createContext, useState, useContext } from 'react';
import {getUser, putUser} from '../utils/restApi';

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

  const submitForm = async (userId) => {
    // Fetch user data because it's needed for the form submission
    const userData = await getUser(userId);
    if (userData.error) {
      throw new Error(userData.error);
    }

    // Prepare form data
    const submitForm = {
      donorInfo: {
        privacyLow: form.privacyLevel.lowRisk,
        privacyHigh: form.privacyLevel.highRisk,
        privacyNone: form.privacyLevel.incentive,
        incentiveTypes: form.incentives,
        reputation: form.reputation,
        sharing: form.purposes,
      },
      _id: userId,
      username: userData.json.username,
      email: userData.json.email,
      active: true,
      roles: userData.json.roles,
    }

    // Submit
    const submitResponse = await putUser(submitForm);
    if (submitResponse.error) {
      throw new Error(submitResponse.error);
    }
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
