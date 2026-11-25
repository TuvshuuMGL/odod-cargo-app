import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Truck, ChevronRight, MapPin, PackageSearch, Store, Inbox, Warehouse, PackageCheck } from 'lucide-react-native';
import { colors, radius } from '../theme';
import { T, Badge, Bubble } from './ui';
import { STATUS_META, statusColor, BRANCHES } from '../data';

const META_ICONS = {
  truck: Truck,
  mapPin: MapPin,
  packageSearch: PackageSearch,
  store: Store,
  inbox: Inbox,
  warehouse: Warehouse,
  package: Package,
  packageCheck: PackageCheck,
};

export function metaIcon(status, size = 14, color = colors.textTertiary) {
  const meta = STATUS_META[status] || STATUS_META.registered;
  const Icon = META_ICONS[meta.icon] || Package;
  return <Icon size={size} color={color} />;
}

export default function ParcelCard({ parcel, onPress }) {
  const router = useRouter();
  const meta = STATUS_META[parcel.status] || STATUS_META.registered;
  const c = statusColor(parcel.status);
  const press = onPress || (() => router.push(`/parcel/${parcel.id}`));
  return (
    <Pressable onPress={press} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      <View style={cardSt.wrap}>
        <View style={cardSt.row}>
          <View style={cardSt.left}>
            <Bubble size={34} bg={colors.brandBg} icon={<Package size={18} color={colors.brand} />} />
            <View style={{ flex: 1 }}>
              <T size={14} weight="600">{parcel.tracking}</T>
              <T size={11} color={colors.textTertiary} style={{ marginTop: 1 }}>{parcel.code}</T>
            </View>
          </View>
          <Badge label={meta.label} fg={c.fg} bg={c.bg} />
        </View>
        <View style={cardSt.row}>
          <View style={cardSt.meta}>
            {metaIcon(parcel.status)}
            <T size={12} color={colors.textSecondary}>{BRANCHES.find((branch) => branch.id === parcel.branchId)?.name || meta.label}</T>
          </View>
          <ChevronRight size={18} color={colors.textTertiary} />
        </View>
      </View>
    </Pressable>
  );
}

const cardSt = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border,
    padding: 14, gap: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
});
