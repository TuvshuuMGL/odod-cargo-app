import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../store';
import { BookOpen, ScanSearch, Scale, CircleHelp } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, NavBar, Bubble, Btn } from '../../../src/components/ui';
import { HELP_ARTICLES, ODOD_WEBSITE } from '../../../src/data';

const ICONS = { bookOpen: BookOpen, scanSearch: ScanSearch, scale: Scale };

export default function Help() {
  const { key } = useLocalSearchParams();
  const router = useRouter();
  const { authed, showToast } = useApp();
  const back = () => router.canGoBack() ? router.back() : router.replace(authed ? '/(tabs)/home' : '/login');
  const article = typeof key === 'string' && Object.hasOwn(HELP_ARTICLES, key) ? HELP_ARTICLES[key] : null;

  if (!article) {
    return (
      <Screen>
        <NavBar title="Тусламж" onBack={back} />
        <View style={st.center}>
          <CircleHelp size={40} color={colors.textTertiary} />
          <T size={14} color={colors.textSecondary}>Нийтлэл олдсонгүй.</T>
        </View>
      </Screen>
    );
  }

  const Icon = ICONS[article.icon] || BookOpen;

  return (
    <Screen>
      <NavBar title="Тусламж" onBack={back} />
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Bubble size={44} bg={colors.brandBg} icon={<Icon size={22} color={colors.brand} />} />
          <T size={17} weight="700" style={{ flex: 1, lineHeight: 24 }}>{article.title}</T>
        </View>
        {article.body.map((p, i) => (
          <View key={i} style={st.paragraph}>
            <T size={14} color={colors.textSecondary} style={{ lineHeight: 23 }}>{p}</T>
          </View>
        ))}
        <Btn title="Одод Каргогийн сайт нээх" kind="secondary" onPress={() => Linking.openURL(ODOD_WEBSITE).catch(() => showToast('Сайтыг нээж чадсангүй'))} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', gap: 10, paddingVertical: 60 },
  paragraph: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 16 },
});
