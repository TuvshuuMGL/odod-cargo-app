import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider, useApp } from '../store';
import { ToastHost } from '../components/ui';

function RootStack() {
  const { authed, toast } = useApp();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="help/[key]" />
        <Stack.Protected guard={!authed}>
          <Stack.Screen name="login" />
          <Stack.Screen name="otp" />
        </Stack.Protected>
        <Stack.Protected guard={authed}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="address" />
          <Stack.Screen name="register-tracking" />
          <Stack.Screen name="parcel/[id]" />
          <Stack.Screen name="pickup/[id]" />
          <Stack.Screen name="invoice/[id]" />
          <Stack.Screen name="registration/[tracking]" />
        </Stack.Protected>
      </Stack>
      <ToastHost message={toast} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootStack />
    </AppProvider>
  );
}
