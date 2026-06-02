import { renderHook, act } from '@testing-library/react-hooks';
import { useProfileViewModel } from '../../../viewModels/profile/useProfileViewModel';
import { useAuth } from '../../../providers/AuthProvider';

jest.mock('../../../providers/AuthProvider');

describe('useProfileViewModel', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  it('should call auth logout when handleLogout is called', async () => {
    const { result } = renderHook(() => useProfileViewModel());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
