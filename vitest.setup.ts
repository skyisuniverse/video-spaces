import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Import all jest-dom matchers (this also fixes the TypeScript error)
import '@testing-library/jest-dom/vitest'

// Clean up the DOM after every test (recommended best practice)
afterEach(() => {
  cleanup()
})