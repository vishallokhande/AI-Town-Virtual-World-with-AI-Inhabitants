/**
 * AI Town — mock / placeholder data.
 * Replace with real Supabase hooks once backend is wired up.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type CharacterMood = 'happy' | 'curious' | 'anxious' | 'excited' | 'melancholy' | 'focused' | 'playful'
export type CharacterTrait = 'introvert' | 'extrovert' | 'creative' | 'logical' | 'empathetic' | 'adventurous' | 'cautious' | 'ambitious'
export type RelationshipType = 'friend' | 'rival' | 'crush' | 'mentor' | 'stranger' | 'best_friend' | 'enemy'
export type BuildingType = 'cafe' | 'library' | 'park' | 'market' | 'gym' | 'garden' | 'fountain' | 'house' | 'school' | 'art_studio' | 'music_hall' | 'observatory'
export type EventKind = 'interaction' | 'milestone' | 'story' | 'memory' | 'conflict' | 'celebration'

export type Memory = {
    id: string
    characterId: string
    text: string
    emotionalWeight: number
    timeAgo: string
    relatedCharacterId?: string
}

export type Character = {
    id: string
    name: string
    emoji: string
    age: number
    occupation: string
    personality: string
    traits: CharacterTrait[]
    mood: CharacterMood
    moodEmoji: string
    energy: number
    happiness: number
    sociability: number
    backstory: string
    currentActivity: string
    locationId: string
    accentColor: string
    memories: Memory[]
    daysSinceJoined: number
}

export type Building = {
    id: string
    type: BuildingType
    name: string
    emoji: string
    x: number
    y: number
    visitors: number
    description: string
    isOwned: boolean
}

export type TownEvent = {
    id: string
    kind: EventKind
    title: string
    detail: string
    characterIds: string[]
    locationId: string
    timeAgo: string
    isNew: boolean
    emoji: string
}

export type Relationship = {
    id: string
    characterAId: string
    characterBId: string
    type: RelationshipType
    strength: number
    description: string
    lastInteraction: string
}

export type ChatMessage = {
    id: string
    characterId: string
    role: 'user' | 'character'
    text: string
    timeAgo: string
}

export type TownStats = {
    totalCharacters: number
    totalBuildings: number
    eventsToday: number
    happinessAvg: number
    daysPassed: number
    townName: string
}

export type FaqItem = {
    id: string
    question: string
    answer: string
}

// ─── Town Stats ───────────────────────────────────────────────────────────────

export const townStats: TownStats = {
    totalCharacters: 8,
    totalBuildings: 12,
    eventsToday: 5,
    happinessAvg: 74,
    daysPassed: 23,
    townName: 'Willowvale',
}

// ─── Characters ───────────────────────────────────────────────────────────────

export const characters: Character[] = [
    {
        id: 'char-1', name: 'Luna', emoji: '🌙', age: 26, occupation: 'Astronomer',
        personality: 'Dreamy & Philosophical', traits: ['introvert', 'creative'],
        mood: 'curious', moodEmoji: '🔭', energy: 72, happiness: 85, sociability: 45,
        backstory: 'Luna grew up stargazing from her grandmother\'s rooftop. She moved to Willowvale chasing a rare comet and never left. She keeps meticulous journals of everything she observes.',
        currentActivity: 'Stargazing at the Observatory', locationId: 'build-observatory',
        accentColor: '#818CF8', daysSinceJoined: 23,
        memories: [
            { id: 'm1a', characterId: 'char-1', text: 'Saw a meteor shower with Marco last Tuesday. He held my telescope steady and pretended not to be impressed.', emotionalWeight: 0.9, timeAgo: '5d ago', relatedCharacterId: 'char-2' },
            { id: 'm1b', characterId: 'char-1', text: 'Found a book at the Library with star maps from 1887. Borrowed it indefinitely.', emotionalWeight: 0.7, timeAgo: '8d ago' },
            { id: 'm1c', characterId: 'char-1', text: 'Skye challenged me to name all constellations in under a minute. I won, but barely.', emotionalWeight: 0.6, timeAgo: '12d ago', relatedCharacterId: 'char-3' },
        ],
    },
    {
        id: 'char-2', name: 'Marco', emoji: '☕', age: 31, occupation: 'Café Owner',
        personality: 'Warm & Protective', traits: ['extrovert', 'empathetic', 'ambitious'],
        mood: 'happy', moodEmoji: '☕', energy: 88, happiness: 91, sociability: 92,
        backstory: 'Marco inherited the town café from his uncle and turned it into the social hub of Willowvale. He knows everyone\'s usual order and uses it to understand what people are going through.',
        currentActivity: 'Opening the café for morning rush', locationId: 'build-cafe',
        accentColor: '#F97316', daysSinceJoined: 23,
        memories: [
            { id: 'm2a', characterId: 'char-2', text: 'Luna came in looking distracted. Made her a lavender latte without her asking. She smiled for the first time that day.', emotionalWeight: 0.85, timeAgo: '3d ago', relatedCharacterId: 'char-1' },
            { id: 'm2b', characterId: 'char-2', text: 'River tried to convince me to add "artisanal ice" to the menu. I said no. They asked three more times.', emotionalWeight: 0.5, timeAgo: '7d ago', relatedCharacterId: 'char-4' },
            { id: 'm2c', characterId: 'char-2', text: 'Hit a new record — 47 customers before noon. Willowvale is growing faster than I expected.', emotionalWeight: 0.7, timeAgo: '10d ago' },
        ],
    },
    {
        id: 'char-3', name: 'Skye', emoji: '⚡', age: 22, occupation: 'Tech Inventor',
        personality: 'Restless & Brilliant', traits: ['introvert', 'logical', 'adventurous'],
        mood: 'excited', moodEmoji: '⚡', energy: 95, happiness: 68, sociability: 38,
        backstory: 'Skye dropped out of a top university, convinced they could build something more important in a small town. Their garage is full of half-finished inventions.',
        currentActivity: 'Tinkering in the Art Studio basement', locationId: 'build-art-studio',
        accentColor: '#06B6D4', daysSinceJoined: 21,
        memories: [
            { id: 'm3a', characterId: 'char-3', text: 'Built an auto-watering system for the Garden. It overwatered everything the first night. The flowers survived. Just.', emotionalWeight: 0.6, timeAgo: '4d ago' },
            { id: 'm3b', characterId: 'char-3', text: 'Had an argument with Vera about AI ethics that lasted three hours. Neither of us convinced the other.', emotionalWeight: 0.8, timeAgo: '9d ago', relatedCharacterId: 'char-5' },
            { id: 'm3c', characterId: 'char-3', text: 'Luna said my telescope calibration was "mathematically poetic." It\'s the nicest thing anyone\'s ever said to me.', emotionalWeight: 0.95, timeAgo: '12d ago', relatedCharacterId: 'char-1' },
        ],
    },
    {
        id: 'char-4', name: 'River', emoji: '🌿', age: 29, occupation: 'Herbalist',
        personality: 'Calm & Mysterious', traits: ['introvert', 'empathetic', 'cautious'],
        mood: 'focused', moodEmoji: '🌿', energy: 60, happiness: 78, sociability: 55,
        backstory: 'River arrived carrying only a seed pouch and a worn field guide. They rarely speak about their past but tend every plant in town with extraordinary care.',
        currentActivity: 'Tending the Community Garden', locationId: 'build-garden',
        accentColor: '#10B981', daysSinceJoined: 18,
        memories: [
            { id: 'm4a', characterId: 'char-4', text: 'Found a rare night-blooming jasmine near the fountain. Transplanted it at 2am so no one would disturb it.', emotionalWeight: 0.8, timeAgo: '2d ago' },
            { id: 'm4b', characterId: 'char-4', text: 'Marco asked about the meaning of rosemary. Told him it\'s for remembrance. He went quiet for a long time.', emotionalWeight: 0.7, timeAgo: '6d ago', relatedCharacterId: 'char-2' },
            { id: 'm4c', characterId: 'char-4', text: 'Skye\'s watering contraption destroyed six weeks of basil growth. I said nothing. I felt everything.', emotionalWeight: 0.65, timeAgo: '4d ago', relatedCharacterId: 'char-3' },
        ],
    },
    {
        id: 'char-5', name: 'Vera', emoji: '📚', age: 35, occupation: 'Librarian',
        personality: 'Precise & Perceptive', traits: ['introvert', 'logical', 'empathetic'],
        mood: 'focused', moodEmoji: '📖', energy: 65, happiness: 82, sociability: 62,
        backstory: 'Vera is the keeper of Willowvale\'s library — and, unofficially, its memory. She reads everything written in the town and quietly connects dots others miss.',
        currentActivity: 'Cataloguing rare manuscripts', locationId: 'build-library',
        accentColor: '#A78BFA', daysSinceJoined: 23,
        memories: [
            { id: 'm5a', characterId: 'char-5', text: 'Noticed Luna has been checking out books on grief lately. Made a note. Said nothing.', emotionalWeight: 0.75, timeAgo: '5d ago', relatedCharacterId: 'char-1' },
            { id: 'm5b', characterId: 'char-5', text: 'The argument with Skye about AI ethics — they were right about one thing. I need to think about it more.', emotionalWeight: 0.85, timeAgo: '9d ago', relatedCharacterId: 'char-3' },
            { id: 'm5c', characterId: 'char-5', text: 'Found a love letter tucked inside a returned novel. No name, no date. Filed it under "mystery."', emotionalWeight: 0.9, timeAgo: '14d ago' },
        ],
    },
    {
        id: 'char-6', name: 'Juno', emoji: '🎵', age: 24, occupation: 'Musician',
        personality: 'Passionate & Impulsive', traits: ['extrovert', 'creative', 'adventurous'],
        mood: 'playful', moodEmoji: '🎶', energy: 82, happiness: 76, sociability: 88,
        backstory: 'Juno busked across twelve cities before settling in Willowvale, drawn by the acoustic quality of the town square. They play every evening from 6pm — rain or shine.',
        currentActivity: 'Rehearsing at Music Hall', locationId: 'build-music-hall',
        accentColor: '#EC4899', daysSinceJoined: 15,
        memories: [
            { id: 'm6a', characterId: 'char-6', text: 'Marco brought me a coffee mid-performance without being asked. Dedicated the next song to him. He turned crimson.', emotionalWeight: 0.9, timeAgo: '3d ago', relatedCharacterId: 'char-2' },
            { id: 'm6b', characterId: 'char-6', text: 'River sat and listened to my whole set. They never clap, but they always stay till the end.', emotionalWeight: 0.85, timeAgo: '7d ago', relatedCharacterId: 'char-4' },
            { id: 'm6c', characterId: 'char-6', text: 'Lost my best pick in the Park. Found a coin from 1934 instead.', emotionalWeight: 0.5, timeAgo: '11d ago' },
        ],
    },
    {
        id: 'char-7', name: 'Ozzy', emoji: '🏋️', age: 28, occupation: 'Coach & Trainer',
        personality: 'Motivating & Loud', traits: ['extrovert', 'ambitious', 'adventurous'],
        mood: 'excited', moodEmoji: '💪', energy: 98, happiness: 88, sociability: 95,
        backstory: 'Ozzy was a semi-professional athlete before a knee injury. He channelled everything into coaching and now runs the Willowvale Gym with infectious energy.',
        currentActivity: 'Morning bootcamp at the Gym', locationId: 'build-gym',
        accentColor: '#EF4444', daysSinceJoined: 20,
        memories: [
            { id: 'm7a', characterId: 'char-7', text: 'Convinced Vera to try the 6am workout. She lasted 12 minutes but said she\'d be back. She came back.', emotionalWeight: 0.8, timeAgo: '6d ago', relatedCharacterId: 'char-5' },
            { id: 'm7b', characterId: 'char-7', text: 'Luna asked if the universe ever felt too big. Told her to do ten push-ups. She laughed.', emotionalWeight: 0.7, timeAgo: '8d ago', relatedCharacterId: 'char-1' },
            { id: 'm7c', characterId: 'char-7', text: 'Set a new personal bench record. Nobody was around. Celebrated alone with Marco\'s muffin.', emotionalWeight: 0.6, timeAgo: '15d ago' },
        ],
    },
    {
        id: 'char-8', name: 'Nami', emoji: '🎨', age: 27, occupation: 'Street Artist',
        personality: 'Vibrant & Observant', traits: ['extrovert', 'creative', 'empathetic'],
        mood: 'happy', moodEmoji: '🎨', energy: 79, happiness: 90, sociability: 80,
        backstory: 'Nami paints murals capturing moments in town history — or moments she imagines could happen. Her latest works feature silhouettes of residents who don\'t know they\'ve been painted.',
        currentActivity: 'Painting near the Fountain', locationId: 'build-fountain',
        accentColor: '#FBBF24', daysSinceJoined: 17,
        memories: [
            { id: 'm8a', characterId: 'char-8', text: 'Painted a mural of Juno playing guitar at sunset. Juno saw it and cried. Then played a song for it.', emotionalWeight: 0.95, timeAgo: '4d ago', relatedCharacterId: 'char-6' },
            { id: 'm8b', characterId: 'char-8', text: 'River showed me how to mix natural pigments from plants. The colors feel alive.', emotionalWeight: 0.88, timeAgo: '8d ago', relatedCharacterId: 'char-4' },
            { id: 'm8c', characterId: 'char-8', text: 'Skye asked me to paint a diagram of their invention. I painted something abstract. They loved it anyway.', emotionalWeight: 0.72, timeAgo: '13d ago', relatedCharacterId: 'char-3' },
        ],
    },
]

// ─── Buildings ────────────────────────────────────────────────────────────────

export const buildings: Building[] = [
    { id: 'build-cafe',        type: 'cafe',        name: "Marco's Café",      emoji: '☕', x: 1, y: 0, visitors: 5, description: 'The heartbeat of Willowvale. Marco opens at 6am and closes when the last person leaves.', isOwned: true },
    { id: 'build-library',     type: 'library',     name: 'The Archive',       emoji: '📚', x: 3, y: 0, visitors: 2, description: "Vera's domain. Rows of books, silence, and secrets filed under Dewey Decimal.", isOwned: true },
    { id: 'build-park',        type: 'park',        name: 'Willowvale Park',   emoji: '🌳', x: 0, y: 2, visitors: 3, description: 'A green common where residents meet, argue, nap, and occasionally find old coins.', isOwned: true },
    { id: 'build-market',      type: 'market',      name: 'Town Market',       emoji: '🛒', x: 2, y: 1, visitors: 7, description: "Fresh produce every morning. River's herb stall is always first to sell out.", isOwned: true },
    { id: 'build-gym',         type: 'gym',         name: "Ozzy's Gym",        emoji: '🏋️', x: 4, y: 1, visitors: 4, description: "Ozzy's bootcamp starts at 6am. The screaming is part of the experience.", isOwned: true },
    { id: 'build-garden',      type: 'garden',      name: 'Community Garden',  emoji: '🌿', x: 1, y: 3, visitors: 2, description: "River's carefully tended botanical space. Touch nothing without permission.", isOwned: true },
    { id: 'build-fountain',    type: 'fountain',    name: 'Central Fountain',  emoji: '⛲', x: 3, y: 2, visitors: 3, description: 'The geographic and spiritual center of Willowvale. Coins on the bottom date to founding day.', isOwned: true },
    { id: 'build-house',       type: 'house',       name: 'Town Hall',         emoji: '🏛️', x: 2, y: 3, visitors: 1, description: 'Weekly town meetings. Mostly debating the fountain coin policy.', isOwned: true },
    { id: 'build-art-studio',  type: 'art_studio',  name: "Nami's Studio",     emoji: '🎨', x: 0, y: 1, visitors: 2, description: 'Half art studio, half underground lab. Smells of paint and soldering flux.', isOwned: true },
    { id: 'build-music-hall',  type: 'music_hall',  name: 'Music Hall',        emoji: '🎵', x: 4, y: 3, visitors: 3, description: 'Juno performs every evening. The acoustics are inexplicably perfect.', isOwned: true },
    { id: 'build-observatory', type: 'observatory', name: 'The Observatory',   emoji: '🔭', x: 4, y: 0, visitors: 1, description: "Luna's personal outpost. Visitors welcome as long as they remain silent.", isOwned: true },
    { id: 'build-school',      type: 'school',      name: 'Willowvale School', emoji: '🏫', x: 0, y: 4, visitors: 0, description: 'Newest building — still being constructed by the whole town together.', isOwned: false },
]

// ─── Town Events ──────────────────────────────────────────────────────────────

export const townEvents: TownEvent[] = [
    {
        id: 'event-1', kind: 'interaction', emoji: '☕',
        title: 'An unexpected conversation',
        detail: 'Luna and Marco shared a quiet moment at the café before sunrise. Luna mentioned her grandmother for the first time. Marco listened without speaking — very unlike him.',
        characterIds: ['char-1', 'char-2'], locationId: 'build-cafe', timeAgo: '2h ago', isNew: true,
    },
    {
        id: 'event-2', kind: 'milestone', emoji: '⚡',
        title: "Skye's invention finally works",
        detail: "After 17 failed attempts, Skye's solar-powered irrigation prototype successfully watered the Garden without destroying it. River watched from behind a hedge in silence.",
        characterIds: ['char-3', 'char-4'], locationId: 'build-garden', timeAgo: '4h ago', isNew: true,
    },
    {
        id: 'event-3', kind: 'story', emoji: '📜',
        title: 'The unfinished letter',
        detail: 'Vera found another anonymous letter tucked in a returned book — addressed to "whoever needs to hear this." She\'s compiling them. Three so far, all the same handwriting.',
        characterIds: ['char-5'], locationId: 'build-library', timeAgo: '6h ago', isNew: true,
    },
    {
        id: 'event-4', kind: 'conflict', emoji: '🎨',
        title: 'The mural dispute',
        detail: 'Ozzy discovered Nami painted him into the town mural lifting something comically small. He went to complain and ended up commissioning a bigger, more accurate portrait.',
        characterIds: ['char-7', 'char-8'], locationId: 'build-fountain', timeAgo: '9h ago', isNew: false,
    },
    {
        id: 'event-5', kind: 'celebration', emoji: '🎵',
        title: "Juno's 100th evening set",
        detail: "Without announcement, Juno played their 100th consecutive set. By song three, half the town had wandered in. By song eight, everyone was crying — including Ozzy, who denied it.",
        characterIds: ['char-6', 'char-1', 'char-2', 'char-4', 'char-5', 'char-7', 'char-8'],
        locationId: 'build-music-hall', timeAgo: '1d ago', isNew: false,
    },
    {
        id: 'event-6', kind: 'memory', emoji: '🌿',
        title: 'River remembers something',
        detail: 'River stood at the fountain for forty minutes without moving. When Nami asked, River said: "I used to live somewhere with a fountain like this." Then walked back to the garden.',
        characterIds: ['char-4', 'char-8'], locationId: 'build-fountain', timeAgo: '2d ago', isNew: false,
    },
    {
        id: 'event-7', kind: 'interaction', emoji: '📚',
        title: 'Late night at the Library',
        detail: "Skye and Vera were both in the library past midnight. They didn't speak for two hours, then argued for three.",
        characterIds: ['char-3', 'char-5'], locationId: 'build-library', timeAgo: '3d ago', isNew: false,
    },
]

// ─── Relationships ────────────────────────────────────────────────────────────

export const relationships: Relationship[] = [
    { id: 'rel-1',  characterAId: 'char-1', characterBId: 'char-2', type: 'crush',       strength: 78, description: "Neither has said anything. Everyone else knows.", lastInteraction: '2h ago' },
    { id: 'rel-2',  characterAId: 'char-1', characterBId: 'char-3', type: 'friend',      strength: 62, description: 'Bonded over a shared love of impossible precision.', lastInteraction: '12d ago' },
    { id: 'rel-3',  characterAId: 'char-1', characterBId: 'char-5', type: 'mentor',      strength: 71, description: "Vera lends Luna books she didn't know she needed.", lastInteraction: '5d ago' },
    { id: 'rel-4',  characterAId: 'char-2', characterBId: 'char-4', type: 'friend',      strength: 58, description: 'Mutual respect — both give without asking.', lastInteraction: '6d ago' },
    { id: 'rel-5',  characterAId: 'char-2', characterBId: 'char-6', type: 'best_friend', strength: 91, description: 'Juno dedicates songs; Marco keeps her usual order warm.', lastInteraction: '3d ago' },
    { id: 'rel-6',  characterAId: 'char-3', characterBId: 'char-5', type: 'rival',       strength: 65, description: 'Different worldviews, mutual fascination.', lastInteraction: '9d ago' },
    { id: 'rel-7',  characterAId: 'char-3', characterBId: 'char-8', type: 'friend',      strength: 55, description: 'Found common ground in abstract thinking.', lastInteraction: '13d ago' },
    { id: 'rel-8',  characterAId: 'char-4', characterBId: 'char-8', type: 'mentor',      strength: 83, description: 'River teaches plant pigments; Nami gives River color.', lastInteraction: '8d ago' },
    { id: 'rel-9',  characterAId: 'char-5', characterBId: 'char-7', type: 'friend',      strength: 48, description: "Unlikely pair. Vera admires Ozzy's directness.", lastInteraction: '6d ago' },
    { id: 'rel-10', characterAId: 'char-6', characterBId: 'char-8', type: 'friend',      strength: 86, description: 'Performance and art — they elevate each other.', lastInteraction: '4d ago' },
    { id: 'rel-11', characterAId: 'char-6', characterBId: 'char-4', type: 'friend',      strength: 69, description: "River always attends Juno's sets. Never explains why.", lastInteraction: '7d ago' },
    { id: 'rel-12', characterAId: 'char-7', characterBId: 'char-1', type: 'friend',      strength: 42, description: 'Ozzy thinks Luna needs more sunlight. Luna disagrees.', lastInteraction: '8d ago' },
]

// ─── Chat seed data ───────────────────────────────────────────────────────────

export const chatHistories: Record<string, ChatMessage[]> = {
    'char-1': [
        { id: 'c1-1', characterId: 'char-1', role: 'character', text: "Oh — a visitor. I don't usually get visitors at this hour. The comet is at perihelion in about 40 minutes. Would you like to wait?", timeAgo: '5m ago' },
        { id: 'c1-2', characterId: 'char-1', role: 'user', text: "I'd love to. What are you writing?", timeAgo: '4m ago' },
        { id: 'c1-3', characterId: 'char-1', role: 'character', text: "Observations. Everything I see gets a notation — not just coordinates, but what I was thinking when I saw it. This morning I wrote: 'The café smelled of cinnamon today. Marco must be worried about something.' He always bakes when he's restless.", timeAgo: '4m ago' },
    ],
    'char-2': [
        { id: 'c2-1', characterId: 'char-2', role: 'character', text: "Hey! Good timing — I just made a fresh batch of cardamom rolls. What can I get you? And don't say 'just water.' No one who comes here at this hour wants just water.", timeAgo: '10m ago' },
        { id: 'c2-2', characterId: 'char-2', role: 'user', text: "Tell me something about the town.", timeAgo: '9m ago' },
        { id: 'c2-3', characterId: 'char-2', role: 'character', text: "Willowvale? The thing nobody says out loud: everyone here ran away from something. Me included. But somewhere between the second and third week, you stop running and start staying. I don't know what does it. Maybe the fountain. Maybe the music.", timeAgo: '8m ago' },
    ],
    'char-3': [
        { id: 'c3-1', characterId: 'char-3', role: 'character', text: "Oh great, someone else wandering in mid-calibration. Do you at least know what a torque sensor is? Because I need to explain this and I've already frightened away two people today.", timeAgo: '15m ago' },
        { id: 'c3-2', characterId: 'char-3', role: 'user', text: "I can try to follow along. What are you building?", timeAgo: '14m ago' },
        { id: 'c3-3', characterId: 'char-3', role: 'character', text: "Something that should be impossible given my budget. A micro-pressure AI that predicts rain 90 minutes ahead based on soil moisture. Vera says it's 'admirable.' River said 'please don't touch the basil again.'", timeAgo: '14m ago' },
    ],
}

// ─── Support FAQ ──────────────────────────────────────────────────────────────

export const supportFaq: FaqItem[] = [
    { id: 'faq-1', question: 'How do AI characters develop over time?', answer: 'Characters gain memories from interactions, events, and conversations. Each memory has an emotional weight that shapes future behavior.' },
    { id: 'faq-2', question: 'How does the relationship graph work?', answer: 'Every interaction updates relationship strength. Frequent positive contact builds friendship; conflict or neglect shifts dynamics.' },
    { id: 'faq-3', question: 'Can I place buildings anywhere on the map?', answer: 'Yes — tap any empty tile to place a building. Each type attracts different characters and unlocks new event types.' },
    { id: 'faq-4', question: 'Can I chat with any character?', answer: 'Yes. Tap any character to open their detail screen and start a conversation. Their responses are shaped by their personality and memories.' },
    { id: 'faq-5', question: 'What are town events?', answer: 'Events are generated automatically when characters interact, hit milestones, or experience conflicts. They form a living story of your town.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCharacterById(id?: string | string[]): Character | null {
    if (!id || Array.isArray(id)) return null
    return characters.find((c) => c.id === id) ?? null
}

export function getCharactersAtLocation(locationId: string): Character[] {
    return characters.filter((c) => c.locationId === locationId)
}

export function getRelationshipsForCharacter(characterId: string): Relationship[] {
    return relationships.filter((r) => r.characterAId === characterId || r.characterBId === characterId)
}

export function getRelatedCharacter(rel: Relationship, selfId: string): Character | null {
    const otherId = rel.characterAId === selfId ? rel.characterBId : rel.characterAId
    return getCharacterById(otherId)
}

export function getChatHistory(characterId: string): ChatMessage[] {
    return chatHistories[characterId] ?? []
}

export function moodColor(mood: CharacterMood): string {
    const map: Record<CharacterMood, string> = {
        happy: '#4ade80', curious: '#60a5fa', anxious: '#f87171',
        excited: '#fb923c', melancholy: '#a78bfa', focused: '#38bdf8', playful: '#f472b6',
    }
    return map[mood] ?? '#ffffff'
}

export function relationshipColor(type: RelationshipType): string {
    const map: Record<RelationshipType, string> = {
        friend: '#60a5fa', best_friend: '#4ade80', crush: '#f472b6',
        mentor: '#a78bfa', rival: '#fb923c', enemy: '#f87171', stranger: '#6b7280',
    }
    return map[type] ?? '#6b7280'
}

export function relationshipLabel(type: RelationshipType): string {
    const map: Record<RelationshipType, string> = {
        friend: 'Friend', best_friend: 'Best Friends', crush: 'Crush',
        mentor: 'Mentor', rival: 'Rival', enemy: 'Enemy', stranger: 'Stranger',
    }
    return map[type] ?? type
}

