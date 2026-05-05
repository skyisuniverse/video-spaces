import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { Box, Typography } from '@mui/material';

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Box>
      {/* <Typography sx={{ marginBottom: 2 }}>
        {dict.title}
      </Typography>

      <Typography sx={{ marginBottom: 2 }}>
        {dict.contextTitle}
      </Typography>

      <Typography sx={{ marginBottom: 2 }}>
        {dict.description}
      </Typography> */}
    </Box>
  );
}