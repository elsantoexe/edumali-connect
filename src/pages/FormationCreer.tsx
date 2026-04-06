import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoriesFormation, niveaux } from '@/lib/mock-data';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, GraduationCap, Lock, ArrowLeft, Video, FileText, Mic, HelpCircle } from 'lucide-react';

interface Module {
  id: string;
  titre: string;
  type: 'video' | 'pdf' | 'audio' | 'quiz';
  duree: string;
}

const moduleTypeConfig = {
  video: { label: 'Vidéo',  icon: Video,     color: 'text-blue-400'   },
  pdf:   { label: 'PDF',    icon: FileText,  color: 'text-green-400'  },
  audio: { label: 'Audio',  icon: Mic,       color: 'text-purple-400' },
  quiz:  { label: 'Quiz',   icon: HelpCircle,color: 'text-yellow-400' },
};

const FormationCreer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titre, setTitre]         = useState('');
  const [description, setDesc]    = useState('');
  const [categorie, setCategorie] = useState('');
  const [niveau, setNiveau]       = useState('');
  const [prix, setPrix]           = useState('');
  const [modules, setModules]     = useState<Module[]>([]);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">Accès réservé aux formateurs</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Vous devez être connecté et avoir le statut Formateur Premium pour créer une formation.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/connexion"><Button>Se connecter</Button></Link>
            <Link to="/formateur"><Button variant="outline">Devenir formateur</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  const addModule = () => {
    setModules([...modules, { id: Date.now().toString(), titre: '', type: 'video', duree: '' }]);
  };

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const updateModule = (id: string, field: keyof Module, value: string) => {
    setModules(modules.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = (publish: boolean) => {
    if (!titre || !categorie || !niveau || !prix) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (modules.length === 0) {
      toast.error('Ajoutez au moins un module à votre formation.');
      return;
    }
    toast.success(publish ? 'Formation publiée avec succès !' : 'Brouillon sauvegardé.');
    setTimeout(() => navigate('/formations'), 1500);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/formations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour aux formations
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Studio Formateur</h1>
            <p className="text-sm text-muted-foreground">Créez et publiez votre formation sur EduMali</p>
          </div>
        </div>

        {/* Revenus info */}
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/10 p-4">
          <p className="text-sm font-medium text-primary">💰 Vous gardez 80% de chaque vente</p>
          <p className="mt-0.5 text-xs text-muted-foreground">EduMali prend 20% de commission sur les ventes. Paiement via Orange Money ou virement bancaire.</p>
        </div>

        {/* Informations générales */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-bold text-lg">Informations générales</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Titre de la formation <span className="text-destructive">*</span></label>
            <Input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Maîtrisez les maths du BAC TSE en 30 jours"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{titre.length}/100 caractères</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
            <Textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Décrivez ce que les apprenants vont acquérir..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie <span className="text-destructive">*</span></label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {categoriesFormation.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau cible <span className="text-destructive">*</span></label>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {niveaux.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  <SelectItem value="Tous niveaux">Tous niveaux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prix en FCFA <span className="text-destructive">*</span></label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                placeholder="Ex: 8000"
                min={0}
                className="max-w-[200px]"
              />
              <span className="text-sm text-muted-foreground">FCFA</span>
            </div>
            {prix && Number(prix) > 0 && (
              <p className="text-xs text-muted-foreground">
                Vos revenus : <strong className="text-primary">{(Number(prix) * 0.8).toLocaleString()} FCFA</strong> par vente (80%)
              </p>
            )}
          </div>
        </div>

        {/* Modules */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg">Modules ({modules.length})</h2>
            <Button size="sm" variant="outline" onClick={addModule} className="gap-1.5">
              <Plus className="h-4 w-4" /> Ajouter un module
            </Button>
          </div>

          {modules.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-sm">Aucun module ajouté</p>
              <p className="text-xs text-muted-foreground mt-1">Cliquez sur "Ajouter un module" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((m, i) => {
                const TypeIcon = moduleTypeConfig[m.type].icon;
                return (
                  <div key={m.id} className="flex gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <Input
                          value={m.titre}
                          onChange={(e) => updateModule(m.id, 'titre', e.target.value)}
                          placeholder="Titre du module"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={m.type} onValueChange={(v) => updateModule(m.id, 'type', v as Module['type'])}>
                          <SelectTrigger className="h-8 text-xs">
                            <div className="flex items-center gap-1">
                              <TypeIcon className={`h-3 w-3 ${moduleTypeConfig[m.type].color}`} />
                              {moduleTypeConfig[m.type].label}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(moduleTypeConfig).map(([k, v]) => {
                              const Icon = v.icon;
                              return (
                                <SelectItem key={k} value={k}>
                                  <div className="flex items-center gap-1.5"><Icon className={`h-3 w-3 ${v.color}`} />{v.label}</div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Input
                          value={m.duree}
                          onChange={(e) => updateModule(m.id, 'duree', e.target.value)}
                          placeholder="15 min"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeModule(m.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => handleSubmit(false)}>
            Sauvegarder brouillon
          </Button>
          <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => handleSubmit(true)}>
            <GraduationCap className="h-4 w-4" />
            Publier la formation
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FormationCreer;
