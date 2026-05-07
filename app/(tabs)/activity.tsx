import { useState } from 'react'
import { View, Pressable, StyleSheet, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE, SURFACE2 } from '@/lib/theme'
import { townEvents, characters, TownEvent, EventKind, getCharacterById } from '@/lib/mockData'
import { TAB_BAR_HEIGHT } from '@/components/TabBar'

const KIND_META: Record<EventKind, { label: string; color: string; bg: string }> = {
    interaction: { label: 'Interaction', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    milestone:   { label: 'Milestone',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
    story:       { label: 'Story',       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    memory:      { label: 'Memory',      color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    conflict:    { label: 'Conflict',    color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    celebration: { label: 'Celebration', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
}

const FILTER_OPTIONS: { key: EventKind | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'interaction', label: '💬 Chat' },
    { key: 'story', label: '📖 Story' },
    { key: 'milestone', label: '⚡ Milestone' },
    { key: 'celebration', label: '🎉 Celebrate' },
    { key: 'conflict', label: '⚔️ Conflict' },
    { key: 'memory', label: '💭 Memory' },
]

function EventCard({ event, index }: { event: TownEvent; index: number }) {
    const meta = KIND_META[event.kind]
    const chars = event.characterIds.map((id) => getCharacterById(id)).filter(Boolean)

    return (
        <Animated.View entering={FadeInDown.delay(index * 55).duration(360)} style={[s.card, event.isNew && s.cardNew]}>
            {/* Kind badge + time */}
            <View style={s.cardTop}>
                <View style={[s.kindBadge, { backgroundColor: meta.bg, borderColor: `${meta.color}40` }]}>
                    <Text style={[s.kindText, { color: meta.color }]}>{event.emoji} {meta.label}</Text>
                </View>
                <View style={s.timeRow}>
                    {event.isNew && <View style={s.newDot} />}
                    <Text style={s.timeText}>{event.timeAgo}</Text>
                </View>
            </View>

            {/* Title + detail */}
            <Text style={s.title}>{event.title}</Text>
            <Text style={s.detail}>{event.detail}</Text>

            {/* Character avatars */}
            {chars.length > 0 && (
                <View style={s.charsRow}>
                    <Text style={s.charsLabel}>Characters involved:</Text>
                    <View style={s.avatarGroup}>
                        {chars.slice(0, 5).map((c, i) => c && (
                            <Pressable
                                key={c.id}
                                onPress={() => router.push(`/character/${c.id}` as any)}
                                style={[s.avatar, { backgroundColor: `${c.accentColor}25`, borderColor: c.accentColor, marginLeft: i > 0 ? -10 : 0 }]}
                            >
                                <Text style={s.avatarEmoji}>{c.emoji}</Text>
                            </Pressable>
                        ))}
                        {chars.length > 5 && (
                            <View style={[s.avatar, s.avatarMore, { marginLeft: -10 }]}>
                                <Text style={s.avatarMoreText}>+{chars.length - 5}</Text>
                            </View>
                        )}
                        <View style={s.charNames}>
                            {chars.slice(0, 3).map((c, i) => c && (
                                <Text key={c.id} style={[s.charNameText, { color: c.accentColor }]}>
                                    {c.name}{i < Math.min(chars.length, 3) - 1 ? ', ' : chars.length > 3 ? '…' : ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Read more / chat */}
            {chars.length > 0 && (
                <Pressable
                    onPress={() => router.push(`/character/${event.characterIds[0]}` as any)}
                    style={s.ctaRow}
                >
                    <Text style={s.ctaText}>💬 Talk to {getCharacterById(event.characterIds[0])?.name ?? 'character'} about this →</Text>
                </Pressable>
            )}
        </Animated.View>
    )
}

export default function EventsScreen() {
    const insets = useSafeAreaInsets()
    const [filter, setFilter] = useState<EventKind | 'all'>('all')

    const filtered = filter === 'all' ? townEvents : townEvents.filter((e) => e.kind === filter)
    const newCount = townEvents.filter((e) => e.isNew).length

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: TAB_BAR_HEIGHT + 24 }}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(340)} style={s.header}>
                    <View>
                        <Text style={s.heading}>📰 Town Events</Text>
                        <Text style={s.subheading}>Living stories from Willowvale</Text>
                    </View>
                    {newCount > 0 && (
                        <View style={s.newBadge}>
                            <Text style={s.newBadgeText}>{newCount} new</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Filter chips */}
                <Animated.View entering={FadeInDown.delay(60).duration(340)} style={{ paddingLeft: 20, marginBottom: 20 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
                        {FILTER_OPTIONS.map((opt) => {
                            const isActive = filter === opt.key
                            const meta = opt.key !== 'all' ? KIND_META[opt.key] : null
                            return (
                                <Pressable
                                    key={opt.key}
                                    onPress={() => setFilter(opt.key)}
                                    style={[
                                        s.chip,
                                        isActive && meta && { backgroundColor: meta.bg, borderColor: `${meta.color}50` },
                                        isActive && !meta && { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BORDER },
                                    ]}
                                >
                                    <Text style={[
                                        s.chipText,
                                        isActive && meta && { color: meta.color },
                                        isActive && !meta && { color: ACCENT },
                                    ]}>
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </Animated.View>

                {/* Event cards */}
                <View style={s.cards}>
                    {filtered.map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                    ))}
                </View>

                {filtered.length === 0 && (
                    <Animated.View entering={FadeIn.duration(300)} style={s.empty}>
                        <Text style={s.emptyEmoji}>🌙</Text>
                        <Text style={s.emptyText}>No events of this type yet</Text>
                        <Text style={s.emptyHint}>Check back as your characters interact</Text>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    )
}

const s = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
    heading: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
    subheading: { color: 'rgba(255,255,255,0.42)', fontSize: 13.5, marginTop: 2 },
    newBadge: { backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BORDER, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
    newBadgeText: { color: ACCENT, fontSize: 12, fontWeight: '700' },

    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER },
    chipText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },

    cards: { paddingHorizontal: 20, gap: 14 },

    card: { backgroundColor: SURFACE, borderRadius: 20, borderWidth: 1, borderColor: BORDER, padding: 16, gap: 10 },
    cardNew: { borderColor: 'rgba(245,158,11,0.25)', backgroundColor: 'rgba(245,158,11,0.04)' },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    kindBadge: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    kindText: { fontSize: 11, fontWeight: '700' },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    newDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: ACCENT },
    timeText: { color: 'rgba(255,255,255,0.35)', fontSize: 11.5 },

    title: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.3, lineHeight: 22 },
    detail: { color: 'rgba(255,255,255,0.58)', fontSize: 13, lineHeight: 20 },

    charsRow: { gap: 8 },
    charsLabel: { color: 'rgba(255,255,255,0.32)', fontSize: 10.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
    avatarGroup: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 0 },
    avatar: { width: 32, height: 32, borderRadius: 99, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
    avatarEmoji: { fontSize: 14 },
    avatarMore: { backgroundColor: SURFACE2, borderColor: BORDER },
    avatarMoreText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700' },
    charNames: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10, flex: 1 },
    charNameText: { fontSize: 12, fontWeight: '700' },

    ctaRow: { backgroundColor: SURFACE2, borderRadius: 10, padding: 10, marginTop: 2 },
    ctaText: { color: ACCENT, fontSize: 12.5, fontWeight: '600' },

    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyEmoji: { fontSize: 44 },
    emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '700' },
    emptyHint: { color: 'rgba(255,255,255,0.28)', fontSize: 13 },
})

