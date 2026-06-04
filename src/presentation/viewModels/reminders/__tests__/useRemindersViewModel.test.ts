import { renderHook, act } from '@testing-library/react-hooks';
import { useRemindersViewModel } from '../useRemindersViewModel';
import { container } from '../../../../di/container';
import { GetRemindersUseCase } from '../../../../domain/reminders/useCases/GetRemindersUseCase';
import { UpdateReminderStatusUseCase } from '../../../../domain/reminders/useCases/UpdateReminderStatusUseCase';

jest.mock('../../../../di/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useRemindersViewModel', () => {
  let mockGetRemindersUseCase: jest.Mocked<GetRemindersUseCase>;
  let mockUpdateReminderStatusUseCase: jest.Mocked<UpdateReminderStatusUseCase>;

  const mockReminder = {
    id: '1',
    memory_id: 'm1',
    title: 'Test Reminder',
    due_date: '2026-06-03T10:00:00Z',
    description: 'Test description',
    is_done: false,
  };

  beforeEach(() => {
    mockGetRemindersUseCase = {
      execute: jest.fn(),
    } as any;
    
    mockUpdateReminderStatusUseCase = {
      execute: jest.fn(),
    } as any;

    (container.resolve as jest.Mock).mockImplementation((dependency) => {
      if (dependency === GetRemindersUseCase) return mockGetRemindersUseCase;
      if (dependency === UpdateReminderStatusUseCase) return mockUpdateReminderStatusUseCase;
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch reminders on mount and set loading state', async () => {
    // Arrange
    mockGetRemindersUseCase.execute.mockResolvedValue([mockReminder]);

    // Act
    const { result } = renderHook(() => useRemindersViewModel());

    // Assert initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.reminders).toEqual([]);

    await act(async () => {
      await result.current.refetch();
    });

    // Assert fetched state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.reminders).toEqual([mockReminder]);
    expect(result.current.error).toBeNull();
    expect(mockGetRemindersUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    mockGetRemindersUseCase.execute.mockRejectedValue(new Error('Network error'));

    // Act
    const { result } = renderHook(() => useRemindersViewModel());
    
    await act(async () => {
      await result.current.refetch();
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.reminders).toEqual([]);
  });

  it('should optimistically update reminder status and call update use case', async () => {
    // Arrange
    mockGetRemindersUseCase.execute.mockResolvedValue([mockReminder]);
    mockUpdateReminderStatusUseCase.execute.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRemindersViewModel());
    await act(async () => {
      await result.current.refetch();
    });

    // Act
    await act(async () => {
      await result.current.toggleReminderDone(mockReminder);
    });

    // Assert optimistic update
    expect(result.current.reminders[0].is_done).toBe(true);
    expect(mockUpdateReminderStatusUseCase.execute).toHaveBeenCalledWith('1', true);
  });

  it('should revert reminder status if update use case fails', async () => {
    // Arrange
    mockGetRemindersUseCase.execute.mockResolvedValue([mockReminder]);
    mockUpdateReminderStatusUseCase.execute.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useRemindersViewModel());
    await act(async () => {
      await result.current.refetch();
    });

    // Act
    await act(async () => {
      await result.current.toggleReminderDone(mockReminder);
    });

    // Assert rollback to initial state (is_done: false)
    expect(result.current.reminders[0].is_done).toBe(false);
    expect(mockUpdateReminderStatusUseCase.execute).toHaveBeenCalledWith('1', true);
  });
});
