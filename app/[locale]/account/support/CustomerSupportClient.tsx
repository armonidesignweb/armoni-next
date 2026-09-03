'use client';

import { useState, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, XCircle, Clock, Plus, ArrowLeft, Paperclip, Search, Download } from 'lucide-react';
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
  messages: Message[];
};

export default function CustomerSupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // New Ticket State
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newAttachment, setNewAttachment] = useState('');
  
  // Reply State
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachment, setReplyAttachment] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Bekliyor</span>;
      case 'investigating': return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1"><Search className="w-3 h-3"/> İnceleniyor</span>;
      case 'answered': return <span className="px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Yanıtlandı</span>;
      case 'closed': return <span className="px-3 py-1 bg-neutral-800 text-neutral-500 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3"/> Kapatıldı</span>;
      default: return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setAttachment: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'support');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setAttachment(data.url);
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Dosya yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: newSubject, 
          message: newMessage, 
          attachment: newAttachment 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(prev => [data.ticket || data, ...prev]);
        setActiveView('list');
        setNewSubject('');
        setNewMessage('');
        setNewAttachment('');
      } else {
        alert('Talep oluşturulamadı.');
      }
    } catch (error) {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/support/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage, attachment: replyAttachment })
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
        setReplyAttachment('');
      }
    } catch (error) {
      alert('Yanıt gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* List View */}
      {activeView === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold font-serif text-white">Destek Taleplerim</h1>
            <button
              onClick={() => setActiveView('new')}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Talep Oluştur
            </button>
          </div>

          <div className="grid gap-4">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => { setSelectedTicket(ticket); setActiveView('detail'); }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-brand-500/30 hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">{ticket.subject}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-500">
                  <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> {ticket.messages.length} Mesaj
                  </span>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-xl">
                <MessageSquare className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Destek Talebi Bulunmuyor</h3>
                <p className="text-neutral-500 mb-6">Herhangi bir konuda desteğe ihtiyacınız varsa bizimle iletişime geçebilirsiniz.</p>
                <button
                  onClick={() => setActiveView('new')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Talep Oluştur
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* New Ticket View */}
      {activeView === 'new' && (
        <div className="max-w-3xl">
          <button
            onClick={() => setActiveView('list')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Taleplere Dön
          </button>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Yeni Destek Talebi Oluştur</h2>
            <form onSubmit={handleCreateTicket} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Konu *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Kısaca probleminizi veya isteğinizi özetleyin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Mesajınız *</label>
                <textarea
                  required
                  rows={5}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Detaylı bir şekilde açıklayın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Dosya Ekleri (Opsiyonel)</label>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e, setNewAttachment)}
                />
                
                {newAttachment ? (
                  <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-brand-400 text-sm truncate flex-1">Dosya yüklendi</span>
                    <button type="button" onClick={() => setNewAttachment('')} className="text-red-400 text-sm hover:underline">Kaldır</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 transition-colors disabled:opacity-50"
                  >
                    <Paperclip className="w-4 h-4" />
                    {uploading ? 'Yükleniyor...' : 'Dosya/Görsel Ekle'}
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View */}
      {activeView === 'detail' && selectedTicket && (
        <div className="max-w-4xl h-[calc(100vh-140px)] flex flex-col">
          <button
            onClick={() => { setActiveView('list'); setSelectedTicket(null); }}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Taleplere Dön
          </button>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex justify-between items-start bg-neutral-900 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedTicket.subject}</h2>
                <span className="text-sm text-neutral-400">Oluşturulma: {new Date(selectedTicket.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              {getStatusBadge(selectedTicket.status)}
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-neutral-950 custom-scrollbar">
              {selectedTicket.messages.map((msg, i) => (
                <div key={msg._id || i} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'customer' 
                      ? 'bg-brand-600/20 text-white rounded-tr-none border border-brand-500/30' 
                      : 'bg-neutral-800 text-white rounded-tl-none border border-neutral-700'
                  }`}>
                    {msg.sender === 'admin' && (
                      <p className="text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Müşteri Temsilcisi</p>
                    )}
                    
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    
                    {msg.attachment && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <a href={msg.attachment} target="_blank" rel="noreferrer" className="block relative w-full h-48 sm:h-64 rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
                            <Image src={msg.attachment} alt="Attachment" fill className="object-cover" />
                          </a>
                        ) : (
                          <a href={msg.attachment} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 bg-black/20 rounded-xl hover:bg-black/30 transition-colors text-sm">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4" />
                              Ekli Dosya
                            </div>
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                    
                    <span className={`block text-xs mt-3 text-right opacity-50`}>
                      {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 shrink-0">
              {selectedTicket.status !== 'closed' ? (
                <form onSubmit={handleReply} className="flex flex-col gap-3">
                  {replyAttachment && (
                    <div className="flex items-center gap-4 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                      <span className="text-brand-400 text-sm truncate flex-1">Dosya eklendi</span>
                      <button type="button" onClick={() => setReplyAttachment('')} className="text-red-400 text-sm hover:underline">Kaldır</button>
                    </div>
                  )}
                  <div className="flex gap-3 items-end">
                    <input
                      type="file"
                      className="hidden"
                      ref={replyFileInputRef}
                      onChange={(e) => handleFileUpload(e, setReplyAttachment)}
                    />
                    <button
                      type="button"
                      onClick={() => replyFileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-colors disabled:opacity-50"
                      title="Dosya Ekle"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 min-h-[50px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500 custom-scrollbar"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loading || uploading || !replyMessage.trim()}
                      className="bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center text-neutral-500 py-2">
                  Bu destek talebi kapatılmıştır. Yeni bir konu için lütfen yeni talep oluşturun.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
