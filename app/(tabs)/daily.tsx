import { ConfettiSprinkle } from "@/components/ConfettiSprinkle";
import { EmojiPicker } from "@/components/EmojiPicker";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { shadow } from "@/lib/shadow";
import { useAdventure } from "@/store/adventure";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

// Emoji picker: user can enter any emoji.

function isToday(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DailyScreen() {
  const { dailyAdventures, addAdventure, removeAdventure } = useAdventure();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("😊");
  const [pickerOpen, setPickerOpen] = useState(false);
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "icon");
  const stickerBg = useThemeColor({}, "sticker");
  const surface = useThemeColor({}, "surface");
  const surfaceMuted = useThemeColor({}, "surfaceMuted");
  const accent = useThemeColor({}, "accent");
  const [confettiTick, setConfettiTick] = useState(0);
  const isDark = useColorScheme() === "dark";

  const todays = useMemo(
    () => dailyAdventures.filter((a) => isToday(a.timestamp)),
    [dailyAdventures]
  );

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const { coords, place } = await getLocationSnapshot();
    addAdventure(trimmed, emoji, coords ?? null, place ?? null);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConfettiTick((t) => t + 1);
    setTitle("");
  };

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top"]}>
      <ThemedText type="title">Daily Adventures</ThemedText>
      <ThemedText style={styles.muted}>
        Logged today: {todays.length}
      </ThemedText>

      <View style={styles.row}>
        <TextInput
          placeholder="What did you do?"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => {
            void handleAdd();
          }}
        />
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.addBtn,
            shadow(2, isDark),
            { backgroundColor: accent },
            pressed && styles.pressed,
          ]}
          onPress={() => {
            void handleAdd();
          }}
        >
          <ThemedText style={styles.addText}>Add</ThemedText>
        </Pressable>
      </View>

      <View style={styles.emojiRow}>
        <ThemedText style={styles.muted}>Icon:</ThemedText>
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={({ pressed }) => [
            styles.emojiPickerBtn,
            { backgroundColor: surfaceMuted },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.emojiGlyphLarge}>{emoji}</Text>
        </Pressable>
        <ThemedText style={styles.muted}>(tap to choose)</ThemedText>
      </View>

      <FlatList
        data={todays}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
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
              </ThemedText>
              {item.place || item.coords ? (
                <ThemedText style={styles.placeText}>
                  📍 {item.place ?? ""}
                </ThemedText>
              ) : null}
            </View>
            <Pressable
              onPress={() =>
                Alert.alert("Delete log?", "This will remove the adventure.", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => removeAdventure(item.id),
                  },
                ])
              }
              style={({ pressed }) => [
                styles.delete,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.deleteText}>Delete</ThemedText>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <Image
              source={require("@/assets/images/island.png")}
              style={{ width: 180, height: 180, marginBottom: 8, opacity: 0.7 }}
              contentFit="contain"
              accessible
              accessibilityLabel="Mountain illustration"
            />
            <ThemedText style={styles.muted}>
              Let’s log an adventure!
            </ThemedText>
          </View>
        }
      />
      {/* Confetti sprinkle on add */}
      <Animated.View
        pointerEvents="none"
        style={{ position: "absolute", top: 80, left: 0, right: 0 }}
      >
        <ConfettiSprinkle trigger={confettiTick} />
      </Animated.View>
      <EmojiPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(e) => setEmoji(e)}
      />
    </ThemedSafeAreaView>
  );
}

async function getLocationSnapshot(): Promise<{
  coords: { latitude: number; longitude: number; accuracy?: number } | null;
  place: string | null;
}> {
  try {
    // Dynamically require to avoid build-time dependency if not installed yet
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Location = require("expo-location");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return { coords: null, place: null };
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude, accuracy } = pos.coords ?? {};
    let coords: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    } | null = null;
    let place: string | null = null;
    if (typeof latitude === "number" && typeof longitude === "number") {
      coords = { latitude, longitude, accuracy };
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const best =
          Array.isArray(results) && results.length ? results[0] : undefined;
        const city =
          best?.city || best?.subregion || best?.region || best?.name;
        if (city) place = city as string;
      } catch (e) {
        // ignore reverse geocoding failure
      }
    }
    return { coords, place };
  } catch (e) {
    // Location module not available or user denied – just skip coords
    console.warn("[location] snapshot failed or unavailable", e);
    return { coords: null, place: null };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  muted: { opacity: 0.7, fontWeight: "500" },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(127,127,127,0.12)",
  },
  addBtn: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#0a7ea4",
  },
  addText: { color: "#fff", fontWeight: "600" },
  pressed: { opacity: 0.7 },
  iconRow: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 35,
    borderRadius: 8,
    backgroundColor: "rgba(10,126,164,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSelected: {
    backgroundColor: "#0a7ea4",
  },
  emojiRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  emojiPickerBtn: {
    width: 48,
    height: 44,
    borderRadius: 8,
    backgroundColor: "rgba(10,126,164,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  list: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
  emojiGlyphLarge: {
    width: 48,
    height: 44,
    lineHeight: 44,
    fontSize: 24,
    textAlign: "center",
    includeFontPadding: false as any,
    textAlignVertical: "center" as any,
  },
  delete: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(244,67,54,0.15)",
  },
  deleteText: { color: "#d32f2f", fontWeight: "600" },
  placeText: { opacity: 0.7, fontWeight: "500", marginTop: 2 },
});
