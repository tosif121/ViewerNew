import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@ohif/ui-next';
import { Button } from '../Button';
import { useTranslation } from 'react-i18next';

export enum showDialogOption {
  NeverShowDialog = 'never',
  AlwaysShowDialog = 'always',
  ShowOnceAndConfigure = 'configure',
}

const InvestigationalUseDialog = ({
  dialogConfiguration = {
    option: showDialogOption.AlwaysShowDialog,
  },
}) => {
  const { option, days } = dialogConfiguration;
  const [isHidden, setIsHidden] = useState(true);
  const { t } = useTranslation('InvestigationalUseDialog');

  useEffect(() => {
    const dialogLocalState = localStorage.getItem('investigationalUseDialog');
    const dialogSessionState = sessionStorage.getItem('investigationalUseDialog');

    switch (option) {
      case showDialogOption.NeverShowDialog:
        setIsHidden(true);
        break;
      case showDialogOption.AlwaysShowDialog:
        setIsHidden(!!dialogSessionState);
        break;
      case showDialogOption.ShowOnceAndConfigure:
        if (dialogLocalState) {
          const { expiryDate } = JSON.parse(dialogLocalState);
          const isExpired = new Date() > new Date(expiryDate);
          setIsHidden(!isExpired);
        } else {
          setIsHidden(false);
        }
        break;
      default:
        setIsHidden(true);
    }
  }, [option, days]);

  const handleConfirmAndHide = () => {
    const expiryDate = new Date();

    switch (option) {
      case showDialogOption.ShowOnceAndConfigure:
        expiryDate.setDate(expiryDate.getDate() + days);
        localStorage.setItem('investigationalUseDialog', JSON.stringify({ expiryDate }));
        break;
      case showDialogOption.AlwaysShowDialog:
        sessionStorage.setItem('investigationalUseDialog', 'hidden');
        break;
    }
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  return <></>;
};

InvestigationalUseDialog.propTypes = {
  dialogConfiguration: PropTypes.shape({
    option: PropTypes.oneOf(Object.values(showDialogOption)).isRequired,
    days: PropTypes.number,
  }),
};

export default InvestigationalUseDialog;
