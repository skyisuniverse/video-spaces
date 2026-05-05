import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Locale } from '@/i18n-config';

// =============================================================================
// CRITICAL TOP-LEVEL MOCKS (hoisted automatically by Vitest)
// =============================================================================
// These MUST be declared BEFORE any other code or imports that could pull in
// get-dictionary.ts or page.tsx. This is the only pattern that reliably prevents
// Vite from trying to resolve the real 'server-only' marker.
vi.mock('server-only', () => ({}));

// Mock the dictionary module with a factory so we never load the real file
// (which contains import 'server-only')
const mockGetDictionary = vi.fn();
vi.mock('@/get-dictionary', () => ({
  getDictionary: mockGetDictionary,
}));

// =============================================================================
// TEST SUITE
// =============================================================================
describe('Home Page (app/[lang]/page.tsx) (Vitest)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper: dynamically load the page AFTER mocks are registered
  const loadHome = async (params: any) => {
    const { default: Home } = await import('./page');
    return Home({ params });
  };

  // ---------------------------------------------------------------------------
  // 1. BASIC RENDERING & SMOKE TEST
  // ---------------------------------------------------------------------------
  it('renders children inside a Box without crashing', async () => {
    const mockDict = {
      title: 'Test Title',
      contextTitle: 'Test Context',
      description: 'Test Description',
    };
    mockGetDictionary.mockResolvedValue(mockDict);

    const params = Promise.resolve({ lang: 'en' as Locale });
    const page = await loadHome(params);

    render(page);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 2. DICTIONARY CONTENT RENDERING
  // ---------------------------------------------------------------------------
  it('renders the title, contextTitle, and description from the dictionary', async () => {
    const mockDict = {
      title: 'Home Title',
      contextTitle: 'Context Section',
      description: 'Full page description text here.',
    };
    mockGetDictionary.mockResolvedValue(mockDict);

    const params = Promise.resolve({ lang: 'en' as Locale });
    const page = await loadHome(params);

    render(page);

    expect(screen.getByText(mockDict.title)).toBeInTheDocument();
    expect(screen.getByText(mockDict.contextTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDict.description)).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // 3. LANGUAGE PARAMETER HANDLING
  // ---------------------------------------------------------------------------
  it('fetches dictionary using the language extracted from params Promise', async () => {
    const lang: Locale = 'de';
    const params = Promise.resolve({ lang });

    mockGetDictionary.mockResolvedValue({
      title: 'a',
      contextTitle: 'b',
      description: 'c',
    });

    await loadHome(params);

    expect(mockGetDictionary).toHaveBeenCalledWith(lang);
    expect(mockGetDictionary).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------------------------------
  // 4. LOCALE AGNOSTIC BEHAVIOR
  // ---------------------------------------------------------------------------
  it('handles different locales correctly (German)', async () => {
    const mockDictDe = {
      title: 'Startseite',
      contextTitle: 'Kontext',
      description: 'Vollständige Seitenbeschreibung auf Deutsch.',
    };
    mockGetDictionary.mockResolvedValue(mockDictDe);

    const params = Promise.resolve({ lang: 'de' as Locale });
    const page = await loadHome(params);

    render(page);

    expect(screen.getByText('Startseite')).toBeInTheDocument();
    expect(screen.getByText('Kontext')).toBeInTheDocument();
    expect(screen.getByText('Vollständige Seitenbeschreibung auf Deutsch.')).toBeInTheDocument();
  });
});

// =============================================================================
// WHAT THIS TEST FILE COVERS
// =============================================================================
// • All public responsibilities of the Home server component:
//   - Correct async params handling (Next.js App Router contract)
//   - Dictionary fetching for any supported Locale ('en' | 'de')
//   - Rendering of all three translated Typography blocks
// • Edge-case safety (different languages, Promise params)
// • No tests for MUI styling or layout (unit test scope – those belong in E2E/visual tests)
// • Uses Vitest + React Testing Library for fast, isolated, realistic component testing.
//
// FIXED: Used top-level `vi.mock('server-only')` + factory mock + dynamic import
//        (`await import('./page')`) to prevent Vitest from failing on the
//        `import 'server-only';` directive in get-dictionary.ts (Next.js server-only marker).