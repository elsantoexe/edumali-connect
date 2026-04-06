import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockForumPosts } from '@/lib/mock-data';
import { ArrowLeft, ArrowUp, CheckCircle2, MessageSquare, Tag, Clock, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const mockAnswers = [
  {
    id: 'a1', username: 'MariamaTraoré', is_best: true,
    body: 'Pour les maths du BAC TSE, je recommande de commencer par revoir toutes les définitions et théorèmes du programme, puis de faire les annales des 5 dernières années. Le site EduMali a toutes les annales avec les corrigés. Bon courage !',
    votes: 34, created_at: '2026-03-28',
  },
  {
    id: 'a2', username: 'OumarDiallo', is_best: false,
    body: 'J\'ai passé le BAC TSE l\'année dernière. Ma méthode : 2h de révisions le matin sur la théorie, 1h30 l\'après-midi sur les exercices. Les annales avec corrigés sont indispensables. N\'oublie pas les exercices de calcul intégral.',
    votes: 21, created_at: '2026-03-29',
  },
  {
    id: 'a3', username: 'MathProBamako', is_best: false,
    body: 'En tant que formateur de maths, je vous conseille de vous concentrer sur : 1) les suites, 2) les intégrales, 3) les probabilités. Ces chapitres représentent 60% du barème. J\'ai une formation complète sur EduMali si vous souhaitez approfondir.',
    votes: 45, created_at: '2026-03-30',
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days}j`;
  return `il y a ${Math.floor(days / 30)}mois`;
}

const ForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const post = mockForumPosts.find((p) => p.id === id);
  const [answer, setAnswer] = useState('');
  const [votes, setVotes]   = useState<Record<string, boolean>>({});

  if (!post) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center">
          <p className="text-muted-foreground">Discussion introuvable.</p>
          <Link to="/forum" className="mt-4"><Button variant="outline">Retour au forum</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleVote = (answerId: string) => {
    if (!user) { toast.error('Connectez-vous pour voter.'); return; }
    setVotes((v) => ({ ...v, [answerId]: !v[answerId] }));
    toast.success(votes[answerId] ? 'Vote retiré.' : 'Vote enregistré !');
  };

  const handleSubmit = () => {
    if (!user) { toast.error('Connectez-vous pour répondre.'); return; }
    if (!answer.trim()) { toast.error('Écrivez votre réponse.'); return; }
    toast.success('Réponse publiée !');
    setAnswer('');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/forum" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour au forum
        </Link>

        {/* Question */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categorie && (
              <span className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs">
                <Tag className="h-3 w-3" /> {post.categorie}
              </span>
            )}
            {post.is_resolved && (
              <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3 w-3" /> Résolu
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold leading-snug md:text-2xl">{post.titre}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{post.body}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
            <span className="font-medium text-foreground">@{post.username}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{timeAgo(post.created_at)}</span>
            <span className="flex items-center gap-1"><ArrowUp className="h-3.5 w-3.5" />{post.votes} votes</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{post.answers_count} réponses</span>
          </div>
        </div>

        {/* Réponses */}
        <div className="mt-8">
          <h2 className="font-bold text-lg mb-4">{mockAnswers.length} Réponses</h2>
          <div className="flex flex-col gap-4">
            {mockAnswers.sort((a, b) => (b.is_best ? 1 : 0) - (a.is_best ? 1 : 0)).map((a) => (
              <div
                key={a.id}
                className={`rounded-xl border p-5 ${a.is_best ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}
              >
                {a.is_best && (
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Meilleure réponse
                  </div>
                )}
                <p className="text-sm leading-relaxed">{a.body}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">@{a.username}</span>
                    <span>{timeAgo(a.created_at)}</span>
                  </div>
                  <button
                    onClick={() => handleVote(a.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-colors ${
                      votes[a.id] ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {a.votes + (votes[a.id] ? 1 : 0)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répondre */}
        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <h3 className="font-bold mb-3">Votre réponse</h3>
          {user ? (
            <>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Partagez votre expérience ou votre solution..."
                rows={4}
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 gap-2">
                  <MessageSquare className="h-4 w-4" /> Publier ma réponse
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link to="/connexion" className="text-primary hover:underline">Connectez-vous</Link> pour répondre à cette discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForumDetail;
