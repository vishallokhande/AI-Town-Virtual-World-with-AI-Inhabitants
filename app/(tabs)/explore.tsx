import { useState } from 'react'
import { View, Pressable, StyleSheet, Dimensions, ScrollView, TextInput } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE, SURFACE2 } from '@/lib/theme'
import { characters, Character, moodColor, CharacterMood } from '@/lib/mockData'
import { TAB_BAR_HEIGHT } from '@/components/TabBar'

const { width: SW } = Dimensions.get('window')

const MOOD_LABELS: Record<CharacterMood, string> = {
    happy: 'Happy', curious: 'Curious', anxious: 'Anxious',
    excited: 'Excited', melancholy: 'Melancholy', focused: 'Focused', playful: 'Playful',
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <View style={sb.row}>
            <Text style={sb.label}>{label}</Text>
            <View style={sb.track}>
                <View style={[sb.fill, { width: `${value}%`, backgroundColor: color }]} />
            </View>
            <Text style={sb.val}>{value}</Text>
        </View>
    )
}

const sb = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    label: { color: 'rgba(255,255,255,0.38)', fontSize: 10.5, width: 68, fontWeight: '600' },
    track: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99 },
    fill: { height: 5, borderRadius: 99 },
    val: { color: 'rgba(255,255,255,0.4)', fontSize: 10, width: 24, textAlign: 'right' },
})

function CharCard({ char }: { char: Character }) {
    const moodCol = moodColor(char.mood)
    return (
        <Pressable
            onPress={() => router.push(`/character/${char.id}` as any)}
            style={({ pressed }) => [s.card, { borderColor: `${char.accentColor}30` }, pressed && { opacity: 0.82, transform: [{ scale: 0.99 }] }]}
        >
            {/* Card header */}
            <View style={s.cardHeader}>
                <View style={[s.avatar, { backgroundColor: `${char.accentColor}20` }]}>
                    <Text style={s.avatarEmoji}>{char.emoji}</Text>
                    <View style={[s.moodDot, { backgroundColor: moodCol }]} />
                </View>
                <View style={s.cardMeta}>
                    <View style={s.nameRow}>
                        <Text style={s.name}>{char.name}</Text>
                        <View style={[s.moodPill, { backgroundColor: `${moodCol}20`, borderColor: `${moodCol}40` }]}>
                            <Text style={[s.moodText, { color: moodCol }]}>{char.moodEmoji} {MOOD_LABELS[char.mood]}</Text>
                        </View>
                    </View>
                    <Text style={s.occupation}>{char.occupation} · Age {char.age}</Text>
                    <Text style={[s.personality, { color: char.accentColor }]}>{char.personality}</Text>
                </View>
            </View>

            {/* Trait badges */}
            <View style={s.traitsRow}>
                {char.traits.map((t) => (
                    <View key={t} style={s.traitBadge}>
                        <Text style={s.traitText}>{t}</Text>
                    </View>
                ))}
            </View>

            {/* Stats */}
            <StatBar label="Energy" value={char.energy} color={char.accentColor} />
            <StatBar label="Happiness" value={char.happiness} color="#4ade80" />
            <StatBar label="Sociability" value={char.sociability} color="#60a5fa" />

            {/* Current activity */}
            <View style={s.activityRow}>
                <View style={[s.activityDot, { backgroundColor: char.accentColor }]} />
                <Text style={s.activityText} numberOfLines={1}>{char.currentActivity}</Text>
            </View>

            {/* Latest memory */}
            {char.memories[0] && (
                <View style={s.memoryBox}>
                    <Text style={s.memoryLabel}>💭 Latest memory</Text>
                    <Text style={s.memoryText} numberOfLines={2}>{char.memories[0].text}</Text>
                    <Text style={s.memoryTime}>{char.memories[0].timeAgo}</Text>
                </View>
            )}

            {/* Chat CTA */}
            <Pressable
                onPress={() => router.push(`/character/${char.id}` as any)}
                style={[s.chatBtn, { borderColor: `${char.accentColor}40` }]}
            >
                <LinearGradient colors={[`${char.accentColor}22`, `${char.accentColor}10`]} style={s.chatBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={[s.chatBtnText, { color: char.accentColor }]}>💬 Chat with {char.name}</Text>
                </LinearGradient>
            </Pressable>
        </Pressable>
    )
}

export default function CitizensScreen() {
    const insets = useSafeAreaInsets()
    const [search, setSearch] = useState('')
    const [filterMood, setFilterMood] = useState<CharacterMood | null>(null)

    const filtered = characters.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.occupation.toLowerCase().includes(search.toLowerCase())
        const matchMood = filterMood ? c.mood === filterMood : true
        return matchSearch && matchMood
    })

    const moods: CharacterMood[] = ['happy', 'curious', 'excited', 'focused', 'playful', 'anxious', 'melancholy']

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: TAB_BAR_HEIGHT + 24, paddingHorizontal: 20, gap: 14 }}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(380)}>
                    <Text style={s.heading}>👥 Citizens</Text>
                    <Text style={s.subheading}>{characters.length} residents · {characters.filter(c => c.happiness > 75).length} thriving</Text>
                </Animated.View>

                {/* Search bar */}
                <Animated.View entering={FadeInDown.delay(60).duration(380)} style={s.searchWrap}>
                    <TextInput
                        placeholder="Search by name or occupation…"
                        placeholderTextColor="rgba(255,255,255,0.28)"
                        value={search}
                        onChangeText={setSearch}
                        style={s.searchInput}
                    />
                </Animated.View>

                {/* Mood filter chips */}
                <Animated.View entering={FadeInDown.delay(100).duration(380)}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        <Pressable
                            onPress={() => setFilterMood(null)}
                            style={[s.chip, !filterMood && s.chipActive]}
                        >
                            <Text style={[s.chipText, !filterMood && s.chipTextActive]}>All</Text>
                        </Pressable>
                        {moods.map((m) => {
                            const col = moodColor(m)
                            const isActive = filterMood === m
                            return (
                                <Pressable
                                    key={m}
                                    onPress={() => setFilterMood(isActive ? null : m)}
                                    style={[s.chip, isActive && { backgroundColor: `${col}20`, borderColor: `${col}50` }]}
                                >
                                    <Text style={[s.chipText, isActive && { color: col }]}>{MOOD_LABELS[m]}</Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </Animated.View>

                {/* Character cards */}
                {filtered.map((c, i) => (
                    <Animated.View key={c.id} entering={FadeInDown.delay(120 + i * 50).duration(380)}>
                        <CharCard char={c} />
                    </Animated.View>
                ))}

                {filtered.length === 0 && (
                    <View style={s.empty}>
                        <Text style={s.emptyEmoji}>🔍</Text>
                        <Text style={s.emptyText}>No residents match your search</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const s = StyleSheet.create({
    heading: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
    subheading: { color: 'rgba(255,255,255,0.42)', fontSize: 13.5, marginTop: 2 },

    searchWrap: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
    searchInput: { color: '#fff', fontSize: 14, fontWeight: '500' },

    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER },
    chipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BORDER },
    chipText: { color: 'rgba(255,255,255,0.5)', fontSize: 12.5, fontWeight: '600' },
    chipTextActive: { color: ACCENT },

    card: { backgroundColor: SURFACE, borderRadius: 20, borderWidth: 1, padding: 16, gap: 8 },
    cardHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
    avatar: { width: 56, height: 56, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    avatarEmoji: { fontSize: 26 },
    moodDot: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 99, borderWidth: 2, borderColor: SURFACE },
    cardMeta: { flex: 1, gap: 3 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    name: { color: '#fff', fontSize: 17, fontWeight: '800' },
    moodPill: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
    moodText: { fontSize: 10.5, fontWeight: '700' },
    occupation: { color: 'rgba(255,255,255,0.45)', fontSize: 12 },
    personality: { fontSize: 12, fontWeight: '700' },
    traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    traitBadge: { backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    traitText: { color: 'rgba(255,255,255,0.55)', fontSize: 10.5, fontWeight: '600' },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    activityDot: { width: 7, height: 7, borderRadius: 99 },
    activityText: { color: 'rgba(255,255,255,0.42)', fontSize: 12, flex: 1 },
    memoryBox: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, gap: 4 },
    memoryLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10.5, fontWeight: '700' },
    memoryText: { color: 'rgba(255,255,255,0.6)', fontSize: 12.5, lineHeight: 18, fontStyle: 'italic' },
    memoryTime: { color: 'rgba(255,255,255,0.25)', fontSize: 10.5 },
    chatBtn: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginTop: 4 },
    chatBtnGrad: { paddingVertical: 11, alignItems: 'center' },
    chatBtnText: { fontSize: 13.5, fontWeight: '700' },
    empty: { alignItems: 'center', paddingTop: 48, gap: 10 },
    emptyEmoji: { fontSize: 38 },
    emptyText: { color: 'rgba(255,255,255,0.35)', fontSize: 15 },
})

