/**
 * 🎨 BRAND — central theme constants.
 *
 * Change ACCENT (and the matching tailwind.config.js color) to rebrand the
 * entire app in one edit. All components import from here instead of
 * hardcoding color strings.
 *
 * Steps to rebrand:
 *   1. Change ACCENT below to your hex color
 *   2. Change the `accent` key in tailwind.config.js to the same hex
 *   3. Optionally change BG for a different dark shade
 */

// ── Primary brand color ───────────────────────────────────────────────────────
// 🎨 AI Town warm amber — evokes lantern light, harvest festival, cozy village
export const ACCENT = '#F59E0B'           // warm amber

// Derived from ACCENT — adjust opacity as needed
export const ACCENT_DIM = 'rgba(245,158,11,0.12)'
export const ACCENT_BORDER = 'rgba(245,158,11,0.30)'
export const ACCENT_GLOW = 'rgba(245,158,11,0.22)'
// Text color on dark background using accent tone
export const ACCENT_LIGHT = '#FCD34D'

// ── Backgrounds ───────────────────────────────────────────────────────────────
export const BG = '#0a0a14'        // deep night sky — dark navy-black
export const SURFACE = '#13131f'        // cards, inputs
export const SURFACE2 = '#1c1c2e'        // elevated surface (sheet panels, etc.)
export const SURFACE3 = '#252538'        // even more elevated

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY = '#ffffff'
export const TEXT_SECONDARY = 'rgba(255,255,255,0.55)'
export const TEXT_TERTIARY = 'rgba(255,255,255,0.28)'
export const TEXT_DISABLED = 'rgba(255,255,255,0.18)'

// ── Borders ───────────────────────────────────────────────────────────────────
export const BORDER = 'rgba(255,255,255,0.09)'
export const BORDER_ACTIVE = 'rgba(255,255,255,0.18)'

// ── Semantic ──────────────────────────────────────────────────────────────────
export const ERROR = '#f87171'
export const ERROR_DIM = 'rgba(248,113,113,0.10)'
export const WARNING = '#fbbf24'
export const SUCCESS = '#4ade80'

// ── Tab bar ───────────────────────────────────────────────────────────────────
export const TAB_ACTIVE = ACCENT
export const TAB_INACTIVE = 'rgba(255,255,255,0.40)'
export const TAB_HEIGHT = 68
