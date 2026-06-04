import 'reflect-metadata';
import { GetRemindersUseCase } from '../GetRemindersUseCase';
import { IReminderRepository } from '../../repositories/IReminderRepository';
import { Reminder } from '../../entities/Reminder';

describe('GetRemindersUseCase', () => {
  let useCase: GetRemindersUseCase;
  let mockRepository: jest.Mocked<IReminderRepository>;

  const mockReminders: Reminder[] = [
    {
      id: '1',
      memory_id: 'm1',
      title: 'Tomar pastilla',
      due_date: '2026-06-03T10:00:00Z',
      description: 'Con agua',
      is_done: false,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getReminders: jest.fn(),
      updateReminderStatus: jest.fn(),
    };
    useCase = new GetRemindersUseCase(mockRepository);
  });

  it('should call repository.getReminders and return the data', async () => {
    // Arrange
    mockRepository.getReminders.mockResolvedValue(mockReminders);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getReminders).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockReminders);
  });

  it('should propagate errors thrown by the repository', async () => {
    // Arrange
    const error = new Error('Network Error');
    mockRepository.getReminders.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Network Error');
    expect(mockRepository.getReminders).toHaveBeenCalledTimes(1);
  });
});
