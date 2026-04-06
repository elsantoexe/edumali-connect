import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Crown, Send, Lock, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const FREE_LIMIT = 20;

interface Message {
  id: string;
  from: 'me' | 'other';
  text: string;
  time: string;
}

const mockContacts = [
  { id: '1', name: 'AminataBa',       last: 'Merci pour les annales !',      time: '14:32', unread: 2 },
  { id: '2', name: 'OumarDiallo',     last: 'T\'as le corrigé de maths ?',   time: '11:05', unread: 0 },
  { id: '3', name: 'MathProBamako',   last: 'Bonjour, bienvenue dans ma formation !', time: 'Hier',   unread: 1 },
];

const mockHistory: Message[] = [
  { id: '1', from: 'other', text: 'Salut ! Tu as les annales de physique 2025 ?', time: '10:01' },
  { id: '2', from: 'me',    text: 'Oui, je les ai uploadées hier sur la bibliothèque 📚', time: '10:03' },
  { id: '3', from: 'other', text: 'Super ! Tu peux m\'envoyer le lien ?', time: '10:04' },
  { id: '4', from: 'me',    text: 'Cherche "BAC 2025 Physique TSE" dans Ressources 😊', time: '10:06' },
  { id: '5', from: 'other', text: 'Merci pour les annales !', time: '14:32' },
];

const Chat = () => {
  const { user } = useAuth();
  const [selected, setSelected]   = useState('1');
  const [message, setMessage]     = useState('');
  const [messages, setMessages]   = useState<Message[]>(mockHistory);
  const [msgCount, setMsgCount]   = useState(3); // messages déjà envoyés aujourd'hui
  const isPremium = false; // TODO: lire depuis le profil
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-32 text-center px-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">Messagerie EduMali</h2>
          <p className="mt-2 text-muted-foreground">Connectez-vous pour accéder à la messagerie.</p>
          <Link to="/connexion" className="mt-5"><Button>Se connecter</Button></Link>
        </div>
      </Layout>
    );
  }

  const canSend = isPremium || msgCount < FREE_LIMIT;

  const send = () => {
    if (!message.trim()) return;
    if (!canSend) {
      toast.error(`Limite quotidienne atteinte (${FREE_LIMIT} messages). Passez Premium pour envoyer sans limite.`);
      return;
    }
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: 'me', text: message, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` },
    ]);
    setMsgCount((c) => c + 1);
    setMessage('');
  };

  const contact = mockContacts.find((c) => c.id === selected)!;

  return (
    <Layout noFooter>
      <div className="mx-auto max-w-5xl h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)] flex border-x border-border">
        {/* Sidebar contacts */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col hidden sm:flex">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary ${
                  selected === c.id ? 'bg-secondary border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Statut messages */}
          {!isPremium && (
            <div className="p-3 border-t border-border">
              <div className="rounded-lg border border-border bg-secondary p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Messages aujourd'hui</span>
                  <span className="font-bold">{msgCount}/{FREE_LIMIT}</span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(msgCount / FREE_LIMIT) * 100}%` }} />
                </div>
                <Link to="/premium" className="flex items-center gap-1 mt-2 text-accent hover:underline">
                  <Crown className="h-3 w-3" /> Illimité avec Premium
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Conversation */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
              {contact.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">@{contact.name}</p>
              <p className="text-xs text-green-400">En ligne</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === 'me'
                    ? 'rounded-br-sm bg-primary text-white'
                    : 'rounded-bl-sm bg-secondary text-foreground'
                }`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-right text-[10px] ${m.from === 'me' ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            {!canSend ? (
              <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                <Clock className="h-4 w-4 text-accent shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Limite quotidienne atteinte ({FREE_LIMIT} messages)</p>
                  <p className="text-xs text-muted-foreground">Revenez demain ou passez Premium pour envoyer sans limite.</p>
                </div>
                <Link to="/premium"><Button size="sm" className="bg-accent text-accent-foreground shrink-0 gap-1"><Crown className="h-3 w-3" />Premium</Button></Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={`Message @${contact.name}...`}
                  className="flex-1"
                />
                <Button onClick={send} disabled={!message.trim()} className="bg-primary hover:bg-primary/90 aspect-square p-0 h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isPremium && canSend && (
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                {FREE_LIMIT - msgCount} message{FREE_LIMIT - msgCount > 1 ? 's' : ''} restant{FREE_LIMIT - msgCount > 1 ? 's' : ''} aujourd'hui ·{' '}
                <Link to="/premium" className="text-accent hover:underline">Premium illimité</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
