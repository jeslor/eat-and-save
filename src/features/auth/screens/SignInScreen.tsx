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

import { resetPassword } from "@/services/supabase/auth";

export function SignInScreen() {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  // Default to 300 so buttons are always visible on first render
  const [toggleWidth, setToggleWidth] = useState(300);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
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
  // Always fallback to 150px per button if toggleWidth is not measured yet
  const segmentWidth = toggleWidth > 0 ? toggleWidth / 2 : 150;

  useEffect(() => {
    if (segmentWidth === 0) {
      return;
    }
    Animated.timing(indicatorX, {
      toValue: activeIndex * segmentWidth,
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

          <View className="h-[54px] mx-auto flex justify-center items-center rounded-[22px] bg-elevated py-1.5 relative">
            <View
              className="relative w-[300px] flex-row items-center rounded-[22px] bg-elevated"
              onLayout={(event) => {
                const width = event.nativeEvent.layout.width;
                // Only update if width is valid and different
                if (width && width !== toggleWidth) {
                  setToggleWidth(width);
                }
              }}
            >
              {segmentWidth > 0 ? (
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-y-0 h-full left-0 rounded-[22px] border border-accent bg-accent"
                  style={{
                    width: 150,
                    position: "absolute",
                    transform: [{ translateX: indicatorX }],
                  }}
                />
              ) : null}
              {/* Sign In Button */}
              <ScalePressable
                style={{ width: "50%" }}
                className="h-[54px] items-center justify-center rounded-[18px] px-3 py-3.5 "
                onPress={() => {
                  setMode("signIn");
                  setSubmitError(null);
                  setFeedback(null);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === "signIn" }}
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
              {/* Create Account Button */}
              <ScalePressable
                style={{ width: segmentWidth }}
                className="h-[54px] items-center justify-center rounded-[18px] px-3 py-3.5 w-1/2"
                onPress={() => {
                  setMode("signUp");
                  setSubmitError(null);
                  setFeedback(null);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === "signUp" }}
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
            {mode === "signIn" && (
              <Pressable
                className="mt-1 self-end"
                onPress={() => {
                  setShowForgot(true);
                  setForgotEmail("");
                  setForgotFeedback(null);
                  setForgotError(null);
                }}
              >
                <Text className="text-accent font-ui text-sm">
                  Forgot password?
                </Text>
              </Pressable>
            )}
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
      {/* Forgot Password Modal */}
      {showForgot && (
        <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/40">
          <View className="w-[90%] max-w-[350px] rounded-2xl bg-surface p-6 shadow-lg">
            <Text className="font-heading text-lg mb-2 text-text-primary">
              Reset your password
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Enter your email"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              className="rounded-[22px] border border-border bg-elevated px-4 py-4 text-text-primary mb-3"
            />
            <Pressable
              className="rounded-[22px] px-4 py-3 bg-accent mb-2"
              onPress={async () => {
                setForgotFeedback(null);
                setForgotError(null);
                if (!forgotEmail.trim()) {
                  setForgotError("Please enter your email address.");
                  return;
                }
                try {
                  const result: any = await resetPassword(
                    forgotEmail.trim().toLowerCase(),
                  );
                  if (result.error) {
                    throw new Error(result.error.message);
                  }
                  setForgotEmail("");
                  setForgotFeedback(
                    "Password reset email sent. Check your inbox.",
                  );
                } catch (e) {
                  setForgotError(
                    e instanceof Error ? e.message : "Reset failed.",
                  );
                }
              }}
            >
              <Text className="font-ui text-center text-base text-background">
                Send reset email
              </Text>
            </Pressable>
            {forgotFeedback && (
              <Text className="text-health text-sm mb-1">{forgotFeedback}</Text>
            )}
            {forgotError && (
              <Text className="text-danger text-sm mb-1">{forgotError}</Text>
            )}
            <Pressable
              onPress={() => {
                setShowForgot(false);
                setForgotEmail("");
                setForgotFeedback(null);
                setForgotError(null);
              }}
            >
              <Text className="text-accent text-center mt-2">Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </AppScreen>
  );
}
