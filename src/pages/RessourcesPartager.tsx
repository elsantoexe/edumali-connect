import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { matieres, series, niveaux, typesRessource, annees } from '@/lib/mock-data';
import { Upload, FileUp, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const typeLabels: Record<string, string> = {
  annale: 'Annale', cours: 'Cours', corrige: 'Corrigé', resume: 'Résumé', tp: 'TP',
};

const MAX_MB_FREE = 50;

const RessourcesPartager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titre, setTitre]     = useState('');
  const [desc, setDesc]       = useState('');
  const [matiere, setMatiere] = useState('');
  const [serie, setSerie]     = useState('');
  const [niveau, setNiveau]   = useState('');
  const [type, setType]       = useState('');
  const [annee, setAnnee]     = useState('');
  const [file, setFile]       = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">Connectez-vous pour partager</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Vous devez être connecté pour uploader des documents sur EduMali.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/connexion"><Button>Se connecter</Button></Link>
            <Link to="/inscription"><Button variant="outline">Créer un compte</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Document partagé !</h2>
          <p className="mt-2 text-muted-foreground">Merci pour votre contribution à la communauté EduMali.</p>
          <p className="mt-1 text-sm text-muted-foreground">Votre document sera visible après validation (sous 24h).</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => setSubmitted(false)} variant="outline">Partager un autre</Button>
            <Link to="/ressources"><Button className="bg-primary hover:bg-primary/90">Voir la bibliothèque</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  const onFileChange = (f: File | null) => {
    if (!f) return;
    const sizeMb = f.size / 1024 / 1024;
    if (sizeMb > MAX_MB_FREE) {
      toast.error(`Fichier trop lourd (${sizeMb.toFixed(1)} MB). Limite gratuite : ${MAX_MB_FREE} MB total.`);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0] ?? null;
    if (f) onFileChange(f);
  };

  const handleSubmit = () => {
    if (!titre || !matiere || !serie || !type || !annee || !file) {
      toast.error('Remplissez tous les champs obligatoires et sélectionnez un fichier.');
      return;
    }
    toast.success('Document envoyé pour validation !');
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link to="/ressources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Partager un document</h1>
            <p className="text-sm text-muted-foreground">Contribuez à la bibliothèque P2P d'EduMali</p>
          </div>
        </div>

        {/* Limites */}
        <div className="mb-6 rounded-xl border border-border bg-secondary/50 p-4 text-sm space-y-1">
          <p className="font-medium">📎 Limites du compte gratuit</p>
          <p className="text-muted-foreground">• Maximum 3 fichiers uploadés au total</p>
          <p className="text-muted-foreground">• Cumul maximum : 50 MB</p>
          <p className="text-muted-foreground">• Formats acceptés : PDF, DOCX, PPTX, JPEG, PNG</p>
          <Link to="/premium" className="text-accent text-xs hover:underline inline-block mt-1">
            → Premium : upload illimité jusqu'à 500 MB
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          {/* Fichier */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fichier <span className="text-destructive">*</span></label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                dragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
              <FileUp className="h-8 w-8 text-muted-foreground" />
              {file ? (
                <>
                  <p className="font-medium text-primary">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">Glissez votre fichier ici</p>
                  <p className="text-xs text-muted-foreground">ou cliquez pour parcourir · PDF, DOCX, PPTX, images</p>
                </>
              )}
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre <span className="text-destructive">*</span></label>
            <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: BAC 2025 — Mathématiques TSE" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description <span className="text-muted-foreground text-xs">(optionnelle)</span></label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brève description du contenu..." rows={3} />
          </div>

          {/* Grille de sélection */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type <span className="text-destructive">*</span></label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type de document" /></SelectTrigger>
                <SelectContent>
                  {typesRessource.map((t) => <SelectItem key={t} value={t}>{typeLabels[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Matière <span className="text-destructive">*</span></label>
              <Select value={matiere} onValueChange={setMatiere}>
                <SelectTrigger><SelectValue placeholder="Matière" /></SelectTrigger>
                <SelectContent>
                  {matieres.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  {niveaux.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Série <span className="text-destructive">*</span></label>
              <Select value={serie} onValueChange={setSerie}>
                <SelectTrigger><SelectValue placeholder="Série" /></SelectTrigger>
                <SelectContent>
                  {series.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Année <span className="text-destructive">*</span></label>
              <Select value={annee} onValueChange={setAnnee}>
                <SelectTrigger className="max-w-[180px]"><SelectValue placeholder="Année" /></SelectTrigger>
                <SelectContent>
                  {annees.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 gap-2"
            size="lg"
            onClick={handleSubmit}
          >
            <Upload className="h-4 w-4" />
            Soumettre le document
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RessourcesPartager;
