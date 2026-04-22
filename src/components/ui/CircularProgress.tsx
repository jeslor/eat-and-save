import Svg, { Circle } from 'react-native-svg';
import { Text, View } from 'react-native';

import { useAppSettings } from '@/components/providers/AppSettingsProvider';

type CircularProgressProps = {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  suffix?: string;
};

export function CircularProgress({
  value,
  max,
  size = 132,
  strokeWidth = 12,
  color,
  trackColor,
  label,
  suffix = '',
}: CircularProgressProps) {
  const { colors } = useAppSettings();
  const boundedValue = Math.max(0, Math.min(value, max));
  const progress = max === 0 ? 0 : boundedValue / max;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const displayValue = `${Math.round(boundedValue)}${suffix}`;
  const digitCount = displayValue.length;
  const valueFontSize = Math.max(18, Math.min(size * 0.26 - Math.max(0, digitCount - 3) * 2.5, 40));
  const labelFontSize = Math.max(9, Math.min(size * 0.09, 12));
  const innerContentWidth = Math.max(0, size - strokeWidth * 2 - 8);

  return (
    <View className="items-center justify-center">
      <View style={{ height: size, width: size }} className="items-center justify-center">
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor ?? colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color ?? colors.accent}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={{ width: innerContentWidth }} className="items-center">
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.7}
            style={{ fontSize: valueFontSize, lineHeight: valueFontSize + 2, maxWidth: innerContentWidth }}
            className="font-heading text-center text-text-primary"
          >
            {displayValue}
          </Text>
          {label ? (
            <Text
              style={{ fontSize: labelFontSize, lineHeight: labelFontSize + 2, maxWidth: innerContentWidth }}
              className="font-ui mt-1 text-center uppercase tracking-[1.5px] text-text-secondary"
            >
              {label}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
