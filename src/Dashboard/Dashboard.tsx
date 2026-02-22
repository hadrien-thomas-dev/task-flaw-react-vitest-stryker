import React from 'react'
import { TaskList } from './TaskList/TaskList'
import { useTasks } from '@/hooks/useTasks'
import type { Task } from '@/services/tasks.service'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
    const {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        completionPercentage,
    } = useTasks()

    const handleAddTask = async () => {
        await addTask(`New Task`)
    }

    const handleToggleTaskCompletion = async (task: Task) => {
        await toggleTask(task)
    }

    const handleDeleteTask = async (task: Task) => {
        await deleteTask(task)
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-actions">
                    <button onClick={handleAddTask} className="btn btn-primary">Add Task</button>
                    <span className="completion-percentage">Completion: {completionPercentage}%</span>
                </div>
            </header>
            <main>
                <TaskList
                    tasks={tasks}
                    onToggleComplete={handleToggleTaskCompletion}
                    onDelete={handleDeleteTask}
                />
            </main>
        </div>
    )
}