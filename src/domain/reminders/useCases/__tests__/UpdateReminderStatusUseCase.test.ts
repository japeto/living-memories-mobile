import 'reflect-metadata';
import { UpdateReminderStatusUseCase } from '../UpdateReminderStatusUseCase';
import { IReminderRepository } from '../../repositories/IReminderRepository';

describe('UpdateReminderStatusUseCase', () => {
  let useCase: UpdateReminderStatusUseCase;
  let mockRepository: jest.Mocked<IReminderRepository>;

  beforeEach(() => {
    mockRepository = {
      getReminders: jest.fn(),
      updateReminderStatus: jest.fn(),
    };
    useCase = new UpdateReminderStatusUseCase(mockRepository);
  });

  it('should call repository.updateReminderStatus with correct arguments', async () => {
    // Arrange
    const reminderId = 'r1';
    const newStatus = true;
    mockRepository.updateReminderStatus.mockResolvedValue(undefined);

    // Act
    await useCase.execute(reminderId, newStatus);

    // Assert
    expect(mockRepository.updateReminderStatus).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateReminderStatus).toHaveBeenCalledWith(reminderId, newStatus);
  });

  it('should propagate errors if repository fails', async () => {
    // Arrange
    const error = new Error('Update failed');
    mockRepository.updateReminderStatus.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute('r1', true)).rejects.toThrow('Update failed');
  });
});
