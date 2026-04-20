import { PropsWithChildren, useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ScalePressableProps = PropsWithChildren<
  Omit<PressableProps, "style"> & {
    className?: string;
    style?: StyleProp<ViewStyle>;
  }
>;

export function ScalePressable({
  children,
  className,
  onPressIn,
  onPressOut,
  style,
  ...props
}: ScalePressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const animatedStyle = useMemo(
    () => [{ transform: [{ scale }] }, style],
    [scale, style],
  );

  function handlePressIn(event: GestureResponderEvent) {
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 9,
      tension: 180,
      useNativeDriver: true,
    }).start();

    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    Animated.spring(scale, {
      toValue: 1,
      friction: 9,
      tension: 180,
      useNativeDriver: true,
    }).start();

    onPressOut?.(event);
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        className={className}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
