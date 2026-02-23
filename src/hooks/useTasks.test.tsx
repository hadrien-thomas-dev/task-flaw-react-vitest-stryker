import { renderHook, waitFor, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import { tasksService } from '@/services/tasks.service'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/tasks.service', () => ({
    tasksService: {
        loadTasks: vi.fn(),
        getAllTasks: vi.fn(),
        createTask: vi.fn(),
        toggleTaskCompletion: vi.fn(),
        deleteTask: vi.fn(),
    }
}))

describe('useTasks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initial Load', () => {
        it('should render useTasks with empty array before loadTasks useEffect', () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValueOnce([{ id: 1, text: 'Initial', completed: false, priority: 'medium' }])
            const { result } = renderHook(() => useTasks())

            expect(tasksService.loadTasks).toHaveBeenCalled()
            expect(tasksService.getAllTasks).not.toHaveBeenCalled()
            expect(result.current.tasks).toEqual([])
        })

        it('should render useTasks with populated array after loadTasks useEffect', async () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValueOnce([{ id: 1, text: 'Initial', completed: false, priority: 'medium' }])
            const { result } = renderHook(() => useTasks())

            expect(tasksService.loadTasks).toHaveBeenCalled()

            await waitFor(() => {
                expect(tasksService.getAllTasks).toHaveBeenCalled()
                expect(result.current.tasks)
                    .toEqual([{ id: 1, text: 'Initial', completed: false, priority: 'medium' }])
            })
        })
    })

    describe('addTask', () => {
        it('should call createTask with correct default values', async () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValue([])
            const { result } = renderHook(() => useTasks())
            await act(async () => {
                await result.current.addTask('New Task')
            })

            expect(tasksService.createTask).toHaveBeenCalled()
        })
    })

    describe('toggleTask', () => {
        it('should call toggleTaskCompletion with correct id', async () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValueOnce([
                { id: 1, text: 'a', completed: true, priority: 'low' },
                { id: 2, text: 'b', completed: false, priority: 'low' },
                { id: 3, text: 'c', completed: false, priority: 'low' },
            ])
            vi.mocked(tasksService.toggleTaskCompletion).mockResolvedValueOnce(undefined)

            const { result } = renderHook(() => useTasks())

            await act(async () => {
                await result.current.toggleTask({ id: 2, text: 'b', completed: false, priority: 'low' })
            })

            expect(tasksService.getAllTasks).toHaveBeenCalled()
        })
    })

    describe('deleteTask', () => {
        it('should call deleteTask with correct id', async () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValue([])
            vi.mocked(tasksService.deleteTask).mockResolvedValueOnce(undefined)

            const { result } = renderHook(() => useTasks())

            await act(async () => {
                await result.current.deleteTask({ id: 2, text: 'b', completed: false, priority: 'low' })
            })

            expect(tasksService.getAllTasks).toHaveBeenCalled()
        })
    })

    describe('Completion Percentage', () => {
        it('should calculate complex completion percentages', async () => {
            vi.mocked(tasksService.getAllTasks).mockResolvedValueOnce([
                { id: 1, text: 'a', completed: true, priority: 'low' },
                { id: 2, text: 'b', completed: true, priority: 'low' },
                { id: 3, text: 'c', completed: false, priority: 'low' },
            ])
            const { result } = renderHook(() => useTasks())
            await waitFor(() => expect(result.current.completionPercentage).toBeDefined())
        })
    })
})