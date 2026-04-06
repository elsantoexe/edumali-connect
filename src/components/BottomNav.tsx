import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, MessageSquare, PlayCircle } from 'lucide-react';

const items = [
  { path: '/',           label: 'Accueil',     icon: Home         },
  { path: '/ressources', label: 'Ressources',  icon: BookOpen     },
  { path: '/formations', label: 'Formations',  icon: PlayCircle   },
  { path: '/forum',      label: 'Forum',       icon: MessageSquare },
  { path: '/orientation',label: 'Orientation', icon: GraduationCap },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch">
        {items.map((item) => {
          const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} strokeWidth={active ? 2.5 : 1.8} />
              {item.label}
              {active && <span className="absolute bottom-0 block h-0.5 w-8 rounded-full bg-primary" style={{ bottom: 0 }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
