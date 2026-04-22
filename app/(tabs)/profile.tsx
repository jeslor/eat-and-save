import { Redirect } from 'expo-router';

import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { useAuthSession } from '@/features/auth/useAuthSession';

export default function ProfileRoute() {
  const { isAuthenticated, sessionLoading } = useAuthSession();

  if (!sessionLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/auth', params: { redirectTo: '/(tabs)/profile' } }} />;
  }

  return <ProfileScreen />;
}
