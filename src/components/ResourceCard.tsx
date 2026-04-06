import { Link } from 'react-router-dom';
import { Download, FileText, Lock, Star, BookOpen, FlaskConical, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  id: string;
  titre: string;
  matiere: string;
  serie: string;
  niveau?: string;
  annee: number;
  type?: string;
  telechargements: number;
  taille_mb?: number;
  is_premium_only?: boolean;
}

const typeConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  annale:  { label: "Annale",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20",    icon: FileText     },
  corrige: { label: "Corrigé",  color: "bg-green-500/10 text-green-400 border-green-500/20", icon: PenLine      },
  cours:   { label: "Cours",    color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: BookOpen  },
  resume:  { label: "Résumé",   color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Star      },
  tp:      { label: "TP",       color: "bg-orange-500/10 text-orange-400 border-orange-500/20",  icon: FlaskConical },
};

export const ResourceCard = ({ id, titre, matiere, serie, niveau, annee, type = "annale", telechargements, taille_mb, is_premium_only }: ResourceCardProps) => {
  const cfg = typeConfig[type] ?? typeConfig.annale;
  const Icon = cfg.icon;

  return (
    <Link to={`/ressources/${id}`}>
      <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${cfg.color}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </div>
          {is_premium_only && (
            <div className="flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
              <Lock className="h-3 w-3" />
              Premium
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {titre}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{matiere}</span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{serie}</span>
          {niveau && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{niveau}</span>}
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-foreground">{annee}</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>{telechargements.toLocaleString()} télécharg.</span>
          </div>
          {taille_mb && <span>{taille_mb} MB</span>}
        </div>
      </div>
    </Link>
  );
};
