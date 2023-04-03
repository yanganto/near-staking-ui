import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { StyledSelect } from './StyledSelect';

const DependentDiskField = (props) => {
  const {
    values: { server },
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);

  useEffect(() => {
    if (server && server.Provider && server.Provider !== 'Other') {
      setFieldValue(props.name, '2');
    }
  }, [server, setFieldValue, props.name]);

  return <StyledSelect {...props} {...field} />;
};

export default DependentDiskField;
