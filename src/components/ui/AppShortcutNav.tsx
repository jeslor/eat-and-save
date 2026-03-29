import { useWindowDimensions, View } from 'react-native';

import { InternalLinkButton } from '@/components/ui/InternalLinkButton';

const shortcuts = [
  {
    href: '/',
    title: 'Home',
    subtitle: 'Back to the main dashboard.',
    icon: 'home-outline',
  },
  {
    href: '/meals',
    title: 'Discover',
    subtitle: 'Browse deals and meal options.',
    icon: 'compass-outline',
  },
  {
    href: '/tracker',
    title: 'Tracker',
    subtitle: 'See nutrition and savings progress.',
    icon: 'chart-donut',
  },
  {
    href: '/profile',
    title: 'Profile',
    subtitle: 'Manage account and preferences.',
    icon: 'account-circle-outline',
  },
] as const;

export function AppShortcutNav() {
  const { width } = useWindowDimensions();
  const compact = width < 420;

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {shortcuts.map((shortcut) => (
        <View
          key={shortcut.title}
          style={{ width: compact ? '48.5%' : '24%' }}
        >
          <InternalLinkButton
            href={shortcut.href}
            title={shortcut.title}
            subtitle={shortcut.subtitle}
            icon={shortcut.icon}
            fullWidth
          />
        </View>
      ))}
    </View>
  );
}
