import { render } from '@testing-library/react'
import { PriorityBadge } from './PriorityBadge'
import { it, expect, describe } from 'vitest'
describe('PriorityBadge Component', () => {

    it('renders low priority with specific class and exact text', () => {
        const { container } = render(<PriorityBadge priority="low" />)
        const badge = container.firstChild as HTMLElement
        expect(badge).toHaveClass('priority-badge', 'priority-low')
        expect(badge.tagName).toBe('SPAN')
        expect(badge.textContent).toBe('low')
    })

    it('renders medium priority with specific class and exact text', () => {
        const { container } = render(<PriorityBadge priority="medium" />)
        const badge = container.firstChild as HTMLElement
        expect(badge).toHaveClass('priority-badge', 'priority-medium')
        expect(badge.textContent).toBe('medium')
    })

    it('renders high priority with specific class and exact text', () => {
        const { container } = render(<PriorityBadge priority="high" />)
        const badge = container.firstChild as HTMLElement
        expect(badge).toHaveClass('priority-badge', 'priority-high')
        expect(badge.textContent).toBe('high')
    })

    it('fallback: renders unknown priority without specific color class', () => {
        const unknown = 'ultra-high' as unknown as 'low' | 'medium' | 'high';
        const { container } = render(<PriorityBadge priority={unknown} />)
        const badge = container.firstChild as HTMLElement
        expect(badge.className).toBe('priority-badge')
        expect(badge.textContent).toBe('ultra-high')
    })

})