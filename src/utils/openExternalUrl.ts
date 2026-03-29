import { Alert, Linking } from 'react-native';

export async function openExternalUrl(url: string) {
  try {
    const normalizedUrl = url.trim();
    if (!/^https?:\/\//.test(normalizedUrl)) {
      throw new Error('Only secure http and https links are supported.');
    }

    const supported = await Linking.canOpenURL(normalizedUrl);

    if (!supported) {
      throw new Error('This link is not supported on your device.');
    }

    await Linking.openURL(normalizedUrl);
  } catch (error) {
    Alert.alert(
      'Unable to open link',
      error instanceof Error ? error.message : 'We could not open that link right now.',
    );
  }
}
