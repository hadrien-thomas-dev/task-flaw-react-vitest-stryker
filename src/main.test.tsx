import { it, expect, vi, describe } from 'vitest'

document.body.innerHTML = '<div id="root"></div>'

const renderMock = vi.fn()

const createRootMock = vi.fn().mockImplementation(() => ({ render: renderMock }))

vi.mock('react-dom/client', () => ({ createRoot: createRootMock }))

vi.mock('./App.tsx', () => ({ default: () => null }))

describe('main.tsx', () => {

    it('calls createRoot and render on app start', async () => {
        await import('./main')

        const rootEl = document.getElementById('root')

        expect(createRootMock).toHaveBeenCalledWith(rootEl)

        expect(renderMock).toHaveBeenCalled()

    })

})