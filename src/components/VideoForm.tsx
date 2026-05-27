import React, { useState } from 'react';
import { PlusCircle, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Project } from '../types';

interface VideoFormProps {
  onAddProject: (project: Omit<Project, 'id' | 'paid' | 'createdAt'>) => void;
}

export default function VideoForm({ onAddProject }: VideoFormProps) {
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [amount, setAmount] = useState('10000');
  const [type, setType] = useState('Advertising Video');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a video/project title.');
      return;
    }
    if (!date) {
      setError('Please select a completion date.');
      return;
    }
    const amtParsed = parseFloat(amount);
    if (!amount || isNaN(amtParsed) || amtParsed <= 0) {
      setError('Please enter a valid video compensation amount (IQD).');
      return;
    }

    setIsSubmitting(true);
    // Simulate slight responsive visual log feel
    setTimeout(() => {
      onAddProject({
        name: name.trim(),
        date,
        amount: amtParsed,
        type,
        notes: notes.trim(),
      });

      // Clear form except default parameters to boost speed
      setName('');
      setNotes('');
      // Keep amount 10000 and current date as default
      setDate(getTodayDateString());
      setIsSubmitting(false);
    }, 150);
  };

  return (
    <div className="max-w-[860px] mx-auto mb-7 bg-surface border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-5 border-b border-border/50 pb-3">
        <h2 className="font-sans font-extrabold text-sm tracking-wider uppercase text-accent flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-accent" /> Log a Completed Ad Video
        </h2>
        <span className="text-[10px] text-muted font-mono bg-card px-2 py-0.5 rounded-md border border-border/80">
          * Required Field
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg p-3 text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5Packed">
            <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
              <PlusCircle className="w-3 h-3 text-muted" /> Video / Project Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Peptonix Summer Ad #3"
              className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2.5 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5 border-t md:border-t-0 pt-2 md:pt-0 border-border/30">
              <Calendar className="w-3 h-3 text-muted" /> Date Completed *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2.5 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5 border-t border-border/30 pt-2 md:pt-0">
              <DollarSign className="w-3 h-3 text-accent" /> Amount (IQD) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2.5 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5 border-t border-border/30 pt-2 md:pt-0">
              <Tag className="w-3 h-3 text-accent2" /> Video Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2.5 outline-none transition cursor-pointer"
            >
              <option value="Advertising Video">Advertising Video</option>
              <option value="Product Promo">Product Promo</option>
              <option value="Social Media Ad">Social Media Ad</option>
              <option value="Story Ad">Story Ad</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
            <label className="text-[10px] text-muted uppercase tracking-wider font-mono flex items-center gap-1.5 border-t border-border/30 pt-2">
              <FileText className="w-3 h-3 text-muted" /> Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 30-second product highlight reel for Instagram..."
              className="bg-card border border-border focus:border-accent rounded-lg text-sm font-mono text-text-main px-3 py-2.5 outline-none transition resize-vertical min-h-[75px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3 bg-accent text-[#0d0d0d] rounded-xl font-sans font-extrabold tracking-wide uppercase hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent/10"
        >
          {isSubmitting ? 'Saving to Log...' : '✓ Save This Video'}
        </button>
      </form>
    </div>
  );
}
