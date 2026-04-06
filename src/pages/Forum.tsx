import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { ForumPostCard } from '@/components/ForumPostCard';
import { mockForumPosts, categoriesForum } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageSquare, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Forum = () => {
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('votes');
  const [categorie, setCategorie] = useState('all');
  const [resolved, setResolved]   = useState('all');
  const [open, setOpen]           = useState(false);
  const [newTitre, setNewTitre]   = useState('');
  const [newBody, setNewBody]     = useState('');
  const [newCat, setNewCat]       = useState('');
  const { user } = useAuth();

  const filtered = useMemo(() => {
    let posts = mockForumPosts.filter((p) => {
      if (search    && !p.titre.toLowerCase().includes(search.toLowerCase())) return false;
      if (categorie !== 'all' && p.categorie !== categorie) return false;
      if (resolved  === 'resolved'   && !p.is_resolved) return false;
      if (resolved  === 'unresolved' &&  p.is_resolved) return false;
      return true;
    });
    if (sort === 'votes')  posts.sort((a, b) => b.votes - a.votes);
    else if (sort === 'recent') posts.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (sort === 'answers') posts.sort((a, b) => b.answers_count - a.answers_count);
    return posts;
  }, [search, sort, categorie, resolved]);

  const handlePost = () => {
    if (!newTitre.trim() || !newBody.trim()) {
      toast.error('Remplissez le titre et la description.');
      return;
    }
    toast.success('Post publié avec succès !');
    setOpen(false);
    setNewTitre(''); setNewBody(''); setNewCat('');
  };

  const totalPosts    = mockForumPosts.length;
  const resolvedCount = mockForumPosts.filter((p) => p.is_resolved).length;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Forum communautaire</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalPosts} discussions · {resolvedCount} résolues
            </p>
          </div>
          {user ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 shrink-0">
                  <Plus className="h-4 w-4" /> Nouveau post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Créer une discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titre <span className="text-destructive">*</span></label>
                    <Input value={newTitre} onChange={(e) => setNewTitre(e.target.value)} placeholder="Posez votre question clairement..." maxLength={120} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
                    <Textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Décrivez le contexte, ce que vous avez déjà essayé..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select value={newCat} onValueChange={setNewCat}>
                      <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                      <SelectContent>
                        {categoriesForum.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                    <Button onClick={handlePost} className="bg-primary hover:bg-primary/90">Publier</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>

        {/* Stats band */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, label: 'Total posts', value: totalPosts,           color: 'text-blue-400'  },
            { icon: CheckCircle2,  label: 'Résolus',     value: resolvedCount,         color: 'text-green-400' },
            { icon: TrendingUp,    label: 'Total votes',  value: mockForumPosts.reduce((s, p) => s + p.votes, 0), color: 'text-accent' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
              <Icon className={`mx-auto h-4 w-4 ${color} mb-1`} />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un sujet..." />
          <Select value={categorie} onValueChange={setCategorie}>
            <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categoriesForum.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Plus votés</SelectItem>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="answers">Plus de réponses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={resolved} onValueChange={setResolved}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="unresolved">Non résolus</SelectItem>
              <SelectItem value="resolved">Résolus ✓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste */}
        <div className="mt-5 flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((p) => <ForumPostCard key={p.id} {...p} />)
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary text-2xl">💬</div>
              <p className="mt-4 font-medium">Aucun post trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground">Modifiez vos filtres ou posez la première question !</p>
            </div>
          )}
        </div>

        {!user && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/connexion" className="text-primary hover:underline">Connectez-vous</Link> pour participer aux discussions.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Forum;
