import React from 'react';
import LinkButton from './LinkButton';
import ModalWrapper from './ModalWrapper';

const ChooseDialog = (props) => {
  return (
    <ModalWrapper {...props}>
      {props.data.map((dataEl) => (
        <LinkButton key={dataEl.id} {...dataEl} />
      ))}
    </ModalWrapper>
  );
};

export default ChooseDialog;
