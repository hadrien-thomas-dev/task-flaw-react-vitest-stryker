import { useState, useEffect, useCallback } from 'react'
import { tasksService } from '@/services/tasks.service'
import type { Task } from '@/services/tasks.service'

export const useTasks = (): {
    tasks: Task[]
    addTask: (text: string) => Promise<void>
    toggleTask: (task: Task) => Promise<void>
    deleteTask: (task: Task) => Promise<void>
    completionPercentage: number
} => {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const loadTasks = async () => {
            await tasksService.loadTasks()
            const tasks = await tasksService.getAllTasks()
            setTasks(tasks)
        }
        loadTasks()
    }, [])

    const addTask = useCallback(async (text: string) => {
        await tasksService.createTask({
            text,
            completed: false,
            priority: 'medium',
        })
        const updatedTasks = await tasksService.getAllTasks()
        setTasks(updatedTasks)
    }, [])

    const toggleTask = useCallback(async (task: Task) => {
        await tasksService.toggleTaskCompletion(task.id)
        const updatedTasks = await tasksService.getAllTasks()
        setTasks(updatedTasks)
    }, [])

    const deleteTask = useCallback(async (task: Task) => {
        await tasksService.deleteTask(task.id)
        const updatedTasks = await tasksService.getAllTasks()
        setTasks(updatedTasks)
    }, [])

    const getCompletionPercentage = () => {
        if (tasks.length === 0) return 0
        const completed = tasks.filter(task => task.completed).length
        return Math.round((completed / tasks.length) * 100)
    }

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        completionPercentage: getCompletionPercentage(),
    }
}