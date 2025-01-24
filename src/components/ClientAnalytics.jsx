'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/utils/analytics';

export default function ClientAnalytics() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
} 