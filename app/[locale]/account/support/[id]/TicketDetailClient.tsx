'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  sender: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

interface Ticket {
  _id: string;
  subject: string;
  status: string;
  messages: Message[];
  createdAt: string;
}

export default function TicketDetailClient({ ticket, locale }: { ticket: Ticket, locale: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(ticket.messages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/account/support/${ticket._id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });

      if (res.ok) {
        const updatedTicket = await res.json();
        setMessages(updatedTicket.messages);
        setNewMessage('');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link 
          href={`/${locale}/account/support`} 
          className="inline-flex items-center text-sm text-neutral-400 hover:text-brand-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Taleplere Dön
        </Link>
        <h1 className="text-2xl font-bold font-sans text-white">{ticket.subject}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Talep No: #{ticket._id.substring(0, 8).toUpperCase()} • Oluşturulma: {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mb-6 flex flex-col min-h-[400px]">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div key={index} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  isCustomer 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-tl-none'
                }`}>
                  <div className="text-xs opacity-70 mb-1 flex justify-between items-center">
                    <span>{isCustomer ? 'Siz' : 'Destek Ekibi'}</span>
                    <span className="ml-4">{new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {ticket.status !== 'closed' ? (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
            <form onSubmit={handleReply} className="flex space-x-3">
              <textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Cevabınızı yazın..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
                rows={2}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="self-end bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900 text-center text-neutral-500 text-sm">
            Bu destek talebi kapatılmıştır.
          </div>
        )}
      </div>
    </div>
  );
}
