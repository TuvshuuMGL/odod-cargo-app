import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BellOff, PackageCheck, Warehouse, Truck, Inbox, Package, Receipt, Check, MapPin } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, Bubble } from '../../../src/components/ui';
import { useApp } from '../../../src/store';

const TYPE_META = {
  ready_pickup: { icon: PackageCheck, fg: colors.success, bg: colors.successBg },
  received_branch: { icon: Warehouse, fg: colors.info, bg: colors.infoBg },
  branch_dispatched: { icon: Truck, fg: colors.info, bg: colors.infoBg },
  dispatched: { icon: Truck, fg: colors.violet, bg: colors.violetBg },
  in_transit: { icon: Truck, fg: colors.violet, bg: colors.violetBg },
  received_china: { icon: Inbox, fg: colors.info, bg: colors.infoBg },
  measured: { icon: Package, fg: colors.teal, bg: colors.tealBg },
  arrived_ub: { icon: MapPin, fg: colors.teal, bg: colors.tealBg },
  delivered: { icon: Check, fg: colors.success, bg: colors.successBg },
  invoice: { icon: Receipt, fg: colors.warning, bg: colors.warningBg },
};

export default function Notifications() {
  const router = useRouter();
  const { notifications, markRead, markAllRead, prefs } = useApp();
  const unread = notifications.filter((item) => !item.read);
  const read = notifications.filter((item) => item.read);

  const open = (n) => {
    markRead(n.id);
    if (n.parcelId) router.push(`/parcel/${n.parcelId}`);
  };

  const renderItem = (n) => {
    const meta = TYPE_META[n.type] || TYPE_META.received_china;
    const Icon = meta.icon;
    return (
      <Pressable key={n.id} onPress={() => open(n)} style={[st.item, n.read && { backgroundColor: 'transparent', borderColor: 'transparent' }]}>
        <Bubble size={40} bg={meta.bg} icon={<Icon size={19} color={meta.fg} />} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <T size={14} weight={n.read ? '600' : '700'} style={{ flex: 1 }}>{n.title}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T size={11} color={colors.textTertiary}>{n.time}</T>
              {!n.read && <View style={st.dot} />}
            </View>
          </View>
          <T size={12} color={colors.textSecondary} style={{ lineHeight: 17 }}>{n.body}</T>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <View style={{ gap: 16 }}>
        <View style={st.header}>
          <T size={22} weight="700">Мэдэгдэл</T>
          {unread.length > 0 && <Pressable accessibilityRole="button" onPress={markAllRead} hitSlop={8}>
            <T size={13} weight="500" color={colors.brand}>Бүгдийг уншсанаар тэмдэглэх</T>
          </Pressable>}
        </View>

        {notifications.length === 0 && (
          <View style={st.empty}>
            <BellOff size={40} color={colors.textTertiary} />
            <T size={14} color={colors.textSecondary}>Мэдэгдэл алга</T>
          </View>
        )}

        {unread.length > 0 && (
          <View style={{ gap: 8 }}>
            <T size={12} weight="600" color={colors.textTertiary}>ШИНЭ</T>
            {unread.map(renderItem)}
          </View>
        )}
        {read.length > 0 && (
          <View style={{ gap: 8 }}>
            <T size={12} weight="600" color={colors.textTertiary}>УНШСАН</T>
            {read.map(renderItem)}
          </View>
        )}

        {!prefs.push && (
          <View style={st.footNote}>
            <BellOff size={14} color={colors.textTertiary} />
            <T size={11} color={colors.textTertiary} style={{ flex: 1, lineHeight: 16 }}>
              Түлхэх мэдэгдэл унтраалттай. Мэдэгдлээ эндээс уншина уу.
            </T>
          </View>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.surface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 14,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 60 },
  footNote: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 4 },
});
