import { Link } from 'react-router-dom';
import { ArrowUp, MessageSquare, CheckCircle2, Tag } from 'lucide-react';

interface ForumPostCardProps {
  id: string;
  titre: string;
  body: string;
  categorie?: string;
  votes: number;
  answers?: number;
  answers_count?: number;
  is_resolved?: boolean;
  username: string;
  created_at: string;
}

const categorieColor: Record<string, string> = {
  "Révisions":   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Orientation": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Ressources":  "bg-green-500/10 text-green-400 border-green-500/20",
  "Bourses":     "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Informatique":"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Forum libre": "bg-secondary text-muted-foreground border-border",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days}j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)}sem`;
  return `il y a ${Math.floor(days / 30)}mois`;
}

export const ForumPostCard = ({
  id, titre, body, categorie, votes, answers, answers_count, is_resolved, username, created_at,
}: ForumPostCardProps) => {
  const nbAnswers = answers_count ?? answers ?? 0;
  const catColor = categorieColor[categorie ?? "Forum libre"] ?? categorieColor["Forum libre"];

  return (
    <Link to={`/forum/${id}`}>
      <div className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
        {/* Votes */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-border bg-secondary text-xs font-bold transition-colors group-hover:border-primary/30">
            <ArrowUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground">{votes}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            {categorie && (
              <span className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${catColor}`}>
                <Tag className="h-3 w-3" />
                {categorie}
              </span>
            )}
            {is_resolved && (
              <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <CheckCircle2 className="h-3 w-3" />
                Résolu
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {titre}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{body}</p>
          <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">@{username}</span>
            <span>{timeAgo(created_at)}</span>
            <span className="ml-auto flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {nbAnswers} réponse{nbAnswers > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
