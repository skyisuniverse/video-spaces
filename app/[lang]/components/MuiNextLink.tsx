'use client';

import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';
import Link from 'next/link';
import { forwardRef } from 'react';

const MuiNextLink = forwardRef<HTMLAnchorElement, MuiLinkProps & { href: string }>(
  (props, ref) => <MuiLink component={Link} ref={ref} {...props} />
);

export default MuiNextLink;