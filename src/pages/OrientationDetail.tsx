import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockEtablissements } from '@/lib/mock-data';
import { ArrowLeft, Building2, MapPin, Clock } from 'lucide-react';

const mockFilieres = [
  { id: 1, nom: 'Médecine générale', duree: '7 ans', description: 'Formation complète en médecine.' },
  { id: 2, nom: 'Pharmacie', duree: '6 ans', description: 'Sciences pharmaceutiques et gestion des médicaments.' },
  { id: 3, nom: 'Génie Civil', duree: '5 ans', description: 'Construction et infrastructure.' },
  { id: 4, nom: 'Informatique', duree: '3 ans (Licence)', description: 'Programmation, réseaux et systèmes.' },
];

const OrientationDetail = () => {
  const { id } = useParams();
  const etab = mockEtablissements.find((e) => e.id === id);

  if (!etab) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-muted-foreground">Établissement introuvable.</p>
          <Link to="/orientation"><Button variant="outline" className="mt-4">Retour</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/orientation" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">{etab.nom}</CardTitle>
                <Badge variant="secondary" className="mt-2"><MapPin className="mr-1 h-3 w-3" />{etab.ville}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{etab.description}</p>
          </CardContent>
        </Card>

        <h2 className="mt-8 text-lg font-semibold">Filières proposées</h2>
        <div className="mt-4 grid gap-3">
          {mockFilieres.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <h3 className="font-medium">{f.nom}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {f.duree}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OrientationDetail;
