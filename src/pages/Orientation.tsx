import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { EtablissementCard } from '@/components/EtablissementCard';
import { mockEtablissements, villes } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Orientation = () => {
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('all');

  const filtered = useMemo(() => {
    return mockEtablissements.filter((e) => {
      if (search && !e.nom.toLowerCase().includes(search.toLowerCase())) return false;
      if (ville !== 'all' && e.ville !== ville) return false;
      return true;
    });
  }, [search, ville]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold">Orientation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Découvrez les universités et filières du Mali.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un établissement..." />
          <Select value={ville} onValueChange={setVille}>
            <SelectTrigger><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {villes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((e) => <EtablissementCard key={e.id} {...e} />)
          ) : (
            <p className="col-span-full py-12 text-center text-muted-foreground">Aucun établissement trouvé.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orientation;
