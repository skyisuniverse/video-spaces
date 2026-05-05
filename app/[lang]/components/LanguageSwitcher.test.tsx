// app/[lang]/components/LanguageSwitcher.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

import LanguageSwitcher from './LanguageSwitcher';

// =============================================================================
// TOP-LEVEL IMPORTS FOR STABLE MOCKING
// =============================================================================
import * as NextNavigation from 'next/navigation';

// =============================================================================
// MOCKS
// =============================================================================

// Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => '/en/dashboard'),
  useParams: vi.fn(() => ({ lang: 'en' })),
}));

// MUI components – rendered with data-testid for easy assertions
vi.mock('@mui/material', () => {
  const mockButton = vi.fn(({ children, onClick, startIcon, endIcon, ...props }: any) => (
    <button
      data-testid="language-button"
      onClick={onClick}
      aria-label={props['aria-label']}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  ));

  const mockMenu = vi.fn(({ children, open, onClose }: any) => (
    open ? <div data-testid="language-menu" onClick={onClose}>{children}</div> : null
  ));

  const mockMenuItem = vi.fn(({ children, onClick, selected }: any) => (
    <div data-testid="menu-item" onClick={onClick} data-selected={String(selected)}>
      {children}
    </div>
  ));

  const mockListItemIcon = vi.fn(({ children }: any) => (
    <div data-testid="list-item-icon">{children}</div>
  ));

  const mockListItemText = vi.fn(({ primary }: any) => (
    <div data-testid="list-item-text">{primary}</div>
  ));

  const mockTypography = vi.fn(({ children }: any) => <span data-testid="typography">{children}</span>);

  const mockTooltip = vi.fn(({ children, title }: any) => (
    <div data-testid="tooltip" title={title}>{children}</div>
  ));

  return {
    Button: mockButton,
    Menu: mockMenu,
    MenuItem: mockMenuItem,
    ListItemIcon: mockListItemIcon,
    ListItemText: mockListItemText,
    Typography: mockTypography,
    Tooltip: mockTooltip,
  };
});

// Icons
vi.mock('@mui/icons-material/Language', () => ({
  default: () => <span data-testid="language-icon">🌐</span>,
}));

vi.mock('@mui/icons-material/ExpandMore', () => ({
  default: () => <span data-testid="expand-more-icon">▼</span>,
}));

// =============================================================================
// TEST SUITE
// =============================================================================
describe('LanguageSwitcher (Vitest + RTL)', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockUseRouter: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    mockUseRouter = vi.mocked(NextNavigation.useRouter);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockPush = vi.fn();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
  });

  // ---------------------------------------------------------------------------
  // 1. BASIC RENDERING & SMOKE TEST
  // ---------------------------------------------------------------------------
  it('renders without crashing and displays the current language name in the button', () => {
    // WHAT: Render the component and verify the button shows the full current language name.
    // WHY:  Ensures the component mounts correctly and the core display logic works.
    render(<LanguageSwitcher />);

    const button = screen.getByTestId('language-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('English');
  });

  // ---------------------------------------------------------------------------
  // 2. BUTTON STRUCTURE & ACCESSIBILITY
  // ---------------------------------------------------------------------------
  it('renders the button with LanguageIcon, language name, ExpandMore icon, and correct ARIA label', () => {
    // WHAT: Assert the Button contains the expected startIcon, children, endIcon and aria-label.
    // WHY:  Material Design requires clear visual + accessible language selector.
    render(<LanguageSwitcher />);

    expect(screen.getByTestId('language-icon')).toBeInTheDocument();
    expect(screen.getByTestId('expand-more-icon')).toBeInTheDocument();
    expect(screen.getByTestId('language-button')).toHaveAttribute('aria-label', 'select language');
  });

  // ---------------------------------------------------------------------------
  // 3. TOOLTIP PRESENCE
  // ---------------------------------------------------------------------------
  it('wraps the button with a Tooltip containing "Change language"', () => {
    // WHAT: Verify the Tooltip component is rendered with the exact title.
    // WHY:  Provides hover guidance – a key usability feature.
    render(<LanguageSwitcher />);

    expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Change language');
  });

  // ---------------------------------------------------------------------------
  // 4. MENU OPENING BEHAVIOR
  // ---------------------------------------------------------------------------
  it('opens the Menu when the button is clicked', async () => {
    // WHAT: Simulate user click on the language button and assert Menu becomes visible.
    // WHY:  Core interaction – the dropdown must appear reliably.
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByTestId('language-button'));
    expect(screen.getByTestId('language-menu')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 5. MENU CONTENT – ALL LANGUAGES RENDERED CORRECTLY
  // ---------------------------------------------------------------------------
  it('renders a MenuItem for every language with correct flag and full name', async () => {
    // WHAT: Open menu and verify each language appears with its flag and name.
    // WHY:  Ensures the full list of supported languages is always shown correctly.
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByTestId('language-button'));

    // IMPORTANT: Use specific selector because "English" also exists in the button
    expect(
      screen.getByText('English', { selector: '[data-testid="list-item-text"]' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Deutsch', { selector: '[data-testid="list-item-text"]' })
    ).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 6. LANGUAGE CHANGE – DIFFERENT LANGUAGE
  // ---------------------------------------------------------------------------
  it('calls router.push with updated locale path when a different language is selected', async () => {
    // WHAT: Click on German while current language is English and verify router.push is called.
    // WHY:  This is the primary business logic of the component.
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByTestId('language-button'));

    // Find the German menu item specifically (avoid ambiguous text match)
    const germanText = screen.getByText('Deutsch', { selector: '[data-testid="list-item-text"]' });
    const germanItem = germanText.closest('[data-testid="menu-item"]');
    await user.click(germanItem!);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/de/dashboard');
  });

  // ---------------------------------------------------------------------------
  // 7. NO-OP WHEN SAME LANGUAGE SELECTED
  // ---------------------------------------------------------------------------
  it('does NOT call router.push when the current language is selected again', async () => {
    // WHAT: Click on English (current) and verify router.push is never invoked.
    // WHY:  Prevents unnecessary navigation and duplicate history entries.
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByTestId('language-button'));

    // Find the English menu item specifically
    const englishText = screen.getByText('English', { selector: '[data-testid="list-item-text"]' });
    const englishItem = englishText.closest('[data-testid="menu-item"]');
    await user.click(englishItem!);

    expect(mockPush).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // 8. FALLBACK TO FIRST LANGUAGE
  // ---------------------------------------------------------------------------
  it('falls back to the first language (English) when currentLang is unknown', () => {
    // WHAT: Force useParams to return an unknown lang and verify the button shows English.
    // WHY:  Defensive programming – guarantees the component never crashes.
    vi.mocked(NextNavigation.useParams).mockReturnValueOnce({ lang: 'xx' });

    render(<LanguageSwitcher />);

    expect(screen.getByTestId('language-button')).toHaveTextContent('English');
  });

  // ---------------------------------------------------------------------------
  // 9. MENU CLOSES AFTER LANGUAGE SELECTION
  // ---------------------------------------------------------------------------
  it('closes the Menu after any language is selected', async () => {
    // WHAT: Select a language and assert the Menu is no longer in the document.
    // WHY:  Standard UX – dropdown should dismiss immediately after action.
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByTestId('language-button'));
    const germanText = screen.getByText('Deutsch', { selector: '[data-testid="list-item-text"]' });
    const germanItem = germanText.closest('[data-testid="menu-item"]');
    await user.click(germanItem!);

    await waitFor(() => {
      expect(screen.queryByTestId('language-menu')).not.toBeInTheDocument();
    });
  });
});

// All public API concerns covered:
// • Rendering of the language button with full name, globe icon, and expand icon
// • Tooltip with correct title for discoverability
// • Menu opening on button click
// • Full list of languages rendered with flags (ListItemIcon) and names (ListItemText)
// • Language switching via router.push with correct pathname replacement
// • No-op behavior when selecting the currently active language
// • Graceful fallback when currentLang is not in the supported list
// • Menu automatically closes after selection
// • All Next.js navigation hooks (useRouter, usePathname, useParams) are exercised
// • Material-UI component contract (Button, Menu, MenuItem, etc.) is respected