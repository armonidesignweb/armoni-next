'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ redirectUrl }: { redirectUrl: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = redirectUrl;
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors py-2 rounded-md text-sm font-medium"
    >
      <LogOut className="w-4 h-4" />
      <span>Çıkış Yap</span>
    </button>
  );
}
