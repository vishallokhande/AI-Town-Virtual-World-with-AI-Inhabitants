const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const config = getSentryExpoConfig(__dirname)

// ── Windows watcher fix ────────────────────────────────────────────────────────
// On Windows the native watchman / FSEvents watcher times out during init.
// Disabling the health-check keeps Metro from throwing "Failed to start
// watch mode" and lets the Node.js fallback watcher take over silently.
config.watcher = {
  ...config.watcher,
  watchAll: false,
  healthCheck: {
    enabled: false,
  },
}

module.exports = config
