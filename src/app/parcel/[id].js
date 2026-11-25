import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { History, Weight, Ruler, Container, Store, Receipt, MessageCircle, Copy, CircleCheck, Forward } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, radius } from '../../../src/theme';
import { Screen, T, Badge, NavBar, Bubble, SectionTitle } from '../../../src/components/ui';
import { useApp } from '../../../src/store';
import { LIFECYCLE, STATUS_META, statusColor, SERVICES, BRANCHES } from '../../../src/data';

export default function ParcelDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { parcels, invoices, advanceParcel, showToast } = useApp();
  const parcel = parcels.find((p) => p.id === id);
  const back = () => router.canGoBack() ? router.back() : router.replace("/(tabs)/parcels");
  if (!parcel) {
    return (
      <Screen>
        <NavBar title="Ачаа олдсонгүй" onBack={back} />
        <T size={14} color={colors.textSecondary}>Энэ ачаа таны бүртгэлд байхгүй байна.</T>
      </Screen>
    );
  }

  const meta = STATUS_META[parcel.status] ?? STATUS_META.registered;
  const branch = BRANCHES.find((item) => item.id === parcel.branchId);
  const c = statusColor(parcel.status);
  const service = SERVICES.find((s2) => s2.id === parcel.serviceId) || SERVICES[0];
  const invoice = invoices.find((i2) => i2.id === parcel.invoiceId);
  const currentIdx = LIFECYCLE.indexOf(parcel.status);
  const canAdvance = currentIdx >= 0 && currentIdx < LIFECYCLE.length - 1;

  const copyCode = async () => {
    try {
      await Clipboard.setStringAsync(parcel.code);
      showToast('Ачааны дугаарыг хууллаа');
    } catch {
      showToast('Ачааны дугаарыг хуулж чадсангүй');
    }
  };

  return (
    <Screen>
      <NavBar
        title="Ачааны дэлгэрэнгүй"
        onBack={back}
        right={
          <Pressable style={st.helpBtn} onPress={() => router.push('/help/dispute')} hitSlop={8}>
            <MessageCircle size={19} color={colors.textPrimary} />
          </Pressable>
        }
      />
      <View style={{ gap: 16 }}>
        <View style={st.summary}>
          <View style={st.summaryTop}>
            <View style={{ flex: 1, gap: 4 }}>
              <T size={18} weight="700">{parcel.tracking}</T>
              <T size={12} color={colors.textTertiary}>Ачааны дугаар · {parcel.code}</T>
            </View>
            <Badge label={meta.label} fg={c.fg} bg={c.bg} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <History size={13} color={colors.textTertiary} />
            <T size={12} color={colors.textSecondary}>
              Шинэчилсэн цаг: {parcel.history[parcel.history.length - 1]?.time} (Улаанбаатарын цаг)
            </T>
          </View>
          <T size={12} color={colors.textSecondary}>Ачааны зураг хараахан байхгүй.</T>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { icon: Weight, label: 'Жин', value: parcel.weight || 'Хэмжээгүй' },
            { icon: Ruler, label: 'Хэмжээс', value: parcel.dims || 'Хэмжээгүй' },
          ].map((f) => (
            <View key={f.label} style={st.fact}>
              <Bubble size={34} bg={colors.brandBg} icon={<f.icon size={17} color={colors.brand} />} />
              <View style={{ flex: 1 }}>
                <T size={10} color={colors.textTertiary}>{f.label}</T>
                <T size={13} weight="600" numberOfLines={1}>{f.value}</T>
              </View>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { icon: Container, label: 'Үйлчилгээ', value: `${service.name} · ${service.label}` },
            { icon: Store, label: 'Авах салбар', value: branch?.name || 'Тодорхойгүй' },
          ].map((f) => (
            <View key={f.label} style={st.fact}>
              <Bubble size={34} bg={colors.brandBg} icon={<f.icon size={17} color={colors.brand} />} />
              <View style={{ flex: 1 }}>
                <T size={10} color={colors.textTertiary}>{f.label}</T>
                <T size={13} weight="600" cjk numberOfLines={1}>{f.value}</T>
              </View>
            </View>
          ))}
        </View>

        {invoice ? (
          <Pressable style={st.invoice} onPress={() => router.push(`/invoice/${invoice.id}`)}>
            <Bubble size={38} bg={colors.warningBg} icon={<Receipt size={18} color={colors.warning} />} />
            <View style={{ flex: 1, gap: 2 }}>
              <T size={13} weight="600">Нэхэмжлэл {invoice.number}</T>
              <T size={11} color={colors.textSecondary}>Нэхэмжлэлийн дүн, үлдэгдэл харах</T>
            </View>
          </Pressable>
        ) : (
          <View style={st.invoice}>
            <Bubble size={38} bg={colors.bg} icon={<Receipt size={18} color={colors.textTertiary} />} />
            <View style={{ flex: 1, gap: 2 }}>
              <T size={13} weight="600">Нэхэмжлэл гараагүй</T>
              <T size={11} color={colors.textSecondary} style={{ lineHeight: 16 }}>
                Нэхэмжлэл гарсны дараа дүн болон үлдэгдэл энд харагдана.
              </T>
            </View>
          </View>
        )}

        <SectionTitle>Ачааны хөдөлгөөн</SectionTitle>
        <View style={st.timeline}>
          {parcel.history.map((ev, i) => {
            const step = ev.status;
            const last = i === parcel.history.length - 1;
            const isCurrent = last && parcel.status !== 'delivered';
            const done = !isCurrent;
            return (
              <View key={step + "-" + i} style={st.tlItem}>
                <View style={st.rail}>
                  {done ? (
                    <CircleCheck size={16} color={colors.success} />
                  ) : isCurrent ? (
                    <View style={[st.currentDot, { borderColor: c.fg }]}>
                      <View style={[st.currentInner, { backgroundColor: c.fg }]} />
                    </View>
                  ) : (
                    <View style={st.pendingDot} />
                  )}
                  {!last && <View style={[st.line, done && { backgroundColor: colors.success }]} />}
                </View>
                <View style={{ flex: 1, paddingBottom: last ? 0 : 16 }}>
                  <T
                    size={13}
                    weight={isCurrent ? '700' : done ? '500' : '400'}
                    color={isCurrent ? c.fg : done ? colors.textPrimary : colors.textTertiary}
                  >
                    {STATUS_META[step]?.label ?? "Төлөв шинэчлэгдсэн"}
                  </T>
                  {!!ev && (
                    <T size={11} color={colors.textTertiary} style={{ marginTop: 2 }}>
                      {ev.time}{ev.location ? ` · ${ev.location}` : ''}{ev.note ? ` · ${ev.note}` : ''}
                    </T>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={st.support} onPress={copyCode}>
          <Bubble size={38} bg={colors.brandBg} icon={<MessageCircle size={18} color={colors.brand} />} />
          <View style={{ flex: 1, gap: 2 }}>
            <T size={13} weight="600">Ачааны дугаар хуулах</T>
            <T size={11} color={colors.textSecondary}>Лавлагааны дугаар: {parcel.code}</T>
          </View>
          <Copy size={16} color={colors.brand} />
        </Pressable>

        {canAdvance && (
          <Pressable
            style={st.demo}
            onPress={() => {
              advanceParcel(parcel.id, parcel.status);
              showToast(`Төлөв: ${STATUS_META[LIFECYCLE[currentIdx + 1]].label}`);
            }}
          >
            <Forward size={16} color={colors.violet} />
            <T size={13} weight="600" color={colors.violet}>
              Туршилт: «{STATUS_META[LIFECYCLE[currentIdx + 1]].label}» болгох
            </T>
          </Pressable>
        )}
        {parcel.status === 'ready_pickup' && (
          <Pressable style={st.pickup} onPress={() => router.push(`/pickup/${parcel.id}`)}>
            <T size={14} weight="600" color="#fff">Авах салбар, төлбөр харах</T>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  helpBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  summary: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 12 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  fact: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12,
  },
  invoice: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14,
  },
  timeline: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: 18, paddingBottom: 10 },
  tlItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  rail: { width: 20, alignItems: 'center' },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 2, minHeight: 26 },
  currentDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  currentInner: { width: 6, height: 6, borderRadius: 3 },
  pendingDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, marginTop: 2 },
  support: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14,
  },
  demo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46,
    borderRadius: radius.lg, backgroundColor: colors.violetBg,
  },
  pickup: { alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.lg, backgroundColor: colors.success },
});
