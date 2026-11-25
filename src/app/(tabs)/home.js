import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ScanBarcode, ChevronRight, Inbox, Package, Bell } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, Bubble } from '../../../src/components/ui';
import ParcelCard from '../../../src/components/ParcelCard';
import { useApp } from '../../../src/store';
import { parcelGroups } from '../../workflow';

export default function Home() {
  const router = useRouter();
  const { user, branch, service, parcels, registrations, notifications } = useApp();
  const { ready, active, waiting } = parcelGroups(parcels, registrations);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Screen>
      <View style={{ gap: 20 }}>
        <View style={st.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={st.avatar}><T size={17} weight="700" color={colors.brand}>{user.name[0]}</T></View>
            <View>
              <T size={12} color={colors.textSecondary}>Сайн байна уу,</T>
              <T size={16} weight="700">{user.name} · {user.code}</T>
            </View>
          </View>
          <Pressable style={st.bell} onPress={() => router.push('/(tabs)/notifications')}>
            <Bell size={20} color={colors.textPrimary} />
            {unread > 0 && <View style={st.bellDot} />}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/address')} style={st.hero}>
          <View style={st.heroTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#FFFFFFCC" />
              <T size={13} weight="600" color="#FFFFFFCC">Эрээн дэх хаяг</T>
            </View>
            <View style={st.heroChip}>
              <T size={11} weight="500" color="#fff" cjk>{service.name} · {branch.name}</T>
            </View>
          </View>
          <T size={15} weight="500" color="#fff">Салбар, тээврийн төрлөөр хаягаа харах</T>
        </Pressable>

        <Pressable style={st.cta} onPress={() => router.push('/register-tracking')}>
          <Bubble size={44} bg={colors.warningBg} icon={<ScanBarcode size={22} color={colors.warning} />} />
          <View style={{ flex: 1, gap: 2 }}>
            <T size={15} weight="600">Тээврийн дугаар бүртгүүлэх</T>
            <T size={12} color={colors.textSecondary} style={{ lineHeight: 17 }}>
              Дэлгүүрээс авсан тээврийн дугаараа оруулна уу.
            </T>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { icon: <Inbox size={19} color={colors.info} />, bg: colors.infoBg, n: waiting.length, label: 'Хүлээж буй бүртгэл', tab: 'waiting' },
            { icon: <Package size={19} color={colors.violet} />, bg: colors.violetBg, n: active.length, label: 'Замд буй ачаа', tab: 'active' },
          ].map((s2) => (
            <Pressable
              key={s2.label}
              style={st.stat}
              onPress={() => router.navigate({ pathname: '/(tabs)/parcels', params: { tab: s2.tab } })}
            >
              <Bubble size={38} bg={s2.bg} icon={s2.icon} />
              <View style={{ flex: 1 }}>
                <T size={18} weight="700">{s2.n}</T>
                <T size={11} color={colors.textSecondary} numberOfLines={2}>{s2.label}</T>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <View style={st.secHead}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T size={17} weight="700">Авахад бэлэн</T>
              <View style={st.count}><T size={12} weight="700" color={colors.success}>{ready.length}</T></View>
            </View>
            <Pressable onPress={() => router.navigate({ pathname: '/(tabs)/parcels', params: { tab: 'ready' } })}>
              <T size={13} weight="500" color={colors.brand}>Бүгдийг харах</T>
            </Pressable>
          </View>
          {ready.length === 0 && (
            <T size={13} color={colors.textTertiary}>Одоогоор авахад бэлэн ачаа алга.</T>
          )}
          {ready.map((p) => <ParcelCard key={p.id} parcel={p} />)}
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandBg, alignItems: 'center', justifyContent: 'center' },
  bell: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 2, borderColor: '#fff' },
  hero: { backgroundColor: colors.brand, borderRadius: radius.xxl, padding: 20, gap: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroChip: { backgroundColor: '#FFFFFF26', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  stat: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14,
  },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { backgroundColor: colors.successBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
});
