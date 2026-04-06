import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { mockAnnales } from '@/lib/mock-data';
import { ArrowLeft, Download, Lock, FileText, Eye, Star, Share2, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const FREE_DAILY = 5;

const typeLabels: Record<string, string> = {
  annale: 'Annale', cours: 'Cours', corrige: 'Corrigé', resume: 'Résumé', tp: 'TP',
};

const RessourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const ressource = mockAnnales.find((a) => a.id === id);
  const [downloaded, setDownloaded] = useState(false);
  const [rating, setRating]         = useState(0);

  if (!ressource) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center">
          <p className="text-muted-foreground">Ressource introuvable.</p>
          <Link to="/ressources" className="mt-4"><Button variant="outline">Retour à la bibliothèque</Button></Link>
        </div>
      </Layout>
    );
  }

  const isPremiumOnly = ressource.is_premium_only;

  const handleDownload = () => {
    if (!user) {
      toast.error('Connectez-vous pour télécharger.');
      return;
    }
    if (isPremiumOnly) {
      toast.error('Ce fichier est réservé aux membres Premium.');
      return;
    }
    // simulate daily limit
    toast.success('Téléchargement démarré ! (0 fichier sur 5 utilisés aujourd\'hui)');
    setDownloaded(true);
  };

  const handleRate = (note: number) => {
    if (!user) { toast.error('Connectez-vous pour noter.'); return; }
    setRating(note);
    toast.success(`Note ${note}/5 enregistrée. Merci !`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/ressources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{typeLabels[ressource.type ?? 'annale']}</span>
                <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{ressource.matiere}</span>
                <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{ressource.serie}</span>
                {ressource.niveau && <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{ressource.niveau}</span>}
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{ressource.annee}</span>
                {isPremiumOnly && (
                  <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    <Lock className="h-3 w-3" /> Premium uniquement
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold md:text-2xl">{ressource.titre}</h1>

              {/* Aperçu */}
              <div className="mt-6 flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/50">
                {isPremiumOnly && !false /* !isPremium */ ? (
                  <div className="text-center">
                    <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Aperçu réservé aux membres Premium</p>
                    <Link to="/premium" className="mt-2 inline-block text-xs text-accent hover:underline">Passer Premium →</Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">{ressource.titre}</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF · {ressource.taille_mb ?? 1.0} MB</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3 text-center border-t border-border pt-5">
                {[
                  { icon: Download, label: 'Téléchargements', val: ressource.telechargements.toLocaleString() },
                  { icon: Clock,    label: 'Année',            val: ressource.annee },
                  { icon: FileText, label: 'Taille',           val: `${ressource.taille_mb ?? 1.0} MB` },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label}>
                    <Icon className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                    <p className="text-lg font-bold">{val}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notation */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-medium mb-3">Évaluer ce document</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleRate(n)}
                    className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'text-accent' : 'text-muted-foreground/30'}`}
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && <span className="ml-2 text-sm text-muted-foreground self-center">Noté {rating}/5</span>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-1">
                <Download className="h-5 w-5 text-primary" />
                <p className="font-bold">Télécharger</p>
              </div>

              {isPremiumOnly ? (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">Ce document est réservé aux membres Premium.</p>
                  <Link to="/premium" className="mt-4 block">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                      <Lock className="h-4 w-4" /> Passer Premium
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {!downloaded ? (
                    <>
                      <div className="my-3 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground space-y-1">
                        <p>📥 Limite gratuite : {FREE_DAILY} téléchargements/jour</p>
                        <Link to="/premium" className="text-accent hover:underline block">→ Illimité avec Premium</Link>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 gap-2"
                        size="lg"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                        Télécharger {ressource.taille_mb ?? 1.0} MB
                      </Button>
                    </>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 p-4">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-sm text-primary font-medium">Téléchargement démarré !</p>
                    </div>
                  )}
                  {!user && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      <Link to="/connexion" className="text-primary hover:underline">Connectez-vous</Link> pour télécharger
                    </p>
                  )}
                </>
              )}

              <div className="mt-4 border-t border-border pt-4">
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Lien copié !'); }}
                  className="flex w-full items-center gap-2 rounded-lg border border-border p-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Share2 className="h-4 w-4" /> Partager ce document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RessourceDetail;
