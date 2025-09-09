import { AnimatedNumber } from "@/components/AnimatedNumber";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { shadow } from "@/lib/shadow";
import { useAdventure } from "@/store/adventure";
import { Image } from "expo-image";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun - 6 Sat
  const diffToMonday = (day + 6) % 7; // Mon=0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diffToMonday);
  return d.getTime();
}

export default function StatsScreen() {
  const { dailyAdventures } = useAdventure();
  const weekStart = startOfWeek();
  const surface = useThemeColor({}, "surface");
  const isDark = useColorScheme() === "dark";

  const { countThisWeek, topEmoji, topCount } = useMemo(() => {
    const inWeek = dailyAdventures.filter((a) => a.timestamp >= weekStart);
    const count = inWeek.length;
    const freq = new Map<string, number>();
    for (const a of inWeek) freq.set(a.emoji, (freq.get(a.emoji) ?? 0) + 1);
    let emoji: string | null = null;
    let max = 0;
    for (const [k, v] of freq) {
      if (v > max) {
        emoji = k;
        max = v;
      }
    }
    return { countThisWeek: count, topEmoji: emoji, topCount: max };
  }, [dailyAdventures, weekStart]);

  // playful top emoji bounce when it changes
  const bounce = useSharedValue(0);
  const topEmojiAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bounce.value }],
  }));

  // Minimal effect trigger: re-run when topEmoji changes and exists
  useEffect(() => {
    if (topEmoji) {
      bounce.value = withSequence(
        withTiming(8, { duration: 120 }),
        withTiming(0, { duration: 160 })
      );
    }
  }, [topEmoji]);

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top"]}>
      <ThemedText type="title">Stats</ThemedText>
      <View
        style={[styles.card, shadow(2, isDark), { backgroundColor: surface }]}
      >
        <ThemedText type="subtitle">This Week</ThemedText>
        <Image
          source={require("@/assets/images/medal.png")}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            width: 56,
            height: 56,
          }}
          contentFit="contain"
          accessible
          accessibilityLabel="Medal illustration"
          pointerEvents="none"
        />
        <AnimatedNumber value={countThisWeek} style={styles.large} />
        <ThemedText style={styles.muted}> adventures</ThemedText>
      </View>
      <View
        style={[styles.card, shadow(2, isDark), { backgroundColor: surface }]}
      >
        <ThemedText type="subtitle">Most frequent</ThemedText>
        {topEmoji ? (
          <View style={styles.rowCenter}>
            <Animated.View style={topEmojiAnimStyle}>
              <ThemedText style={styles.emojiLarge}>{topEmoji}</ThemedText>
            </Animated.View>
            <ThemedText style={styles.topText}>× </ThemedText>
            <AnimatedNumber value={topCount} style={styles.topText} />
          </View>
        ) : (
          <ThemedText style={styles.muted}>
            No adventures logged this week
          </ThemedText>
        )}
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(127,127,127,0.12)",
    gap: 8,
    position: "relative",
  },
  muted: { opacity: 0.7, fontWeight: "500" },
  large: { fontSize: 40, lineHeight: 48, fontWeight: "700" },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  topText: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  emojiLarge: { fontSize: 28, paddingTop: 8 },
});
