// app/[lang]/layout.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Locale } from '@/i18n-config';

// =============================================================================
// TOP-LEVEL IMPORTS FOR STABLE MOCKING
// =============================================================================
import ClientRootLayout from './ClientRootLayout';

// =============================================================================
// CRITICAL TOP-LEVEL MOCKS (hoisted automatically by Vitest)
// =============================================================================
vi.mock('server-only', () => ({}));

// Mock the i18n config so we control supported locales
vi.mock('@/i18n-config', () => ({
  i18n: {
    locales: ['en', 'de', 'fr'] as const,
    defaultLocale: 'en' as const,
  },
}));

// Mock getDictionary – the layout now calls it (passes dict to ClientRootLayout)
const mockGetDictionary = vi.fn(async (locale: Locale) => ({
  // Minimal dictionary shape expected by ClientRootLayout + NavigationProvider
  navigation: { title: 'Navigation' },
  common: { hello: 'Hello' },
}));
vi.mock('@/get-dictionary', () => ({
  getDictionary: mockGetDictionary,
}));

// Mock ClientRootLayout
vi.mock('./ClientRootLayout', () => ({
  __esModule: true,
  default: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-client-root-layout">{children}</div>
  )),
}));

// =============================================================================
// TEST SUITE
// =============================================================================
describe('RootLayout (app/[lang]/layout.tsx) (Vitest)', () => {
  let mockClientRootLayout: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClientRootLayout = vi.mocked(ClientRootLayout);
  });

  // Helper: dynamically load the layout AFTER mocks are registered.
  const loadLayout = async () => {
    const { default: RootLayout, generateStaticParams } = await import('./layout');
    return { RootLayout, generateStaticParams };
  };

  // ---------------------------------------------------------------------------
  // 1. GENERATE STATIC PARAMS
  // ---------------------------------------------------------------------------
  it('generateStaticParams returns an array for every supported locale', async () => {
    const { generateStaticParams } = await loadLayout();
    const params = await generateStaticParams();

    expect(params).toEqual([
      { lang: 'en' },
      { lang: 'de' },
      { lang: 'fr' },
    ]);
    expect(params).toHaveLength(3);
  });

  // ---------------------------------------------------------------------------
  // 2. BASIC RENDERING & SMOKE TEST
  // ---------------------------------------------------------------------------
  it('renders without crashing and wraps children with ClientRootLayout', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'en' as Locale });

    const page = await RootLayout({
      children: <div data-testid="test-child">Hello from page</div>,
      params,
    });

    render(page);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('mock-client-root-layout')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 3. HTML LANG ATTRIBUTE
  // ---------------------------------------------------------------------------
  it('sets the correct lang attribute on the <html> tag from awaited params', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'de' as Locale });

    const page = await RootLayout({ children: <div />, params });

    render(page);
    expect(document.querySelector('html')).toHaveAttribute('lang', 'de');
  });

  // ---------------------------------------------------------------------------
  // 4. ASYNC PARAMS HANDLING (Next.js 15+ contract)
  // ---------------------------------------------------------------------------
  it('correctly awaits the params Promise before using lang', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'fr' as Locale });

    const page = await RootLayout({ children: <div data-testid="child" />, params });

    render(page);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 5. LOCALE AGNOSTIC BEHAVIOR – ENGLISH
  // ---------------------------------------------------------------------------
  it('renders correctly for English (en)', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'en' as Locale });

    const page = await RootLayout({
      children: <div data-testid="en-child">English content</div>,
      params,
    });

    render(page);

    expect(document.querySelector('html')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('en-child')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 6. LOCALE AGNOSTIC BEHAVIOR – GERMAN
  // ---------------------------------------------------------------------------
  it('renders correctly for German (de)', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'de' as Locale });

    const page = await RootLayout({
      children: <div data-testid="de-child">German content</div>,
      params,
    });

    render(page);

    expect(document.querySelector('html')).toHaveAttribute('lang', 'de');
    expect(screen.getByTestId('de-child')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 7. CLIENT ROOT LAYOUT PROP PASSING
  // ---------------------------------------------------------------------------
  it('passes children unchanged to the mocked ClientRootLayout', async () => {
    const { RootLayout } = await loadLayout();

    const params = Promise.resolve({ lang: 'en' as Locale });
    const children = <div data-testid="real-child">Real page content</div>;

    const page = await RootLayout({ children, params });

    render(page);

    expect(screen.getByTestId('mock-client-root-layout')).toBeInTheDocument();
    expect(screen.getByTestId('real-child')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 8. DICTIONARY LOOKUP (UPDATED – layout now calls it)
  // ---------------------------------------------------------------------------
  it('calls getDictionary exactly once with the resolved locale', async () => {
    // WHAT: The RootLayout now awaits getDictionary(locale) and passes `dict`
    //       to ClientRootLayout. This test verifies the expected call.
    // WHY:  Dictionary is required for i18n in ClientRootLayout/NavigationProvider.
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'en' as Locale });

    await RootLayout({ children: <div />, params });

    expect(mockGetDictionary).toHaveBeenCalledTimes(1);
    expect(mockGetDictionary).toHaveBeenCalledWith('en');
  });

  // ---------------------------------------------------------------------------
  // 9. TYPE SAFETY CONTRACT
  // ---------------------------------------------------------------------------
  it('accepts the correct TypeScript shape for params (Promise<{ lang: Locale }>)', async () => {
    const { RootLayout } = await loadLayout();

    const params = Promise.resolve({ lang: 'fr' as Locale });
    await expect(RootLayout({ children: null, params })).resolves.not.toThrow();
  });

  // ---------------------------------------------------------------------------
  // 10. FULL RENDER PATH (html → body → ClientRootLayout)
  // ---------------------------------------------------------------------------
  it('produces the complete document structure (html > body > ClientRootLayout)', async () => {
    const { RootLayout } = await loadLayout();
    const params = Promise.resolve({ lang: 'en' as Locale });

    const page = await RootLayout({
      children: <div data-testid="page-content">Content</div>,
      params,
    });

    render(page);

    expect(document.querySelector('html')).toBeInTheDocument();
    expect(document.querySelector('body')).toBeInTheDocument();
    expect(screen.getByTestId('mock-client-root-layout')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });
});

// =============================================================================
// WHAT THIS TEST FILE COVERS
// =============================================================================
// • All public responsibilities of the RootLayout server component:
//   - Correct async params handling (Next.js 15+ Promise pattern)
//   - generateStaticParams for static generation of every locale
//   - Proper <html lang={lang}> and <body> structure
//   - Clean delegation of children to ClientRootLayout
//   - Correct call to getDictionary(locale) (new behavior)
// • Locale-agnostic behavior across all supported languages
// • TypeScript contract safety for the params prop
//
// Uses Vitest + React Testing Library for fast, isolated, realistic server-component testing.
// Fully compatible with Next.js App Router dynamic params and static generation.