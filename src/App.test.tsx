import { render } from '@testing-library/react'
import { App } from './App'
import { it, expect, vi, describe } from 'vitest'

vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    addTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    completionPercentage: 0,
  }),
}))

describe('App Component', () => {

  it('renders TaskFlaw title', () => {
    const { container } = render(<App />)

    const div = container.firstChild
    expect(div).toBeInTheDocument()

    const header = div?.firstChild
    expect(header).toBeInTheDocument()

    const title = header?.firstChild as HTMLElement
    expect(title).toBeInTheDocument()
    expect(title.textContent).toBe('TaskFlaw')

    const dashboard = div?.lastChild
    expect(dashboard).toBeInTheDocument()
  })

})