import { Link } from 'react-router-dom';
import { Users, Clock, Star, BookOpen, GraduationCap } from 'lucide-react';

interface FormationCardProps {
  id: string;
  titre: string;
  description: string;
  formateur: { username: string; full_name: string; avatar_url: string | null };
  prix_fcfa: number;
  niveau: string;
  categorie: string;
  image_url: string | null;
  nb_inscrits: number;
  nb_modules: number;
  duree_heures: number;
  note_moyenne: number;
}

const categoryColors: Record<string, string> = {
  "Mathématiques": "from-blue-600/20 to-blue-800/10 border-blue-500/20",
  "Sciences":      "from-green-600/20 to-green-800/10 border-green-500/20",
  "Droit":         "from-purple-600/20 to-purple-800/10 border-purple-500/20",
  "Informatique":  "from-cyan-600/20 to-cyan-800/10 border-cyan-500/20",
  "Langues":       "from-yellow-600/20 to-yellow-800/10 border-yellow-500/20",
  "Comptabilité":  "from-orange-600/20 to-orange-800/10 border-orange-500/20",
};

export const FormationCard = ({
  id, titre, description, formateur, prix_fcfa, niveau, categorie,
  nb_inscrits, nb_modules, duree_heures, note_moyenne,
}: FormationCardProps) => {
  const gradient = categoryColors[categorie] ?? "from-primary/20 to-primary/5 border-primary/20";

  return (
    <Link to={`/formations/${id}`}>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
        {/* Thumbnail */}
        <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br border-b ${gradient}`}>
          <div className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-foreground/30" />
            <p className="mt-2 text-xs font-medium text-muted-foreground">{categorie}</p>
          </div>
          {/* Note */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-accent/30 bg-background/80 px-2 py-1 text-xs font-bold text-accent backdrop-blur">
            <Star className="h-3 w-3 fill-accent" />
            {note_moyenne.toFixed(1)}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{categorie}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{niveau}</span>
            </div>
            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {titre}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
          </div>

          {/* Formateur */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
              {formateur.full_name.charAt(0)}
            </div>
            <span>{formateur.full_name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{nb_inscrits.toLocaleString()}</span>
            <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{nb_modules} modules</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duree_heures}h</span>
          </div>
        </div>

        {/* Prix */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">
              {prix_fcfa === 0 ? 'Gratuit' : `${prix_fcfa.toLocaleString()} FCFA`}
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-medium text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              Voir →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
