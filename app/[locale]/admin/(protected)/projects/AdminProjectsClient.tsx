'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import AdminProjectModal, { ProjectData } from './AdminProjectModal';

export default function AdminProjectsClient() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects?seed=true');
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map((p: any) => ({
          _id: p._id,
          title: p.title,
          description: p.description,
          location: p.location,
          year: p.year,
          images: [p.coverImage, ...(p.gallery || [])].filter(Boolean),
          isActive: p.isActive,
        }));
        setProjects(mappedData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: ProjectData) => {
    setEditingProject(project || null);
    setIsModalOpen(true);
  };

  const handleSave = async (project: ProjectData) => {
    const url = project._id ? `/api/admin/projects/${project._id}` : '/api/admin/projects';
    const method = project._id ? 'PUT' : 'POST';

    const payload = {
      ...project,
      coverImage: project.images[0],
      gallery: project.images.slice(1),
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Failed to save project');
    }
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjs = [...projects];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newProjs[index];
    newProjs[index] = newProjs[swapIndex];
    newProjs[swapIndex] = temp;

    setProjects(newProjs);

    const orderedIds = newProjs.map(p => p._id);
    try {
      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async (project: ProjectData) => {
    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !project.isActive }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold font-sans text-white">Projeler</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Yeni Ekle</span>
        </button>
      </div>

      {loading ? (
        <div className="text-neutral-400 py-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl">Yükleniyor...</div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm uppercase tracking-wider">
                  <th className="p-4 w-16 text-center">Sıra</th>
                  <th className="p-4 w-24">Kapak</th>
                  <th className="p-4">Proje Adı (TR)</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4 text-center">Durum</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj, index) => (
                  <tr key={proj._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1 text-neutral-500">
                        <button 
                          onClick={() => moveProject(index, 'up')}
                          disabled={index === 0}
                          className="hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                        >
                          ▲
                        </button>
                        <span className="text-xs">{index + 1}</span>
                        <button 
                          onClick={() => moveProject(index, 'down')}
                          disabled={index === projects.length - 1}
                          className="hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="w-16 h-12 relative bg-neutral-950 rounded overflow-hidden">
                        {proj.images?.[0] ? (
                          <Image
                            src={proj.images[0]}
                            alt={proj.title.tr || ''}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-[10px] text-neutral-500 w-full h-full flex items-center justify-center text-center leading-tight">Görsel Yok</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">
                      {proj.title.tr}
                      <span className="block text-xs text-neutral-500 font-normal mt-1">{proj.images.length} Görsel</span>
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {proj.location} <span className="opacity-50">·</span> {proj.year}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(proj)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          proj.isActive
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {proj.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(proj)}
                        className="p-2 text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(proj._id!)}
                        className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                      Henüz hiç proje eklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        onSave={handleSave}
      />
    </div>
  );
}
