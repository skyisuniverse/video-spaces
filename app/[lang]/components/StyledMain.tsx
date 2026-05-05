'use client';

import { styled } from '@mui/material/styles';
import { drawerWidth } from './ResponsiveDrawer';

export const StyledMain = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 0,

  [theme.breakpoints.up('sm')]: {
    marginLeft: `-${drawerWidth}px`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  variants: [
    {
      props: ({ open }) => open,
      style: {
        [theme.breakpoints.up('sm')]: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    },
  ],
}));