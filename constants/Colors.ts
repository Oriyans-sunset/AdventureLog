/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Playful, warm palette
const tintColorLight = '#FF8A80'; // coral
const tintColorDark = '#FFD3B6'; // melon for dark accent

export const Colors = {
  light: {
    text: '#3B2F2F',
    background: '#FFF7E9',
    surface: '#FFFFFF',
    surfaceMuted: 'rgba(0,0,0,0.05)',
    sticker: '#FFD3B6',
    accent: '#FFB703',
    mint: '#B4F8C8',
    sky: '#7FDBFF',
    lilac: '#C8B6FF',
    tint: tintColorLight,
    icon: '#7A6E6E',
    tabIconDefault: '#7A6E6E',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FDFCF8',
    background: '#1E1A1A',
    surface: '#2A2424',
    surfaceMuted: 'rgba(255,255,255,0.06)',
    sticker: '#5B3F3E',
    accent: '#FFB703',
    mint: '#5AC8A1',
    sky: '#5BC8F7',
    lilac: '#9F93FF',
    tint: tintColorDark,
    icon: '#C8C1C1',
    tabIconDefault: '#C8C1C1',
    tabIconSelected: tintColorDark,
  },
} as const;
