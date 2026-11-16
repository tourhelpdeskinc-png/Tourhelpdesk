"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import CookiePolicyPage from '../../components/CookiePolicyPage';

export default function CookiePolicyRoute() {
  const router = useRouter();
  return <CookiePolicyPage onBack={() => router.push('/')} />;
}
