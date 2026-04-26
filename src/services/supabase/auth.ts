import { supabase } from '@/services/supabase/client';
import type { Session } from '@supabase/supabase-js';

type AuthSettings = {
  disableSignup: boolean | null;
  mailerAutoconfirm: boolean | null;
};

export async function fetchAuthSettings(): Promise<AuthSettings> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth settings request failed with status ${response.status}.`);
    }

    const data = (await response.json()) as {
      disable_signup?: boolean;
      mailer_autoconfirm?: boolean;
    };

    return {
      disableSignup: data.disable_signup ?? null,
      mailerAutoconfirm: data.mailer_autoconfirm ?? null,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`We could not verify your Supabase auth settings. ${error.message}`);
    }

    throw new Error('We could not verify your Supabase auth settings.');
  }
}

export async function getCurrentSession() {
  if (!supabase) {
    throw new Error('Supabase is not configured in this app.');
  }

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`We could not load your auth session. ${error.message}`);
    }

    throw new Error('We could not load your auth session.');
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured in this app.');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign in failed. ${error.message}`);
    }

    throw new Error('Sign in failed.');
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured in this app.');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign up failed. ${error.message}`);
    }

    throw new Error('Sign up failed.');
  }
}

// Simulated email reset logic (replace with real API call later)
export async function resetPassword(email: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success
      resolve({ message: `Password reset email sent to ${email}` });
    }, 1000);
  });
}


export async function signOutCurrentUser() {
  if (!supabase) {
    throw new Error('Supabase is not configured in this app.');
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign out failed. ${error.message}`);
    }

    throw new Error('Sign out failed.');
  }
}

export function subscribeToAuthChanges(callback: (session: Session | null) => void) {
  if (!supabase) {
    throw new Error('Supabase is not configured in this app.');
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}
