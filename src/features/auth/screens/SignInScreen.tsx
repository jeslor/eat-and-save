import {
  Redirect,
  type Href,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppScreen } from "@/components/ui/AppScreen";
import { ScalePressable } from "@/components/ui/ScalePressable";
import { useAuthSession } from "@/features/auth/useAuthSession";
import { signInWithEmail, signUpWithEmail } from "@/services/supabase/auth";
import { supabaseConfig } from "@/services/supabase/env";

export function SignInScreen() {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [toggleWidth, setToggleWidth] = useState(300);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const {
    disableSignup,
    mailerAutoconfirm,
    sessionError,
    sessionLoading,
    settingsError,
    isAuthenticated,
  } = useAuthSession();

  const modeLabel = useMemo(
    () => (mode === "signIn" ? "Sign in" : "Create account"),
    [mode],
  );
  const destination = ((redirectTo as string | undefined) ??
    "/(tabs)/profile") as Href;
  const signupDisabled = disableSignup === true && mode === "signUp";
  const activeIndex = mode === "signIn" ? 0 : 1;
  const segmentWidth = toggleWidth > 0 ? toggleWidth / 2 : 0;

  useEffect(() => {
    if (segmentWidth === 0) {
      return;
    }

    Animated.timing(indicatorX, {
      toValue: activeIndex * 150,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicatorX, segmentWidth]);

  async function handleSubmit() {
    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setSubmitError("Email and password are both required.");
      setFeedback(null);
      return;
    }

    if (mode === "signUp" && !normalizedFullName) {
      setSubmitError(
        "Full name, email, and password are all required to create an account.",
      );
      setFeedback(null);
      return;
    }

    if (signupDisabled) {
      setSubmitError(
        "Account creation is disabled for this project right now.",
      );
      setFeedback(null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setFeedback(null);

    try {
      if (mode === "signIn") {
        const result = await signInWithEmail(normalizedEmail, password);

        setFeedback(
          result.user?.email
            ? `Signed in as ${result.user.email}.`
            : "Sign in completed successfully.",
        );
        router.replace(destination);
        return;
      }

      console.log(indicatorX);

      const result = await signUpWithEmail(
        normalizedEmail,
        password,
        normalizedFullName,
      );

      if (result.session) {
        setFeedback(
          `Account created for ${normalizedFullName} and signed in as ${result.user?.email ?? normalizedEmail}.`,
        );
        router.replace(destination);
        return;
      }

      setFeedback(
        mailerAutoconfirm === false
          ? `Account created for ${normalizedFullName}. Check your email to confirm the address before signing in.`
          : "Account created successfully.",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : `${modeLabel} failed.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!sessionLoading && isAuthenticated) {
    return <Redirect href={destination} />;
  }

  return (
    <AppScreen>
      <View className="flex-1 px-5 pt-6">
        <View className="gap-6 rounded-[32px] bg-surface p-5">
          <View className="gap-2">
            <Text className="font-heading text-center text-[30px] leading-9 text-text-primary">
              Sign in or create your account
            </Text>
            <Text className="font-body text-center text-sm leading-6 text-text-secondary">
              Save meals, keep your preferences, and unlock your profile across
              the app.
            </Text>
          </View>

          <View className="h-[54px] w-[300px] mx-auto  flex justify-center items-center rounded-[22px] bg-elevated py-1.5 relative">
            <View
              className="relative flex-row w-full"
              onLayout={(event) => {
                setToggleWidth(300);
              }}
            >
              {segmentWidth > 0 ? (
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-y-0 h-full left-0 rounded-[22px] border border-accent bg-accent"
                  style={{
                    width: 150,
                    transform: [{ translateX: indicatorX }],
                  }}
                />
              ) : null}
              <ScalePressable
                style={{ width: segmentWidth }}
                className="h-[54px]  items-center justify-center rounded-[18px] px-3 py-3.5 "
                onPress={() => {
                  setMode("signIn");
                  setSubmitError(null);
                  setFeedback(null);
                }}
              >
                <Text
                  numberOfLines={1}
                  className={`font-ui text-center ${
                    mode === "signIn"
                      ? "text-background"
                      : "text-text-secondary"
                  }`}
                >
                  Sign in
                </Text>
              </ScalePressable>
              <ScalePressable
                className="min-h-[54px] flex-1 items-center justify-center rounded-[18px] px-3 py-3.5"
                onPress={() => {
                  setMode("signUp");
                  setSubmitError(null);
                  setFeedback(null);
                }}
              >
                <Text
                  numberOfLines={1}
                  className={`font-ui text-center ${
                    mode === "signUp"
                      ? "text-background"
                      : "text-text-secondary"
                  }`}
                >
                  Create account
                </Text>
              </ScalePressable>
            </View>
          </View>

          <View className="gap-3">
            {mode === "signUp" ? (
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={setFullName}
                placeholder="Full name"
                value={fullName}
                className="rounded-[22px] border border-border bg-elevated px-4 py-4 text-text-primary"
              />
            ) : null}
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
            className={`rounded-[22px] px-4 py-4 ${submitting || signupDisabled ? "bg-accent/60" : "bg-accent"}`}
            disabled={submitting || signupDisabled}
            onPress={() => {
              void handleSubmit();
            }}
          >
            <Text className="font-ui text-center text-base text-background">
              {submitting ? "Working..." : modeLabel}
            </Text>
          </Pressable>

          {disableSignup === true && mode === "signUp" ? (
            <Text className="font-copy text-sm leading-6 text-warning">
              Signup is disabled in this Supabase project right now.
            </Text>
          ) : null}
          {feedback ? (
            <Text className="font-copy text-sm leading-6 text-health">
              {feedback}
            </Text>
          ) : null}
          {submitError ? (
            <Text className="font-copy text-sm leading-6 text-danger">
              {submitError}
            </Text>
          ) : null}
          {sessionError ? (
            <Text className="font-copy text-sm leading-6 text-danger">
              {sessionError}
            </Text>
          ) : null}
          {settingsError && !sessionError ? (
            <Text className="font-copy text-sm leading-6 text-danger">
              {settingsError}
            </Text>
          ) : null}
        </View>

        <View className="mt-6 rounded-[28px] bg-surface p-5">
          <Text className="font-heading text-xl text-text-primary">
            Authentication status
          </Text>
          {sessionLoading ? (
            <Text className="mt-3 font-copy text-sm text-text-secondary">
              Loading session...
            </Text>
          ) : (
            <Text className="mt-3 font-copy text-sm leading-6 text-text-secondary">
              {supabaseConfig.isConfigured
                ? "Your account will unlock profile access, saved meals, and persisted preferences."
                : "Set your Supabase environment variables to enable account creation and sign-in."}
            </Text>
          )}
        </View>
      </View>
    </AppScreen>
  );
}
