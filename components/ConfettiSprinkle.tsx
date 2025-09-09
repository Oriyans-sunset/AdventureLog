import React, { useEffect, useMemo } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function ConfettiSprinkle({ trigger, emojis = ['✨','🎉','🌟','🎈','🍀'] }: { trigger: number; emojis?: string[] }) {
  // Wider, slower sprinkle across the top area
  const seeds = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        leftPct: 8 + Math.random() * 84,
        startYOffset: -20 + Math.random() * 40,
        delay: Math.floor(Math.random() * 200),
      })),
    [trigger, emojis]
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {seeds.map((s, idx) => (
        <ConfettiPiece key={`${trigger}-${s.id}`} index={idx} emoji={s.emoji} leftPct={s.leftPct} startYOffset={s.startYOffset} delay={s.delay} />
      ))}
    </View>
  );
}

function ConfettiPiece({ index, emoji, leftPct, startYOffset, delay = 0 }: { index: number; emoji: string; leftPct: number; startYOffset: number; delay?: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(startYOffset);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const fallDistance = 220 + Math.random() * 160;
    const driftX = (Math.random() * 2 - 1) * 60;
    const spin = (Math.random() * 2 - 1) * 60;
    const travelMs = 1400 + Math.random() * 700;
    const fadeDelay = 900 + Math.random() * 600;

    const start = () => {
      opacity.value = withTiming(1, { duration: 220 });
      translateY.value = withTiming(startYOffset + fallDistance, { duration: travelMs, easing: Easing.out(Easing.cubic) });
      translateX.value = withTiming(driftX, { duration: travelMs, easing: Easing.out(Easing.cubic) });
      rotate.value = withTiming(spin, { duration: travelMs });
      const t = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 380 });
      }, fadeDelay);
      return () => clearTimeout(t);
    };

    let cleanup: (() => void) | undefined;
    const d = setTimeout(() => {
      cleanup = start();
    }, delay);
    return () => {
      clearTimeout(d);
      if (cleanup) cleanup();
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.piece, { left: `${leftPct}%` }, style]}>
      <ThemedText>{emoji}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
});
