import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import MuiTextField from './MuiTextFieldFormik';

const DependentIPField = (props) => {
  const {
    values: { server },
    errors,

    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);

  useEffect(() => {
    if (
      server &&
      (server.Provider === 'OVH' || server.Provider === 'Latitude')
    ) {
      setFieldValue('server.CIDR', 24);
      const regex = /(^(\d{1,3}\.){3}(\d{1,3})$)/;
      if (server.IPv4 && regex.test(server.IPv4)) {
        const arr = server.IPv4.split('.');
        arr.pop();
        if (server.Provider === 'OVH') {
          setFieldValue(props.name, `${arr.join('.')}.254`);
        } else if (server.Provider === 'Latitude') {
          setFieldValue(props.name, `${arr.join('.')}.1`);
        }
      }
    }
  }, [errors, server, setFieldValue, props.name]);

  return <MuiTextField {...props} {...field} />;
};

export default DependentIPField;
