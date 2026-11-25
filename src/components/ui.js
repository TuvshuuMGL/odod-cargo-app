import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';
import { ChevronLeft, Check } from 'lucide-react-native';

export function Screen({ children, bg = colors.bg, padded = true, scroll = true, footer = null, style }) {
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[{ flexGrow: 1 }, padded && { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 }, style]}>
      {children}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: footer ? 90 : 24 }} keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer}
    </View>
  );
}

export function NavBar({ title, onBack, right = null }) {
  return (
    <View style={st.nav}>
      <Pressable accessibilityRole="button" accessibilityLabel="Буцах" onPress={onBack} style={st.navBtn} hitSlop={8}>
        <ChevronLeft size={20} color={colors.textPrimary} />
      </Pressable>
      <Text style={st.navTitle} numberOfLines={1}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function T({ children, size = 14, weight = '400', color = colors.textPrimary, center = false, style, numberOfLines, cjk = false, ...rest }) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        { fontSize: size, color, textAlign: center ? 'center' : 'left' },
        weight !== '400' && { fontWeight: weight },
        cjk && { letterSpacing: 0.2 },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Badge({ label, fg, bg }) {
  return (
    <View style={[st.badge, { backgroundColor: bg }]}>
      <View style={[st.badgeDot, { backgroundColor: fg }]} />
      <T size={12} weight="500" color={fg}>{label}</T>
    </View>
  );
}

export function Btn({ title, onPress, kind = 'primary', icon = null, disabled = false, style }) {
  const bg = kind === 'primary' ? colors.brand : kind === 'danger' ? colors.dangerBg : colors.surface;
  const fg = kind === 'primary' ? '#fff' : kind === 'danger' ? colors.danger : colors.brand;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        st.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        kind === 'secondary' && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {icon}
      <T size={16} weight="600" color={fg}>{title}</T>
    </Pressable>
  );
}

export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[st.card, style]}>
      {children}
    </Wrapper>
  );
}

export function Bubble({ icon, bg, size = 34 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </View>
  );
}

export function SectionTitle({ children, right = null }) {
  return (
    <View style={st.section}>
      <T size={17} weight="700">{children}</T>
      {right}
    </View>
  );
}

export function EmptyState({ icon, title, sub, action = null }) {
  return (
    <View style={st.empty}>
      <View style={st.emptyIcon}>{icon}</View>
      <T size={17} weight="700">{title}</T>
      <T size={13} color={colors.textSecondary} center style={{ lineHeight: 20, maxWidth: 280 }}>{sub}</T>
      {action}
    </View>
  );
}

export function Sheet({ visible, onClose, title, options, selectedId, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={st.sheetBackdrop} onPress={onClose} />
      <View style={st.sheet}>
        <View style={st.sheetHandle} />
        <T size={16} weight="700" style={{ marginBottom: 8 }}>{title}</T>
        {options.map((o) => {
          const active = o.id === selectedId;
          return (
            <Pressable key={o.id} onPress={() => onSelect(o.id)} style={[st.sheetRow, active && { backgroundColor: colors.brandBg }]}>
              <View style={{ flex: 1 }}>
                <T size={15} weight="600" color={active ? colors.brand : colors.textPrimary}>{o.label}</T>
                {!!o.sub && <T size={12} color={colors.textSecondary} style={{ marginTop: 2 }}>{o.sub}</T>}
              </View>
              {active && <Check size={18} color={colors.brand} />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

export function ToastHost({ message }) {
  const insets = useSafeAreaInsets();
  if (!message) return null;
  return (
    <View pointerEvents="none" style={[st.toast, { bottom: insets.bottom + 90 }]}>
      <View style={st.toastPill}>
        <T size={13} weight="600" color="#fff">{message}</T>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  navBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  btn: {
    height: 52, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border,
    padding: 14, ...shadow.card,
  },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 8 },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 10 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  sheetBackdrop: { flex: 1, backgroundColor: '#10182866' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: radius.md, gap: 10 },
  toast: {
    position: 'absolute', left: 0, right: 0, alignItems: 'center',
  },
  toastPill: {
    backgroundColor: '#101828E6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill,
  },
});
