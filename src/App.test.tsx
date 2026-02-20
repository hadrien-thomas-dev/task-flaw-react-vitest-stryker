import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { test, expect } from 'vitest'
import { vi } from 'vitest'

// Mock static assets to prevent path errors
vi.mock('/vite.svg', () => ({ default: 'vite-logo' }))
vi.mock('/react.svg', () => ({ default: 'react-logo' }))

test('renders title and initial counter', () => {
  render(<App />)
  expect(screen.getByText(/Vite \+ React/i)).toBeDefined()
  expect(screen.getByRole('button').textContent).toBe('count is 0')
})

test('increments counter on click', () => {
  render(<App />)
  const button = screen.getByRole('button')

  fireEvent.click(button)

  expect(button.textContent).toBe('count is 1')
})