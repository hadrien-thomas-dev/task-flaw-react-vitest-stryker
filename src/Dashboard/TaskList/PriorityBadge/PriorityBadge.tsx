import React, { memo } from 'react'
import './PriorityBadge.css'

export const PriorityBadge: React.FC<{ priority: 'low' | 'medium' | 'high' }> = memo(({ priority }) => {
    const getPriorityClass = (priority: string): string => {
        switch (priority) {
            case 'low':
                return 'priority-badge priority-low'
            case 'medium':
                return 'priority-badge priority-medium'
            case 'high':
                return 'priority-badge priority-high'
            default:
                return 'priority-badge'
        }
    }

    return <span className={getPriorityClass(priority)}>{priority}</span>
})