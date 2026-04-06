import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ResourceCard } from '@/components/ResourceCard';
import { ForumPostCard } from '@/components/ForumPostCard';
import { FormationCard } from '@/components/FormationCard';
import { mockAnnales, mockForumPosts, mockFormations } from '@/lib/mock-data';
import { BookOpen, Users, GraduationCap, PlayCircle, ArrowRight, Upload, Crown, MessageSquare } from 'lucide-react';

const stats = [
  { icon: BookOpen,      label: 'Ressources',     value: '500+',  color: 'text-blue-400'   },
  { icon: Users,         label: 'Étudiants',       value: '10K+',  color: 'text-green-400'  },
  { icon: PlayCircle,    label: 'Formations',       value: '50+',   color: 'text-purple-400' },
  { icon: GraduationCap, label: 'Établissements',   value: '30+',   color: 'text-accent'     },
];

const features = [
  { icon: BookOpen,     title: 'Bibliothèque P2P',   desc: 'Annales, cours, corrigés, résumés partagés par des étudiants.', href: '/ressources', color: 'from-blue-600/20'   },
  { icon: PlayCircle,   title: 'Formations vidéo',    desc: 'Des formateurs certifiés créent des formations vendues en FCFA.', href: '/formations', color: 'from-purple-600/20' },
  { icon: MessageSquare,title: 'Forum communautaire', desc: "Pose tes questions, aide les autres, gagne de la réputation.",   href: '/forum',      color: 'from-green-600/20'  },
  { icon: Crown,        title: 'Premium 5 000 FCFA',  desc: 'Téléchargements illimités, formations, badge, sans pub.',         href: '/premium',    color: 'from-accent/20'     },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
          🇲🇱 La plateforme éducative du Mali
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-primary">Edu</span><span className="text-accent">Mali</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-xl">
          Le <strong className="text-foreground">Wikipedia + Udemy</strong> de l'étudiant malien.<br />
          Annales, cours P2P, formations vidéo et forum communautaire.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/ressources">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <BookOpen className="h-4 w-4" />
              Explorer les ressources
            </Button>
          </Link>
          <Link to="/ressources/partager">
            <Button variant="outline" size="lg" className="gap-2">
              <Upload className="h-4 w-4" />
              Partager un document
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-4 md:grid-cols-4 divide-x divide-y divide-border">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col items-center justify-center gap-1 py-8">
              <Icon className={`h-6 w-6 ${s.color}`} />
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>

    {/* Features */}
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-center text-2xl font-bold mb-2">Tout ce dont tu as besoin</h2>
      <p className="text-center text-sm text-muted-foreground mb-8">Une plateforme complète, conçue pour les lycéens et étudiants maliens.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.href} to={f.href}>
              <div className={`group flex flex-col gap-3 rounded-xl border border-border bg-gradient-to-br ${f.color} to-transparent p-5 transition-all hover:border-primary/30 hover:-translate-y-0.5`}>
                <Icon className="h-7 w-7 text-foreground/70" />
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
                <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorer →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>

    {/* Ressources récentes */}
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Ressources récentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Annales, corrigés, résumés — partagés par la communauté</p>
          </div>
          <Link to="/ressources" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockAnnales.slice(0, 6).map((a) => (
            <ResourceCard key={a.id} {...a} />
          ))}
        </div>
      </div>
    </section>

    {/* Formations */}
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Formations populaires</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Créées par des formateurs certifiés EduMali</p>
          </div>
          <Link to="/formations" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockFormations.slice(0, 3).map((f) => (
            <FormationCard key={f.id} {...f} />
          ))}
        </div>
      </div>
    </section>

    {/* Forum */}
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Discussions populaires</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Posez vos questions, aidez la communauté</p>
          </div>
          <Link to="/forum" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Voir le forum <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {mockForumPosts.slice(0, 3).map((p) => (
            <ForumPostCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA Premium */}
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Crown className="mx-auto h-10 w-10 text-accent mb-4" />
        <h2 className="text-2xl font-bold">Passez à EduMali Premium</h2>
        <p className="mt-2 text-muted-foreground">Téléchargements illimités, accès complet aux formations, badge Premium visible, sans publicité.</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/premium">
            <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
              <Crown className="h-4 w-4" />
              Passer Premium — 5 000 FCFA/mois
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
