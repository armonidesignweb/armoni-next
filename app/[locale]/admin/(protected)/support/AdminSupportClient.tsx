'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Send, CheckCircle, XCircle, Clock, Paperclip, Download } from 'lucide-react';
import Image from 'next/image';

type Message = {
  _id: string;
  sender: 'admin' | 'customer';
  message: string;
  attachment?: string;
  createdAt: string;
};

type Ticket = {
  _id: string;
  subject: string;
  status: 'new' | 'investigating' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  messages: Message[];
};

export default function AdminSupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState(false);

  const filteredTickets = tickets.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Yeni Talep</span>;
      case 'investigating': return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1"><Search className="w-3 h-3"/> İnceleniyor</span>;
      case 'answered': return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Yanıtlandı</span>;
      case 'closed': return <span className="px-3 py-1 bg-neutral-700 text-neutral-400 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3"/> Kapatıldı</span>;
      default: return null;
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: updated.status } : t));
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status: updated.status } : null);
        }
      }
    } catch (e) {
      alert('Durum güncellenemedi.');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', message: replyMessage })
      });
      if (res.ok) {
        const updated = await res.json();
        const updatedTicket = {
            ...selectedTicket,
            status: updated.status,
            messages: updated.messages.map((m: any) => ({
                _id: m._id || Math.random().toString(),
                sender: m.sender,
                message: m.message,
                attachment: m.attachment,
                createdAt: m.createdAt
            }))
        };
        setTickets(prev => prev.map(t => t._id === selectedTicket._id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyMessage('');
      }
    } catch (e) {
      alert('Yanıt gönderilemedi.');
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl min-h-[calc(100vh-100px)] flex gap-6">
      
      {/* Ticket List (Left Sidebar) */}
      <div className="w-1/3 flex flex-col gap-4 border-r border-neutral-800 pr-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-sans text-white">Destek Talepleri</h1>
        </div>

        <div className="flex gap-2 bg-neutral-950 p-1 rounded-lg">
          {(['all', 'new', 'answered', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${
                filter === f ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'new' ? 'Yeni' : f === 'answered' ? 'Yanıtlandı' : 'Kapalı'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredTickets.map(ticket => (
            <button
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedTicket?._id === ticket._id 
                  ? 'bg-primary-900/20 border-primary-500/50' 
                  : ticket.status === 'new'
                  ? 'bg-red-500/5 border-red-500/20 hover:bg-neutral-800/50'
                  : 'bg-neutral-950 border-neutral-800 hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium truncate pr-2">{ticket.subject}</h3>
                {getStatusBadge(ticket.status)}
              </div>
              <p className="text-sm text-neutral-400 mb-2 truncate">
                {ticket.user?.name} - {ticket.user?.company}
              </p>
              <div className="flex justify-between items-center text-xs text-neutral-500">
                <span>{new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {ticket.messages.length}
                </span>
              </div>
            </button>
          ))}
          {filteredTickets.length === 0 && (
            <p className="text-center text-neutral-500 text-sm mt-10">Kayıt bulunamadı.</p>
          )}
        </div>
      </div>

      {/* Ticket Details (Right Area) */}
      <div className="w-2/3 flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 bg-neutral-900 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedTicket.subject}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400">
                  <p><strong className="text-neutral-300">Müşteri:</strong> {selectedTicket.user?.name}</p>
                  <p><strong className="text-neutral-300">Firma:</strong> {selectedTicket.user?.company}</p>
                  <p><strong className="text-neutral-300">E-posta:</strong> {selectedTicket.user?.email}</p>
                  <p><strong className="text-neutral-300">Telefon:</strong> {selectedTicket.user?.phone}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(selectedTicket.status)}
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="new">Yeni</option>
                  <option value="investigating">İnceleniyor</option>
                  <option value="answered">Yanıtlandı</option>
                  <option value="closed">Kapatıldı</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {selectedTicket.messages.map((msg, i) => (
                <div key={msg._id || i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl p-4 ${
                    msg.sender === 'admin' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    
                    {msg.attachment && (
                      <div className="mt-3">
                        {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <a href={msg.attachment} target="_blank" rel="noreferrer" className="block relative w-full h-48 rounded-lg overflow-hidden border border-white/20 hover:opacity-90 transition-opacity">
                            <Image src={msg.attachment} alt="Attachment" fill className="object-cover" />
                          </a>
                        ) : (
                          <a href={msg.attachment} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors text-sm">
                            <Paperclip className="w-4 h-4" />
                            Ekli Dosyayı İndir
                            <Download className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                      </div>
                    )}
                    
                    <span className={`block text-xs mt-2 ${msg.sender === 'admin' ? 'text-primary-200' : 'text-neutral-500'}`}>
                      {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== 'closed' ? (
              <form onSubmit={handleReply} className="p-4 bg-neutral-900 border-t border-neutral-800 flex gap-3 items-end">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 min-h-[50px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar"
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={replying || !replyMessage.trim()}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 text-center text-neutral-500">
                Bu talep kapatıldığı için mesaj gönderilemez.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p>Detayları görmek için sol taraftan bir talep seçin.</p>
          </div>
        )}
      </div>

    </div>
  );
}
