import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Receipt, BadgeCheck, Info } from 'lucide-react-native';
import { colors, radius } from '../../../src/theme';
import { Screen, T, NavBar, Bubble } from '../../../src/components/ui';
import { useApp } from '../../../src/store';
import { invoiceTotals, fmtMoney } from '../../../src/data';

export default function InvoiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { invoices } = useApp();
  const back = () => router.canGoBack() ? router.back() : router.replace("/(tabs)/parcels");
  const invoice = invoices.find((i2) => i2.id === id);

  if (!invoice) {
    return (
      <Screen>
        <NavBar title="Нэхэмжлэл" onBack={back} />
        <T size={14} color={colors.textSecondary}>Нэхэмжлэл олдсонгүй.</T>
      </Screen>
    );
  }

  const totals = invoiceTotals(invoice);
  const statusLabel = totals.balance === 0 ? 'Төлөгдсөн' : totals.paid > 0 ? 'Хэсэгчлэн төлсөн' : 'Үлдэгдэлтэй';
  const statusColor2 = totals.balance === 0 ? colors.success : colors.warning;

  return (
    <Screen>
      <NavBar title="Нэхэмжлэл" onBack={back} />
      <View style={{ gap: 16 }}>
        <View style={st.head}>
          <Bubble size={44} bg={colors.warningBg} icon={<Receipt size={22} color={colors.warning} />} />
          <View style={{ flex: 1, gap: 2 }}>
            <T size={17} weight="700">{invoice.number}</T>
            <T size={12} color={colors.textTertiary}>Огноо: {invoice.date}</T>
          </View>
          <View style={[st.badge, { backgroundColor: statusColor2 + '1A' }]}>
            <T size={12} weight="600" color={statusColor2}>{statusLabel}</T>
          </View>
        </View>

        <View style={st.card}>
          <T size={14} weight="700" style={{ marginBottom: 10 }}>Нэхэмжлэлд багтсан ачаа</T>
          {invoice.lines.map((l, i) => (
            <View key={l.parcelCode} style={[st.lineRow, i < invoice.lines.length - 1 && { marginBottom: 10 }]}>
              <View style={{ flex: 1 }}>
                <T size={14} weight="600">{l.parcelCode}</T>
                <T size={12} color={colors.textTertiary} cjk style={{ marginTop: 1 }}>{l.desc}</T>
              </View>
              <T size={14} weight="600">{fmtMoney(l.amount)}</T>
            </View>
          ))}
          <View style={st.divider} />
          <View style={st.lineRow}><T size={13} color={colors.textSecondary}>Нийт дүн</T><T size={14} weight="600">{fmtMoney(totals.total)}</T></View>
          <View style={[st.lineRow, { marginTop: 6 }]}><T size={13} color={colors.textSecondary}>Төлсөн</T><T size={14} weight="600" color={colors.success}>{fmtMoney(totals.paid)}</T></View>
          <View style={[st.lineRow, { marginTop: 6 }]}><T size={15} weight="700">Үлдэгдэл</T><T size={18} weight="700" color={totals.balance > 0 ? colors.danger : colors.success}>{fmtMoney(totals.balance)}</T></View>
        </View>

        {invoice.payments.length > 0 && (
          <View style={st.card}>
            <T size={14} weight="700" style={{ marginBottom: 10 }}>Төлбөрийн түүх</T>
            {invoice.payments.map((p, i) => (
              <View key={p.id} style={[st.lineRow, i < invoice.payments.length - 1 && { marginBottom: 10 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <BadgeCheck size={16} color={colors.success} />
                  <View>
                    <T size={13} weight="500">{p.method}</T>
                    <T size={11} color={colors.textTertiary} style={{ marginTop: 1 }}>{p.date}</T>
                  </View>
                </View>
                <T size={13} weight="600" color={colors.success}>{fmtMoney(p.amount)}</T>
              </View>
            ))}
          </View>
        )}

        {totals.balance > 0 && (
          <View style={st.note}>
            <Info size={16} color={colors.info} />
            <T size={13} color={colors.textSecondary} style={{ flex: 1 }}>Төлбөрийн үлдэгдлээ салбараас лавлана уу.</T>
          </View>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  card: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: 18 },
  lineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  note: { flexDirection: 'row', gap: 10, backgroundColor: colors.infoBg, borderRadius: radius.lg, padding: 14, alignItems: 'flex-start' },
});
