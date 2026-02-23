import React, { memo } from 'react'
import type { Task } from '@/services/tasks.service'
import { PriorityBadge } from './PriorityBadge/PriorityBadge'
import './TaskList.css'

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (task: Task) => void
  onDelete: (task: Task) => void
}

export const TaskList: React.FC<TaskListProps> = memo(({ tasks, onToggleComplete, onDelete }) => (
  <ul className="task-list">
    {tasks.map(task => (
      <li key={task.id} className={`${task.completed ? 'completed' : 'task-item'}`}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          className="task-checkbox"
        />
        <span className={`${task.completed ? 'task-text completed' : 'task-text'}`}>{task.text}</span>
        <PriorityBadge priority={task.priority} />
        <button onClick={() => onDelete(task)} className="btn btn-delete">Delete</button>
      </li>
    ))}
  </ul>
))