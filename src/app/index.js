import React from 'react';
import { Redirect } from 'expo-router';
import { useApp } from '../store';

export default function Index() {
  const { authed } = useApp();
  return <Redirect href={authed ? '/(tabs)/home' : '/login'} />;
}
