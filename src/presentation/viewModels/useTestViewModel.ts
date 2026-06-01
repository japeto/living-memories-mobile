import { useState } from 'react';
import { container } from 'tsyringe';

import { TestUseCase } from '../../domain/useCases/TestUseCase';

export const useTestViewModel = () => {
  const [message] = useState(() => {
    const testUseCase = container.resolve(TestUseCase);
    return testUseCase.execute();
  });

  return { message };
};
