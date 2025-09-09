import { renderHook, waitFor } from '@testing-library/react'
import { useNotifications } from '../use-notifications'

// Mock the API request function
jest.mock('@/config/api', () => ({
  apiRequest: jest.fn(),
  API_CONFIG: {
    ENDPOINTS: {
      NOTIFICATIONS: '/notifications'
    }
  }
}))

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useNotifications())
    
    expect(result.current.notifications).toEqual([])
    expect(result.current.stats).toEqual({
      urgent: 0,
      messages: 0,
      tasks: 0,
      proposals: 0,
      clients: 0
    })
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch notifications successfully', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'proposal',
        title: 'Test Proposal',
        description: 'Test description',
        timestamp: new Date().toISOString(),
        status: 'pending',
        priority: 'urgent',
        proposalId: 'prop-123'
      }
    ]

    const { apiRequest } = require('@/config/api')
    apiRequest.mockResolvedValue({ notifications: mockNotifications })

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.notifications).toEqual(mockNotifications)
    expect(result.current.stats.urgent).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('should handle API errors gracefully', async () => {
    const { apiRequest } = require('@/config/api')
    apiRequest.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.notifications).toHaveLength(5) // Mock data fallback
    expect(result.current.error).toBeNull() // Should not set error for fallback
  })
})
