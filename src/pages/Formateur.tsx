import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoriesFormation } from '@/lib/mock-data';
import { GraduationCap, Crown, CheckCircle2, Lock, ArrowRight, DollarSign, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const avantages = [
  { icon: DollarSign, title: '80% des revenus',      desc: 'Vous gardez 80% de chaque vente. EduMali prend 20% de commission.' },
  { icon: Users,      title: 'Audience malienne',    desc: 'Accès à des milliers d\'étudiants et lycéens maliens actifs sur EduMali.' },
  { icon: Star,       title: 'Badge Certifié',        desc: 'Badge "Formateur Certifié EduMali" visible sur votre profil public.' },
  { icon: GraduationCap, title: 'Dashboard complet', desc: 'Suivez vos ventes, revenus, inscrits et messages depuis votre espace.' },
];

const Formateur = () => {
  const { user } = useAuth();
  const isPremium = false; // TODO: lire depuis le profil
  const [nom, setNom]           = useState('');
  const [email, setEmail]       = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!nom || !email || !expertise || !experience || !motivation) {
      toast.error('Remplissez tous les champs du formulaire.');
      return;
    }
    toast.success('Demande envoyée ! Vous serez contacté sous 48h.');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Demande envoyée !</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Notre équipe examinera votre candidature et vous contactera sous 48h à l'adresse {email}.
          </p>
          <Link to="/formations" className="mt-6">
            <Button variant="outline">Voir les formations</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 mb-5">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold">Devenez Formateur EduMali</h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Partagez votre expertise avec des milliers d'étudiants maliens. Créez et vendez vos formations. Gagnez 80% des revenus.
          </p>
        </div>

        {/* Avantages */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {avantages.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Prérequis Premium */}
        {!isPremium && !user && (
          <div className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-6 flex flex-col sm:flex-row items-center gap-4">
            <Crown className="h-10 w-10 text-accent shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold">Premium requis pour devenir formateur</p>
              <p className="mt-1 text-sm text-muted-foreground">L'abonnement EduMali Premium (5 000 FCFA/mois) est obligatoire pour créer et vendre des formations.</p>
            </div>
            <Link to="/premium" className="shrink-0">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                <Crown className="h-4 w-4" /> Passer Premium
              </Button>
            </Link>
          </div>
        )}

        {/* Process */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-center mb-6">Comment ça marche</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { n: '01', title: 'Postulez',       desc: 'Remplissez le formulaire ci-dessous avec vos informations et expertise.' },
              { n: '02', title: 'Validation',      desc: 'Notre équipe valide votre profil et vous attribue le badge Formateur sous 48h.' },
              { n: '03', title: 'Créez & Vendez',  desc: 'Accédez au studio, créez vos formations et commencez à générer des revenus.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="relative flex flex-col items-center text-center gap-2 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-xl font-extrabold text-primary">{n}</div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Formulaire de candidature
          </h2>

          {!user ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Lock className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">Connexion requise</p>
              <p className="mt-1 text-sm text-muted-foreground">Vous devez être connecté pour soumettre une candidature.</p>
              <div className="mt-4 flex gap-3">
                <Link to="/connexion"><Button>Se connecter</Button></Link>
                <Link to="/inscription"><Button variant="outline">Créer un compte</Button></Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet <span className="text-destructive">*</span></label>
                  <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dr. Aminata Coulibaly" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Domaine d'expertise <span className="text-destructive">*</span></label>
                <Select value={expertise} onValueChange={setExpertise}>
                  <SelectTrigger><SelectValue placeholder="Choisir votre domaine principal" /></SelectTrigger>
                  <SelectContent>
                    {categoriesFormation.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expérience professionnelle <span className="text-destructive">*</span></label>
                <Textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Décrivez votre parcours : diplômes, années d'expérience, postes occupés..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pourquoi voulez-vous devenir formateur sur EduMali ? <span className="text-destructive">*</span></label>
                <Textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Parlez de votre motivation, de la formation que vous souhaitez créer..."
                  rows={4}
                />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 gap-2" size="lg" onClick={handleSubmit}>
                <GraduationCap className="h-4 w-4" />
                Soumettre ma candidature
              </Button>
              <p className="text-center text-xs text-muted-foreground">Réponse sous 48h par email</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Formateur;
