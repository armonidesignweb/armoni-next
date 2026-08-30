'use client';

import { useState } from 'react';
import { User, Mail, Building, Phone, Calendar, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export default function ProfileClient({ initialProfile, locale }: { initialProfile: UserProfile, locale: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: initialProfile.name,
    company: initialProfile.company || '',
    phone: initialProfile.phone || '',
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({ ...profile, ...data.user });
        setIsEditing(false);
        setSuccessMsg('Profiliniz başarıyla güncellendi.');
        setTimeout(() => setSuccessMsg(''), 3000);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMsg('Yeni şifreler eşleşmiyor.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMsg('Yeni şifre en az 6 karakter olmalıdır.');
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditingPassword(false);
        setPasswordSuccessMsg('Şifreniz başarıyla güncellendi.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccessMsg(''), 3000);
      } else {
        setPasswordErrorMsg(data.error || 'Şifre güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      setPasswordErrorMsg('Bağlantı hatası oluştu.');
    } finally {
      setPasswordLoading(false);
    }
  };


  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-serif text-white mb-2">Profil Bilgileri</h1>
          <p className="text-neutral-400 text-sm">Hesap bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-brand-900/50 rounded-full flex items-center justify-center text-brand-400 text-xl font-serif">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-medium text-white">{profile.name}</h2>
                <p className="text-sm text-neutral-400">{profile.company || 'Bireysel Müşteri'}</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors"
              >
                Düzenle
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Firma Adı</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">E-posta (Değiştirilemez)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-500 opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">E-posta</h3>
                  <div className="flex items-center space-x-2 text-white">
                    <Mail className="w-4 h-4 text-brand-400" />
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Telefon</h3>
                  <div className="flex items-center space-x-2 text-white">
                    <Phone className="w-4 h-4 text-brand-400" />
                    <span>{profile.phone || '-'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Firma Adı</h3>
                  <div className="flex items-center space-x-2 text-white">
                    <Building className="w-4 h-4 text-brand-400" />
                    <span>{profile.company || '-'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Kayıt Tarihi</h3>
                  <div className="flex items-center space-x-2 text-white">
                    <Calendar className="w-4 h-4 text-brand-400" />
                    <span>{new Date(profile.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Hesap Durumu</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${profile.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={profile.isActive ? 'text-green-400' : 'text-red-400'}>
                      {profile.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold font-serif text-white mb-2">Şifre Değiştir</h2>
          <p className="text-neutral-400 text-sm">Hesabınızın güvenliği için şifrenizi düzenli olarak güncelleyin.</p>
        </div>

        {passwordSuccessMsg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}
        
        {passwordErrorMsg && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordErrorMsg}</span>
          </div>
        )}

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden p-6">
           {isEditingPassword ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Mevcut Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="password" 
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Yeni Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="password" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Yeni Şifre (Tekrar)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="password" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start space-x-3 pt-4 mt-4">
                  <button 
                    type="submit" 
                    disabled={passwordLoading}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setPasswordErrorMsg('');
                    }}
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
           ) : (
               <button 
                onClick={() => setIsEditingPassword(true)}
                className="px-4 py-2 border border-neutral-700 hover:border-brand-500 text-white text-sm rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Şifre Değiştir
              </button>
           )}
        </div>
      </div>

    </div>
  );
}
