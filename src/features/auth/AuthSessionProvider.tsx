import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import {
  fetchAuthSettings,
  getCurrentSession,
  subscribeToAuthChanges,
} from '@/services/supabase/auth';
import { supabaseConfig } from '@/services/supabase/env';

type AuthSessionState = {
  sessionEmail: string | null;
  sessionFullName: string | null;
  sessionLoading: boolean;
  sessionError: string | null;
  disableSignup: boolean | null;
  mailerAutoconfirm: boolean | null;
  settingsError: string | null;
  isAuthenticated: boolean;
};

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionFullName, setSessionFullName] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(supabaseConfig.isConfigured);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [disableSignup, setDisableSignup] = useState<boolean | null>(null);
  const [mailerAutoconfirm, setMailerAutoconfirm] = useState<boolean | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseConfig.isConfigured) {
      setSessionLoading(false);
      return;
    }

    let isMounted = true;

    async function loadState() {
      try {
        const [session, settings] = await Promise.all([getCurrentSession(), fetchAuthSettings()]);

        if (!isMounted) {
          return;
        }

        setSessionEmail(session?.user.email ?? null);
        setSessionFullName(getSessionFullName(session));
        setDisableSignup(settings.disableSignup);
        setMailerAutoconfirm(settings.mailerAutoconfirm);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'We could not load authentication.';
        setSessionError(message);
        setSettingsError(message);
      } finally {
        if (isMounted) {
          setSessionLoading(false);
        }
      }
    }

    void loadState();

    const unsubscribe = subscribeToAuthChanges((session) => {
      if (!isMounted) {
        return;
      }

      setSessionEmail(session?.user.email ?? null);
      setSessionFullName(getSessionFullName(session));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      sessionEmail,
      sessionFullName,
      sessionLoading,
      sessionError,
      disableSignup,
      mailerAutoconfirm,
      settingsError,
      isAuthenticated: Boolean(sessionEmail),
    }),
    [disableSignup, mailerAutoconfirm, sessionEmail, sessionError, sessionFullName, sessionLoading, settingsError],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSessionContext() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSessionContext must be used inside AuthSessionProvider.');
  }

  return context;
}

function getSessionFullName(session: Awaited<ReturnType<typeof getCurrentSession>>) {
  const fullName = session?.user.user_metadata?.full_name;
  return typeof fullName === 'string' && fullName.trim().length > 0 ? fullName.trim() : null;
}
