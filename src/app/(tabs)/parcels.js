import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search, Plus, PackageOpen, Inbox, Info } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, Btn, EmptyState } from '../../../src/components/ui';
import ParcelCard from '../../../src/components/ParcelCard';
import { useApp } from '../../store';
import { parcelGroups } from '../../workflow';

const TABS = [
  { key: 'waiting', label: 'Бүртгэл' },
  { key: 'active', label: 'Замд буй' },
  { key: 'ready', label: 'Бэлэн' },
  { key: 'history', label: 'Түүх' },
];

export default function Parcels() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { parcels, registrations } = useApp();
  const [query, setQuery] = useState('');
  const tab = TABS.some((item) => item.key === params.tab) ? params.tab : 'active';
  const groups = parcelGroups(parcels, registrations);
  const q = query.trim().toLowerCase();
  const items = groups[tab].filter((item) =>
    item.tracking.toLowerCase().includes(q) || item.code?.toLowerCase().includes(q)
  );
  const isRegistration = tab === 'waiting';

  return (
    <Screen>
      <View style={{ gap: 16 }}>
        <View style={st.header}>
          <T size={22} weight="700">Миний ачаа</T>
          <Pressable style={st.add} onPress={() => router.push('/register-tracking')}>
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={st.search}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={st.searchField}
            placeholder="Тээврийн эсвэл ачааны дугаараар хайх"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Ачаа хайх"
            autoCorrect={false}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="characters"
          />
        </View>

        <View style={st.tabs}>
          {TABS.map((t) => {
            const sel = tab === t.key;
            return (
              <Pressable key={t.key} onPress={() => router.setParams({ tab: t.key })} accessibilityRole="tab" accessibilityState={{ selected: sel }} style={[st.tab, sel && st.tabSel]}>
                <T size={13} weight={sel ? '600' : '500'} color={sel ? '#fff' : colors.textSecondary}>
                  {t.label} · {groups[t.key].length}
                </T>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: 12 }}>
          {items.length === 0 && (
            <EmptyState
              icon={q ? <Search size={40} color={colors.textTertiary} /> : tab === 'waiting' ? <Inbox size={40} color={colors.textTertiary} /> : <PackageOpen size={40} color={colors.textTertiary} />}
              title={q ? 'Ачаа олдсонгүй' : tab === 'waiting' ? 'Хүлээж буй бүртгэл алга' : tab === 'active' ? 'Замд яваа ачаа алга' : tab === 'ready' ? 'Авахад бэлэн ачаа алга' : 'Хүлээн авсан ачаа алга'}
              sub={q
                ? 'Хайлтын утгаа шалгаад дахин оролдоно уу.'
                : tab === 'waiting' ? 'Дэлгүүрээс авсан тээврийн дугаараа бүртгүүлээрэй.' : undefined}
              action={!q && isRegistration ? (
                <Btn title="Тээврийн дугаар бүртгүүлэх" onPress={() => router.push('/register-tracking')} style={{ alignSelf: 'stretch', marginTop: 8 }} />
              ) : null}
            />
          )}

          {items.map((item) =>
            isRegistration ? (
              <Pressable key={item.id} onPress={() => router.push({ pathname: '/registration/[tracking]', params: { tracking: item.tracking } })}>
                <View style={st.regCard}>
                  <View style={st.regRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <View style={st.regIcon}><Inbox size={18} color={colors.info} /></View>
                      <View style={{ flex: 1 }}>
                        <T size={14} weight="600">{item.tracking}</T>
                        <T size={11} color={colors.textTertiary} style={{ marginTop: 1 }}>
                          {item.carrier} · {item.createdAt}
                        </T>
                      </View>
                    </View>
                    <View style={st.waitingBadge}>
                      <T size={11} weight="600" color={colors.info}>Эрээнд ирэхийг хүлээж байна</T>
                    </View>
                  </View>
                  {!!item.orderRef && (
                    <T size={11} color={colors.textTertiary}>Захиалга: {item.orderRef}</T>
                  )}
                </View>
              </Pressable>
            ) : (
              <ParcelCard key={item.id} parcel={item} />
            )
          )}
        </View>

        <View style={st.footNote}>
          <Info size={14} color={colors.textTertiary} />
          <T size={11} color={colors.textTertiary} style={{ flex: 1, lineHeight: 16 }}>
            Агуулах ачааг хүлээн авч, тээврийн дугаартай нь тулгасны дараа энд харагдана.
          </T>
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  add: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
  },
  searchField: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  tabs: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, padding: 4, gap: 2,
  },
  tab: { flex: 1, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  tabSel: { backgroundColor: colors.brand },
  regCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8,
  },
  regRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  regIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  waitingBadge: { backgroundColor: colors.infoBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  footNote: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 4 },
});
