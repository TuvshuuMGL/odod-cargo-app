import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { colors, radius } from '../../src/theme';
import { Screen, T, Btn } from '../../src/components/ui';
import { useApp } from '../../src/store';

const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;
const RESEND_DELAY = 42_000;
const EXPIRY_DELAY = 600_000;

export default function Otp() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { signIn, showToast } = useApp();
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [issuedAt, setIssuedAt] = useState(Date.now);
  const [now, setNow] = useState(Date.now);
  const refs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const code = digits.join('');
  const complete = code.length === CODE_LENGTH;
  const timer = Math.max(0, Math.ceil((issuedAt + RESEND_DELAY - now) / 1000));
  const expired = now >= issuedAt + EXPIRY_DELAY;

  if (typeof phone !== 'string' || !/^\+976 \d{8}$/.test(phone)) return <Redirect href="/login" />;

  const clearCode = () => {
    setDigits(Array(CODE_LENGTH).fill(''));
    refs.current[0]?.focus();
  };

  const submit = () => {
    if (!complete || attempts === 0 || Date.now() >= issuedAt + EXPIRY_DELAY) return;
    if (code !== '123456') {
      setAttempts((a) => Math.max(0, a - 1));
      setError('Баталгаажуулах код буруу байна.');
      clearCode();
      return;
    }
    signIn(phone);
  };

  const resend = () => {
    const time = Date.now();
    if (time < issuedAt + RESEND_DELAY) return;
    setIssuedAt(time);
    setNow(time);
    setAttempts(MAX_ATTEMPTS);
    setError('');
    clearCode();
    showToast('Туршилтын кодыг шинэчиллээ');
  };

  const setDigit = (i, v) => {
    const clean = v.replace(/[^0-9]/g, '');
    const next = [...digits];
    setError('');
    if (clean.length > 1) {
      const chars = clean.slice(0, CODE_LENGTH - i).split('');
      chars.forEach((ch, k) => { next[i + k] = ch; });
      setDigits(next);
      const target = Math.min(i + chars.length, CODE_LENGTH - 1);
      refs.current[target]?.focus();
      return;
    }
    next[i] = clean;
    setDigits(next);
    if (clean && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      const next = [...digits];
      next[i - 1] = '';
      setDigits(next);
    }
  };

  return (
    <Screen bg={colors.surface}>
      <View style={{ flex: 1, gap: 28 }}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/login')} accessibilityLabel="Утасны дугаар руу буцах" style={st.back} hitSlop={8}>
          <ChevronLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={{ gap: 8 }}>
          <T size={24} weight="700">Кодоо оруулна уу</T>
          <T size={15} color={colors.textSecondary} style={{ lineHeight: 23 }}>
            {phone} дугаараар нэвтрэхийн тулд 6 оронтой код оруулна уу.
          </T>
        </View>

        <View style={st.otpRow}>
          {digits.map((d, i) => {
            const active = i === digits.findIndex((x) => !x) || (i === CODE_LENGTH - 1 && complete);
            return (
              <TextInput
                key={i}
                ref={(r) => { refs.current[i] = r; }}
                accessibilityLabel={`Кодын ${i + 1}-р орон`}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                style={[
                  st.box,
                  !!d && st.boxFilled,
                  active && !error && st.boxActive,
                  !!error && st.boxError,
                ]}
                value={d}
                onChangeText={(v) => setDigit(i, v)}
                onKeyPress={(e) => onKey(i, e)}
                keyboardType="number-pad"
                maxLength={i === 0 ? CODE_LENGTH : 1}
                selectTextOnFocus
              />
            );
          })}
        </View>
        {(error || expired || attempts === 0) && (
          <T size={13} color={colors.danger} center accessibilityLiveRegion="polite">
            {attempts === 0 ? "Оролдлогын тоо дууслаа. Шинэ код авна уу." : expired ? "Кодын хугацаа дууслаа. Шинэ код авна уу." : error}
          </T>
        )}

        <Pressable onPress={resend} disabled={timer > 0} style={st.resend}>
          <T size={14} color={colors.textSecondary}>Код ирээгүй юу? </T>
          <T size={14} weight="600" color={timer > 0 ? colors.textTertiary : colors.brand}>
            {timer > 0 ? `Дахин авах (0:${String(timer).padStart(2, '0')})` : 'Шинэ код авах'}
          </T>
        </Pressable>

        <View style={{ gap: 12 }}>
          <Btn title="Нэвтрэх" disabled={!complete || attempts === 0 || expired} onPress={submit} />
          <View style={st.shield}>
            <ShieldCheck size={13} color={colors.textTertiary} />
            <T size={12} color={colors.textTertiary}>
              Код 10 минут хүчинтэй · {attempts} оролдлого үлдсэн
            </T>
          </View>
          <T size={11} color={colors.textTertiary} center>
            Туршихдаа 123456 кодыг ашиглаарай. Буруу кодын төлөвийг 000000 кодоор шалгана.
          </T>
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  back: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  otpRow: { flexDirection: 'row', gap: 8 },
  box: {
    flex: 1, height: 56, borderRadius: radius.lg, backgroundColor: colors.bg, borderWidth: 1,
    borderColor: colors.border, textAlign: 'center', fontSize: 22, fontWeight: '600', color: colors.brand,
  },
  boxFilled: { backgroundColor: colors.brandBg, borderColor: colors.brand },
  boxActive: { borderColor: colors.brand, borderWidth: 1.5 },
  boxError: { borderColor: colors.danger },
  resend: { flexDirection: 'row', justifyContent: 'center' },
  shield: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
});
