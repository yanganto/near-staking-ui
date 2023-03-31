export const drawerWidth = 340;

export const navPageDialogData = [
  {
    id: 1,
    text: 'Bring your own server',
    to: '/servers/add',
  },
  {
    id: 2,
    text: 'kuutamo infrastructure platform',
    to: '#',
  },
];

export const authInitialValues = {
  email: '',
  password: '',
};

export const addServerInitialValues = {
  server: {
    id: '',
    Provider: '',
    Type: 'NEAR',
    IPv4: '',
    CIDR: '',
    Gateway: '',
    Username: '',
    disks: '',
  },
  key: { value: '', name: '' },
};
