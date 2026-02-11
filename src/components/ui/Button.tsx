import type { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-full border border-slate-300/50 px-4 py-2 text-sm ${props.className ?? ''}`} />;
}
