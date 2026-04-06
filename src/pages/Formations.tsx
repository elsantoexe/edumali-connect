import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { FormationCard } from '@/components/FormationCard';
import { mockFormations, categoriesFormation, niveaux } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlayCircle, Plus, Star, Users, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Formations = () => {
  const [search, setSearch]       = useState('');
  const [categorie, setCategorie] = useState('all');
  const [niveau, setNiveau]       = useState('all');
  const [sort, setSort]           = useState('popular');
  const { user } = useAuth();

  const filtered = useMemo(() => {
    let list = mockFormations.filter((f) => {
      if (search    && !f.titre.toLowerCase().includes(search.toLowerCase())) return false;
      if (categorie !== 'all' && f.categorie !== categorie) return false;
      if (niveau    !== 'all' && f.niveau    !== niveau)    return false;
      return true;
    });
    if (sort === 'popular') list.sort((a, b) => b.nb_inscrits - a.nb_inscrits);
    else if (sort === 'note') list.sort((a, b) => b.note_moyenne - a.note_moyenne);
    else if (sort === 'recent') list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (sort === 'price_asc') list.sort((a, b) => a.prix_fcfa - b.prix_fcfa);
    return list;
  }, [search, categorie, niveau, sort]);

  const totalInscrits = mockFormations.reduce((s, f) => s + f.nb_inscrits, 0);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Marketplace de Formations</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {filtered.length} formation{filtered.length > 1 ? 's' : ''} · {totalInscrits.toLocaleString()} inscrits au total
            </p>
          </div>
          <Link to="/formations/creer">
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Créer</span>
            </Button>
          </Link>
        </div>

        {/* Stats band */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: PlayCircle, label: 'Formations',    value: mockFormations.length,                    color: 'text-purple-400' },
            { icon: Users,      label: 'Inscrits',      value: totalInscrits.toLocaleString() + '+',      color: 'text-green-400'  },
            { icon: Star,       label: 'Note moyenne',  value: (mockFormations.reduce((s, f) => s + f.note_moyenne, 0) / mockFormations.length).toFixed(1) + ' ★', color: 'text-accent' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
              <Icon className={`mx-auto h-5 w-5 ${color} mb-1`} />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une formation..." />
          <Select value={categorie} onValueChange={setCategorie}>
            <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categoriesFormation.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={niveau} onValueChange={setNiveau}>
            <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              {niveaux.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="note">Mieux notées</SelectItem>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((f) => <FormationCard key={f.id} {...f} />)
          ) : (
            <div className="col-span-full flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary text-2xl">🎓</div>
              <p className="mt-4 font-medium">Aucune formation trouvée</p>
              <p className="mt-1 text-sm text-muted-foreground">Modifiez vos filtres ou créez la première !</p>
            </div>
          )}
        </div>

        {/* CTA Formateur */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-primary mb-3" />
          <h3 className="text-xl font-bold">Devenez formateur sur EduMali</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Créez et vendez vos formations. Vous gardez <strong className="text-foreground">80%</strong> des revenus. Disponible pour les membres Premium.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/formateur"><Button className="gap-2 bg-primary hover:bg-primary/90">Devenir formateur</Button></Link>
            {!user && <Link to="/premium"><Button variant="outline">Voir Premium</Button></Link>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Formations;
