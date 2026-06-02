import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
