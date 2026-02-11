'use client';

import { useState } from 'react';

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="glass h-10 w-10 rounded-full">🔎</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="glass mt-20 w-full max-w-2xl rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <input className="w-full rounded-xl border border-slate-300/50 bg-white/70 p-3 dark:bg-slate-900/60" placeholder="Search tools..." autoFocus />
          </div>
        </div>
      )}
    </>
  );
}
