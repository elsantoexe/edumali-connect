import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { ResourceCard } from '@/components/ResourceCard';
import { mockAnnales, matieres, series, niveaux, typesRessource, annees } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const typeLabels: Record<string, string> = {
  annale: 'Annale', cours: 'Cours', corrige: 'Corrigé', resume: 'Résumé', tp: 'TP',
};

const Ressources = () => {
  const [search, setSearch]   = useState('');
  const [matiere, setMatiere] = useState('all');
  const [serie, setSerie]     = useState('all');
  const [niveau, setNiveau]   = useState('all');
  const [type, setType]       = useState('all');
  const [annee, setAnnee]     = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [matiere, serie, niveau, type, annee].filter((v) => v !== 'all').length;

  const filtered = useMemo(() => {
    return mockAnnales
      .filter((a) => {
        if (search   && !a.titre.toLowerCase().includes(search.toLowerCase())) return false;
        if (matiere !== 'all' && a.matiere !== matiere)   return false;
        if (serie   !== 'all' && a.serie   !== serie)     return false;
        if (niveau  !== 'all' && a.niveau  !== niveau)    return false;
        if (type    !== 'all' && a.type    !== type)      return false;
        if (annee   !== 'all' && a.annee   !== Number(annee)) return false;
        return true;
      })
      .sort((a, b) => b.annee - a.annee);
  }, [search, matiere, serie, niveau, type, annee]);

  const reset = () => {
    setMatiere('all'); setSerie('all'); setNiveau('all'); setType('all'); setAnnee('all');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bibliothèque P2P</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} ressource{filtered.length > 1 ? 's' : ''} — annales, cours, corrigés, résumés
            </p>
          </div>
          <Link to="/ressources/partager">
            <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 shrink-0">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Partager</span>
            </Button>
          </Link>
        </div>

        {/* Search + filter toggle */}
        <div className="mt-6 flex gap-2">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une ressource..." />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {typesRessource.map((t) => <SelectItem key={t} value={t}>{typeLabels[t]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={matiere} onValueChange={setMatiere}>
                <SelectTrigger><SelectValue placeholder="Matière" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes matières</SelectItem>
                  {matieres.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  {niveaux.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={serie} onValueChange={setSerie}>
                <SelectTrigger><SelectValue placeholder="Série" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes séries</SelectItem>
                  {series.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={annee} onValueChange={setAnnee}>
                <SelectTrigger><SelectValue placeholder="Année" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes années</SelectItem>
                  {annees.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={reset} className="mt-2 gap-1 text-xs text-muted-foreground">
                <X className="h-3 w-3" /> Réinitialiser les filtres
              </Button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters > 0 && !showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { val: matiere, reset: () => setMatiere('all') },
              { val: serie,   reset: () => setSerie('all')   },
              { val: niveau,  reset: () => setNiveau('all')  },
              { val: type,    reset: () => setType('all')    },
              { val: annee,   reset: () => setAnnee('all')   },
            ].filter(({ val }) => val !== 'all').map(({ val, reset: r }) => (
              <button
                key={val}
                onClick={r}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                {typeLabels[val] ?? val}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((a) => <ResourceCard key={a.id} {...a} />)
          ) : (
            <div className="col-span-full flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                <span className="text-2xl">📂</span>
              </div>
              <p className="mt-4 font-medium">Aucune ressource trouvée</p>
              <p className="mt-1 text-sm text-muted-foreground">Essayez de modifier vos filtres ou partagez la première !</p>
              <Link to="/ressources/partager" className="mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" /> Partager un document
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Ressources;
