import { type ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedSafeAreaView({
  children,
  style,
  edges = ['top'],
  lightColor,
  darkColor,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
  lightColor?: string;
  darkColor?: string;
}) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

