import React, { useState, useEffect } from 'react';
import { Edit2, Calendar, DollarSign, Tag, FileText, Check, X } from 'lucide-react';
import { Project } from '../types';

interface EditModalProps {
  project: Project | null;
  onSave: (id: string, updatedFields: Partial<Project>) => void;
  onClose: () => void;
}

export default function EditModal({ project, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Advertising Video');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Update input fields when modal is opened for a project
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDate(project.date);
      setAmount(project.amount.toString());
      setType(project.type);
      setNotes(project.notes || '');
      setError('');
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a video/project title.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    const amtParsed = parseFloat(amount);
    if (!amount || isNaN(amtParsed) || amtParsed <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    onSave(project.id, {
      name: name.trim(),
      date,
      amount: amtParsed,
      type,
      notes: notes.trim(),
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-surface border border-border rounded-2xl w-full max-w-[500px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-sans font-extrabold text-sm tracking-wider uppercase text-accent flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-accent" /> ✏ Edit Project
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-text-main p-1 rounded-lg hover:bg-card transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg p-3 text-xs font-mono">
              ⚠ {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
                Video / Project Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Date Completed *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2 outline-none transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Video Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2 outline-none transition cursor-pointer"
                >
                  <option value="Advertising Video">Advertising Video</option>
                  <option value="Product Promo">Product Promo</option>
                  <option value="Social Media Ad">Social Media Ad</option>
                  <option value="Story Ad">Story Ad</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> Amount (IQD) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2 outline-none transition resize-vertical"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-border">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-accent text-[#0d0d0d] rounded-lg font-sans font-extrabold tracking-wide uppercase hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-card text-muted border border-border hover:text-text-main rounded-lg font-mono text-xs hover:border-border transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
