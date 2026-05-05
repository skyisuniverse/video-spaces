'use client';
import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter, usePathname, useParams } from 'next/navigation';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
//   { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  // Add more languages here as needed
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang: currentLang } = useParams() as { lang: string };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (newLang: string) => {
    handleClose();
    if (newLang === currentLang) return;

    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  // Find current language object
  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <>
      <Tooltip title="Change language" arrow>
        <Button
          color="inherit"
          aria-label="select language"
          onClick={handleClick}
          startIcon={<LanguageIcon />}
          endIcon={<ExpandMore sx={{ fontSize: 18 }} />}
          sx={{
            ml: 1,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          {currentLanguage.name}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            selected={lang.code === currentLang}
          >
            <ListItemIcon>
              <Typography variant="body1" component="span" sx={{ fontSize: '1.4rem' }}>
                {lang.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText primary={lang.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}