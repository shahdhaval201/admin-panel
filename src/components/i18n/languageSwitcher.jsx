import React from 'react';
import i18n from 'i18next';

const LanguageSwitcher = () => {
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Change the language
  };

  return (
    <>
    <div>
      <button onClick={() => handleChangeLanguage('en')}>English</button>
      <button onClick={() => handleChangeLanguage('fr')}>Français</button>
    </div>
    </>
  );
};

export default LanguageSwitcher;
