import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Switch, Linking, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BadgeCheck, IdCard, Copy, Store, Bell, ChevronRight, BookOpen, ScanSearch, Scale, Headphones, LogOut,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, radius } from '../../../src/theme';
import { Screen, T, Sheet } from '../../../src/components/ui';
import { useApp } from '../../../src/store';
import { BRANCHES } from '../../../src/data';

export default function Profile() {
  const router = useRouter();
  const { user, phone, branch, branchId, setBranchId, prefs, setPref, signOut, showToast } = useApp();
  const [branchOpen, setBranchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const copyCode = async () => {
    try {
      await Clipboard.setStringAsync(user.code);
      showToast('Хэрэглэгчийн кодыг хууллаа');
    } catch {
      showToast('Кодыг хуулж чадсангүй');
    }
  };

  const confirmLogout = () => {
    setLogoutOpen(false);
    signOut();
  };

  return (
    <Screen>
      <View style={{ gap: 16 }}>
        <T size={22} weight="700">Миний бүртгэл</T>

        <View style={st.userCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={st.avatar}><T size={22} weight="700" color={colors.brand}>{user.name[0]}</T></View>
            <View style={{ flex: 1, gap: 3 }}>
              <T size={17} weight="700">{user.fullName}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <T size={13} color={colors.textSecondary}>{phone || user.phone}</T>
                <BadgeCheck size={14} color={colors.success} />
              </View>
            </View>
          </View>
          <Pressable style={st.codeRow} onPress={copyCode}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IdCard size={16} color={colors.textTertiary} />
              <T size={12} color={colors.textSecondary}>Хэрэглэгчийн код</T>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T size={14} weight="700">{user.code}</T>
              <Copy size={15} color={colors.brand} />
            </View>
          </Pressable>
        </View>

        <View style={st.group}>
          <Pressable style={[st.row, st.rowBorder]} onPress={() => setBranchOpen(true)}>
            <View style={st.rowIcon}><Store size={17} color={colors.textSecondary} /></View>
            <T size={14} weight="500" style={{ flex: 1 }}>Үндсэн салбар</T>
            <T size={13} color={colors.textTertiary}>{branch.name.replace(' салбар', '')}</T>
            <ChevronRight size={17} color={colors.textTertiary} />
          </Pressable>
          <View style={[st.row, st.rowBorder]}>
            <View style={st.rowIcon}><Bell size={17} color={colors.textSecondary} /></View>
            <T size={14} weight="500" style={{ flex: 1 }}>Аппын түлхэх мэдэгдэл</T>
            <Switch
              value={prefs.push}
              accessibilityLabel="Аппын түлхэх мэдэгдэл"
              onValueChange={(v) => setPref('push', v)}
              trackColor={{ true: colors.brand, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
          <View style={[st.row, st.rowBorder]}>
            <View style={st.rowIcon}><Bell size={17} color={colors.textSecondary} /></View>
            <T size={14} weight="500" style={{ flex: 1 }}>Мессежээр мэдэгдэх</T>
            <Switch
              value={prefs.sms}
              accessibilityLabel="Мессежээр мэдэгдэх"
              onValueChange={(v) => setPref('sms', v)}
              trackColor={{ true: colors.brand, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
          <T size={12} color={colors.textSecondary} style={{ paddingVertical: 10 }}>Туршилтын горимд мэдэгдлээ зөвхөн апп дотроос харна.</T>
        </View>

        <T size={12} weight="600" color={colors.textTertiary}>ТУСЛАМЖ</T>
        <View style={st.group}>
          {[
            { key: 'address', icon: BookOpen, label: 'Эрээн дэх хаягаа яаж оруулах вэ?' },
            { key: 'tracking', icon: ScanSearch, label: 'Тээврийн дугаараа яаж олох вэ?' },
            { key: 'dispute', icon: Scale, label: 'Ачааны эзэмшлээ баталгаажуулах' },
          ].map((h, i, arr) => (
            <Pressable key={h.key} style={[st.row, i < arr.length - 1 && st.rowBorder]} onPress={() => router.push(`/help/${h.key}`)}>
              <View style={[st.rowIcon, { backgroundColor: colors.brandBg }]}><h.icon size={17} color={colors.brand} /></View>
              <T size={14} weight="500" style={{ flex: 1 }}>{h.label}</T>
              <ChevronRight size={17} color={colors.textTertiary} />
            </Pressable>
          ))}
          <Pressable style={st.row} onPress={() => Linking.openURL('tel:' + branch.phone.replace(/\s/g, '')).catch(() => showToast('Утасны дугаарыг нээж чадсангүй'))}>
            <View style={[st.rowIcon, { backgroundColor: colors.brandBg }]}><Headphones size={17} color={colors.brand} /></View>
            <T size={14} weight="500" style={{ flex: 1 }}>Үндсэн салбар руу залгах</T>
            <ChevronRight size={17} color={colors.textTertiary} />
          </Pressable>
        </View>

        <Pressable style={st.logout} onPress={() => setLogoutOpen(true)}>
          <LogOut size={17} color={colors.danger} />
          <T size={15} weight="600" color={colors.danger}>Гарах</T>
        </Pressable>

        <T size={11} color={colors.textTertiary} center>Одод Карго · Туршилтын хувилбар 1.0</T>
      </View>

      <Sheet
        visible={branchOpen}
        onClose={() => setBranchOpen(false)}
        title="Үндсэн салбар сонгох"
        options={BRANCHES.map((b) => ({ id: b.id, label: b.name, sub: b.address }))}
        selectedId={branchId}
        onSelect={(id) => { setBranchId(id); setBranchOpen(false); showToast('Үндсэн салбар шинэчлэгдлээ'); }}
      />
      <Modal visible={logoutOpen} transparent animationType="fade" onRequestClose={() => setLogoutOpen(false)}>
        <View style={st.confirmBackdrop}>
          <View style={st.confirmCard}>
            <T size={16} weight="700">Гарах</T>
            <T size={13} color={colors.textSecondary} style={{ lineHeight: 19 }}>
              Аппаас гарах уу?
            </T>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable style={[st.confirmBtn, { backgroundColor: colors.bg }]} onPress={() => setLogoutOpen(false)}>
                <T size={14} weight="600" color={colors.textSecondary}>Болих</T>
              </Pressable>
              <Pressable style={[st.confirmBtn, { backgroundColor: colors.danger }]} onPress={confirmLogout}>
                <T size={14} weight="600" color="#fff">Гарах</T>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  userCard: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.brandBg, alignItems: 'center', justifyContent: 'center' },
  codeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.bg, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10,
  },
  group: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52,
    borderRadius: radius.lg, backgroundColor: colors.dangerBg,
  },
  confirmBackdrop: { flex: 1, backgroundColor: '#10182866', alignItems: 'center', justifyContent: 'center', padding: 24 },
  confirmCard: {
    backgroundColor: colors.surface, borderRadius: radius.xxl, padding: 20, gap: 12,
    width: '100%', maxWidth: 320,
  },
  confirmBtn: { flex: 1, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
