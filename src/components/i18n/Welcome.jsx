import React from 'react';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation(); // Access translation function

  return (
    <>
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('login')}</p>
    </div>
    </>
  );
};

export default Welcome;
