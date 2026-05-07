import { useState, useRef, useEffect } from 'react'
import { View, Pressable, StyleSheet, Dimensions, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, SURFACE, SURFACE2, SURFACE3 } from '@/lib/theme'
import {
    getCharacterById, getChatHistory, getRelationshipsForCharacter,
    getRelatedCharacter, moodColor, relationshipLabel, relationshipColor,
    ChatMessage, Character,
} from '@/lib/mockData'
import { adjustBrightness } from '@/lib/utils'

const { width: SW } = Dimensions.get('window')

const AI_RESPONSES: Record<string, string[]> = {
    'char-1': [
        "The universe is 13.8 billion years old. Somehow that makes conversations feel both urgent and completely unhurried.",
        "I recorded three observations about you just now. Shall I share? Actually — let me wait. Some things become more interesting over time.",
        "Marco brought me a second coffee this morning without being asked. I wrote it down. I write everything down.",
        "There's a particular quality of silence I try to preserve up here. You haven't disrupted it. That's rare.",
    ],
    'char-2': [
        "You look like you need something warm. Let me guess — you're a chamomile person. No, wait. Chai latte.",
        "Running a café in a small town means knowing everyone's tells. You're holding something back. Take your time.",
        "The first rule of this place: you don't have to talk. The second rule: if you want to, I'm here.",
        "I've been thinking about what River said about rosemary. I think I need to plant some outside.",
    ],
    'char-3': [
        "I've broken three things this week trying to fix one thing. Progress technically.",
        "Vera would say I need to slow down. She's probably right. I haven't told her that.",
        "Can I show you something? I know it doesn't work yet, but I can explain what it's supposed to do.",
        "The problem with being called a genius is everyone expects you to have answers. I mostly just have better questions.",
    ],
    'char-4': [
        "Plants don't lie. That's why I prefer their company most mornings.",
        "I was somewhere else before here. That's enough about that, I think.",
        "The jasmine bloomed early this year. I take that as a sign of something, though I'm not sure what.",
        "You asked, so I'll say: I'm fine. Most days that's true. Some days it's just a direction I'm pointing in.",
    ],
    'char-5': [
        "I noticed you looking at the card catalogue. Most people don't notice it anymore. What were you hoping to find?",
        "I catalogued 'anonymous' under its own section. It's become quite substantial.",
        "The thing about keeping records is — eventually you see patterns no one intended to create.",
        "Skye borrowed three books on quantum computing. I left a note: 'Don't fold the pages.' They didn't respond.",
    ],
    'char-6': [
        "I wrote a new song this morning. It's not ready yet, but it was born at 4am so I trust it.",
        "Someone once told me busking was giving up. I've played for 40,000 people since then. Funny how that goes.",
        "River came to last night's set. They stood the whole time. Didn't say a word after. That's the best kind of review.",
        "I think music is just the shape of things people can't quite say. That's what I'm trying to do, anyway.",
    ],
    'char-7': [
        "You look like you could use a workout. I'm not wrong, am I? Nobody ever thinks they need one until after.",
        "I coach people who've given up on themselves. That's the most important job in the world, if you ask me.",
        "My knee ended my career. My knee also made me who I am. I can't decide if that's ironic or perfect.",
        "Vera did 12 minutes. She'll do 15 on Friday. I already know this.",
    ],
    'char-8': [
        "I painted you into a scene last week. Don't panic — it's abstract. You're the blue-green light near the edge.",
        "I see everyone in this town as colors. Marco is warm sienna. Luna is deep indigo with silver threads.",
        "River taught me how plants bleed pigment. I haven't used synthetic colors since.",
        "Art is just attention made visible. Everything I paint is a record of where I looked for long enough.",
    ],
}

const DEFAULT_RESPONSES = [
    "That's... actually something I've been thinking about too.",
    "Hmm. Give me a moment with that.",
    "I don't have an easy answer for that. But I'm glad you asked.",
    "In Willowvale, we've learned to sit with hard questions. It's not avoidance — it's respect.",
]

function getAIResponse(characterId: string): string {
    const pool = AI_RESPONSES[characterId] ?? DEFAULT_RESPONSES
    return pool[Math.floor(Math.random() * pool.length)]
}

export default function CharacterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()
    const char = getCharacterById(id)
    const [messages, setMessages] = useState<ChatMessage[]>(() => getChatHistory(id ?? ''))
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'memories'>('chat')
    const scrollRef = useRef<ScrollView>(null)

    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
    }, [messages])

    if (!char) {
        return (
            <View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Character not found</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: ACCENT, fontSize: 14 }}>← Go back</Text>
                </Pressable>
            </View>
        )
    }

    const moodCol = moodColor(char.mood)
    const rels = getRelationshipsForCharacter(char.id)

    const sendMessage = () => {
        if (!input.trim()) return
        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            characterId: char.id,
            role: 'user',
            text: input.trim(),
            timeAgo: 'just now',
        }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setIsTyping(true)
        setTimeout(() => {
            const charMsg: ChatMessage = {
                id: `msg-${Date.now()}-char`,
                characterId: char.id,
                role: 'character',
                text: getAIResponse(char.id),
                timeAgo: 'just now',
            }
            setMessages((prev) => [...prev, charMsg])
            setIsTyping(false)
        }, 1200 + Math.random() * 800)
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: BG }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* ── Background gradient ── */}
            <LinearGradient
                pointerEvents="none"
                colors={[`${char.accentColor}12`, BG, BG]}
                locations={[0, 0.35, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* ── Header ── */}
            <Animated.View entering={FadeInDown.duration(340)} style={[s.header, { paddingTop: insets.top + 8 }]}>
                <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}>
                    <Text style={s.backText}>←</Text>
                </Pressable>
                <View style={[s.headerAvatar, { backgroundColor: `${char.accentColor}22` }]}>
                    <Text style={s.headerEmoji}>{char.emoji}</Text>
                    <View style={[s.onlineDot, { backgroundColor: moodCol }]} />
                </View>
                <View style={s.headerMeta}>
                    <Text style={s.headerName}>{char.name}</Text>
                    <Text style={[s.headerOcc, { color: char.accentColor }]}>{char.occupation} · {char.moodEmoji} {char.mood}</Text>
                </View>
                <Pressable
                    onPress={() => setActiveTab('profile')}
                    style={[s.profileBtn, activeTab === 'profile' && { backgroundColor: `${char.accentColor}20` }]}
                >
                    <Text style={[s.profileBtnText, { color: char.accentColor }]}>ℹ️</Text>
                </Pressable>
            </Animated.View>

            {/* ── Tab switcher ── */}
            <Animated.View entering={FadeInDown.delay(50).duration(300)} style={s.tabRow}>
                {(['chat', 'profile', 'memories'] as const).map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[s.tabBtn, activeTab === tab && { borderBottomColor: char.accentColor }]}
                    >
                        <Text style={[s.tabText, activeTab === tab && { color: char.accentColor }]}>
                            {tab === 'chat' ? '💬 Chat' : tab === 'profile' ? '👤 Profile' : '💭 Memories'}
                        </Text>
                    </Pressable>
                ))}
            </Animated.View>

            {/* ── Chat tab ── */}
            {activeTab === 'chat' && (
                <>
                    <ScrollView
                        ref={scrollRef}
                        style={s.chatScroll}
                        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg, i) => {
                            const isUser = msg.role === 'user'
                            return (
                                <Animated.View
                                    key={msg.id}
                                    entering={FadeInUp.delay(i < 3 ? i * 60 : 0).duration(280)}
                                    style={[s.msgRow, isUser && s.msgRowUser]}
                                >
                                    {!isUser && (
                                        <View style={[s.msgAvatar, { backgroundColor: `${char.accentColor}20` }]}>
                                            <Text style={{ fontSize: 14 }}>{char.emoji}</Text>
                                        </View>
                                    )}
                                    <View style={[
                                        s.bubble,
                                        isUser
                                            ? { backgroundColor: char.accentColor, borderBottomRightRadius: 4 }
                                            : { backgroundColor: SURFACE2, borderBottomLeftRadius: 4 },
                                    ]}>
                                        <Text style={[s.bubbleText, isUser && { color: '#000' }]}>{msg.text}</Text>
                                        <Text style={[s.bubbleTime, isUser && { color: 'rgba(0,0,0,0.4)' }]}>{msg.timeAgo}</Text>
                                    </View>
                                </Animated.View>
                            )
                        })}
                        {isTyping && (
                            <Animated.View entering={FadeIn.duration(200)} style={s.msgRow}>
                                <View style={[s.msgAvatar, { backgroundColor: `${char.accentColor}20` }]}>
                                    <Text style={{ fontSize: 14 }}>{char.emoji}</Text>
                                </View>
                                <View style={[s.bubble, { backgroundColor: SURFACE2 }]}>
                                    <Text style={s.typingText}>●●●</Text>
                                </View>
                            </Animated.View>
                        )}
                    </ScrollView>

                    <View style={[s.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
                        <TextInput
                            placeholder={`Message ${char.name}…`}
                            placeholderTextColor="rgba(255,255,255,0.28)"
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={sendMessage}
                            style={s.input}
                            multiline
                            maxLength={300}
                        />
                        <Pressable
                            onPress={sendMessage}
                            disabled={!input.trim() || isTyping}
                            style={({ pressed }) => [
                                s.sendBtn,
                                { backgroundColor: input.trim() && !isTyping ? char.accentColor : 'rgba(255,255,255,0.1)' },
                                pressed && { opacity: 0.8 },
                            ]}
                        >
                            <Text style={[s.sendIcon, { color: input.trim() && !isTyping ? '#000' : 'rgba(255,255,255,0.3)' }]}>↑</Text>
                        </Pressable>
                    </View>
                </>
            )}

            {/* ── Profile tab ── */}
            {activeTab === 'profile' && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 24 }}
                >
                    {/* Hero */}
                    <Animated.View entering={FadeInDown.duration(300)} style={[s.profileHero, { borderColor: `${char.accentColor}30` }]}>
                        <View style={[s.bigAvatar, { backgroundColor: `${char.accentColor}20` }]}>
                            <Text style={s.bigAvatarEmoji}>{char.emoji}</Text>
                        </View>
                        <Text style={s.profileName}>{char.name}</Text>
                        <Text style={[s.profileOcc, { color: char.accentColor }]}>{char.occupation} · Age {char.age}</Text>
                        <Text style={s.profilePersonality}>{char.personality}</Text>
                        <View style={s.traitsRow}>
                            {char.traits.map((t) => (
                                <View key={t} style={s.traitBadge}>
                                    <Text style={s.traitText}>{t}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Backstory */}
                    <Animated.View entering={FadeInDown.delay(60).duration(300)} style={s.backstoryCard}>
                        <Text style={s.cardLabel}>📜 Backstory</Text>
                        <Text style={s.backstoryText}>{char.backstory}</Text>
                    </Animated.View>

                    {/* Stats */}
                    <Animated.View entering={FadeInDown.delay(100).duration(300)} style={s.statsCard}>
                        <Text style={s.cardLabel}>📊 State</Text>
                        {[
                            { label: 'Energy', value: char.energy, color: char.accentColor },
                            { label: 'Happiness', value: char.happiness, color: '#4ade80' },
                            { label: 'Sociability', value: char.sociability, color: '#60a5fa' },
                        ].map((stat) => (
                            <View key={stat.label} style={s.statRow}>
                                <Text style={s.statLabel}>{stat.label}</Text>
                                <View style={s.statTrack}>
                                    <View style={[s.statFill, { width: `${stat.value}%`, backgroundColor: stat.color }]} />
                                </View>
                                <Text style={s.statVal}>{stat.value}</Text>
                            </View>
                        ))}
                    </Animated.View>

                    {/* Relationships */}
                    {rels.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(140).duration(300)} style={s.relsCard}>
                            <Text style={s.cardLabel}>🕸️ Relationships</Text>
                            {rels.map((rel) => {
                                const other = getRelatedCharacter(rel, char.id)
                                if (!other) return null
                                const relCol = relationshipColor(rel.type)
                                return (
                                    <Pressable
                                        key={rel.id}
                                        onPress={() => router.push(`/character/${other.id}` as any)}
                                        style={s.relRow}
                                    >
                                        <View style={[s.relAvatar, { backgroundColor: `${other.accentColor}20` }]}>
                                            <Text style={{ fontSize: 14 }}>{other.emoji}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={s.relTopRow}>
                                                <Text style={s.relName}>{other.name}</Text>
                                                <View style={[s.relBadge, { backgroundColor: `${relCol}18`, borderColor: `${relCol}40` }]}>
                                                    <Text style={[s.relBadgeText, { color: relCol }]}>{relationshipLabel(rel.type)}</Text>
                                                </View>
                                            </View>
                                            <Text style={s.relDesc} numberOfLines={1}>{rel.description}</Text>
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </Animated.View>
                    )}
                </ScrollView>
            )}

            {/* ── Memories tab ── */}
            {activeTab === 'memories' && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: insets.bottom + 24 }}
                >
                    <Animated.View entering={FadeInDown.duration(280)}>
                        <Text style={s.memoriesHeading}>{char.name}'s Memories</Text>
                        <Text style={s.memoriesSub}>Things {char.name.split(' ')[0]} remembers and carries.</Text>
                    </Animated.View>
                    {char.memories.map((mem, i) => {
                        const related = mem.relatedCharacterId ? getCharacterById(mem.relatedCharacterId) : null
                        const weight = mem.emotionalWeight
                        const weightColor = weight > 0.8 ? '#f472b6' : weight > 0.6 ? '#fb923c' : '#60a5fa'
                        return (
                            <Animated.View
                                key={mem.id}
                                entering={FadeInDown.delay(i * 70).duration(300)}
                                style={[s.memCard, { borderColor: `${char.accentColor}25` }]}
                            >
                                <View style={s.memTop}>
                                    <View style={[s.weightBar, { width: `${weight * 100}%`, backgroundColor: weightColor }]} />
                                    <Text style={s.memTime}>{mem.timeAgo}</Text>
                                </View>
                                <Text style={s.memText}>{mem.text}</Text>
                                {related && (
                                    <Pressable
                                        onPress={() => router.push(`/character/${related.id}` as any)}
                                        style={s.memRelated}
                                    >
                                        <Text style={{ fontSize: 12 }}>{related.emoji}</Text>
                                        <Text style={[s.memRelatedText, { color: related.accentColor }]}> about {related.name}</Text>
                                    </Pressable>
                                )}
                                <View style={s.memWeightRow}>
                                    <Text style={s.memWeightLabel}>Emotional weight</Text>
                                    <Text style={[s.memWeightVal, { color: weightColor }]}>{Math.round(weight * 100)}%</Text>
                                </View>
                            </Animated.View>
                        )
                    })}
                </ScrollView>
            )}
        </KeyboardAvoidingView>
    )
}

const s = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
    backBtn: { width: 36, height: 36, borderRadius: 99, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
    backText: { color: '#fff', fontSize: 18, marginTop: -1 },
    headerAvatar: { width: 42, height: 42, borderRadius: 99, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    headerEmoji: { fontSize: 20 },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 99, borderWidth: 2, borderColor: BG },
    headerMeta: { flex: 1 },
    headerName: { color: '#fff', fontSize: 17, fontWeight: '800' },
    headerOcc: { fontSize: 11, fontWeight: '600', marginTop: 1 },
    profileBtn: { width: 36, height: 36, borderRadius: 99, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
    profileBtnText: { fontSize: 16 },

    tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BORDER, marginHorizontal: 16 },
    tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabText: { color: 'rgba(255,255,255,0.42)', fontSize: 12.5, fontWeight: '700' },

    chatScroll: { flex: 1 },
    msgRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
    msgRowUser: { flexDirection: 'row-reverse' },
    msgAvatar: { width: 30, height: 30, borderRadius: 99, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    bubble: { maxWidth: SW * 0.72, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 3 },
    bubbleText: { color: '#fff', fontSize: 14, lineHeight: 21 },
    bubbleTime: { color: 'rgba(255,255,255,0.32)', fontSize: 10, alignSelf: 'flex-end' },
    typingText: { color: 'rgba(255,255,255,0.4)', fontSize: 16, letterSpacing: 2 },

    inputWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: BG },
    input: { flex: 1, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 14, maxHeight: 100, minHeight: 44 },
    sendBtn: { width: 44, height: 44, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    sendIcon: { fontSize: 20, fontWeight: '800' },

    profileHero: { backgroundColor: SURFACE, borderWidth: 1, borderRadius: 20, padding: 20, alignItems: 'center', gap: 8 },
    bigAvatar: { width: 80, height: 80, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    bigAvatarEmoji: { fontSize: 40 },
    profileName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    profileOcc: { fontSize: 13, fontWeight: '700' },
    profilePersonality: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' },
    traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
    traitBadge: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    traitText: { color: 'rgba(255,255,255,0.55)', fontSize: 10.5, fontWeight: '600' },

    backstoryCard: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, gap: 8 },
    cardLabel: { color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
    backstoryText: { color: 'rgba(255,255,255,0.65)', fontSize: 13.5, lineHeight: 21 },

    statsCard: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, gap: 10 },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, width: 72, fontWeight: '600' },
    statTrack: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99 },
    statFill: { height: 5, borderRadius: 99 },
    statVal: { color: 'rgba(255,255,255,0.45)', fontSize: 10.5, width: 24, textAlign: 'right' },

    relsCard: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, gap: 10 },
    relRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: SURFACE2, borderRadius: 12, padding: 10 },
    relAvatar: { width: 34, height: 34, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
    relTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    relName: { color: '#fff', fontSize: 13.5, fontWeight: '700' },
    relBadge: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
    relBadgeText: { fontSize: 9.5, fontWeight: '700' },
    relDesc: { color: 'rgba(255,255,255,0.38)', fontSize: 11.5, marginTop: 2 },

    memoriesHeading: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.4, marginBottom: 4 },
    memoriesSub: { color: 'rgba(255,255,255,0.38)', fontSize: 13 },
    memCard: { backgroundColor: SURFACE, borderWidth: 1, borderRadius: 16, padding: 14, gap: 8 },
    memTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    weightBar: { height: 3, borderRadius: 99, flex: 1 },
    memTime: { color: 'rgba(255,255,255,0.3)', fontSize: 10.5 },
    memText: { color: 'rgba(255,255,255,0.72)', fontSize: 13.5, lineHeight: 20, fontStyle: 'italic' },
    memRelated: { flexDirection: 'row', alignItems: 'center' },
    memRelatedText: { fontSize: 11.5, fontWeight: '700' },
    memWeightRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    memWeightLabel: { color: 'rgba(255,255,255,0.28)', fontSize: 10.5, fontWeight: '600' },
    memWeightVal: { fontSize: 11, fontWeight: '700' },
})
