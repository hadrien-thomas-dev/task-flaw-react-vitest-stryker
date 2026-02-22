import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { it, expect, vi, describe, beforeEach } from 'vitest'

const mockAddTask = vi.fn()
const mockToggleTask = vi.fn()
const mockDeleteTask = vi.fn()

vi.mock('@/hooks/useTasks', () => ({
    useTasks: () => ({
        tasks: [
            { id: 1, text: 'Test task', completed: false, priority: 'medium' as const }
        ],
        addTask: mockAddTask,
        toggleTask: mockToggleTask,
        deleteTask: mockDeleteTask,
        completionPercentage: 0
    })
}))

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })



    describe('Initial Render', () => {
        it('renders dashboard', () => {
            const { container } = render(<Dashboard />)

            const dashboard = container.firstChild
            expect(dashboard).toBeInTheDocument()
            expect(dashboard).toBeInstanceOf(HTMLDivElement)
            expect(dashboard).toHaveClass('dashboard')
        })

        describe('Header', () => {
            it('renders header', () => {
                const { container } = render(<Dashboard />)

                const dashboard = container.firstChild
                const header = dashboard?.firstChild
                expect(header).toBeInTheDocument()
                expect(header).toBeInstanceOf(HTMLElement)
                expect(header).toHaveClass('dashboard-header')
            })

            describe('Actions', () => {
                it('renders header actions', () => {
                    const { container } = render(<Dashboard />)

                    const dashboard = container.firstChild
                    const header = dashboard?.firstChild
                    const actions = header?.firstChild
                    expect(actions).toBeInTheDocument()
                    expect(actions).toBeInstanceOf(HTMLDivElement)
                    expect(actions).toHaveClass('header-actions')
                })

                describe('Add Button', () => {
                    it('renders add button', () => {
                        const { container } = render(<Dashboard />)

                        const dashboard = container.firstChild
                        const header = dashboard?.firstChild
                        const actions = header?.firstChild
                        const addButton = actions?.firstChild
                        expect(addButton).toBeInTheDocument()
                        expect(addButton).toBeInstanceOf(HTMLButtonElement)
                        expect(addButton).toHaveClass('btn btn-primary')
                        expect(addButton?.textContent).toBe('Add Task')
                    })
                })

                describe('Completion Percentage', () => {
                    it('renders completion percentage', () => {
                        const { container } = render(<Dashboard />)

                        const dashboard = container.firstChild
                        const header = dashboard?.firstChild
                        const actions = header?.firstChild
                        const completionText = actions?.lastChild
                        expect(completionText).toBeInTheDocument()
                        expect(completionText).toBeInstanceOf(HTMLSpanElement)
                        expect(completionText).toHaveClass('completion-percentage')
                        expect(completionText?.textContent).toBe('Completion: 0%')
                    })
                })
            })
        })

        describe('Main', () => {
            it('renders main', () => {
                const { container } = render(<Dashboard />)

                const dashboard = container.firstChild
                const main = dashboard?.lastChild
                expect(main).toBeInTheDocument()
                expect(main).toBeInstanceOf(HTMLElement)
            })

            describe('TaskList', () => {
                it('renders TaskList component', () => {
                    const { container } = render(<Dashboard />)

                    const dashboard = container.firstChild
                    const main = dashboard?.lastChild
                    const taskList = main?.firstChild
                    expect(taskList).toBeInTheDocument()
                    expect(taskList).toBeInstanceOf(HTMLElement)

                })
            })
        })
    })

    describe('Actions', () => {
        describe('Add Task', () => {
            it('calls addTask when add button is clicked', async () => {
                const { container } = render(<Dashboard />)

                const dashboard = container.firstChild
                const header = dashboard?.firstChild
                const actions = header?.firstChild
                const addButton = actions?.firstChild as HTMLButtonElement

                fireEvent.click(addButton)
                await waitFor(() => {
                    expect(mockAddTask).toHaveBeenCalledWith('New Task')
                })
            })
        })

        describe('Toggle Task', () => {
            it('calls toggleTask when a task is toggled', async () => {
                render(<Dashboard />)
                const toggleButton = screen.getByRole('checkbox')
                fireEvent.click(toggleButton)
                expect(mockToggleTask).toHaveBeenCalled()
            })
        })

        describe('Delete Task', () => {


            it('calls deleteTask when a task is deleted', async () => {
                render(<Dashboard />)
                const deleteButton = screen.getByRole('button', { name: /delete/i })
                fireEvent.click(deleteButton)
                expect(mockDeleteTask).toHaveBeenCalled()
            })
        })
    })
})