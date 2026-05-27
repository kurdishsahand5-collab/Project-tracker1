import { Film, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface StatsRowProps {
  projects: Project[];
}

export default function StatsRow({ projects }: StatsRowProps) {
  const totalCount = projects.length;
  const totalEarned = projects.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = projects.filter((p) => p.paid).reduce((sum, p) => sum + p.amount, 0);
  const totalOwed = projects.filter((p) => !p.paid).reduce((sum, p) => sum + p.amount, 0);

  const formatMoney = (val: number) => {
    return val.toLocaleString('en-US') + ' IQD';
  };

  const stats = [
    {
      label: 'Videos Done',
      value: totalCount.toString(),
      colorClass: 'text-accent',
      borderColor: 'border-accent/10',
      icon: <Film className="w-4 h-4 text-accent" />,
      bgIcon: 'bg-accent/5',
    },
    {
      label: 'Total Earned',
      value: formatMoney(totalEarned),
      colorClass: 'text-accent2',
      borderColor: 'border-accent2/10',
      icon: <DollarSign className="w-4 h-4 text-accent2" />,
      bgIcon: 'bg-accent2/5',
    },
    {
      label: 'Paid',
      value: formatMoney(totalPaid),
      colorClass: 'text-success',
      borderColor: 'border-success/10',
      icon: <CheckCircle2 className="w-4 h-4 text-success" />,
      bgIcon: 'bg-success/5',
    },
    {
      label: 'Owed to You',
      value: formatMoney(totalOwed),
      colorClass: 'text-danger',
      borderColor: 'border-danger/10',
      icon: <AlertCircle className="w-4 h-4 text-danger" />,
      bgIcon: 'bg-danger/5',
    },
  ];

  return (
    <div className="max-w-[860px] mx-auto mb-7 grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-surface border border-border/80 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-border duration-200 relative overflow-hidden group`}
        >
          {/* subtle background glow on hover */}
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl ${stat.bgIcon}`} />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-muted tracking-wider uppercase font-mono">
              {stat.label}
            </span>
            <div className={`p-1.5 rounded-lg ${stat.bgIcon}`}>
              {stat.icon}
            </div>
          </div>
          <div className={`font-sans font-extrabold text-lg sm:text-xl truncate ${stat.colorClass}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
