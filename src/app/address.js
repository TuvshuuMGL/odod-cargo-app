import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Linking, TextInput } from 'react-native';
import { MapPin, Copy, Store, Container, ChevronDown } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, radius } from '../theme';
import { Screen, T, Btn, NavBar, Sheet } from '../components/ui';
import { useApp } from '../store';
import { BRANCHES, SERVICES, buildChinaAddress, ODOD_WEBSITE } from '../data';
import { useRouter } from 'expo-router';

export default function Address() {
  const router = useRouter();
  const { branch, service, phone, showToast } = useApp();
  const [selectedBranch, setSelectedBranch] = useState(branch);
  const [selectedService, setSelectedService] = useState(service);
  const [picker, setPicker] = useState(null);
  const [facebookName, setFacebookName] = useState('');
  const address = buildChinaAddress(selectedBranch, selectedService);
  const sender = facebookName.trim().replace(/\s+/g, ' ');
  const fields = address ? [
    { label: 'Хүлээн авагч · 收货人', value: address.recipient },
    { label: 'Бүс нутаг · 所在地区', value: address.region },
    { label: 'Утас · 手机号', value: address.phone },
    { label: 'Хаяг · 地址', value: [address.address, sender, sender ? phone.slice(-8) : ''].filter(Boolean).join(' ') },
    { label: 'Шуудангийн код · 邮编', value: address.postal },
  ] : [];

  const copy = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      showToast('Хууллаа');
    } catch {
      showToast('Хуулж чадсангүй. Дахин оролдоно уу.');
    }
  };

  return (
    <Screen>
      <NavBar title="Эрээн дэх хаяг" onBack={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')} />
      <View style={{ gap: 16 }}>
        {[
          { key: 'branch', icon: Store, label: 'Ачаагаа авах салбар', value: selectedBranch.name },
          { key: 'service', icon: Container, label: 'Тээврийн төрөл', value: selectedService.label + ' · ' + selectedService.name },
        ].map((p) => (
          <Pressable key={p.key} style={st.picker} onPress={() => setPicker(p.key)}>
            <p.icon size={18} color={colors.textTertiary} />
            <View style={{ flex: 1 }}>
              <T size={11} color={colors.textTertiary}>{p.label}</T>
              <T size={14} weight="600" cjk>{p.value}</T>
            </View>
            <ChevronDown size={18} color={colors.textTertiary} />
          </Pressable>
        ))}
        {address ? (
          <View style={st.card}>
            <View style={st.cardHead}>
              <MapPin size={16} color={colors.brand} />
              <T size={14} weight="700">Захиалгад оруулах хаяг</T>
            </View>
            {fields.map((field) => (
              <View key={field.label} style={[st.field, st.fieldBorder]}>
                <View style={{ flex: 1 }}>
                  <T size={11} color={colors.textTertiary}>{field.label}</T>
                  <T size={14} weight="500" cjk>{field.value}</T>
                </View>
                <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={field.label + ' хуулах'} onPress={() => copy(field.value)}>
                  <Copy size={16} color={colors.brand} />
                </Pressable>
              </View>
            ))}
            <View style={st.addressInput}>
              <T size={12} color={colors.textSecondary}>Facebook нэрээ оруулбал нэр, утас тань хаягийн ард нэмэгдэнэ.</T>
              <TextInput accessibilityLabel="Facebook нэр" placeholder="Facebook нэр" value={facebookName} maxLength={80}
                onChangeText={setFacebookName} style={st.nameField} />
              <Btn title="Хаяг бүтнээр хуулах" kind="secondary" disabled={!sender}
                onPress={() => copy(fields.map((field) => field.value).join('\n'))} />
            </View>
          </View>
        ) : (
          <T size={14} color={colors.textSecondary}>Энэ салбарт шуурхай тээврийн хаяг бүртгэгдээгүй байна. Өөр салбар эсвэл энгийн тээвэр сонгоно уу.</T>
        )}
        <View style={st.svc}>
          <T size={14} weight="700">Албан ёсны эх сурвалж</T>
          <T size={13} color={colors.textSecondary}>Энд Одод Каргогийн сайтад нийтэлсэн хаягийг харууллаа. Захиалга батлахаасаа өмнө салбар, үйлчилгээ, шуудангийн кодоо сайтаас тулгана уу.</T>
          <Btn title="Албан ёсны хаяг нээх" kind="secondary" onPress={() => Linking.openURL(ODOD_WEBSITE).catch(() => showToast('Сайтыг нээж чадсангүй'))} />
        </View>
      </View>

      <Sheet visible={picker === 'branch'} onClose={() => setPicker(null)} title="Ачаагаа авах салбар сонгох"
        options={BRANCHES.map((item) => ({ id: item.id, label: item.name, sub: item.address }))}
        selectedId={selectedBranch.id}
        onSelect={(id) => { setSelectedBranch(BRANCHES.find((item) => item.id === id)); setPicker(null); }} />
      <Sheet visible={picker === 'service'} onClose={() => setPicker(null)} title="Тээврийн төрөл сонгох"
        options={SERVICES.map((item) => ({ id: item.id, label: item.label, sub: item.name }))}
        selectedId={selectedService.id}
        onSelect={(id) => { setSelectedService(SERVICES.find((item) => item.id === id)); setPicker(null); }} />
    </Screen>
  );
}

const st = StyleSheet.create({
  picker: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border },
  cardHead: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  field: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  addressInput: { gap: 8, padding: 16 },
  nameField: {
    borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12,
    minHeight: 44, color: colors.textPrimary, fontSize: 14,
  },
  svc: { gap: 10, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14 },
});
