import LanguageSwitcher from 'components/i18n/languageSwitcher';
import Welcome from 'components/i18n/Welcome';
import React, { useState } from 'react';

const Language = () => {
 

  return (
    <div>
      <Welcome />
      <LanguageSwitcher />  
    </div>
  );
};

export default Language;
