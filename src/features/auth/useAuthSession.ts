import { useEffect, useState } from 'react';

import {
  fetchAuthSettings,
  getCurrentSession,
  subscribeToAuthChanges,
} from '@/services/supabase/auth';
import { supabaseConfig } from '@/services/supabase/env';

type AuthSessionState = {
  sessionEmail: string | null;
  sessionLoading: boolean;
  sessionError: string | null;
  disableSignup: boolean | null;
  mailerAutoconfirm: boolean | null;
  settingsError: string | null;
};

export function useAuthSession(): AuthSessionState {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
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
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    sessionEmail,
    sessionLoading,
    sessionError,
    disableSignup,
    mailerAutoconfirm,
    settingsError,
  };
}
