import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { useAuthSession } from '@/features/auth/useAuthSession';
import { signInWithEmail, signOutCurrentUser, signUpWithEmail } from '@/services/supabase/auth';
import { supabaseConfig } from '@/services/supabase/env';

export function SignInScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    disableSignup,
    mailerAutoconfirm,
    sessionEmail,
    sessionError,
    sessionLoading,
    settingsError,
  } = useAuthSession();

  const modeLabel = useMemo(() => (mode === 'signIn' ? 'Sign in' : 'Create account'), [mode]);

  async function handleSubmit() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setSubmitError('Email and password are both required.');
      setFeedback(null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setFeedback(null);

    try {
      if (mode === 'signIn') {
        const result = await signInWithEmail(normalizedEmail, password);

        setFeedback(
          result.user?.email
            ? `Signed in as ${result.user.email}.`
            : 'Sign in completed successfully.',
        );
        return;
      }

      const result = await signUpWithEmail(normalizedEmail, password);

      if (result.session) {
        setFeedback(`Account created and signed in as ${result.user?.email ?? normalizedEmail}.`);
        return;
      }

      setFeedback(
        mailerAutoconfirm === false
          ? 'Account created. Check your email to confirm the address before signing in.'
          : 'Account created successfully.',
      );
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `${modeLabel} failed.`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    setSubmitting(true);
    setSubmitError(null);
    setFeedback(null);

    try {
      await signOutCurrentUser();
      setFeedback('Signed out successfully.');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Sign out failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppScreen>
      <View className="flex-1 px-5 pt-6">
        <View className="gap-6 rounded-[32px] bg-surface p-5">
          <View className="gap-2">
            <Text className="font-medium text-sm text-text-secondary">Supabase authentication</Text>
            <Text className="font-heading text-[30px] leading-9 text-text-primary">
              Sign in or create your account
            </Text>
            <Text className="font-body text-sm leading-6 text-text-secondary">
              Live auth is connected. Configured: {supabaseConfig.isConfigured ? 'Yes' : 'No'} ·
              signup {disableSignup === false ? 'enabled' : 'unknown'} · email confirmation{' '}
              {mailerAutoconfirm === false ? 'required' : 'optional'}.
            </Text>
          </View>

          <View className="rounded-[24px] bg-elevated p-1.5">
            <View className="flex-row gap-1.5">
            <ScalePressable
              className={`flex-1 rounded-[18px] border px-4 py-3.5 ${
                mode === 'signIn'
                  ? 'border-accent bg-accent'
                  : 'border-transparent bg-transparent'
              }`}
              onPress={() => {
                setMode('signIn');
                setSubmitError(null);
                setFeedback(null);
              }}
            >
              <Text
                className={`font-ui text-center ${
                  mode === 'signIn' ? 'text-background' : 'text-text-secondary'
                }`}
              >
                Sign in
              </Text>
            </ScalePressable>
            <ScalePressable
              className={`flex-1 rounded-[18px] border px-4 py-3.5 ${
                mode === 'signUp'
                  ? 'border-accent bg-accent'
                  : 'border-transparent bg-transparent'
              }`}
              onPress={() => {
                setMode('signUp');
                setSubmitError(null);
                setFeedback(null);
              }}
            >
              <Text
                className={`font-ui text-center ${
                  mode === 'signUp' ? 'text-background' : 'text-text-secondary'
                }`}
              >
                Create account
              </Text>
            </ScalePressable>
            </View>
          </View>

          <View className="gap-3">
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              value={email}
              className="rounded-[22px] border border-border bg-elevated px-4 py-4 text-text-primary"
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              value={password}
              className="rounded-[22px] border border-border bg-elevated px-4 py-4 text-text-primary"
            />
          </View>

          <Pressable
            className={`rounded-[22px] px-4 py-4 ${submitting ? 'bg-accent/60' : 'bg-accent'}`}
            disabled={submitting}
            onPress={() => {
              void handleSubmit();
            }}
          >
            <Text className="font-ui text-center text-base text-background">
              {submitting ? 'Working...' : modeLabel}
            </Text>
          </Pressable>

          {disableSignup === true && mode === 'signUp' ? (
            <Text className="font-copy text-sm leading-6 text-warning">
              Signup is disabled in this Supabase project right now.
            </Text>
          ) : null}
          {feedback ? <Text className="font-copy text-sm leading-6 text-health">{feedback}</Text> : null}
          {submitError ? <Text className="font-copy text-sm leading-6 text-danger">{submitError}</Text> : null}
          {sessionError ? <Text className="font-copy text-sm leading-6 text-danger">{sessionError}</Text> : null}
          {settingsError && !sessionError ? (
            <Text className="font-copy text-sm leading-6 text-danger">{settingsError}</Text>
          ) : null}
        </View>

        <View className="mt-6 rounded-[28px] bg-surface p-5">
          <Text className="font-heading text-xl text-text-primary">Current session</Text>
          {sessionLoading ? (
            <Text className="mt-3 font-copy text-sm text-text-secondary">Loading session...</Text>
          ) : sessionEmail ? (
            <View className="mt-3 gap-3">
              <Text className="font-copy text-sm leading-6 text-text-secondary">Signed in as {sessionEmail}</Text>
              <Pressable
                className={`rounded-[22px] px-4 py-4 ${submitting ? 'bg-elevated' : 'bg-elevated'}`}
                disabled={submitting}
                onPress={() => {
                  void handleSignOut();
                }}
              >
                <Text className="font-ui text-center text-base text-text-primary">Sign out</Text>
              </Pressable>
            </View>
          ) : (
            <Text className="mt-3 font-copy text-sm leading-6 text-text-secondary">
              No active session yet. Use the form above to sign in or create an account.
            </Text>
          )}
        </View>
      </View>
    </AppScreen>
  );
}
