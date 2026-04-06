import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap, Crown, PlayCircle, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Ressources',  path: '/ressources',  icon: BookOpen     },
  { label: 'Formations',  path: '/formations',  icon: PlayCircle   },
  { label: 'Forum',       path: '/forum',       icon: MessageSquare },
  { label: 'Orientation', path: '/orientation', icon: GraduationCap },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
          <span className="text-primary">Edu</span>
          <span className="text-accent">Mali</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                  active ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/premium"
            className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            <Crown className="h-4 w-4" />
            Premium
          </Link>
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to="/compte">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Mon compte
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/connexion"><Button variant="ghost" size="sm">Connexion</Button></Link>
              <Link to="/inscription"><Button size="sm" className="bg-primary hover:bg-primary/90">Inscription</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/premium"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-accent hover:bg-accent/10"
            >
              <Crown className="h-4 w-4" />
              Premium
            </Link>
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {user ? (
              <>
                <Link to="/compte" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Mon compte
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => { signOut(); setOpen(false); }} className="w-full">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Connexion</Button>
                </Link>
                <Link to="/inscription" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
