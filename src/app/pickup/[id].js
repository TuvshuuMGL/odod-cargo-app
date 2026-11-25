import React from 'react';
import { View, Pressable, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Store, MapPin, Timer, Phone, Navigation, Receipt } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, NavBar, Bubble, Btn } from '../../../src/components/ui';
import { useApp } from '../../../src/store';
import { invoiceTotals, fmtMoney, BRANCHES } from '../../../src/data';

export default function Pickup() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { parcels, invoices, showToast } = useApp();
  const parcel = parcels.find((p) => p.id === id);
  const branch = BRANCHES.find((item) => item.id === parcel?.branchId);
  const back = () => router.canGoBack() ? router.back() : router.replace("/(tabs)/parcels");
  const open = (url) => Linking.openURL(url).catch(() => showToast("Холбоосыг нээж чадсангүй"));
  const invoice = invoices.find((i2) => i2.id === parcel?.invoiceId);
  const totals = invoice ? invoiceTotals(invoice) : null;

  if (!parcel || parcel.status !== "ready_pickup" || !branch) {
    return (
      <Screen>
        <NavBar title="Ачаа авах" onBack={back} />
        <T size={14} color={colors.textSecondary}>{!parcel ? "Ачаа олдсонгүй." : parcel.status !== "ready_pickup" ? "Энэ ачааг одоогоор салбараас авах боломжгүй." : "Авах салбарын мэдээлэл алга."}</T>
      </Screen>
    );
  }

  return (
    <Screen>
      <NavBar title="Ачаа авах" onBack={back} />
      <View style={{ gap: 16 }}>
        <View style={st.banner}>
          <View style={st.bannerIcon}><Check size={24} color="#fff" /></View>
          <View style={{ flex: 1, gap: 2 }}>
            <T size={16} weight="700">Авахад бэлэн</T>
            <T size={12} color={colors.textSecondary}>{parcel.code} · {branch.name}</T>
          </View>
        </View>

        <View style={st.branchCard}>
          <View style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Store size={18} color={colors.brand} />
                <T size={15} weight="700">{branch.name}</T>
              </View>
            </View>
            {[
              { icon: MapPin, text: branch.address },
              { icon: Timer, text: branch.hours },
              { icon: Phone, text: branch.phone },
            ].map((r, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <r.icon size={15} color={colors.textTertiary} />
                <T size={13} color={colors.textSecondary} style={{ flex: 1 }}>{r.text}</T>
              </View>
            ))}
            <Pressable style={st.directions} onPress={() => open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Одод Карго ' + branch.name + ', ' + branch.address))}>
              <Navigation size={16} color={colors.brand} />
              <T size={14} weight="600" color={colors.brand}>Газрын зургаас хайх</T>
            </Pressable>
            <Pressable style={st.directions} onPress={() => open('tel:' + branch.phone.replace(/\s/g, ''))}>
              <Phone size={16} color={colors.brand} />
              <T size={14} weight="600" color={colors.brand}>Салбар руу залгах</T>
            </Pressable>
          </View>
        </View>

        {invoice && totals && (
          <View style={st.invoice}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Bubble size={38} bg={colors.warningBg} icon={<Receipt size={18} color={colors.warning} />} />
              <View style={{ flex: 1, gap: 2 }}>
                <T size={14} weight="700">Нэхэмжлэл {invoice.number}</T>
                <T size={11} color={colors.textTertiary}>{invoice.date} · {invoice.lines.length} багц</T>
              </View>
              <View style={[st.payBadge, { backgroundColor: totals.balance > 0 ? colors.warningBg : colors.successBg }]}>
                <T size={11} weight="600" color={totals.balance > 0 ? colors.warning : colors.success}>
                  {totals.balance > 0 ? 'Үлдэгдэлтэй' : 'Төлөгдсөн'}
                </T>
              </View>
            </View>
            <View style={{ gap: 6, marginTop: 4 }}>
              {invoice.lines.map((l) => (
                <View key={l.parcelCode} style={st.lineRow}>
                  <T size={13} color={colors.textSecondary} cjk>{l.parcelCode} · {l.desc}</T>
                  <T size={13} weight="500">{fmtMoney(l.amount)}</T>
                </View>
              ))}
              <View style={st.divider} />
              <View style={st.lineRow}><T size={12} color={colors.textSecondary}>Нийт дүн</T><T size={13} weight="500">{fmtMoney(totals.total)}</T></View>
              <View style={st.lineRow}><T size={12} color={colors.textSecondary}>Төлсөн</T><T size={13} weight="500" color={colors.success}>{fmtMoney(totals.paid)}</T></View>
              <View style={st.lineRow}><T size={14} weight="700">Үлдэгдэл</T><T size={16} weight="700" color={totals.balance > 0 ? colors.danger : colors.success}>{fmtMoney(totals.balance)}</T></View>
            </View>
            <Btn title="Нэхэмжлэл харах" kind="secondary" onPress={() => router.push(`/invoice/${invoice.id}`)} />
          </View>
        )}

        {!invoice && <T size={13} color={colors.textSecondary}>Нэхэмжлэл гараагүй байна.</T>}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.successBg, borderRadius: radius.xl, padding: 16 },
  bannerIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  branchCard: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  directions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: radius.md, backgroundColor: colors.brandBg },
  invoice: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 12 },
  payBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  lineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
});
