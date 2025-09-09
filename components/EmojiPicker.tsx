import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { shadow } from "@/lib/shadow";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const EMOJI_LIST = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "🥱",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙃",
  "🫠",
  "🤑",
  "🤠",
  "😈",
  "👿",
  "🤡",
  "💩",
  "👻",
  "💀",
  "☠️",
  "👽",
  "👾",
  "🤖",
  "🎃",
  "👋",
  "🤚",
  "🖐️",
  "✋",
  "🖖",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "👍",
  "👎",
  "✊",
  "👊",
  "👏",
  "🫶",
  "🙌",
  "👐",
  "🤲",
  "🙏",
  "💪",
  "🦵",
  "🦶",
  "👣",
  "👀",
  "👁️",
  "🧠",
  "🫀",
  "🫁",
  "👅",
  "👄",
  "💋",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
  "❣️",
  "💔",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💯",
  "✨",
  "🔥",
  "🌟",
  "⭐",
  "🌈",
  "☀️",
  "🌤️",
  "⛅",
  "🌥️",
  "☁️",
  "🌦️",
  "🌧️",
  "⛈️",
  "🌩️",
  "❄️",
  "🌨️",
  "🌪️",
  "🌫️",
  "🌬️",
  "🌊",
  "💧",
  "☔",
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🥕",
  "🌽",
  "🥔",
  "🥦",
  "🧄",
  "🧅",
  "🍄",
  "🥬",
  "🥒",
  "🌶️",
  "🫑",
  "🧀",
  "🍞",
  "🥐",
  "🥖",
  "🥯",
  "🥞",
  "🧇",
  "🧈",
  "🍗",
  "🍖",
  "🍔",
  "🍟",
  "🍕",
  "🌭",
  "🥪",
  "🌮",
  "🌯",
  "🥙",
  "🧆",
  "🥚",
  "🍳",
  "🥘",
  "🍲",
  "🥣",
  "🥗",
  "🍿",
  "🧂",
  "🍰",
  "🎂",
  "🧁",
  "🍦",
  "🍩",
  "🍪",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍯",
  "☕",
  "🍵",
  "🧋",
  "🧃",
  "🥤",
  "🍺",
  "🍻",
  "🍷",
  "🍸",
  "🍹",
  "🍾",
  "🥂",
  "🚶",
  "🏃",
  "🚴",
  "🚵",
  "🏊",
  "🧗",
  "🏄",
  "🧘",
  "🏕️",
  "🏞️",
  "🌃",
  "🏙️",
  "🗺️",
  "🧭",
  "📷",
  "🎥",
  "🎶",
  "🎧",
  "🎸",
  "🎹",
  "🥁",
  "🎮",
  "🕹️",
  "📚",
  "✈️",
  "🚗",
  "🚌",
  "🚆",
  "🚄",
  "🚇",
  "⛵",
  "🚤",
  "🛶",
  "🏔️",
  "⛰️",
  "🌋",
  "🏖️",
  "🏜️",
];

export function EmojiPicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}) {
  const [query, setQuery] = useState("");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "icon");
  const surfaceMuted = useThemeColor({}, "surfaceMuted");
  const isDark = useColorScheme() === 'dark';
  const data = useMemo(() => {
    if (!query.trim()) return EMOJI_LIST;
    // naive filter: include emojis that match any char in query
    const q = query.trim();
    return EMOJI_LIST.filter((e) => e.includes(q));
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <ThemedSafeAreaView style={[styles.sheet, shadow(3, isDark)]} edges={["bottom"]}>
          <View style={styles.header}>
            <ThemedText type="title">Pick Emoji</ThemedText>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText style={styles.closeText}>Cancel</ThemedText>
            </Pressable>
          </View>
          <TextInput
            placeholder="Search"
            style={[
              styles.search,
              { color: textColor, backgroundColor: surfaceMuted },
            ]}
            placeholderTextColor={placeholderColor}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <FlatList
            data={data}
            keyExtractor={(item, idx) => item + idx}
            numColumns={8}
            style={{ flex: 1 }}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.cell,
                  pressed && styles.cellPressed,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <ThemedText style={styles.emoji}>{item}</ThemedText>
              </Pressable>
            )}
          />
        </ThemedSafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    height: "70%",
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(127,127,127,0.12)",
  },
  closeText: { fontWeight: "600" },
  search: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(127,127,127,0.12)",
  },
  grid: { paddingHorizontal: 8, paddingBottom: 16, paddingTop: 8 },
  cell: {
    width: "12.5%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  cellPressed: { backgroundColor: "rgba(127,127,127,0.12)" },
  emoji: { fontSize: 24, lineHeight: 28, textAlign: "center" },
});
