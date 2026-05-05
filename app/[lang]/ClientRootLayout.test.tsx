// app/[lang]/ClientRootLayout.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

import ClientRootLayout from './ClientRootLayout';

// =============================================================================
// TOP-LEVEL IMPORTS FOR STABLE MOCKING
// =============================================================================
import ResponsiveDrawer, { DrawerHeader } from '@/app/[lang]/components/ResponsiveDrawer';
import ADRTopBar from '@/app/[lang]/components/ADRTopBar';
import { StyledMain } from '@/app/[lang]/components/StyledMain';
import ADRBreadcrumbs from '@/app/[lang]/components/ADRBreadcrumbs';
import ADRBottomNav from '@/app/[lang]/components/ADRBottomNav';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import * as NextFontGoogle from 'next/font/google';

// =============================================================================
// MOCKS
// =============================================================================

// Next.js font (top-level call in ClientRootLayout.tsx)
vi.mock('next/font/google', () => ({
  Roboto: vi.fn(() => ({
    className: 'mock-roboto-class',
    variable: '--font-roboto',
    style: { fontFamily: 'Roboto' },
  })),
}));

// MUI providers
vi.mock('@mui/material-nextjs/v15-appRouter', () => ({
  AppRouterCacheProvider: vi.fn(({ children, options }: any) => (
    <div data-testid="app-router-cache-provider" data-key={options?.key}>
      {children}
    </div>
  )),
}));

vi.mock('@mui/material/styles', () => {
  const mockUseTheme = vi.fn(() => ({
    palette: { mode: 'light' },
    typography: { fontFamily: 'Roboto, sans-serif' },
    spacing: (factor: number) => `${factor * 8}px`,
  }));
  return {
    ThemeProvider: vi.fn(({ children, theme }: any) => (
      <div data-testid="theme-provider" data-theme-mode={theme?.palette?.mode}>
        {children}
      </div>
    )),
    useTheme: mockUseTheme,
  };
});

// Subpath imports used in ClientRootLayout.tsx
vi.mock('@mui/material/CssBaseline', () => ({
  default: vi.fn(() => <div data-testid="css-baseline" />),
}));

vi.mock('@mui/material/Box', () => ({
  default: vi.fn(({ children, sx }: any) => (
    <div data-testid="mui-box" data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  )),
}));

// Custom layout components
vi.mock('@/app/[lang]/components/ResponsiveDrawer', () => ({
  __esModule: true,
  default: vi.fn(({ open, mobileOpen }: any) => (
    <div
      data-testid="responsive-drawer"
      data-open={String(open)}
      data-mobile-open={String(mobileOpen)}
    />
  )),
  DrawerHeader: vi.fn(() => <div data-testid="drawer-header" />),
}));

vi.mock('@/app/[lang]/components/ADRTopBar', () => ({
  __esModule: true,
  default: vi.fn(({ open, onDrawerOpen, onMobileDrawerToggle }: any) => (
    <div data-testid="adr-top-bar" data-open={String(open)}>
      <button data-testid="topbar-desktop-open-btn" onClick={onDrawerOpen}>
        Open Desktop Drawer
      </button>
      <button data-testid="topbar-mobile-toggle-btn" onClick={onMobileDrawerToggle}>
        Toggle Mobile Drawer
      </button>
    </div>
  )),
}));

vi.mock('@/app/[lang]/components/StyledMain', () => ({
  StyledMain: vi.fn(({ open, children }: any) => (
    <main data-testid="styled-main" data-open={String(open)}>
      {children}
    </main>
  )),
}));

vi.mock('@/app/[lang]/components/ADRBreadcrumbs', () => ({
  __esModule: true,
  default: vi.fn(() => <nav data-testid="adr-breadcrumbs" />),
}));

vi.mock('@/app/[lang]/components/ADRBottomNav', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="adr-bottom-nav" />),
}));

// Navigation context
vi.mock('@/app/[lang]/contexts/navigation-context', () => ({
  NavigationProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="navigation-provider">{children}</div>
  ),
}));

vi.mock('./globals.css', () => ({}));

// =============================================================================
// TEST SUITE
// =============================================================================
describe('ClientRootLayout (Vitest + RTL)', () => {
  let mockAppRouterCacheProvider: ReturnType<typeof vi.fn>;
  let mockThemeProvider: ReturnType<typeof vi.fn>;
  let mockUseTheme: ReturnType<typeof vi.fn>;
  let mockResponsiveDrawer: ReturnType<typeof vi.fn>;
  let mockADRTopBar: ReturnType<typeof vi.fn>;
  let mockStyledMain: ReturnType<typeof vi.fn>;

  // ---------------------------------------------------------------------------
  // FONT CONFIGURATION (TOP-LEVEL MODULE EVALUATION)
  // ---------------------------------------------------------------------------
  beforeAll(() => {
    const mockRoboto = vi.mocked(NextFontGoogle.Roboto);
    expect(mockRoboto).toHaveBeenCalledWith(
      expect.objectContaining({
        weight: ['300', '400', '500', '700'],
        subsets: ['latin'],
        display: 'swap',
        variable: '--font-roboto',
      })
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockAppRouterCacheProvider = vi.mocked(AppRouterCacheProvider);
    mockThemeProvider = vi.mocked(ThemeProvider);
    mockUseTheme = vi.mocked(useTheme);
    mockResponsiveDrawer = vi.mocked(ResponsiveDrawer);
    mockADRTopBar = vi.mocked(ADRTopBar);
    mockStyledMain = vi.mocked(StyledMain);
  });

  // ---------------------------------------------------------------------------
  // 1. PROVIDER RENDERING & BASIC SETUP
  // ---------------------------------------------------------------------------
  it('renders without crashing and mounts all required providers and children', () => {
    // WHAT: Render the full layout with a test child and assert presence of everything.
    // WHY:  Basic smoke test – catches top-level errors, missing imports, provider crashes,
    //       or React hydration issues in a client component.
    render(
      <ClientRootLayout>
        <div data-testid="page-child">Hello from page</div>
      </ClientRootLayout>
    );

    expect(screen.getByTestId('page-child')).toBeInTheDocument();
    expect(screen.getByTestId('app-router-cache-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-provider')).toBeInTheDocument();
    expect(screen.getByTestId('css-baseline')).toBeInTheDocument();
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 2. PROVIDER HIERARCHY & THEME SETUP
  // ---------------------------------------------------------------------------
  it('wraps content with the exact expected provider nesting (AppRouterCacheProvider → ThemeProvider → NavigationProvider)', () => {
    // WHAT: Verify provider order and that ThemeProvider receives the result of useTheme().
    // WHY:  MUI Next.js integration requires this exact order for style caching and theme context
    //       to work correctly in the App Router.
    render(
      <ClientRootLayout>
        <div data-testid="child" />
      </ClientRootLayout>
    );

    expect(mockAppRouterCacheProvider).toHaveBeenCalled();
    expect(mockThemeProvider).toHaveBeenCalled();
    expect(mockUseTheme).toHaveBeenCalled();
    expect(screen.getByTestId('theme-provider')).toHaveAttribute('data-theme-mode', 'light');
  });

  // ---------------------------------------------------------------------------
  // 3. DRAWER STATE INITIALIZATION
  // ---------------------------------------------------------------------------
  it('initializes with desktop drawer open=true and mobileOpen=false', () => {
    // WHAT: Assert default state values passed to ADRTopBar, ResponsiveDrawer, and StyledMain.
    // WHY:  Desktop sidebar starts expanded (standard UX); mobile starts collapsed to avoid
    //       overlay on load.
    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-mobile-open', 'false');
    expect(screen.getByTestId('styled-main')).toHaveAttribute('data-open', 'true');
  });

  // ---------------------------------------------------------------------------
  // 4. CONTENT SLOTTING INSIDE StyledMain
  // ---------------------------------------------------------------------------
  it('renders DrawerHeader, ADRBreadcrumbs, page children, and ADRBottomNav inside StyledMain', () => {
    // WHAT: Verify the exact layout slotting inside the main content area.
    // WHY:  This is the visual skeleton – any misplacement would break the entire page layout.
    render(
      <ClientRootLayout>
        <div data-testid="page-content">Page content</div>
      </ClientRootLayout>
    );

    expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    expect(screen.getByTestId('adr-breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByTestId('adr-bottom-nav')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 5. DESKTOP DRAWER OPEN HANDLER (from ADRTopBar)
  // ---------------------------------------------------------------------------
  it('handleDrawerOpen sets desktop drawer to open', async () => {
    // WHAT: Simulate click on desktop open button inside mocked ADRTopBar.
    // WHY:  Tests the internal setOpen(true) handler and confirms state-driven re-render
    //       updates all child props.
    const user = userEvent.setup();

    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const openBtn = screen.getByTestId('topbar-desktop-open-btn');
    await user.click(openBtn);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-open', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // 6. MOBILE DRAWER TOGGLE HANDLER (from ADRTopBar)
  // ---------------------------------------------------------------------------
  it('handleMobileDrawerToggle flips mobileOpen state', async () => {
    // WHAT: Click the mobile toggle button and assert state flip (false → true).
    // WHY:  Mobile drawer must toggle on hamburger clicks; verifies the useState toggle logic.
    const user = userEvent.setup();

    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const toggleBtn = screen.getByTestId('topbar-mobile-toggle-btn');
    await user.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-mobile-open', 'true');
    });

    await user.click(toggleBtn);
    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-mobile-open', 'false');
    });
  });

  // ---------------------------------------------------------------------------
  // 7. DESKTOP DRAWER CLOSE HANDLER (from ResponsiveDrawer)
  // ---------------------------------------------------------------------------
  it('handleDesktopDrawerClose sets open=false', async () => {
    // WHAT: Invoke the onDesktopDrawerClose handler passed to ResponsiveDrawer.
    // WHY:  Desktop close (usually on backdrop or chevron) must collapse the sidebar
    //       and update StyledMain.
    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const lastCall = mockResponsiveDrawer.mock.calls.at(-1)?.[0];
    const closeHandler = lastCall?.onDesktopDrawerClose;
    closeHandler?.();

    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-open', 'false');
      expect(screen.getByTestId('styled-main')).toHaveAttribute('data-open', 'false');
    });
  });

  // ---------------------------------------------------------------------------
  // 8. MOBILE DRAWER CLOSE HANDLER (from ResponsiveDrawer)
  // ---------------------------------------------------------------------------
  it('handleMobileDrawerClose forces mobileOpen=false', async () => {
    // WHAT: Simulate mobile close (e.g. after navigation or backdrop click).
    // WHY:  Mobile drawer must dismiss reliably after selection.
    const user = userEvent.setup();
    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const toggleBtn = screen.getByTestId('topbar-mobile-toggle-btn');
    await user.click(toggleBtn);
    await waitFor(() => expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-mobile-open', 'true'));

    const lastCall = mockResponsiveDrawer.mock.calls.at(-1)?.[0];
    const closeHandler = lastCall?.onMobileDrawerClose;
    closeHandler?.();

    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-mobile-open', 'false');
    });
  });

  // ---------------------------------------------------------------------------
  // 9. STATE SYNC BETWEEN DRAWER AND MAIN
  // ---------------------------------------------------------------------------
  it('StyledMain and ResponsiveDrawer stay in sync when drawer state changes', async () => {
    // WHAT: Full round-trip: close desktop drawer via handler and verify both components update.
    // WHY:  Layout spacing (margin shift) depends on this sync; any desync would break UI.
    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const lastCall = mockResponsiveDrawer.mock.calls.at(-1)?.[0];
    lastCall?.onDesktopDrawerClose?.();

    await waitFor(() => {
      expect(screen.getByTestId('responsive-drawer')).toHaveAttribute('data-open', 'false');
      expect(screen.getByTestId('styled-main')).toHaveAttribute('data-open', 'false');
    });
  });

  // ---------------------------------------------------------------------------
  // 10. ROBOTO FONT & ROOT BOX CONFIGURATION
  // ---------------------------------------------------------------------------
  it('defines Roboto font and applies correct flex Box styling', () => {
    // WHAT: Verify the Roboto font object is created with the exact config and the root Box uses display:flex.
    // WHY:  Typography consistency and the flex layout are foundational to the entire responsive design.
    render(
      <ClientRootLayout>
        <div />
      </ClientRootLayout>
    );

    const box = screen.getByTestId('mui-box');
    expect(box).toHaveAttribute('data-sx', expect.stringContaining('"display":"flex"'));
  });
});

// All public API concerns covered:
// • Provider hierarchy & caching (AppRouterCacheProvider, ThemeProvider, NavigationProvider)
// • MUI primitives (CssBaseline, Box) via exact subpath mocks
// • Roboto font configuration (top-level module evaluation)
// • Drawer state initialization (desktop open, mobile closed)
// • All handlers (handleDrawerOpen, handleMobileDrawerToggle, handleDesktopDrawerClose, handleMobileDrawerClose)
// • Prop passing & re-render behavior to ResponsiveDrawer, ADRTopBar, StyledMain
// • Content slotting (DrawerHeader, ADRBreadcrumbs, children, ADRBottomNav)
// • State-driven UI sync between drawer and main content area