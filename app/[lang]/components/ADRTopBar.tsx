'use client';
import { useTheme } from '@mui/material/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { drawerWidth } from './ResponsiveDrawer';
import LanguageSwitcher from './LanguageSwitcher';

type Dictionary = Record<string, string>;

interface AppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up('sm')]: {
    ...(open
      ? {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }
      : {
          width: '100%',
          marginLeft: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
  },
}));

interface ADRTopBarProps {
  open: boolean;
  onDrawerOpen: () => void;
  onMobileDrawerToggle: () => void;
  dict: Dictionary;
}

export default function ADRTopBar({
  open,
  onDrawerOpen,
  onMobileDrawerToggle,
  dict
}: ADRTopBarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const { lang } = useParams() as { lang: string };

  const navItems = [
    { title: dict.companies, href: 'companies' },
    { title: dict.products, href: 'products' },
    { title: dict.services, href: 'services' },
    { title: dict.applications, href: 'apps' },   // uses /apps route + translated label
  ];

  // const pages = ['Companies', 'Products', 'Services', 'Apps'];

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        {/* Mobile drawer toggle (xs only) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMobileDrawerToggle}
          edge="start"
          sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop drawer toggle (sm+ only when drawer is closed) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          sx={{
            mr: 2,
            display: { xs: 'none', sm: open ? 'none' : 'block' },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo / Title – locale-aware */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ mr: 2, flexGrow: 0 }}
        >
          <Link
            href={`/${lang}`}
            color="inherit"
            style={{ textDecoration: 'none' }}
          >
            Video Spaces
          </Link>
        </Typography>

        {/* Desktop navigation (sm and up) – locale-aware links */}
        {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
          {navItems.map((item) => {
            const href = `/${lang}/${item.href}`;
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Button
                key={item.href}
                component={Link}
                href={href}
                color="inherit"
                sx={{
                  my: 2,
                  display: 'block',
                  mx: 1,
                  ...(isActive && {
                    backgroundColor: 'white',
                    color: 'primary.dark',
                  }),
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Button>
            );
          })}
        </Box> */}

        {/* Right side: Language switcher + R&D Center link */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <LanguageSwitcher />
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ ml: 2 }}
          >
            <Link
              href="https://rd-center.vercel.app/"
              color="inherit"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              R&D Center
            </Link>
          </Typography> */}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}