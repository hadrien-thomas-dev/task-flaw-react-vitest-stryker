import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from './TaskList'
import { it, expect, vi, beforeEach, describe } from 'vitest'
import type { Task } from '@/services/tasks.service'

const mockOnToggleComplete = vi.fn()
const mockOnDelete = vi.fn()

const sampleTasks: Task[] = [
    { id: 1, text: 'Task 1 high priority not completed', completed: false, priority: 'high' },
    { id: 2, text: 'Task 2 low priority completed', completed: true, priority: 'low' }
]

describe('TaskList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Rendering', () => {
        it('should render an empty list as a UL element', () => {
            const { container } = render(<TaskList tasks={[]} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const list = container.firstChild as HTMLElement

            expect(list).toBeInTheDocument()
            expect(list.tagName).toBe('UL')
            expect(list.children).toHaveLength(0)
        })

        it('should always apply base classes', () => {
            const { container } = render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)
            const list = container.firstChild as HTMLElement

            Array.from(list.children).forEach((item) => {

                const checkbox = item.children[0]
                const text = item.children[1]
                const badge = item.children[2]
                const deleteButton = item.children[3]


                expect(item.tagName).toBe('LI')
                expect(item.className).toMatch(/^(task-item|task-item completed)$/)

                expect(checkbox).toBeInstanceOf(HTMLInputElement)
                expect(checkbox.className).toBe('task-checkbox')

                expect(text).toBeInstanceOf(HTMLSpanElement)
                expect(text.className).toMatch(/^(task-text|task-text completed)$/)

                expect(badge).toBeInstanceOf(HTMLSpanElement)
                expect(badge.className).toMatch(/^(priority-badge priority-low|priority-badge priority-medium|priority-badge priority-high)$/)

                expect(deleteButton).toBeInstanceOf(HTMLButtonElement)
                expect(deleteButton.className).toBe('btn btn-delete')
            })
        })
    })

    describe('Data binding', () => {
        it('should render all tasks with their specific data', () => {
            const { container } = render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const list = container.firstChild as HTMLElement

            const item1 = list.children[0]
            expect(item1).toBeDefined()
            expect(item1.textContent).toContain('Task 1 high priority not completed')

            const item2 = list.children[1]
            expect(item2).toBeDefined()
            expect(item2.textContent).toContain('Task 2 low priority completed')
        })
    })

    describe('Task Completion States', () => {
        it('should apply "completed" class when task is completed', () => {
            const { container } = render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const list = container.firstChild as HTMLElement
            const completedItem = list.children[1]

            const completedCheckbox = completedItem.children[0]
            const completedText = completedItem.children[1]

            expect(completedItem).toHaveClass('completed')
            expect(completedText).toHaveClass('completed')
            expect(completedCheckbox).toBeChecked()
        })

        it('should NOT apply "completed" class when task is pending', () => {
            const { container } = render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const list = container.firstChild as HTMLElement
            const notCompletedItem = list.children[0]

            const notCompletedCheckbox = notCompletedItem.children[0]
            const notCompletedText = notCompletedItem.children[1]

            expect(notCompletedItem).not.toHaveClass('completed')
            expect(notCompletedText).not.toHaveClass('completed')
            expect(notCompletedCheckbox).not.toBeChecked()
        })
    })

    describe('User Interactions', () => {
        it('should trigger onToggleComplete with correct task data', () => {
            render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const notCompletedItem = screen.getAllByRole('listitem')[1]
            const notCompletedCheckbox = notCompletedItem.children[0]

            fireEvent.click(notCompletedCheckbox)

            expect(mockOnToggleComplete).toHaveBeenCalledTimes(1)
            expect(mockOnToggleComplete).toHaveBeenCalledWith(sampleTasks[1])
        })

        it('should trigger onDelete with correct task data', () => {
            render(<TaskList tasks={sampleTasks} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />)

            const completedItem = screen.getAllByRole('listitem')[0]
            const deleteButton = completedItem.children[3]

            fireEvent.click(deleteButton)

            expect(mockOnDelete).toHaveBeenCalledTimes(1)
            expect(mockOnDelete).toHaveBeenCalledWith(sampleTasks[0])
        })
    })
})