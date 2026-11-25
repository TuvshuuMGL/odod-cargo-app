import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { House, Package, Bell, User } from 'lucide-react-native';
import { colors, shadow } from '../theme';
import { T } from './ui';
import { useApp } from '../store';

const TABS = [
  { name: 'home', href: '/(tabs)/home', label: 'Нүүр', icon: House },
  { name: 'parcels', href: '/(tabs)/parcels', label: 'Миний ачаа', icon: Package },
  { name: 'notifications', href: '/(tabs)/notifications', label: 'Мэдэгдэл', icon: Bell },
  { name: 'profile', href: '/(tabs)/profile', label: 'Профайл', icon: User },
];

export default function TabBar({ state }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <View style={[st.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={st.bar}>
        {TABS.map((t) => {
          const focused = state.routes[state.index]?.name === t.name;
          const Icon = t.icon;
          const color = focused ? colors.brand : colors.textTertiary;
          return (
            <Pressable
              key={t.name}
              accessibilityRole="tab"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: focused }}
              onPress={() => { if (!focused) router.navigate(t.href); }}
              style={[st.item, focused && { backgroundColor: colors.brandBg }]}
            >
              <View>
                <Icon size={22} color={color} />
                {t.name === 'notifications' && unread > 0 && (
                  <View style={st.dot}>
                    <T size={8} weight="700" color="#fff">{unread > 9 ? '9+' : unread}</T>
                  </View>
                )}
              </View>
              <T size={10} weight={focused ? '600' : '500'} color={color}>{t.label}</T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 4, backgroundColor: colors.bg },
  bar: {
    flexDirection: 'row', backgroundColor: '#FFFFFFB3', borderRadius: 32, padding: 6, gap: 4,
    borderWidth: 1, borderColor: colors.border, ...shadow.tab,
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 6, borderRadius: 16 },
  dot: {
    position: 'absolute', top: -4, right: -10, minWidth: 15, height: 15, borderRadius: 8,
    backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#fff',
  },
});
