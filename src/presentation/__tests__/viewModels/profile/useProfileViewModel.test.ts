import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfileViewModel } from '../../../viewModels/profile/useProfileViewModel';
import { useAuth } from '../../../providers/AuthProvider';
import { container } from '../../../../di/container';
import { GetProfileUseCase } from '../../../../domain/profile/useCases/GetProfileUseCase';

jest.mock('../../../providers/AuthProvider');

describe('useProfileViewModel', () => {
  const mockLogout = jest.fn();
  let mockGetProfileUseCase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
    
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });

    mockGetProfileUseCase = {
      execute: jest.fn(),
    };
    
    container.registerInstance(GetProfileUseCase, mockGetProfileUseCase);
  });

  it('should call auth logout when handleLogout is called', async () => {
    mockGetProfileUseCase.execute.mockResolvedValue({
      userId: '1',
      email: 'test@correo.com',
      displayName: 'Test',
    });

    const { result } = renderHook(() => useProfileViewModel());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should fetch profile successfully and update state', async () => {
    const mockProfile = {
      userId: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      fullName: 'Test User Full',
      avatarUrl: null,
    };

    mockGetProfileUseCase.execute.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfileViewModel());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for the async fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should be updated
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
    expect(mockGetProfileUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching profile fails', async () => {
    const errorMessage = 'Network Error';
    mockGetProfileUseCase.execute.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProfileViewModel());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });
});
