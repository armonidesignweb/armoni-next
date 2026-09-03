'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Ticket {
  _id: string;
  subject: string;
  status: 'new' | 'investigating' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export default function SupportClient({ initialTickets, locale }: { initialTickets: Ticket[], locale: string }) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const statusMap = {
    new: { label: 'Yeni', icon: AlertCircle, color: 'text-blue-400' },
    investigating: { label: 'İnceleniyor', icon: Clock, color: 'text-amber-400' },
    answered: { label: 'Cevaplandı', icon: CheckCircle, color: 'text-green-400' },
    closed: { label: 'Kapalı', icon: CheckCircle, color: 'text-neutral-500' }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setLoading(true);

    try {
      const res = await fetch('/api/account/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message })
      });

      if (res.ok) {
        const newTicket = await res.json();
        setTickets([newTicket, ...tickets]);
        setIsCreating(false);
        setSubject('');
        setMessage('');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white mb-2">Yardım & Destek</h1>
          <p className="text-neutral-400 text-sm">Destek taleplerinizi buradan oluşturabilir ve takip edebilirsiniz.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Talep</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-medium text-white mb-4">Yeni Destek Talebi</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Konu Seçiniz</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                required
              >
                <option value="">Seçiniz...</option>
                <option value="Ürün hakkında bilgi">Ürün hakkında bilgi</option>
                <option value="Fiyat hakkında">Fiyat hakkında</option>
                <option value="Sipariş">Sipariş</option>
                <option value="Teknik destek">Teknik destek</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Mesajınız</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 resize-none"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {tickets.length > 0 ? (
          <div className="divide-y divide-neutral-800">
            {tickets.map((ticket) => {
              const status = statusMap[ticket.status] || statusMap.new;
              const StatusIcon = status.icon;
              return (
                <Link 
                  href={`/${locale}/account/support/${ticket._id}`} 
                  key={ticket._id}
                  className="flex items-center p-4 hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-white font-medium truncate">{ticket.subject}</h3>
                      <span className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-neutral-500 space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                      </span>
                      <span>ID: #{ticket._id.substring(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="text-neutral-500 group-hover:text-brand-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <LifeBuoyIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Henüz destek talebiniz bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LifeBuoyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}
