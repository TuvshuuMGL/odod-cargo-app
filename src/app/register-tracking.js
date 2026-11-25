import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ClipboardPaste, Truck, ChevronDown, CircleAlert } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, radius } from '../../src/theme';
import { Screen, T, Btn, NavBar, Sheet } from '../../src/components/ui';
import { useApp } from '../../src/store';
import { CARRIERS } from '../data';
import { normalizeTracking, validTracking, trackingRecords } from '../workflow';

export default function RegisterTracking() {
  const router = useRouter();
  const { registerTracking, parcels, registrations } = useApp();
  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [error, setError] = useState('');
  const [dup, setDup] = useState(null);
  const [carrierOpen, setCarrierOpen] = useState(false);

  const setNumber = (value) => {
    setTracking(value);
    setError('');
    setDup(null);
  };

  const paste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (!text.trim()) {
        setError('Хуулах тээврийн дугаар алга.');
        return;
      }
      setNumber(text.trim());
    } catch {
      setError('Санах ойгоос уншиж чадсангүй. Дугаараа гараар оруулна уу.');
    }
  };

  const openRegistration = (number) => {
    router.replace({ pathname: '/registration/[tracking]', params: { tracking: number } });
  };

  const submit = () => {
    const number = normalizeTracking(tracking);
    if (!validTracking(number)) {
      setError('Тээврийн дугаар 8–40 тэмдэгттэй байна. Латин үсэг, цифр, зураас ашиглана уу.');
      return;
    }
    const existing = trackingRecords({ parcels, registrations }, number);
    if (existing.registration || existing.parcels.length) {
      setDup(number);
      return;
    }
    registerTracking({ tracking: number, carrier, orderRef: orderRef.trim() });
    openRegistration(number);
  };

  return (
    <Screen>
      <NavBar title="Тээврийн дугаар бүртгүүлэх" onBack={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/home")} />
      <View style={{ gap: 20 }}>
        <T size={14} color={colors.textSecondary}>Дэлгүүрийн хүргэлтийн мэдээллээс тээврийн дугаараа хуулж эсвэл гараар оруулна уу.</T>

        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <T size={13} weight="500">Тээврийн дугаар</T>
              <T size={13} weight="500" color={colors.danger}>*</T>
            </View>
            <View style={[st.input, !!tracking && st.inputActive, !!error && { borderColor: colors.danger }]}>
              <TextInput
                style={st.field}
                placeholder="Жишээ: YT882731004CN"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="characters"
                value={tracking}
                onChangeText={setNumber}
                autoCorrect={false}
                accessibilityLabel="Тээврийн дугаар"
              />
              <Pressable hitSlop={8} onPress={paste} accessibilityRole="button" accessibilityLabel="Тээврийн дугаар буулгах">
                <ClipboardPaste size={18} color={colors.brand} />
              </Pressable>
            </View>
            {!!error && <T size={12} color={colors.danger}>{error}</T>}
            <T size={11} color={colors.textTertiary}>
              Тээврийн дугаарын эхний тэгийг орхилгүй оруулна уу.
            </T>
          </View>

          <View style={{ gap: 8 }}>
            <T size={13} weight="500">Тээвэрлэгч (заавал биш)</T>
            <Pressable style={st.input} onPress={() => setCarrierOpen(true)}>
              <Truck size={18} color={colors.textTertiary} />
              <T size={15} cjk color={carrier ? colors.textPrimary : colors.textTertiary} style={{ flex: 1 }}>
                {carrier || 'Сонгох'}
              </T>
              <ChevronDown size={18} color={colors.textTertiary} />
            </Pressable>
          </View>

          <View style={{ gap: 8 }}>
            <T size={13} weight="500">Дэлгүүрийн захиалгын дугаар (заавал биш)</T>
            <View style={st.input}>
              <TextInput
                style={st.field}
                placeholder="Жишээ: TB-2026-99120"
                placeholderTextColor={colors.textTertiary}
                value={orderRef}
                onChangeText={setOrderRef}
              />
            </View>
          </View>

          {dup ? (
            <View style={st.dup}>
              <CircleAlert size={18} color={colors.warning} />
              <View style={{ flex: 1, gap: 3 }}>
                <T size={13} weight="600">Энэ дугаар өмнө бүртгэгдсэн байна</T>
                <T size={12} color={colors.textSecondary} style={{ lineHeight: 18 }}>
                  Өмнөх бүртгэл болон холбогдсон ачааг харах боломжтой.
                </T>
                <Pressable onPress={() => openRegistration(dup)} style={{ marginTop: 4 }}>
                  <T size={13} weight="600" color={colors.brand}>Бүртгэлийг нээх →</T>
                </Pressable>
              </View>
            </View>
          ) : null}

          <Btn title="Бүртгүүлэх" onPress={submit} />
        </View>
      </View>

      <Sheet
        visible={carrierOpen}
        onClose={() => setCarrierOpen(false)}
        title="Тээвэрлэгч сонгох"
        options={CARRIERS.map((c2) => ({ id: c2, label: c2 }))}
        selectedId={carrier}
        onSelect={(id) => { setCarrier(id); setCarrierOpen(false); }}
      />
    </Screen>
  );
}

const st = StyleSheet.create({
  input: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, borderRadius: radius.lg,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16,
  },
  inputActive: { borderColor: colors.brand, borderWidth: 1.5 },
  field: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  dup: { flexDirection: 'row', gap: 10, backgroundColor: colors.warningBg, borderRadius: radius.lg, padding: 14, alignItems: 'flex-start' },
});
