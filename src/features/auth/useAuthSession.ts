import { useAuthSessionContext } from '@/features/auth/AuthSessionProvider';

export function useAuthSession() {
  return useAuthSessionContext();
}
