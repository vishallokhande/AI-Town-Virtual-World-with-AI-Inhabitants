import { useState } from 'react'
import { View, Pressable, StyleSheet, Dimensions, ScrollView, Modal, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE, SURFACE2, SURFACE3 } from '@/lib/theme'
import {
    buildings, characters, townStats,
    getCharactersAtLocation, Building,
} from '@/lib/mockData'
import { TAB_BAR_HEIGHT } from '@/components/TabBar'

const { width: SW } = Dimensions.get('window')
const GRID_COLS = 5
const TILE_GAP = 8
const TILE_SIZE = (SW - 40 - TILE_GAP * (GRID_COLS - 1)) / GRID_COLS

const AVAILABLE_BUILDINGS: { type: Building['type']; emoji: string; name: string }[] = [
    { type: 'cafe',        emoji: '☕', name: 'Café'        },
    { type: 'library',     emoji: '📚', name: 'Library'     },
    { type: 'park',        emoji: '🌳', name: 'Park'        },
    { type: 'market',      emoji: '🛒', name: 'Market'      },
    { type: 'gym',         emoji: '🏋️', name: 'Gym'         },
    { type: 'garden',      emoji: '🌿', name: 'Garden'      },
    { type: 'fountain',    emoji: '⛲', name: 'Fountain'    },
    { type: 'house',       emoji: '🏛️', name: 'Town Hall'   },
    { type: 'art_studio',  emoji: '🎨', name: 'Art Studio'  },
    { type: 'music_hall',  emoji: '🎵', name: 'Music Hall'  },
    { type: 'observatory', emoji: '🔭', name: 'Observatory' },
    { type: 'school',      emoji: '🏫', name: 'School'      },
]

function buildingAtGrid(x: number, y: number): Building | undefined {
    return buildings.find((b) => b.x === x && b.y === y)
}

export default function TownScreen() {
    const insets = useSafeAreaInsets()
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
    const [addingMode, setAddingMode] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const onTilePress = (x: number, y: number) => {
        const building = buildingAtGrid(x, y)
        if (building) setSelectedBuilding(building)
    }

    const stats = townStats
    const happyChars = characters.filter((c) => c.happiness > 75).length

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <LinearGradient
                pointerEvents="none"
                colors={[BG, '#10101e', BG]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: TAB_BAR_HEIGHT + 24 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} tintColor={ACCENT} />}
            >
                {/* ── Header ── */}
                <Animated.View entering={FadeInDown.duration(380)} style={s.header}>
                    <View>
                        <Text style={s.townName}>🏙️ {stats.townName}</Text>
                        <Text style={s.townSub}>Day {stats.daysPassed} · {happyChars}/{stats.totalCharacters} residents happy</Text>
                    </View>
                    <Pressable
                        onPress={() => setAddingMode(!addingMode)}
                        style={[s.addBtn, addingMode && { backgroundColor: ACCENT }]}
                    >
                        <Text style={[s.addBtnText, addingMode && { color: '#000' }]}>
                            {addingMode ? '✕ Cancel' : '+ Place'}
                        </Text>
                    </Pressable>
                </Animated.View>

                {/* ── Stat pills ── */}
                <Animated.View entering={FadeInDown.delay(80).duration(380)} style={s.statsRow}>
                    {[
                        { label: '🏘️ Buildings', value: String(stats.totalBuildings) },
                        { label: '👥 Citizens', value: String(stats.totalCharacters) },
                        { label: '⚡ Events', value: String(stats.eventsToday) },
                        { label: '😊 Happiness', value: `${stats.happinessAvg}%` },
                    ].map((s2) => (
                        <View key={s2.label} style={s.statPill}>
                            <Text style={s.statValue}>{s2.value}</Text>
                            <Text style={s.statLabel}>{s2.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* ── Town Grid ── */}
                <Animated.View entering={FadeInDown.delay(160).duration(400)} style={s.gridWrap}>
                    <Text style={s.sectionLabel}>TOWN MAP</Text>
                    <View style={s.grid}>
                        {Array.from({ length: 5 }, (_, row) =>
                            Array.from({ length: GRID_COLS }, (_, col) => {
                                const building = buildingAtGrid(col, row)
                                const charsHere = building ? getCharactersAtLocation(building.id) : []
                                const isEmpty = !building
                                return (
                                    <Pressable
                                        key={`${col}-${row}`}
                                        onPress={() => onTilePress(col, row)}
                                        style={({ pressed }) => [
                                            s.tile,
                                            isEmpty && s.tileEmpty,
                                            building && !building.isOwned && s.tileLocked,
                                            pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
                                        ]}
                                    >
                                        {building ? (
                                            <>
                                                <Text style={s.tileEmoji}>{building.emoji}</Text>
                                                {charsHere.length > 0 && (
                                                    <View style={s.charDots}>
                                                        {charsHere.slice(0, 3).map((c) => (
                                                            <View key={c.id} style={[s.charDot, { backgroundColor: c.accentColor }]} />
                                                        ))}
                                                    </View>
                                                )}
                                                {!building.isOwned && (
                                                    <View style={s.lockBadge}>
                                                        <Text style={s.lockText}>🔒</Text>
                                                    </View>
                                                )}
                                            </>
                                        ) : (
                                            <Text style={s.tileAdd}>{addingMode ? '+' : ''}</Text>
                                        )}
                                    </Pressable>
                                )
                            })
                        )}
                    </View>
                    <Text style={s.gridCaption}>Tap a building to explore · Colored dots = residents inside</Text>
                </Animated.View>

                {/* ── Active Characters ── */}
                <Animated.View entering={FadeInDown.delay(240).duration(400)} style={s.charsWrap}>
                    <Text style={s.sectionLabel}>ACTIVE NOW</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.charsScroll}>
                        {characters.map((c) => (
                            <Pressable
                                key={c.id}
                                onPress={() => router.push(`/character/${c.id}` as any)}
                                style={({ pressed }) => [s.charCard, { borderColor: `${c.accentColor}33` }, pressed && { opacity: 0.78 }]}
                            >
                                <View style={[s.charAvatar, { backgroundColor: `${c.accentColor}22` }]}>
                                    <Text style={s.charEmoji}>{c.emoji}</Text>
                                    <View style={[s.moodDot, { backgroundColor: c.accentColor }]} />
                                </View>
                                <Text style={s.charName}>{c.name}</Text>
                                <Text style={s.charActivity} numberOfLines={2}>{c.currentActivity}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* ── Unlockable buildings picker (add mode) ── */}
                {addingMode && (
                    <Animated.View entering={FadeIn.duration(220)} style={s.picker}>
                        <Text style={s.sectionLabel}>CHOOSE BUILDING</Text>
                        <View style={s.pickerGrid}>
                            {AVAILABLE_BUILDINGS.map((b) => {
                                const isPlaced = buildings.some((bld) => bld.type === b.type && bld.isOwned)
                                return (
                                    <Pressable
                                        key={b.type}
                                        disabled={isPlaced}
                                        style={[s.pickerTile, isPlaced && { opacity: 0.35 }]}
                                    >
                                        <Text style={s.pickerEmoji}>{b.emoji}</Text>
                                        <Text style={s.pickerName}>{b.name}</Text>
                                        {isPlaced && <Text style={s.pickerOwned}>Placed</Text>}
                                    </Pressable>
                                )
                            })}
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* ── Building Detail Modal ── */}
            <Modal
                visible={!!selectedBuilding}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedBuilding(null)}
            >
                <Pressable style={s.modalBackdrop} onPress={() => setSelectedBuilding(null)}>
                    <Pressable style={s.modalSheet} onPress={() => {}}>
                        {selectedBuilding && (
                            <>
                                <View style={s.modalHandle} />
                                <View style={s.modalHeader}>
                                    <View style={s.modalEmojiWrap}>
                                        <Text style={s.modalEmoji}>{selectedBuilding.emoji}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.modalName}>{selectedBuilding.name}</Text>
                                        <Text style={s.modalType}>{selectedBuilding.type.replace('_', ' ').toUpperCase()}</Text>
                                    </View>
                                    <View style={s.visitorBadge}>
                                        <Text style={s.visitorText}>👥 {selectedBuilding.visitors}</Text>
                                    </View>
                                </View>
                                <Text style={s.modalDesc}>{selectedBuilding.description}</Text>

                                {getCharactersAtLocation(selectedBuilding.id).length > 0 && (
                                    <>
                                        <Text style={s.modalSection}>Currently inside</Text>
                                        {getCharactersAtLocation(selectedBuilding.id).map((c) => (
                                            <Pressable
                                                key={c.id}
                                                onPress={() => { setSelectedBuilding(null); router.push(`/character/${c.id}` as any) }}
                                                style={s.modalCharRow}
                                            >
                                                <View style={[s.modalCharAvatar, { backgroundColor: `${c.accentColor}25` }]}>
                                                    <Text style={{ fontSize: 18 }}>{c.emoji}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={s.modalCharName}>{c.name}</Text>
                                                    <Text style={s.modalCharOcc}>{c.currentActivity}</Text>
                                                </View>
                                                <Text style={s.modalChatBtn}>Chat →</Text>
                                            </Pressable>
                                        ))}
                                    </>
                                )}

                                {!selectedBuilding.isOwned && (
                                    <View style={s.lockedBanner}>
                                        <Text style={s.lockedBannerText}>🔒 Place this building on the map to unlock it</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

const s = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 },
    townName: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    townSub: { color: 'rgba(255,255,255,0.45)', fontSize: 12.5, marginTop: 2 },
    addBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: SURFACE2, borderWidth: 1, borderColor: BORDER },
    addBtnText: { color: ACCENT, fontSize: 13, fontWeight: '700' },

    statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
    statPill: { flex: 1, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingVertical: 10, alignItems: 'center', gap: 2 },
    statValue: { color: '#fff', fontSize: 15, fontWeight: '800' },
    statLabel: { color: 'rgba(255,255,255,0.38)', fontSize: 9, fontWeight: '600', letterSpacing: 0.4 },

    sectionLabel: { color: 'rgba(255,255,255,0.38)', fontSize: 10.5, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },

    gridWrap: { paddingHorizontal: 20, marginBottom: 22 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP },
    tile: { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    tileEmpty: { borderStyle: 'dashed', opacity: 0.55 },
    tileLocked: { opacity: 0.5 },
    tileEmoji: { fontSize: 26 },
    tileAdd: { color: 'rgba(255,255,255,0.2)', fontSize: 22, fontWeight: '300' },
    charDots: { position: 'absolute', bottom: 5, flexDirection: 'row', gap: 3 },
    charDot: { width: 6, height: 6, borderRadius: 99 },
    lockBadge: { position: 'absolute', top: 4, right: 4 },
    lockText: { fontSize: 10 },
    gridCaption: { color: 'rgba(255,255,255,0.28)', fontSize: 11, textAlign: 'center', marginTop: 10 },

    charsWrap: { paddingLeft: 20, marginBottom: 20 },
    charsScroll: { paddingRight: 20, gap: 10 },
    charCard: { width: 96, alignItems: 'center', backgroundColor: SURFACE, borderRadius: 16, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 8, gap: 5 },
    charAvatar: { width: 46, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    charEmoji: { fontSize: 22 },
    moodDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 99, borderWidth: 1.5, borderColor: BG },
    charName: { color: '#fff', fontSize: 12, fontWeight: '700' },
    charActivity: { color: 'rgba(255,255,255,0.35)', fontSize: 9.5, textAlign: 'center', lineHeight: 13 },

    picker: { paddingHorizontal: 20, marginBottom: 20 },
    pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    pickerTile: { width: (SW - 40 - 30) / 4, backgroundColor: SURFACE2, borderRadius: 12, borderWidth: 1, borderColor: BORDER, alignItems: 'center', paddingVertical: 12, gap: 4 },
    pickerEmoji: { fontSize: 22 },
    pickerName: { color: '#fff', fontSize: 10.5, fontWeight: '600' },
    pickerOwned: { color: ACCENT, fontSize: 9, fontWeight: '700' },

    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: SURFACE, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12 },
    modalHandle: { width: 38, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99, alignSelf: 'center', marginBottom: 18 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
    modalEmojiWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: SURFACE2, alignItems: 'center', justifyContent: 'center' },
    modalEmoji: { fontSize: 28 },
    modalName: { color: '#fff', fontSize: 18, fontWeight: '800' },
    modalType: { color: ACCENT, fontSize: 10.5, fontWeight: '600', letterSpacing: 0.8, marginTop: 2 },
    visitorBadge: { backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BORDER, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
    visitorText: { color: ACCENT, fontSize: 12, fontWeight: '700' },
    modalDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 13.5, lineHeight: 20, marginBottom: 16 },
    modalSection: { color: 'rgba(255,255,255,0.38)', fontSize: 10.5, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
    modalCharRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: SURFACE2, borderRadius: 14, padding: 12, marginBottom: 8 },
    modalCharAvatar: { width: 40, height: 40, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    modalCharName: { color: '#fff', fontSize: 14, fontWeight: '700' },
    modalCharOcc: { color: 'rgba(255,255,255,0.45)', fontSize: 11.5, marginTop: 1 },
    modalChatBtn: { color: ACCENT, fontSize: 12, fontWeight: '700' },
    lockedBanner: { backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: ACCENT_BORDER, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
    lockedBannerText: { color: ACCENT, fontSize: 13, fontWeight: '600', textAlign: 'center' },
})

