import { Calendar, Edit2, ClipboardList, Trash2, Check, RotateCcw, Lock } from 'lucide-react';
import { Project } from '../types';

interface VideoCardProps {
  key?: string;
  project: Project;
  indexNumber: number; // Chromatic index based on oldest-first numbering
  onEdit: (project: Project) => void;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
  isCreator: boolean;
}

export default function VideoCard({
  project,
  indexNumber,
  onEdit,
  onTogglePaid,
  onDelete,
  isCreator,
}: VideoCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [y, m, d] = parts;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const monthIndex = parseInt(m) - 1;
    const monthName = months[monthIndex] || m;
    return `${parseInt(d)} ${monthName} ${y}`;
  };

  const formatMoney = (val: number) => {
    return val.toLocaleString('en-US') + ' IQD';
  };

  return (
    <div className="bg-surface border border-border/80 rounded-xl p-5 hover:border-border/150 transition-all duration-200 shadow-md flex flex-col justify-between relative group">
      <div>
        {/* Card Top */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="min-w-0">
            <span className="text-[10px] text-muted tracking-wider uppercase font-mono block mb-1">
              Video #{indexNumber} &nbsp;·&nbsp; {project.type}
            </span>
            <h4 className="font-sans font-bold text-base text-text-main leading-tight truncate-two-lines">
              {project.name}
            </h4>
          </div>
          <span
            className={`text-[9px] font-mono px-2.5 py-1 rounded-full border tracking-wide uppercase font-semibold ${
              project.paid
                ? 'bg-accent/10 border-accent/25 text-accent'
                : 'bg-danger/10 border-danger/25 text-danger'
            }`}
          >
            {project.paid ? 'Paid ✓' : 'Unpaid'}
          </span>
        </div>

        {/* Completed details */}
        <div className="flex items-center gap-1.5 text-xs text-muted font-mono mb-3">
          <Calendar className="w-3.5 h-3.5 text-muted" />
          <span>Completed: {formatDate(project.date)}</span>
        </div>

        {/* Compensation amount */}
        <div className="font-sans font-extrabold text-xl md:text-2xl text-accent mb-4">
          {formatMoney(project.amount)}
        </div>

        {/* Notes (if any) */}
        {project.notes && (
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted leading-relaxed font-mono italic flex items-start gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-muted mt-0.5 flex-shrink-0" />
              <span>{project.notes}</span>
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/50">
        <button
          onClick={() => onEdit(project)}
          className="flex items-center gap-1 text-[11px] font-mono border border-info/20 text-info hover:bg-info/10 hover:border-info px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>

        {isCreator ? (
          <button
            onClick={() => onTogglePaid(project.id)}
            className={`flex items-center gap-1 text-[11px] font-mono border px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              project.paid
                ? 'border-muted/30 text-muted hover:bg-muted/10 hover:border-muted'
                : 'border-accent/20 text-accent hover:bg-accent/10 hover:border-accent'
            }`}
          >
            {project.paid ? (
              <>
                <RotateCcw className="w-3 h-3" /> Mark Unpaid
              </>
            ) : (
              <>
                <Check className="w-3 h-3" /> Mark Paid
              </>
            )}
          </button>
        ) : (
          <div
            title="Only Sahand (Creator) can verify transaction payments."
            className="flex items-center gap-1 text-[11px] font-mono border border-border bg-card/40 text-muted px-3 py-1.5 rounded-lg select-none cursor-not-allowed opacity-70"
          >
            <Lock className="w-3 h-3 text-muted" />
            <span>Sahand Only</span>
          </div>
        )}

        <button
          onClick={() => onDelete(project.id)}
          className="ml-auto flex items-center gap-1 text-[11px] font-mono border border-danger/20 text-danger hover:bg-danger/10 hover:border-danger px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
}
