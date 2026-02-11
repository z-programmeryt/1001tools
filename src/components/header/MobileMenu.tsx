'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems } from '@/config/navigation';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="glass h-10 w-10 rounded-full lg:hidden" onClick={() => setOpen(true)}>☰</button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
          <button className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} aria-label="Close" />
          <nav className="glass absolute left-0 top-0 h-full w-80 max-w-[86vw] space-y-2 p-4">
            {navItems.map((item) => (
              <Link key={item.href + item.label} href={item.href} className="block rounded-lg border border-slate-300/40 p-3" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
