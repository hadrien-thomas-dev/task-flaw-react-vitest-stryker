import { TasksService } from './tasks.service'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('TasksService', () => {
    let tasksService: TasksService

    beforeEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
        tasksService = new TasksService()
    })

    describe('Data Persistence', () => {
        it('should load tasks from the correct JSON file', async () => {
            const mockTasks = [{ id: 1, text: 'Loaded', completed: false, priority: 'low' }]
            const fetchMock = vi.fn().mockResolvedValue({
                json: () => Promise.resolve(mockTasks),
            })
            vi.stubGlobal('fetch', fetchMock)

            await tasksService.loadTasks()

            expect(fetchMock).toHaveBeenCalledWith('/src/services/tasks.json')
            expect(await tasksService.getAllTasks()).toEqual(mockTasks)
        })

        it('should explicitly update internal state when saving', async () => {
            const newTasks = [{ id: 5, text: 'New', completed: true, priority: 'medium' as const }]
            await tasksService.saveTasks(newTasks)
            expect(await tasksService.getAllTasks()).toBe(newTasks)
        })
    })

    describe('Tasks Operations', () => {
        it('should create first task with id = 1', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (tasksService as any).tasks = []
            const firstTask = await tasksService.createTask({ text: 'T1', completed: false, priority: 'low' })
            expect(firstTask.id).toBe(1)
        })

        it('should create task with id = highest existing id + 1', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (tasksService as any).tasks = [{ id: 10, text: 'Old', completed: false, priority: 'low' }]

            const newTask = await tasksService.createTask({ text: 'T2', completed: false, priority: 'medium' })
            expect(newTask.id).toBe(11)
        })

        it('should remove the specific task by id when deleting', async () => {
            await tasksService.createTask({ text: 'Task to Delete', completed: false, priority: 'low' })

            await tasksService.deleteTask(1)
            const tasks = await tasksService.getAllTasks()

            expect(tasks).toHaveLength(0)
        })

        it('should ignore deletion if the id does not exist', async () => {
            await tasksService.createTask({ text: 'Stay', completed: false, priority: 'low' })

            await tasksService.deleteTask(999)
            const tasks = await tasksService.getAllTasks()

            expect(tasks).toHaveLength(1)
        })

        it('should toggle "completed" status for a targeted task', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (tasksService as any).tasks = [
                { id: 1, text: 'T1', completed: false, priority: 'high' },
                { id: 2, text: 'T2', completed: false, priority: 'medium' },
            ]

            await tasksService.toggleTaskCompletion(1)
            const tasks = await tasksService.getAllTasks()

            expect(tasks[0].completed).toBe(true)
            expect(tasks[1].completed).toBe(false)
        })
    })
})