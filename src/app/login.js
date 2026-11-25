import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Info, MessageCircle } from 'lucide-react-native';
import { colors, radius } from '../../src/theme';
import { Screen, T, Btn } from '../../src/components/ui';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const value = phone.trim();
  const digits = value.replace(/^\+976\s*/, '').replace(/\s+/g, '');
  const valid = /^\d{8}$/.test(digits);

  return (
    <Screen bg={colors.surface}>
      <View style={{ flex: 1, gap: 32, paddingTop: 40 }}>
        <View style={{ gap: 20 }}>
          <View style={st.logo}>
            <Star size={30} color="#fff" fill="#fff" />
          </View>
          <View style={{ gap: 8 }}>
            <T size={28} weight="700">Одод Карго</T>
            <T size={15} color={colors.textSecondary} style={{ lineHeight: 23 }}>
              Утасны дугаараар нэвтэрч, ачааны явц болон төлбөрийн мэдээллээ хараарай.
            </T>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <T size={13} weight="500">Утасны дугаар</T>
            <View style={[st.input, phone.length > 0 && !valid && { borderColor: colors.danger }]}>
              <T size={16} weight="600">+976</T>
              <View style={st.divider} />
              <TextInput
                style={st.field}
                placeholder="8811 2233"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                accessibilityLabel="Утасны дугаар"
                autoComplete="tel-national"
                maxLength={16}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            {phone.length > 0 && !valid ? (
              <T size={12} color={colors.danger}>8 оронтой дугаар оруулна уу.</T>
            ) : (
              <View style={st.hint}>
                <Info size={13} color={colors.textTertiary} />
                <T size={12} color={colors.textTertiary}>Утасны дугаараа 8 оронтойгоор оруулна уу.</T>
              </View>
            )}
          </View>
          <Btn
            title="Баталгаажуулах код авах"
            disabled={!valid}
            onPress={() => router.push({ pathname: '/otp', params: { phone: `+976 ${digits}` } })}
          />
        </View>

        <View style={{ alignItems: 'center', gap: 12 }}>
          <Pressable style={st.help} onPress={() => router.push('/help/login')}>
            <MessageCircle size={16} color={colors.brand} />
            <T size={14} weight="500" color={colors.brand}>Нэвтрэхэд тусламж авах</T>
          </Pressable>
          <T size={11} color={colors.textTertiary} center style={{ lineHeight: 17 }}>
            Туршилтын горимд утсанд мессеж илгээхгүй.
          </T>
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  logo: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  input: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, borderRadius: radius.lg,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16,
  },
  divider: { width: 1, height: 24, backgroundColor: colors.border },
  field: { flex: 1, fontSize: 16, color: colors.textPrimary, padding: 0 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  help: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
