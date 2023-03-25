import React, { useEffect } from 'react';
import { redirect } from 'react-router-dom';
import ChooseDialog from '../ui/components/ChooseDialog';

const NavPage = ({ isSignedIn, wallet }) => {
  useEffect(() => {
    console.log('here');
    if (!isSignedIn) {
      console.log('here');
      wallet.signIn();
    }
  }, [wallet, isSignedIn]);

  const handleClose = () => {
    redirect('/');
  };

  return (
    (isSignedIn && <ChooseDialog isOpen={true} onClose={handleClose} />) || null
  );
};

export default NavPage;
