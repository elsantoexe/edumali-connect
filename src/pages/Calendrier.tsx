import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCalendrier } from '@/lib/mock-data';
import { Calendar as CalIcon, GraduationCap, Palmtree, ClipboardCheck, UserPlus } from 'lucide-react';

const typeConfig: Record<string, { icon: any; color: string }> = {
  rentrée: { icon: CalIcon, color: 'text-primary' },
  examen: { icon: GraduationCap, color: 'text-destructive' },
  vacances: { icon: Palmtree, color: 'text-accent' },
  résultats: { icon: ClipboardCheck, color: 'text-primary' },
  inscription: { icon: UserPlus, color: 'text-accent' },
};

const Calendrier = () => (
  <Layout>
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Calendrier académique</h1>
      <p className="mt-1 text-sm text-muted-foreground">Dates clés de l'année scolaire et universitaire.</p>

      <div className="mt-8 space-y-3">
        {mockCalendrier.map((evt) => {
          const config = typeConfig[evt.type] || typeConfig.rentrée;
          const Icon = config.icon;
          return (
            <Card key={evt.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{evt.titre}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(evt.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">{evt.type}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </Layout>
);

export default Calendrier;
