/**
 * Tabs layout — add new tabs by:
 *   1. Create app/(tabs)/<name>.tsx
 *   2. Add a tabBarIcon and tabBarLabel in the <Tabs.Screen> below.
 *
 * The custom TabBar renders itself — its tab list is driven entirely by
 * the screens registered here.
 */
import { Tabs } from 'expo-router'
import { Map, Users, Newspaper, CircleUser } from 'lucide-react-native'
import TabBar, { TAB_BAR_HEIGHT } from '@/components/TabBar'
import { BG } from '@/lib/theme'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: BG },
        tabBarStyle: { height: TAB_BAR_HEIGHT },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Town',
          tabBarIcon: ({ color, size }) => (
            <Map size={size} color={color} strokeWidth={1.6} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Citizens',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} strokeWidth={1.6} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Newspaper size={size} color={color} strokeWidth={1.6} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <CircleUser size={size} color={color} strokeWidth={1.6} />
          ),
        }}
      />
    </Tabs>
  )
}
