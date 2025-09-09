import { Platform } from 'react-native';

type ShadowStyle = {
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  elevation?: number;
};

export function shadow(level: 0 | 1 | 2 | 3, dark: boolean): ShadowStyle {
  if (level === 0) return {};
  // Base opacities and radii tuned for playful, soft look
  const ios = [
    {},
    { opacity: dark ? 0.08 : 0.1, radius: 6, offsetH: 0, offsetV: 2 },
    { opacity: dark ? 0.1 : 0.12, radius: 10, offsetH: 0, offsetV: 4 },
    { opacity: dark ? 0.12 : 0.16, radius: 16, offsetH: 0, offsetV: 8 },
  ][level] as { opacity: number; radius: number; offsetH: number; offsetV: number };

  const androidElevation = [0, 2, 4, 8][level];

  if (Platform.OS === 'android') {
    return { elevation: androidElevation, shadowColor: '#000' };
  }

  return {
    shadowColor: '#000',
    shadowOpacity: ios.opacity,
    shadowRadius: ios.radius,
    shadowOffset: { width: ios.offsetH, height: ios.offsetV },
  };
}

