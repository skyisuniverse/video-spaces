'use client';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Companies',
    path: '/companies',
    icon: <BusinessIcon />,
  },
  {
    label: 'Products',
    path: '/products',
    icon: <InventoryIcon />,
  },
  {
    label: 'Services',
    path: '/services',
    icon: <MiscellaneousServicesIcon />,
  },
  {
    label: 'Apps',
    path: '/apps',
    icon: <AppShortcutIcon />,
  },
];

export default function ADRBottomNav() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'flex', sm: 'none' }, // only visible on mobile
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        sx={{
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
            component={Link}
            href={item.path}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}