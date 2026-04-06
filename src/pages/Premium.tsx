import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Check, X, Crown, Zap, GraduationCap, MessageSquare, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: Download,      label: 'Téléchargements',             free: '5/jour',   premium: 'Illimités'  },
  { icon: Upload,        label: 'Upload de documents',          free: '3 max / 50 MB', premium: 'Illimité / 500 MB' },
  { icon: MessageSquare, label: 'Messages par jour',            free: '20/jour',  premium: 'Illimités'  },
  { icon: Check,         label: 'Consulter toutes les ressources', free: true, premium: true           },
  { icon: Check,         label: 'Forum communautaire',          free: true,       premium: true         },
  { icon: Check,         label: 'Orientation & calendrier',     free: true,       premium: true         },
  { icon: Crown,         label: 'Badge Premium visible',        free: false,      premium: true         },
  { icon: GraduationCap, label: 'Accès aux formations achetées',free: false,      premium: true         },
  { icon: Zap,           label: 'Sans publicité',               free: false,      premium: true         },
  { icon: GraduationCap, label: 'Possibilité de devenir formateur', free: false,  premium: true         },
];

const paymentMethods = [
  { name: 'Orange Money Mali', icon: '🟠', desc: 'Paiement mobile instant' },
  { name: 'Moov Money',        icon: '🔵', desc: 'Paiement mobile instant' },
  { name: 'Carte bancaire',    icon: '💳', desc: 'Visa, Mastercard' },
];

const Premium = () => {
  const { user } = useAuth();

  const handlePay = (method: string) => {
    toast.info(`Paiement via ${method} bientôt disponible !`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 border border-accent/30 mb-5">
            <Crown className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">EduMali Premium</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Débloquez tout le potentiel d'EduMali. Téléchargements illimités, formations, badge, sans pub.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Gratuit */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Gratuit</p>
              <p className="mt-1 text-4xl font-extrabold">0 <span className="text-lg font-normal text-muted-foreground">FCFA</span></p>
              <p className="text-xs text-muted-foreground mt-1">Pour toujours</p>
            </div>
            <div className="space-y-3 mb-6">
              {features.map((f) => {
                const Icon = f.icon;
                const val = f.free;
                return (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    {val === false
                      ? <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      : <Check className="h-4 w-4 text-primary shrink-0" />
                    }
                    <span className={!val ? 'text-muted-foreground/60' : ''}>
                      {f.label}
                      {typeof val === 'string' && (
                        <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-xs">{val}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full" disabled>Plan actuel</Button>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/5 to-transparent p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-accent/20 border border-accent/30 px-2.5 py-1 text-xs font-bold text-accent">Recommandé</span>
            </div>
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                <p className="text-sm font-semibold text-accent uppercase tracking-wide">Premium</p>
              </div>
              <p className="mt-1 text-4xl font-extrabold">5 000 <span className="text-lg font-normal text-muted-foreground">FCFA/mois</span></p>
              <p className="text-xs text-muted-foreground mt-1">Annulable à tout moment</p>
            </div>
            <div className="space-y-3 mb-6">
              {features.map((f) => {
                const val = f.premium;
                return (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      {f.label}
                      {typeof val === 'string' && (
                        <span className="ml-2 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">{val}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Paiement */}
            {user ? (
              <div className="space-y-2">
                {paymentMethods.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePay(p.name)}
                    className="w-full flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm transition-colors hover:border-accent/30 hover:bg-accent/5"
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div className="text-left">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <span className="ml-auto text-accent font-bold text-sm">→</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/inscription">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" size="lg">
                    Créer un compte et passer Premium
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  Déjà un compte ? <Link to="/connexion" className="text-accent hover:underline">Connexion</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Comment annuler mon abonnement ?', r: 'Vous pouvez annuler à tout moment depuis votre espace "Mon compte". L\'accès Premium reste actif jusqu\'à la fin de la période payée.' },
              { q: 'Comment payer avec Orange Money ?', r: 'Sélectionnez "Orange Money Mali" et suivez les instructions. Vous recevrez un SMS de confirmation pour valider le paiement.' },
              { q: 'Comment devenir formateur ?', r: 'L\'abonnement Premium est requis pour devenir formateur. Une fois Premium, rendez-vous sur la page "Devenir formateur" pour soumettre votre demande.' },
            ].map(({ q, r }) => (
              <div key={q} className="rounded-xl border border-border bg-card p-5">
                <p className="font-medium text-sm">{q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Premium;
