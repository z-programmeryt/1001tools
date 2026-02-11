'use client';

import type { ReactNode } from 'react';

export default function Modal({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/45">{children}</div>;
}
