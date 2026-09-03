'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Mail, MessageCircle, Trash2, Pencil, CheckSquare, Square, X } from 'lucide-react';

export interface CustomerData {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  isActive: boolean;
  locale?: string;
  createdAt: string;
}

export default function AdminCustomersClient() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modal states
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const lowerSearch = search.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.email.toLowerCase().includes(lowerSearch) ||
      (c.company && c.company.toLowerCase().includes(lowerSearch)) ||
      (c.phone && c.phone.includes(lowerSearch))
    );
  }, [customers, search]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCustomers.map(c => c._id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCustomers();
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      const res = await fetch(`/api/admin/customers/${editingCustomer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer),
      });
      if (res.ok) {
        fetchCustomers();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert('Geçerli bir telefon numarası bulunamadı.');
      return;
    }
    const message = encodeURIComponent('Merhaba, Armoni Design olarak sizinle iletişime geçiyoruz.');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const generateGmailLinks = () => {
    if (selectedIds.size === 0) {
      alert('Lütfen en az bir müşteri seçin.');
      return;
    }
    if (!emailSubject || !emailBody) {
      alert('Lütfen e-posta konusunu ve içeriğini doldurun.');
      return;
    }

    const selectedEmails = customers
      .filter(c => selectedIds.has(c._id))
      .map(c => c.email);

    const chunkSize = 15;
    for (let i = 0; i < selectedEmails.length; i += chunkSize) {
      const chunk = selectedEmails.slice(i, i + chunkSize);
      const bccList = chunk.join(',');
      
      const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}&bcc=${encodeURIComponent(bccList)}`;
      window.open(url, '_blank');
    }
    setIsEmailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold font-sans text-white">Müşteriler</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Ara (Ad, e-posta, firma, tel)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            disabled={selectedIds.size === 0}
            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail size={16} />
            <span>Toplu E-posta ({selectedIds.size})</span>
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm tracking-wider">
                <th className="p-4 w-12">
                  <button onClick={toggleSelectAll} className="text-neutral-500 hover:text-white transition-colors">
                    {selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-brand-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-medium uppercase">Ad Soyad</th>
                <th className="p-4 font-medium uppercase">Firma Adı</th>
                <th className="p-4 font-medium uppercase">İletişim</th>
                <th className="p-4 font-medium uppercase">Kayıt / Dil</th>
                <th className="p-4 font-medium uppercase text-center">Durum</th>
                <th className="p-4 font-medium uppercase text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">Yükleniyor...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">Kayıtlı müşteri bulunamadı.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4">
                      <button onClick={() => toggleSelect(customer._id)} className="text-neutral-500 hover:text-white transition-colors">
                        {selectedIds.has(customer._id) ? (
                          <CheckSquare className="w-5 h-5 text-brand-500" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-medium text-white">{customer.name}</td>
                    <td className="p-4 text-neutral-300">{customer.company || '-'}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-neutral-300">{customer.email}</span>
                        {customer.phone && <span className="text-neutral-400">{customer.phone}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="block text-neutral-300">{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</span>
                      <span className="uppercase text-xs text-brand-400 font-medium">{customer.locale || 'TR'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {customer.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {customer.phone && (
                        <button
                          onClick={() => sendWhatsApp(customer.phone!)}
                          className="p-2 text-green-400 hover:text-white bg-green-500/10 hover:bg-green-600 rounded-lg transition-colors"
                          title="WhatsApp'tan Mesaj Gönder"
                        >
                          <MessageCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingCustomer({ ...customer });
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h2 className="text-lg font-bold font-sans text-white">Müşteri Düzenle</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Firma Adı</label>
                <input
                  type="text"
                  value={editingCustomer.company || ''}
                  onChange={e => setEditingCustomer({...editingCustomer, company: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={editingCustomer.phone || ''}
                  onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Durum</label>
                <select
                  value={editingCustomer.isActive ? 'true' : 'false'}
                  onChange={e => setEditingCustomer({...editingCustomer, isActive: e.target.value === 'true'})}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Pasif</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white">İptal</button>
                <button type="submit" className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h2 className="text-lg font-bold font-sans text-white">Toplu E-posta Hazırla</h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 text-sm text-brand-200">
                <p><strong>{selectedIds.size}</strong> müşteri seçildi.</p>
                <p className="mt-1 opacity-80">Gönderim işlemi için Gmail hesap pencereniz açılacaktır. Güvenlik ve spam politikaları gereği e-postalar 15 kişilik BCC (Gizli kopya) gruplarına bölünerek {Math.ceil(selectedIds.size / 15)} ayrı sekme/pencere olarak hazırlanacaktır.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">E-posta Konusu</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Örn: Yeni Koleksiyonumuz Çıktı!"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Mesaj İçeriği</label>
                <textarea
                  required
                  rows={6}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder="Mesajınızı buraya yazın..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm focus:border-brand-500 outline-none resize-y"
                />
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white">İptal</button>
                <button 
                  type="button" 
                  onClick={generateGmailLinks}
                  disabled={!emailSubject || !emailBody}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <Mail size={16} />
                  <span>Gmail'de Aç ({Math.ceil(selectedIds.size / 15)} Grup)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
