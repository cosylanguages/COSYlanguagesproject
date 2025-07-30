import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './BoosterPackDescription.css';

const BoosterPackDescription = ({ summary }) => {
  const { t } = useI18n();
  return (
    <div className="session-summary">
      <h3>{t('freestyle.boosterPackDescription', 'Booster Pack Description')}</h3>
      <p>{summary.description}</p>
    </div>
  );
};

export default BoosterPackDescription;
