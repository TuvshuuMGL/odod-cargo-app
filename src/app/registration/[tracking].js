import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, T, NavBar, Btn } from '../../components/ui';
import ParcelCard from '../../components/ParcelCard';
import { useApp } from '../../store';
import { trackingRecords, validTracking } from '../../workflow';
import { colors } from '../../theme';

export default function Registration() {
  const { tracking } = useLocalSearchParams();
  const router = useRouter();
  const account = useApp();
  const records = typeof tracking === 'string' && validTracking(tracking)
    ? trackingRecords(account, tracking)
    : { parcels: [], registration: null };
  const { parcels, registration } = records;
  const statuses = parcels.map((parcel) => parcel.status);
  const tab = !statuses.length ? 'waiting'
    : statuses.every((status) => status === 'delivered') ? 'history'
    : statuses.every((status) => status === 'ready_pickup') ? 'ready' : 'active';
  const list = () => router.dismissTo({ pathname: '/(tabs)/parcels', params: { tab } });

  return (
    <Screen>
      <NavBar title="Тээврийн дугаарын бүртгэл" onBack={() => router.canGoBack() ? router.back() : list()} />
      <View style={{ gap: 14 }}>
        {registration || parcels.length ? (
          <>
            <T size={20} weight="700">{tracking}</T>
            {registration && <T size={13} color={colors.textSecondary}>{registration.carrier} · {registration.createdAt}</T>}
            {registration?.orderRef && <T size={13} color={colors.textSecondary}>Захиалгын дугаар: {registration.orderRef}</T>}
            {parcels.length ? (
              <>
                <T size={16} weight="700">Холбогдсон багц: {parcels.length}</T>
                {parcels.map((parcel) => <ParcelCard key={parcel.id} parcel={parcel} />)}
              </>
            ) : (
              <>
                <T size={15} weight="600">Агуулахад ирэхийг хүлээж байна</T>
                <T size={13} color={colors.textSecondary}>Агуулах ачааг хүлээн авсны дараа холбогдсон багц энд харагдана.</T>
                <Btn kind="secondary" title="Туршилтын ачаа хүлээн авах" onPress={() => account.receiveDemoParcel(tracking)} />
              </>
            )}
          </>
        ) : <T size={14} color={colors.textSecondary}>Тээврийн дугаарын бүртгэл олдсонгүй.</T>}
        <Btn kind="secondary" title="Миний ачаа руу буцах" onPress={list} />
      </View>
    </Screen>
  );
}
