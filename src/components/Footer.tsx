import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">
            <span className="text-primary">Edu</span><span className="text-accent">Mali</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            La plateforme éducative de référence pour les étudiants maliens.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Ressources</h4>
          <div className="flex flex-col gap-2">
            <Link to="/ressources" className="text-sm text-muted-foreground hover:text-foreground">Annales BAC</Link>
            <Link to="/forum" className="text-sm text-muted-foreground hover:text-foreground">Forum</Link>
            <Link to="/orientation" className="text-sm text-muted-foreground hover:text-foreground">Orientation</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Plateforme</h4>
          <div className="flex flex-col gap-2">
            <Link to="/calendrier" className="text-sm text-muted-foreground hover:text-foreground">Calendrier</Link>
            <Link to="/premium" className="text-sm text-muted-foreground hover:text-foreground">Premium</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Compte</h4>
          <div className="flex flex-col gap-2">
            <Link to="/connexion" className="text-sm text-muted-foreground hover:text-foreground">Connexion</Link>
            <Link to="/inscription" className="text-sm text-muted-foreground hover:text-foreground">Inscription</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © 2024 EduMali. Fait avec ❤️ pour les étudiants du Mali.
      </div>
    </div>
  </footer>
);
