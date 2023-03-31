import * as yup from 'yup';

export const addServerValidator = yup.object({
  server: yup.object({
    id: yup.string().required('Required'),
    Provider: yup
      .string()
      .oneOf(['OVH', 'Latitude', 'Other'])
      .required('Required'),
    Type: yup.string().oneOf(['NEAR']).required('Required'),
    IPv4: yup
      .string()
      .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'IP is invalid')
      .required('Required'),
    CIDR: yup.number().required('Required'),
    Gateway: yup
      .string()
      .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'Gateway is invalid')
      .required('Required'),
    Username: yup.string().required('Required'),
    disks: yup.string().oneOf(['1', '2', '3']).required('Required'),
  }),
  key: yup.object({
    value: yup.string().required('Required'),
    name: yup.string().required('Required'),
  }),
});
