import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navPageDialogData } from '../constants';
import ChooseDialog from '../ui/components/ChooseDialog';

const NavPage = ({ isSignedIn, wallet }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      wallet.signIn();
    }
  }, [wallet, isSignedIn]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    (isSignedIn && (
      <ChooseDialog
        title="Select an option"
        isOpen={true}
        onClose={handleClose}
        data={navPageDialogData}
      />
    )) ||
    null
  );
};

export default NavPage;
