import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { shadow } from "@/lib/shadow";
import { useAdventure } from "@/store/adventure";
import { Image } from "expo-image";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function MapScreen() {
  const { dailyAdventures, removeAdventure } = useAdventure();
  const textColor = useThemeColor({}, "text");
  const stickerBg = useThemeColor({}, "sticker");
  const surface = useThemeColor({}, "surface");
  const surfaceMuted = useThemeColor({}, "surfaceMuted");
  const accent = useThemeColor({}, "accent");
  const isDark = useColorScheme() === "dark";

  const data = [...dailyAdventures].sort((a, b) => b.timestamp - a.timestamp);

  function isSameDay(a: number, b: number) {
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }

  function fmtDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top"]}>
      <ThemedText type="title">Journey</ThemedText>
      <ThemedText style={styles.muted}>Your adventure timeline!</ThemedText>

      <FlatList
        data={data}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
            <Image
              source={require("@/assets/images/calender.png")}
              style={{
                width: 180,
                height: 180,
                marginBottom: 10,
                opacity: 0.8,
              }}
              contentFit="contain"
              accessible
              accessibilityLabel="Calendar illustration"
            />
            <ThemedText style={styles.muted}>
              No adventures yet. Start your journey!
            </ThemedText>
          </View>
        }
        renderItem={({ item, index }) => {
          const showHeader =
            index === 0 ||
            !isSameDay(item.timestamp, data[index - 1].timestamp);
          const lastInDay =
            index === data.length - 1 ||
            !isSameDay(item.timestamp, data[index + 1].timestamp);
          return (
            <>
              {showHeader && (
                <ThemedText type="subtitle" style={styles.dateHeader}>
                  {fmtDate(item.timestamp)}
                </ThemedText>
              )}
              <View style={styles.timelineRow}>
                <View style={styles.timelineCol}>
                  {!showHeader && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: surfaceMuted },
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.timelineDot,
                      { borderColor: textColor, backgroundColor: accent },
                    ]}
                  />
                  {!lastInDay && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: surfaceMuted },
                      ]}
                    />
                  )}
                </View>
                <Animated.View
                  entering={FadeInDown.springify().damping(14)}
                  style={[
                    styles.card,
                    shadow(2, isDark),
                    { backgroundColor: surface },
                  ]}
                >
                  <View
                    style={[
                      styles.sticker,
                      shadow(1, isDark),
                      { backgroundColor: stickerBg, borderColor: textColor },
                    ]}
                  >
                    <Animated.View entering={ZoomIn.springify().damping(12)}>
                      <Text style={styles.emojiGlyph}>{item.emoji}</Text>
                    </Animated.View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="subtitle">{item.title}</ThemedText>
                    <ThemedText style={styles.muted}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                      {item.place ? `  ·  ${item.place}` : ''}
                    </ThemedText>
                  </View>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Delete log?",
                        "This will remove the adventure.",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => removeAdventure(item.id),
                          },
                        ]
                      )
                    }
                    style={({ pressed }) => [
                      styles.delete,
                      pressed && styles.pressed,
                    ]}
                  >
                    <ThemedText style={styles.deleteText}>Delete</ThemedText>
                  </Pressable>
                </Animated.View>
              </View>
            </>
          );
        }}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  list: { gap: 10 },
  dateHeader: { marginLeft: 38, marginBottom: 6 },
  muted: { opacity: 0.7, fontWeight: "500" },
  timelineRow: { flexDirection: "row", alignItems: "flex-start" },
  timelineCol: { width: 26, alignItems: "center" },
  timelineLine: { width: 2, flex: 1, borderRadius: 1 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginVertical: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    flex: 1,
  },
  sticker: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emojiGlyph: {
    width: 44,
    height: 44,
    lineHeight: 44,
    fontSize: 24,
    textAlign: "center",
    includeFontPadding: false as any,
    textAlignVertical: "center" as any,
  },
  pressed: { opacity: 0.7 },
  delete: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(244,67,54,0.15)",
  },
  deleteText: { color: "#d32f2f", fontWeight: "600" },
});
