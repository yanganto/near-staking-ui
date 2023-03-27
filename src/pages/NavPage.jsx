import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChooseDialog from '../ui/components/ChooseDialog';

const NavPage = ({ isSignedIn, wallet }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      wallet.signIn();
    }
  }, [wallet, isSignedIn]);

  const handleClose = () => {
    console.log('here');
    navigate('/');
  };

  return (
    (isSignedIn && <ChooseDialog isOpen={true} onClose={handleClose} />) || null
  );
};

export default NavPage;
