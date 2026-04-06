import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceCard } from '@/components/ResourceCard';
import { mockAnnales } from '@/lib/mock-data';
import { Crown, GraduationCap, Download, Upload, MessageSquare, Star, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Mock profil
const mockProfils: Record<string, {
  username: string; full_name: string; bio: string; role: string;
  is_premium: boolean; reputation: number; uploads_count: number;
  downloads_count: number; created_at: string;
}> = {
  AminataBa: {
    username: 'AminataBa', full_name: 'Aminata Ba', bio: 'Étudiante en L2 Mathématiques à l\'USTTB. Passionnée par les sciences. Je partage mes cours et résumés pour aider la communauté 📚',
    role: 'premium', is_premium: true, reputation: 124, uploads_count: 12, downloads_count: 58, created_at: '2025-09-15',
  },
  MathProBamako: {
    username: 'MathProBamako', full_name: 'Dr. Amadou Kouyaté', bio: 'Enseignant en mathématiques depuis 15 ans. Formateur certifié EduMali. Auteur de 3 formations sur la plateforme.',
    role: 'formateur', is_premium: true, reputation: 890, uploads_count: 35, downloads_count: 120, created_at: '2025-03-01',
  },
};

const roleConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  eleve:     { label: 'Élève',              icon: BookOpen,      class: 'badge-free'      },
  premium:   { label: 'Premium',            icon: Crown,         class: 'badge-premium'   },
  formateur: { label: 'Formateur Certifié', icon: GraduationCap, class: 'badge-formateur' },
  admin:     { label: 'Admin',              icon: Star,          class: 'badge-formateur' },
};

const Profil = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const profil = mockProfils[username ?? ''];

  if (!profil) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <p className="text-muted-foreground">Profil introuvable.</p>
          <Link to="/" className="mt-4"><Button variant="outline">Retour à l'accueil</Button></Link>
        </div>
      </Layout>
    );
  }

  const cfg = roleConfig[profil.role] ?? roleConfig.eleve;
  const RoleIcon = cfg.icon;
  const userDocs = mockAnnales.slice(0, profil.uploads_count > 3 ? 3 : profil.uploads_count);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Profile header */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-3xl font-extrabold text-primary border border-primary/20">
              {profil.full_name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{profil.full_name}</h1>
                <span className={cfg.class}>
                  <RoleIcon className="h-3 w-3" /> {cfg.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">@{profil.username}</p>
              {profil.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profil.bio}</p>}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Membre depuis {new Date(profil.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Actions */}
            {user && user.email !== profil.username && (
              <Link to="/chat">
                <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-border border-t border-border pt-5">
            {[
              { icon: Star,     label: 'Réputation', value: profil.reputation },
              { icon: Upload,   label: 'Uploads',    value: profil.uploads_count },
              { icon: Download, label: 'Télécharg.', value: profil.downloads_count },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 px-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents partagés */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Documents partagés ({profil.uploads_count})
          </h2>
          {userDocs.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userDocs.map((doc) => <ResourceCard key={doc.id} {...doc} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-center rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground text-sm">Aucun document partagé pour l'instant.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profil;
