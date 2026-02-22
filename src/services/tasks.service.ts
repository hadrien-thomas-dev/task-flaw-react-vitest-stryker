export interface Task {
    id: number
    text: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
}

export class TasksService {
    private tasksFile = '/src/services/tasks.json'
    private tasks: Task[] = []

    async loadTasks(): Promise<void> {
        const response = await fetch(this.tasksFile)
        this.tasks = await response.json()
        return Promise.resolve()
    }

    async saveTasks(tasks: Task[]): Promise<void> {
        this.tasks = tasks
        return Promise.resolve()
    }

    async getAllTasks(): Promise<Task[]> {
        return Promise.resolve(this.tasks)
    }

    async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
        const newTask: Task = {
            ...taskData,
            id: Math.max(0, ...this.tasks.map(t => t.id)) + 1,
        }
        const updatedTasks = [...this.tasks, newTask]
        await this.saveTasks(updatedTasks)
        return newTask
    }

    async deleteTask(id: number): Promise<void> {
        const updatedTasks = this.tasks.filter(task => task.id !== id)
        return this.saveTasks(updatedTasks)
    }

    async toggleTaskCompletion(id: number): Promise<void> {
        const updatedTasks = this.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        return this.saveTasks(updatedTasks)
    }
}

export const tasksService = new TasksService()