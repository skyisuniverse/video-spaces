'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import "./globals.css";
import ResponsiveDrawer from '@/app/[lang]/components/ResponsiveDrawer';
import ADRTopBar from '@/app/[lang]/components/ADRTopBar';
import { StyledMain } from '@/app/[lang]/components/StyledMain';
import { DrawerHeader } from '@/app/[lang]/components/ResponsiveDrawer';
import ADRBottomNav from '@/app/[lang]/components/ADRBottomNav';
// import ADRBreadcrumbs from '@/app/[lang]/components/ADRBreadcrumbs';

import { NavigationProvider } from '@/app/[lang]/contexts/navigation-context';

type Dictionary = Record<string, string>;

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function ClientRootLayout({
  children,
  dict
}: Readonly<{
  children: React.ReactNode;
  dict: Dictionary;
}>) {
  // ← your existing logic stays exactly the same (state, handlers, MUI providers, etc.)
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerOpen = () => { setOpen(true); };
  const handleMobileDrawerToggle = () => { setMobileOpen((prev) => !prev); };
  const handleMobileDrawerClose = () => { setMobileOpen(false); };
  const handleDesktopDrawerClose = () => { setOpen(false); };
  
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <NavigationProvider dict={dict}>
          <Box sx={{ display: 'flex' }}>
            <ADRTopBar
              open={open}
              onDrawerOpen={handleDrawerOpen}
              onMobileDrawerToggle={handleMobileDrawerToggle}
              dict={dict}
            />

            <ResponsiveDrawer
              open={open}
              onDesktopDrawerClose={handleDesktopDrawerClose}
              mobileOpen={mobileOpen}
              onMobileDrawerClose={handleMobileDrawerClose}
            />

            <StyledMain open={open}>
              <DrawerHeader />
              {/* <ADRBreadcrumbs dict={dict} /> */}
              {children}
              {/* <ADRBottomNav /> */}
            </StyledMain>
          </Box>
        </NavigationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}