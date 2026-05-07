import { useState } from 'react'
import { View, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE, SURFACE2, SURFACE3 } from '@/lib/theme'
import {
    characters, relationships, townStats,
    getRelatedCharacter, getCharacterById,
    relationshipColor, relationshipLabel,
    Relationship,
} from '@/lib/mockData'
import { TAB_BAR_HEIGHT } from '@/components/TabBar'
import { adjustBrightness } from '@/lib/utils'

const { width: SW } = Dimensions.get('window')

// ─── Relationship Graph (force-layout inspired, static positions) ──────────────
const NODE_RADIUS = 22
const GRAPH_W = SW - 40
const GRAPH_H = 320

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
    'char-1': { x: GRAPH_W * 0.50, y: GRAPH_H * 0.15 },
    'char-2': { x: GRAPH_W * 0.20, y: GRAPH_H * 0.32 },
    'char-3': { x: GRAPH_W * 0.78, y: GRAPH_H * 0.28 },
    'char-4': { x: GRAPH_W * 0.10, y: GRAPH_H * 0.65 },
    'char-5': { x: GRAPH_W * 0.45, y: GRAPH_H * 0.50 },
    'char-6': { x: GRAPH_W * 0.28, y: GRAPH_H * 0.78 },
    'char-7': { x: GRAPH_W * 0.72, y: GRAPH_H * 0.70 },
    'char-8': { x: GRAPH_W * 0.60, y: GRAPH_H * 0.88 },
}

function RelationshipGraph({ selectedChar, onSelectChar }: { selectedChar: string | null; onSelectChar: (id: string) => void }) {
    const activeRels = selectedChar
        ? relationships.filter((r) => r.characterAId === selectedChar || r.characterBId === selectedChar)
        : relationships

    return (
        <View style={g.container}>
            {/* SVG-style lines as absolute views */}
            {activeRels.map((rel) => {
                const aPos = NODE_POSITIONS[rel.characterAId]
                const bPos = NODE_POSITIONS[rel.characterBId]
                if (!aPos || !bPos) return null
                const color = relationshipColor(rel.type)
                const dx = bPos.x - aPos.x
                const dy = bPos.y - aPos.y
                const length = Math.sqrt(dx * dx + dy * dy)
                const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                const opacity = selectedChar ? 0.9 : 0.35 + (rel.strength / 100) * 0.55
                return (
                    <View
                        key={rel.id}
                        pointerEvents="none"
                        style={[
                            g.line,
                            {
                                left: aPos.x,
                                top: aPos.y,
                                width: length,
                                borderColor: color,
                                opacity,
                                transform: [{ rotateZ: `${angle}deg` }],
                            },
                        ]}
                    />
                )
            })}

            {/* Character nodes */}
            {characters.map((char) => {
                const pos = NODE_POSITIONS[char.id]
                if (!pos) return null
                const isSelected = selectedChar === char.id
                const isConnected = selectedChar
                    ? activeRels.some((r) => r.characterAId === char.id || r.characterBId === char.id)
                    : true
                const opacity = selectedChar && !isConnected && !isSelected ? 0.22 : 1
                return (
                    <Pressable
                        key={char.id}
                        onPress={() => onSelectChar(isSelected ? '' : char.id)}
                        style={[
                            g.node,
                            {
                                left: pos.x - NODE_RADIUS,
                                top: pos.y - NODE_RADIUS,
                                backgroundColor: `${char.accentColor}28`,
                                borderColor: isSelected ? char.accentColor : `${char.accentColor}60`,
                                borderWidth: isSelected ? 2.5 : 1.5,
                                opacity,
                            },
                        ]}
                    >
                        <Text style={g.nodeEmoji}>{char.emoji}</Text>
                        {isSelected && <View style={[g.selectedRing, { borderColor: char.accentColor }]} />}
                    </Pressable>
                )
            })}

            {/* Name labels */}
            {characters.map((char) => {
                const pos = NODE_POSITIONS[char.id]
                if (!pos) return null
                const isActive = !selectedChar || selectedChar === char.id ||
                    activeRels.some((r) => r.characterAId === char.id || r.characterBId === char.id)
                return (
                    <View
                        key={`lbl-${char.id}`}
                        pointerEvents="none"
                        style={[g.label, { left: pos.x - 28, top: pos.y + NODE_RADIUS + 3, opacity: isActive ? 1 : 0.2 }]}
                    >
                        <Text style={[g.labelText, selectedChar === char.id && { color: char.accentColor }]}>{char.name}</Text>
                    </View>
                )
            })}
        </View>
    )
}

const g = StyleSheet.create({
    container: { width: GRAPH_W, height: GRAPH_H, position: 'relative' },
    line: { position: 'absolute', height: 1.5, borderTopWidth: 1.5, transformOrigin: '0% 50%' },
    node: { position: 'absolute', width: NODE_RADIUS * 2, height: NODE_RADIUS * 2, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    nodeEmoji: { fontSize: 18 },
    selectedRing: { position: 'absolute', width: NODE_RADIUS * 2 + 8, height: NODE_RADIUS * 2 + 8, borderRadius: 99, borderWidth: 2, opacity: 0.5 },
    label: { position: 'absolute', width: 56, alignItems: 'center' },
    labelText: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '700', textAlign: 'center' },
})

// ─── Profile screen ───────────────────────────────────────────────────────────

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const [selectedChar, setSelectedChar] = useState<string | null>(null)

    const selectedCharData = selectedChar ? getCharacterById(selectedChar) : null
    const selectedRels = selectedChar
        ? relationships.filter((r) => r.characterAId === selectedChar || r.characterBId === selectedChar)
        : []

    const topRelationships = relationships.sort((a, b) => b.strength - a.strength).slice(0, 5)

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: TAB_BAR_HEIGHT + 24, paddingHorizontal: 20, gap: 18 }}
            >
                {/* Town identity header */}
                <Animated.View entering={FadeInDown.duration(340)} style={s.townHeader}>
                    <LinearGradient colors={[adjustBrightness(ACCENT, 10), ACCENT, adjustBrightness(ACCENT, -22)]} style={s.townIconGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={s.townIconEmoji}>🏙️</Text>
                    </LinearGradient>
                    <View style={s.townMeta}>
                        <Text style={s.townName}>{townStats.townName}</Text>
                        <Text style={s.townSub}>Day {townStats.daysPassed} · Founded by you</Text>
                        <View style={s.townBadge}>
                            <Text style={s.townBadgeText}>🏆 Mayor</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Town stats grid */}
                <Animated.View entering={FadeInDown.delay(60).duration(340)} style={s.statsGrid}>
                    {[
                        { emoji: '👥', label: 'Citizens', value: String(townStats.totalCharacters) },
                        { emoji: '🏘️', label: 'Buildings', value: String(townStats.totalBuildings) },
                        { emoji: '😊', label: 'Happiness', value: `${townStats.happinessAvg}%` },
                        { emoji: '⚡', label: 'Events', value: String(townStats.eventsToday) },
                    ].map((stat) => (
                        <View key={stat.label} style={s.statCard}>
                            <Text style={s.statEmoji}>{stat.emoji}</Text>
                            <Text style={s.statVal}>{stat.value}</Text>
                            <Text style={s.statLbl}>{stat.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Relationship Graph */}
                <Animated.View entering={FadeInDown.delay(100).duration(360)} style={s.graphSection}>
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>🕸️ Relationship Web</Text>
                        {selectedCharData && (
                            <Pressable onPress={() => setSelectedChar(null)} style={s.clearBtn}>
                                <Text style={s.clearBtnText}>Clear</Text>
                            </Pressable>
                        )}
                    </View>
                    <Text style={s.sectionSub}>Tap a resident to highlight their connections</Text>
                    <View style={s.graphWrap}>
                        <RelationshipGraph selectedChar={selectedChar} onSelectChar={setSelectedChar} />
                    </View>
                </Animated.View>

                {/* Selected character relationships */}
                {selectedCharData && selectedRels.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(280)} style={s.relSection}>
                        <View style={s.relHeader}>
                            <View style={[s.relCharAvatar, { backgroundColor: `${selectedCharData.accentColor}20` }]}>
                                <Text style={s.relCharEmoji}>{selectedCharData.emoji}</Text>
                            </View>
                            <View>
                                <Text style={s.relCharName}>{selectedCharData.name}'s connections</Text>
                                <Text style={s.relCharOcc}>{selectedRels.length} relationship{selectedRels.length !== 1 ? 's' : ''}</Text>
                            </View>
                        </View>
                        {selectedRels.map((rel) => {
                            const other = getRelatedCharacter(rel, selectedChar!)
                            const relColor = relationshipColor(rel.type)
                            if (!other) return null
                            return (
                                <Pressable
                                    key={rel.id}
                                    onPress={() => router.push(`/character/${other.id}` as any)}
                                    style={s.relRow}
                                >
                                    <View style={[s.relOtherAvatar, { backgroundColor: `${other.accentColor}20` }]}>
                                        <Text style={{ fontSize: 16 }}>{other.emoji}</Text>
                                    </View>
                                    <View style={s.relContent}>
                                        <View style={s.relTopRow}>
                                            <Text style={s.relOtherName}>{other.name}</Text>
                                            <View style={[s.relTypeBadge, { backgroundColor: `${relColor}18`, borderColor: `${relColor}40` }]}>
                                                <Text style={[s.relTypeText, { color: relColor }]}>{relationshipLabel(rel.type)}</Text>
                                            </View>
                                        </View>
                                        <Text style={s.relDesc} numberOfLines={2}>{rel.description}</Text>
                                        <View style={s.relStrengthRow}>
                                            <View style={s.relStrengthTrack}>
                                                <View style={[s.relStrengthFill, { width: `${rel.strength}%`, backgroundColor: relColor }]} />
                                            </View>
                                            <Text style={[s.relStrengthVal, { color: relColor }]}>{rel.strength}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        })}
                    </Animated.View>
                )}

                {/* Strongest bonds */}
                {!selectedChar && (
                    <Animated.View entering={FadeInDown.delay(140).duration(340)} style={s.bondsSection}>
                        <Text style={s.sectionTitle}>💛 Strongest Bonds</Text>
                        {topRelationships.map((rel) => {
                            const charA = getCharacterById(rel.characterAId)
                            const charB = getCharacterById(rel.characterBId)
                            if (!charA || !charB) return null
                            const relColor = relationshipColor(rel.type)
                            return (
                                <View key={rel.id} style={s.bondRow}>
                                    <View style={s.bondAvatars}>
                                        <View style={[s.bondAvatar, { backgroundColor: `${charA.accentColor}22` }]}>
                                            <Text style={{ fontSize: 14 }}>{charA.emoji}</Text>
                                        </View>
                                        <View style={[s.bondAvatar, s.bondAvatarB, { backgroundColor: `${charB.accentColor}22` }]}>
                                            <Text style={{ fontSize: 14 }}>{charB.emoji}</Text>
                                        </View>
                                    </View>
                                    <View style={s.bondContent}>
                                        <Text style={s.bondNames}>{charA.name} & {charB.name}</Text>
                                        <Text style={[s.bondType, { color: relColor }]}>{relationshipLabel(rel.type)}</Text>
                                    </View>
                                    <View style={s.bondStrengthWrap}>
                                        <Text style={[s.bondStrength, { color: relColor }]}>{rel.strength}</Text>
                                        <Text style={s.bondStrengthLabel}>strength</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </Animated.View>
                )}

                {/* Settings */}
                <Animated.View entering={FadeInDown.delay(160).duration(340)} style={s.settingsSection}>
                    {[
                        { label: '⚙️ Settings', onPress: () => router.push('/settings') },
                        { label: '❓ Support', onPress: () => router.push('/support') },
                        { label: '📋 Terms', onPress: () => router.push('/terms') },
                        { label: '🔒 Privacy', onPress: () => router.push('/privacy') },
                    ].map((item) => (
                        <Pressable key={item.label} onPress={item.onPress} style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}>
                            <Text style={s.settingsLabel}>{item.label}</Text>
                            <Text style={s.settingsArrow}>›</Text>
                        </Pressable>
                    ))}
                </Animated.View>
            </ScrollView>
        </View>
    )
}

const s = StyleSheet.create({
    townHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    townIconGrad: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
    townIconEmoji: { fontSize: 30 },
    townMeta: { flex: 1, gap: 4 },
    townName: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    townSub: { color: 'rgba(255,255,255,0.42)', fontSize: 12.5 },
    townBadge: { alignSelf: 'flex-start', backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BORDER, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    townBadgeText: { color: ACCENT, fontSize: 11, fontWeight: '700' },

    statsGrid: { flexDirection: 'row', gap: 10 },
    statCard: { flex: 1, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 3 },
    statEmoji: { fontSize: 18 },
    statVal: { color: '#fff', fontSize: 17, fontWeight: '800' },
    statLbl: { color: 'rgba(255,255,255,0.38)', fontSize: 9.5, fontWeight: '600' },

    graphSection: { gap: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
    sectionSub: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
    clearBtn: { backgroundColor: SURFACE2, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
    clearBtnText: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '600' },
    graphWrap: { backgroundColor: SURFACE, borderRadius: 20, borderWidth: 1, borderColor: BORDER, padding: 10, overflow: 'hidden' },

    relSection: { backgroundColor: SURFACE, borderRadius: 20, borderWidth: 1, borderColor: BORDER, padding: 16, gap: 12 },
    relHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    relCharAvatar: { width: 44, height: 44, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    relCharEmoji: { fontSize: 22 },
    relCharName: { color: '#fff', fontSize: 15, fontWeight: '800' },
    relCharOcc: { color: 'rgba(255,255,255,0.38)', fontSize: 12 },
    relRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: SURFACE2, borderRadius: 14, padding: 12 },
    relOtherAvatar: { width: 38, height: 38, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    relContent: { flex: 1, gap: 4 },
    relTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    relOtherName: { color: '#fff', fontSize: 14, fontWeight: '700' },
    relTypeBadge: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
    relTypeText: { fontSize: 10, fontWeight: '700' },
    relDesc: { color: 'rgba(255,255,255,0.45)', fontSize: 11.5, lineHeight: 16 },
    relStrengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    relStrengthTrack: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99 },
    relStrengthFill: { height: 4, borderRadius: 99 },
    relStrengthVal: { fontSize: 10.5, fontWeight: '700', width: 20 },

    bondsSection: { gap: 12 },
    bondRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 12 },
    bondAvatars: { flexDirection: 'row' },
    bondAvatar: { width: 34, height: 34, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    bondAvatarB: { marginLeft: -10 },
    bondContent: { flex: 1 },
    bondNames: { color: '#fff', fontSize: 13.5, fontWeight: '700' },
    bondType: { fontSize: 11.5, fontWeight: '600', marginTop: 1 },
    bondStrengthWrap: { alignItems: 'center' },
    bondStrength: { fontSize: 18, fontWeight: '800' },
    bondStrengthLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: '600' },

    settingsSection: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, overflow: 'hidden' },
    settingsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.07)' },
    settingsLabel: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
    settingsArrow: { color: 'rgba(255,255,255,0.3)', fontSize: 20, fontWeight: '300' },
})

