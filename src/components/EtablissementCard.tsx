import { Link } from 'react-router-dom';
import { Building2, MapPin, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EtablissementCardProps {
  id: string;
  nom: string;
  ville: string;
  description: string;
  filieres: number;
}

export const EtablissementCard = ({ id, nom, ville, description, filieres }: EtablissementCardProps) => (
  <Link to={`/orientation/${id}`}>
    <Card className="transition-colors hover:border-primary/50 hover:bg-card/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium leading-tight">{nom}</h3>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs"><MapPin className="mr-1 h-3 w-3" />{ville}</Badge>
              <Badge variant="outline" className="text-xs"><BookOpen className="mr-1 h-3 w-3" />{filieres} filières</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);
