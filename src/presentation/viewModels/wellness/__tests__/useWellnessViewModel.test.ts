import { renderHook } from '@testing-library/react-native';
import { useWellnessViewModel } from '../useWellnessViewModel';

describe('useWellnessViewModel', () => {
  it('should return default wellness data', () => {
    const { result } = renderHook(() => useWellnessViewModel());
    
    expect(result.current.data).toBeDefined();
    expect(result.current.data.week).toBe('Del 12 al 18 de Octubre');
    expect(result.current.data.moods.length).toBe(7);
    expect(result.current.data.topics.length).toBe(4);
    
    expect(result.current.data.moods[0].day).toBe('L');
    expect(result.current.data.moods[0].label).toBe('Alegría');
    expect(result.current.data.topics[0].name).toBe('Familia');
  });
});
