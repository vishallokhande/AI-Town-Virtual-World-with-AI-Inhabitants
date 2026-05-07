import { useEffect, useRef } from 'react'
import { View, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE } from '@/lib/theme'
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants'
import { adjustBrightness } from '@/lib/utils'

const { width: SW, height: SH } = Dimensions.get('window')

const FEATURES = [
    { emoji: '🏘️', title: 'Design Your Town', desc: 'Place buildings, parks, and decorations on an interactive map grid' },
    { emoji: '🧠', title: 'AI Characters with Memory', desc: 'Each resident develops preferences, remembers events, and evolves over time' },
    { emoji: '💬', title: 'Chat with Any Resident', desc: 'Have real conversations shaped by their unique personality and memories' },
    { emoji: '📖', title: 'Living Storylines', desc: 'Watch events unfold, rivalries form, and unexpected romances develop' },
    { emoji: '🕸️', title: 'Relationship Graph', desc: 'See how bonds and conflicts connect every character in your town' },
]

const CHARACTERS_PREVIEW = [
    { emoji: '🌙', name: 'Luna', role: 'Astronomer', color: '#818CF8' },
    { emoji: '☕', name: 'Marco', role: 'Café Owner', color: '#F97316' },
    { emoji: '⚡', name: 'Skye', role: 'Inventor', color: '#06B6D4' },
    { emoji: '🌿', name: 'River', role: 'Herbalist', color: '#10B981' },
    { emoji: '📚', name: 'Vera', role: 'Librarian', color: '#A78BFA' },
    { emoji: '🎵', name: 'Juno', role: 'Musician', color: '#EC4899' },
]

export default function LandingScreen() {
    const insets = useSafeAreaInsets()
    const headerY = useSharedValue(-20)
    const headerOpacity = useSharedValue(0)
    const heroScale = useSharedValue(0.88)
    const heroOpacity = useSharedValue(0)
    const featuresY = useSharedValue(30)
    const featuresOpacity = useSharedValue(0)
    const footerOpacity = useSharedValue(0)
    const orbOneY = useSharedValue(0)
    const orbTwoY = useSharedValue(0)
    const townY = useSharedValue(20)
    const townOpacity = useSharedValue(0)

    useEffect(() => {
        headerY.value = withSpring(0, { damping: 16, stiffness: 120 })
        headerOpacity.value = withTiming(1, { duration: 500 })
        heroScale.value = withDelay(120, withSpring(1, { damping: 14, stiffness: 100 }))
        heroOpacity.value = withDelay(120, withTiming(1, { duration: 550 }))
        townY.value = withDelay(280, withSpring(0, { damping: 16, stiffness: 110 }))
        townOpacity.value = withDelay(280, withTiming(1, { duration: 480 }))
        featuresY.value = withDelay(420, withSpring(0, { damping: 16, stiffness: 110 }))
        featuresOpacity.value = withDelay(420, withTiming(1, { duration: 480 }))
        footerOpacity.value = withDelay(580, withTiming(1, { duration: 500 }))
        orbOneY.value = withRepeat(withSequence(withTiming(-18, { duration: 3600, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 3600, easing: Easing.inOut(Easing.sin) })), -1, true)
        orbTwoY.value = withRepeat(withSequence(withTiming(14, { duration: 2900, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 2900, easing: Easing.inOut(Easing.sin) })), -1, true)
    }, [])

    const headerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: headerY.value }], opacity: headerOpacity.value }))
    const heroStyle = useAnimatedStyle(() => ({ transform: [{ scale: heroScale.value }], opacity: heroOpacity.value }))
    const featuresStyle = useAnimatedStyle(() => ({ transform: [{ translateY: featuresY.value }], opacity: featuresOpacity.value }))
    const footerStyle = useAnimatedStyle(() => ({ opacity: footerOpacity.value }))
    const orbOneStyle = useAnimatedStyle(() => ({ transform: [{ translateY: orbOneY.value }] }))
    const orbTwoStyle = useAnimatedStyle(() => ({ transform: [{ translateY: orbTwoY.value }] }))
    const townStyle = useAnimatedStyle(() => ({ transform: [{ translateY: townY.value }], opacity: townOpacity.value }))

    return (
        <View style={s.root}>
            <LinearGradient pointerEvents="none" colors={[BG, '#10101e', '#0d0d1a', BG]} locations={[0, 0.28, 0.65, 1]} style={StyleSheet.absoluteFillObject} />
            <Animated.View pointerEvents="none" style={[s.orbOne, orbOneStyle]} />
            <Animated.View pointerEvents="none" style={[s.orbTwo, orbTwoStyle]} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}>

                {/* ── Header ── */}
                <Animated.View style={[s.headerOuter, { marginTop: insets.top + 10 }, headerStyle]}>
                    <View style={s.headerBar}>
                        <View style={s.headerLeft}>
                            <LinearGradient colors={[adjustBrightness(ACCENT, 20), ACCENT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.headerLogo}>
                                <Text style={s.headerLogoText}>🏙️</Text>
                            </LinearGradient>
                            <Text style={s.headerAppName}>{APP_NAME}</Text>
                        </View>
                        <Pressable onPress={() => router.push('/(auth)/login')} style={({ pressed }) => [s.headerCta, pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] }]}>
                            <LinearGradient colors={[ACCENT, adjustBrightness(ACCENT, -18)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.headerCtaGrad}>
                                <Text style={s.headerCtaText}>Enter Town →</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* ── Hero ── */}
                <Animated.View style={[s.heroWrap, heroStyle]}>
                    <View style={s.heroBadge}>
                        <Text style={s.heroBadgeText}>✨ AI Simulation · Mobile Game</Text>
                    </View>
                    <Text style={s.heroTitle}>Build a town.{'\n'}Watch it <Text style={s.heroTitleAccent}>come alive.</Text></Text>
                    <Text style={s.heroTagline}>{APP_TAGLINE}</Text>
                    <Text style={s.heroDesc}>{APP_DESCRIPTION}</Text>
                </Animated.View>

                {/* ── Character preview strip ── */}
                <Animated.View style={[s.charsSection, townStyle]}>
                    <Text style={s.sectionLabel}>Meet the residents</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.charsScroll}>
                        {CHARACTERS_PREVIEW.map((c) => (
                            <View key={c.name} style={[s.charCard, { borderColor: `${c.color}33` }]}>
                                <View style={[s.charAvatar, { backgroundColor: `${c.color}20` }]}>
                                    <Text style={s.charEmoji}>{c.emoji}</Text>
                                </View>
                                <Text style={s.charName}>{c.name}</Text>
                                <Text style={[s.charRole, { color: c.color }]}>{c.role}</Text>
                            </View>
                        ))}
                        <View style={s.charCardMore}>
                            <Text style={s.charMoreText}>+2{'\n'}more</Text>
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* ── Town preview tiles ── */}
                <Animated.View style={[s.townPreview, townStyle]}>
                    <Text style={s.sectionLabel}>Your town map</Text>
                    <View style={s.townGrid}>
                        {['☕', '🎨', '📚', '🛒', '🏋️', '🌿', '⛲', '🏛️', '🎵', '🔭', '🌳', '🏫'].map((emoji, i) => (
                            <View key={i} style={[s.townTile, i === 11 && s.townTileLocked]}>
                                <Text style={s.townTileEmoji}>{emoji}</Text>
                                {i === 11 && <View style={s.tileLock}><Text style={s.tileLockText}>🔒</Text></View>}
                            </View>
                        ))}
                    </View>
                    <Text style={s.townCaption}>Tap any tile to place or upgrade buildings</Text>
                </Animated.View>

                {/* ── Feature highlights ── */}
                <Animated.View style={[s.featuresWrap, featuresStyle]}>
                    {FEATURES.map((feat, i) => (
                        <View key={i} style={s.featureRow}>
                            <View style={s.featureIconWrap}>
                                <Text style={s.featureEmoji}>{feat.emoji}</Text>
                            </View>
                            <View style={s.featureTextWrap}>
                                <Text style={s.featureTitle}>{feat.title}</Text>
                                <Text style={s.featureDesc}>{feat.desc}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>

                {/* ── CTA ── */}
                <Animated.View style={[s.ctaWrap, footerStyle]}>
                    <Pressable onPress={() => router.push('/(auth)/login')} style={({ pressed }) => [s.ctaBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}>
                        <LinearGradient colors={[adjustBrightness(ACCENT, 12), ACCENT, adjustBrightness(ACCENT, -20)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ctaGrad}>
                            <Text style={s.ctaText}>🏙️  Start Building Your Town</Text>
                        </LinearGradient>
                    </Pressable>
                    <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                        <Text style={s.signInText}>Already have a town? <Text style={s.signInLink}>Sign in</Text></Text>
                    </Pressable>
                    <Text style={s.legal}>
                        By continuing you agree to our{' '}
                        <Text onPress={() => router.push('/terms')} style={s.legalLink}>Terms</Text>
                        {' '}and{' '}
                        <Text onPress={() => router.push('/privacy')} style={s.legalLink}>Privacy Policy</Text>
                    </Text>
                </Animated.View>

            </ScrollView>
        </View>
    )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    orbOne: { position: 'absolute', right: -SW * 0.3, top: SH * 0.05, width: SW * 0.78, height: SW * 0.78, borderRadius: 999, backgroundColor: `${ACCENT}10` },
    orbTwo: { position: 'absolute', left: -SW * 0.35, bottom: SH * 0.22, width: SW * 0.7, height: SW * 0.7, borderRadius: 999, backgroundColor: 'rgba(129,140,248,0.07)' },

    headerOuter: { alignItems: 'center', paddingHorizontal: 20 },
    headerBar: { width: '100%', height: 58, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 6, paddingRight: 6 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerLogo: { width: 38, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
    headerLogoText: { fontSize: 18 },
    headerAppName: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
    headerCta: { borderRadius: 999, overflow: 'hidden' },
    headerCtaGrad: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999 },
    headerCtaText: { color: '#fff', fontSize: 13, fontWeight: '700' },

    heroWrap: { paddingHorizontal: 24, paddingTop: 32, gap: 10 },
    heroBadge: { alignSelf: 'flex-start', backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT_BORDER, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
    heroBadgeText: { color: ACCENT, fontSize: 11.5, fontWeight: '600', letterSpacing: 0.3 },
    heroTitle: { color: '#fff', fontSize: 36, fontWeight: '800', letterSpacing: -1, lineHeight: 43, marginTop: 4 },
    heroTitleAccent: { color: ACCENT },
    heroTagline: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '500' },
    heroDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 13.5, lineHeight: 20, maxWidth: 330, marginTop: 2 },

    sectionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 },

    charsSection: { marginTop: 32, paddingLeft: 24 },
    charsScroll: { paddingRight: 24, gap: 10 },
    charCard: { width: 82, alignItems: 'center', backgroundColor: SURFACE, borderRadius: 16, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 8, gap: 6 },
    charAvatar: { width: 44, height: 44, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    charEmoji: { fontSize: 22 },
    charName: { color: '#fff', fontSize: 12, fontWeight: '700' },
    charRole: { fontSize: 10, fontWeight: '500' },
    charCardMore: { width: 82, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: BORDER, paddingVertical: 14 },
    charMoreText: { color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: '700', textAlign: 'center' },

    townPreview: { marginTop: 28, paddingHorizontal: 24 },
    townGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    townTile: { width: (SW - 48 - 44) / 6, aspectRatio: 1, backgroundColor: SURFACE, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
    townTileLocked: { opacity: 0.38 },
    townTileEmoji: { fontSize: 18 },
    tileLock: { position: 'absolute', bottom: 2, right: 3 },
    tileLockText: { fontSize: 8 },
    townCaption: { color: 'rgba(255,255,255,0.3)', fontSize: 11.5, textAlign: 'center', marginTop: 4 },

    featuresWrap: { paddingHorizontal: 24, gap: 10, marginTop: 28 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16 },
    featureIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: ACCENT_DIM, alignItems: 'center', justifyContent: 'center' },
    featureEmoji: { fontSize: 20 },
    featureTextWrap: { flex: 1, gap: 2 },
    featureTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
    featureDesc: { color: 'rgba(255,255,255,0.42)', fontSize: 12.5, lineHeight: 18 },

    ctaWrap: { paddingHorizontal: 24, marginTop: 36, gap: 14, alignItems: 'center' },
    ctaBtn: { width: '100%', borderRadius: 18, overflow: 'hidden', shadowColor: ACCENT, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 18, elevation: 10 },
    ctaGrad: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
    ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
    signInText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
    signInLink: { color: ACCENT, fontWeight: '600' },
    legal: { color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: 11, lineHeight: 17, paddingHorizontal: 8 },
    legalLink: { color: 'rgba(255,255,255,0.36)', textDecorationLine: 'underline' },
})
