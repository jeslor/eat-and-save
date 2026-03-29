import { Pressable, Text } from 'react-native';

import type { MealAction } from '@/types/recommendation';
import { openExternalUrl } from '@/utils/openExternalUrl';

type ExternalActionButtonProps = {
  action: MealAction;
};

export function ExternalActionButton({ action }: ExternalActionButtonProps) {
  const className =
    action.kind === 'order'
      ? 'bg-surface border-border'
      : 'bg-surface border-health/40';

  const textClassName = action.kind === 'order' ? 'text-text-primary' : 'text-health';

  return (
    <Pressable
      accessibilityRole="link"
      className={`rounded-[20px] border px-4 py-3 ${className}`}
      onPress={() => {
        void openExternalUrl(action.url);
      }}
    >
      <Text className={`font-ui text-sm ${textClassName}`}>{action.label}</Text>
      <Text className="font-copy mt-1 text-xs text-text-secondary">{action.provider}</Text>
    </Pressable>
  );
}
