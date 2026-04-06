import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { mockFormations } from '@/lib/mock-data';
import { Star, Users, Clock, BookOpen, CheckCircle, Lock, ArrowLeft, GraduationCap, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const mockModules = [
  { id: 1, titre: "Introduction & objectifs",         duree: "12 min", libre: true  },
  { id: 2, titre: "Module 1 — Fondamentaux",          duree: "28 min", libre: false },
  { id: 3, titre: "Module 2 — Exercices guidés",      duree: "35 min", libre: false },
  { id: 4, titre: "Module 3 — Cas pratiques",         duree: "42 min", libre: false },
  { id: 5, titre: "Quiz de mi-parcours",              duree: "15 min", libre: false },
  { id: 6, titre: "Module 4 — Approfondissement",     duree: "50 min", libre: false },
  { id: 7, titre: "Module 5 — Méthodologie examen",   duree: "38 min", libre: false },
  { id: 8, titre: "Corrigé complet + PDF de synthèse",duree: "25 min", libre: false },
];

const FormationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const formation = mockFormations.find((f) => f.id === id);

  if (!formation) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center">
          <p className="text-muted-foreground">Formation introuvable.</p>
          <Link to="/formations" className="mt-4"><Button variant="outline">Retour aux formations</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleAcheter = () => {
    if (!user) {
      toast.error('Connectez-vous pour acheter cette formation.');
      return;
    }
    toast.info('Paiement bientôt disponible — Orange Money & Carte bancaire');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/formations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Toutes les formations
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{formation.categorie}</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{formation.niveau}</span>
              </div>
              <h1 className="text-2xl font-bold leading-snug md:text-3xl">{formation.titre}</h1>
              <p className="mt-3 text-muted-foreground">{formation.description}</p>

              {/* Stats */}
              <div className="mt-5 flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <Star className="h-4 w-4 fill-accent" />
                  {formation.note_moyenne.toFixed(1)} / 5
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {formation.nb_inscrits.toLocaleString()} inscrits
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {formation.nb_modules} modules
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formation.duree_heures}h de contenu
                </div>
              </div>

              {/* Formateur */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-lg">
                  {formation.formateur.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{formation.formateur.full_name}</p>
                  <p className="text-sm text-muted-foreground">@{formation.formateur.username}</p>
                  <span className="badge-formateur mt-1"><GraduationCap className="h-3 w-3" /> Formateur Certifié</span>
                </div>
              </div>

              {/* Ce que vous apprendrez */}
              <div className="mt-8">
                <h2 className="font-bold text-lg mb-3">Ce que vous allez apprendre</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    'Maîtriser les bases fondamentales',
                    'Appliquer les méthodes avec des exercices',
                    'Résoudre des cas pratiques concrets',
                    'Préparer efficacement votre examen',
                    'Accéder aux corrigés détaillés',
                    'Télécharger le PDF de synthèse',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar acheter */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-xl">
                {/* Thumbnail */}
                <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary/20 to-transparent mb-5">
                  <Play className="h-12 w-12 text-primary/40" />
                </div>

                <p className="text-3xl font-extrabold">{formation.prix_fcfa.toLocaleString()} FCFA</p>
                <p className="text-xs text-muted-foreground mt-0.5">Accès à vie · {formation.nb_modules} modules</p>

                <Button
                  className="mt-4 w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  size="lg"
                  onClick={handleAcheter}
                >
                  Acheter la formation
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">Orange Money · Moov Money · Carte bancaire</p>

                {/* Contenu */}
                <div className="mt-5 border-t border-border pt-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Aperçu du contenu</p>
                  {mockModules.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-sm py-1.5">
                      {m.libre
                        ? <Play className="h-4 w-4 text-primary shrink-0" />
                        : <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      }
                      <span className={m.libre ? 'text-foreground' : 'text-muted-foreground'}>{m.titre}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{m.duree}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-1">+ {mockModules.length - 4} autres modules après achat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programme complet */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Programme complet</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          {mockModules.map((m, i) => (
            <div
              key={m.id}
              className={`flex items-center gap-3 px-5 py-4 text-sm ${i < mockModules.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold">
                {m.id}
              </span>
              <span className={m.libre ? 'flex-1 font-medium' : 'flex-1 text-muted-foreground'}>{m.titre}</span>
              {m.libre && <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">Gratuit</span>}
              <span className="text-xs text-muted-foreground">{m.duree}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FormationDetail;
