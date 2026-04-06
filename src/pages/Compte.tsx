import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, BookOpen, Upload, Download, MessageSquare, Settings, GraduationCap, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const Compte = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">Connectez-vous</h2>
          <p className="mt-2 text-muted-foreground">Accédez à votre espace personnel EduMali.</p>
          <div className="mt-5 flex gap-3">
            <Link to="/connexion"><Button>Se connecter</Button></Link>
            <Link to="/inscription"><Button variant="outline">Créer un compte</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  const username = user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'utilisateur';
  const isPremium = false; // TODO: fetch from profile

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie.');
    navigate('/');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-2xl font-extrabold text-primary border border-primary/20">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">@{username}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1">
                {isPremium ? (
                  <span className="badge-premium"><Crown className="h-3 w-3" /> Premium</span>
                ) : (
                  <span className="badge-free">Plan gratuit</span>
                )}
              </div>
            </div>
          </div>

          {!isPremium && (
            <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Passez à Premium</p>
                <p className="text-xs text-muted-foreground">Téléchargements illimités, formations, badge</p>
              </div>
              <Link to="/premium">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 shrink-0">
                  <Crown className="h-4 w-4" /> 5 000 FCFA
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Upload,   label: 'Uploads',         val: '0' },
            { icon: Download, label: 'Téléchargements', val: '0' },
            { icon: MessageSquare, label: 'Messages',   val: '0/20' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <Icon className="mx-auto h-5 w-5 text-muted-foreground mb-1.5" />
              <p className="text-xl font-bold">{val}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          {[
            { icon: User,          label: 'Mon profil public',    href: `/profil/${username}` },
            { icon: BookOpen,      label: 'Mes ressources',        href: '/ressources'          },
            { icon: Upload,        label: 'Partager un document',  href: '/ressources/partager' },
            { icon: GraduationCap, label: 'Mes formations',        href: '/formations'          },
            { icon: MessageSquare, label: 'Mes messages',          href: '/chat'                },
          ].map(({ icon: Icon, label, href }, i) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-secondary ${i < 4 ? 'border-b border-border' : ''}`}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span>{label}</span>
              <span className="ml-auto text-muted-foreground">→</span>
            </Link>
          ))}
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Compte</h3>
          <Button variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Se déconnecter
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Compte;
