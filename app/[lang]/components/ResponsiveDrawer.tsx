'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  styled,
  Badge,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// === Project management icons ===
import TimelineIcon from '@mui/icons-material/Timeline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SettingsIcon from '@mui/icons-material/Settings';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/app/[lang]/contexts/navigation-context';

export const drawerWidth = 240;

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface Props {
  open: boolean;
  onDesktopDrawerClose: () => void;
  mobileOpen: boolean;
  onMobileDrawerClose: () => void;
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const {
    window,
    open,
    onDesktopDrawerClose,
    mobileOpen,
    onMobileDrawerClose,
  } = props;

  const pathname = usePathname();
  const { localize, dict } = useNavigation();

  // Updated nav items with meaningful project-management icons
  // const navItems = [
  //   { key: 'roadmap', Icon: TimelineIcon },
  //   { key: 'backlog', Icon: FormatListBulletedIcon },
  //   { key: 'board', Icon: ViewKanbanIcon, badge: true },
  //   { key: 'reports', Icon: AssessmentIcon },
  //   { key: 'issues', Icon: BugReportIcon },
  //   { key: 'code', Icon: CodeIcon },
  //   { key: 'releases', Icon: NewReleasesIcon },
  //   { key: 'project-settings', Icon: SettingsIcon },
  // ];

  const drawerContent = (onClose: () => void) => (
    <div>
      <DrawerHeader>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        {/* {navItems.map(({ key, Icon, badge = false }) => {
          // Convert key to kebab-case for URL (myPage → my-page)
          const slug = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          const localizedHref = localize(`/${slug}`);

          return (
            <ListItem key={key} disablePadding>
              <ListItemButton
                component={Link}
                href={localizedHref}
                selected={pathname === localizedHref}
              >
                <ListItemIcon>
                  {badge ? (
                    <Badge badgeContent={4} color="primary">
                      <Icon />
                    </Badge>
                  ) : (
                    <Icon />
                  )}
                </ListItemIcon>
                <ListItemText primary={dict[key] ?? key} />
              </ListItemButton>
            </ListItem>
          );
        })} */}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileDrawerClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        slotProps={{ root: { keepMounted: true } }}
      >
        {drawerContent(onMobileDrawerClose)}
      </Drawer>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent(onDesktopDrawerClose)}
      </Drawer>
    </Box>
  );
}