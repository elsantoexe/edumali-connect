-- =========================================================
-- EDU MALI — MIGRATION ADDITIVE V2
-- Safe : utilise IF NOT EXISTS / DO $$ blocks
-- =========================================================

-- Extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- FONCTION updated_at (idempotente)
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========================================================
-- PROFILES (conserver l'existant, ajouter colonnes manquantes)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username            TEXT UNIQUE,
  full_name           TEXT,
  bio                 TEXT,
  avatar_url          TEXT,
  role                TEXT NOT NULL DEFAULT 'eleve' CHECK (role IN ('eleve', 'premium', 'formateur', 'admin')),
  is_premium          BOOLEAN NOT NULL DEFAULT false,
  premium_since       TIMESTAMP WITH TIME ZONE,
  premium_expires_at  TIMESTAMP WITH TIME ZONE,
  badge               TEXT DEFAULT 'nouveau',
  reputation          INT NOT NULL DEFAULT 0,
  uploads_count       INT NOT NULL DEFAULT 0,
  downloads_count     INT NOT NULL DEFAULT 0,
  messages_today      INT NOT NULL DEFAULT 0,
  messages_today_date DATE,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter messages_today_date si manquant
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'messages_today_date'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN messages_today_date DATE;
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Profiles are viewable by everyone') THEN
    CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can insert their own profile') THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan         TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  active       BOOLEAN NOT NULL DEFAULT true,
  amount_fcfa  INT DEFAULT 5000,
  provider     TEXT,          -- 'orange_money' | 'moov_money' | 'stripe'
  provider_ref TEXT,          -- référence transaction côté provider
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'failed')),
  expires_at   TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter provider_ref si manquant
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'provider_ref'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN provider_ref TEXT;
  END IF;
END $$;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subscriptions' AND policyname='Users can view their own subscription') THEN
    CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subscriptions' AND policyname='Users can insert their own subscription') THEN
    CREATE POLICY "Users can insert their own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================================
-- ANNALES (ressources P2P)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.annales (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre            TEXT NOT NULL,
  description      TEXT,
  matiere          TEXT NOT NULL,
  serie            TEXT NOT NULL,
  niveau           TEXT,
  annee            INT NOT NULL,
  type             TEXT DEFAULT 'annale' CHECK (type IN ('annale', 'cours', 'corrige', 'resume', 'tp')),
  format           TEXT DEFAULT 'pdf',
  fichier_url      TEXT,
  taille_mb        NUMERIC DEFAULT 0,
  telechargements  INT NOT NULL DEFAULT 0,
  uploaded_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_premium_only  BOOLEAN NOT NULL DEFAULT false,
  status           TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'annales' AND column_name = 'niveau'
  ) THEN
    ALTER TABLE public.annales ADD COLUMN niveau TEXT;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'annales' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.annales ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected'));
  END IF;
END $$;

ALTER TABLE public.annales ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='annales' AND policyname='Annales are viewable by everyone') THEN
    CREATE POLICY "Annales are viewable by everyone" ON public.annales FOR SELECT USING (status = 'published');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='annales' AND policyname='Authenticated users can insert annales') THEN
    CREATE POLICY "Authenticated users can insert annales" ON public.annales FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='annales' AND policyname='Owners can update their annales') THEN
    CREATE POLICY "Owners can update their annales" ON public.annales FOR UPDATE USING (auth.uid() = uploaded_by);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_annales_annee ON public.annales(annee DESC);
CREATE INDEX IF NOT EXISTS idx_annales_matiere ON public.annales(matiere);
CREATE INDEX IF NOT EXISTS idx_annales_type ON public.annales(type);

-- =========================================================
-- DOWNLOAD LOGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.download_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annale_id     UUID NOT NULL REFERENCES public.annales(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='download_logs' AND policyname='Users can view their own downloads') THEN
    CREATE POLICY "Users can view their own downloads" ON public.download_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='download_logs' AND policyname='Users can log their own downloads') THEN
    CREATE POLICY "Users can log their own downloads" ON public.download_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_download_logs_user_date ON public.download_logs(user_id, downloaded_at);

-- Fonction : vérifier la limite de téléchargements journaliers
CREATE OR REPLACE FUNCTION public.check_download_limit(p_user_id UUID)
RETURNS TABLE(can_download BOOLEAN, downloads_today INT, is_premium BOOLEAN) AS $$
DECLARE
  v_premium BOOLEAN;
  v_count   INT;
BEGIN
  SELECT is_premium INTO v_premium FROM public.profiles WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_count
    FROM public.download_logs
   WHERE user_id = p_user_id
     AND downloaded_at >= CURRENT_DATE;

  RETURN QUERY SELECT
    (v_premium OR v_count < 5),
    v_count::INT,
    COALESCE(v_premium, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =========================================================
-- FORUM POSTS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre        TEXT NOT NULL,
  body         TEXT NOT NULL,
  categorie    TEXT DEFAULT 'Forum libre',
  votes        INT NOT NULL DEFAULT 0,
  answers_count INT NOT NULL DEFAULT 0,
  is_resolved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_posts' AND policyname='Forum posts are viewable by everyone') THEN
    CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_posts' AND policyname='Authenticated users can create posts') THEN
    CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_posts' AND policyname='Users can update their own posts') THEN
    CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_posts' AND policyname='Users can delete their own posts') THEN
    CREATE POLICY "Users can delete their own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- FORUM ANSWERS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.forum_answers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  is_best    BOOLEAN NOT NULL DEFAULT false,
  votes      INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'forum_answers' AND column_name = 'votes'
  ) THEN
    ALTER TABLE public.forum_answers ADD COLUMN votes INT NOT NULL DEFAULT 0;
  END IF;
END $$;

ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_answers' AND policyname='Forum answers are viewable by everyone') THEN
    CREATE POLICY "Forum answers are viewable by everyone" ON public.forum_answers FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_answers' AND policyname='Authenticated users can create answers') THEN
    CREATE POLICY "Authenticated users can create answers" ON public.forum_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_answers' AND policyname='Users can update their own answers') THEN
    CREATE POLICY "Users can update their own answers" ON public.forum_answers FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================================
-- FORUM VOTES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id   UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES public.forum_answers(id) ON DELETE CASCADE,
  value     INT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, answer_id)
);

ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='forum_votes' AND policyname='Users can manage their own votes') THEN
    CREATE POLICY "Users can manage their own votes" ON public.forum_votes FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================================
-- FORMATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.formations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formateur_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre         TEXT NOT NULL,
  description   TEXT,
  prix_fcfa     INT NOT NULL DEFAULT 0,
  niveau        TEXT,
  categorie     TEXT,
  image_url     TEXT,
  apercu_url    TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  nb_inscrits   INT NOT NULL DEFAULT 0,
  note_moyenne  NUMERIC(3,2) DEFAULT 0,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'formations' AND column_name = 'note_moyenne'
  ) THEN
    ALTER TABLE public.formations ADD COLUMN note_moyenne NUMERIC(3,2) DEFAULT 0;
  END IF;
END $$;

ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formations' AND policyname='Published formations are viewable by everyone') THEN
    CREATE POLICY "Published formations are viewable by everyone"
      ON public.formations FOR SELECT USING (is_published = true OR auth.uid() = formateur_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formations' AND policyname='Formateurs can insert formations') THEN
    CREATE POLICY "Formateurs can insert formations"
      ON public.formations FOR INSERT WITH CHECK (
        auth.uid() = formateur_id AND EXISTS (
          SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'formateur'
        )
      );
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formations' AND policyname='Formateurs can update their formations') THEN
    CREATE POLICY "Formateurs can update their formations"
      ON public.formations FOR UPDATE USING (auth.uid() = formateur_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_formations_updated_at ON public.formations;
CREATE TRIGGER update_formations_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_formations_published ON public.formations(is_published, created_at DESC);

-- =========================================================
-- MODULES DE FORMATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.formation_modules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  titre        TEXT NOT NULL,
  type         TEXT DEFAULT 'video' CHECK (type IN ('video', 'pdf', 'audio', 'quiz')),
  content_url  TEXT,
  duree_min    INT DEFAULT 0,
  ordre        INT NOT NULL DEFAULT 0,
  is_free      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formation_modules ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formation_modules' AND policyname='Modules are viewable by enrolled or formateur') THEN
    CREATE POLICY "Modules are viewable by enrolled or formateur"
      ON public.formation_modules FOR SELECT USING (
        is_free = true
        OR EXISTS (SELECT 1 FROM public.formations f WHERE f.id = formation_id AND f.formateur_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.formation_enrollments e WHERE e.formation_id = formation_id AND e.user_id = auth.uid() AND e.paid = true)
      );
  END IF;
END $$;

-- =========================================================
-- INSCRIPTIONS AUX FORMATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.formation_enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paid         BOOLEAN NOT NULL DEFAULT false,
  amount_fcfa  INT DEFAULT 0,
  provider     TEXT,
  provider_ref TEXT,
  enrolled_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(formation_id, user_id)
);

ALTER TABLE public.formation_enrollments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formation_enrollments' AND policyname='Users can view their own enrollments') THEN
    CREATE POLICY "Users can view their own enrollments"
      ON public.formation_enrollments FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formation_enrollments' AND policyname='Users can enroll') THEN
    CREATE POLICY "Users can enroll"
      ON public.formation_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================================
-- NOTES SUR FORMATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.formation_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note         INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire  TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(formation_id, user_id)
);

ALTER TABLE public.formation_reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formation_reviews' AND policyname='Reviews are viewable by everyone') THEN
    CREATE POLICY "Reviews are viewable by everyone" ON public.formation_reviews FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formation_reviews' AND policyname='Enrolled users can review') THEN
    CREATE POLICY "Enrolled users can review"
      ON public.formation_reviews FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
          SELECT 1 FROM public.formation_enrollments WHERE formation_id = formation_reviews.formation_id AND user_id = auth.uid() AND paid = true
        )
      );
  END IF;
END $$;

-- =========================================================
-- MESSAGES (CHAT)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  type         TEXT DEFAULT 'text' CHECK (type IN ('text', 'audio', 'file')),
  audio_url    TEXT,
  read_at      TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Users can see their messages') THEN
    CREATE POLICY "Users can see their messages"
      ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='Users can send messages') THEN
    CREATE POLICY "Users can send messages"
      ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON public.messages(LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC);

-- =========================================================
-- CALENDRIER
-- =========================================================
CREATE TABLE IF NOT EXISTS public.calendrier (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       TEXT NOT NULL,
  description TEXT,
  date_debut  DATE NOT NULL,
  date_fin    DATE,
  type        TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.calendrier ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='calendrier' AND policyname='Calendrier is viewable by everyone') THEN
    CREATE POLICY "Calendrier is viewable by everyone" ON public.calendrier FOR SELECT USING (true);
  END IF;
END $$;

-- =========================================================
-- ETABLISSEMENTS & FILIERES (conservés)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.etablissements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         TEXT NOT NULL,
  sigle       TEXT,
  type        TEXT,
  ville       TEXT NOT NULL,
  description TEXT,
  site_web    TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.etablissements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='etablissements' AND policyname='Etablissements are viewable by everyone') THEN
    CREATE POLICY "Etablissements are viewable by everyone" ON public.etablissements FOR SELECT USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.filieres (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etablissement_id  UUID NOT NULL REFERENCES public.etablissements(id) ON DELETE CASCADE,
  nom               TEXT NOT NULL,
  type_diplome      TEXT,
  duree             TEXT,
  niveau            TEXT,
  description       TEXT,
  mode_acces        TEXT,
  debouches         TEXT,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.filieres ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='filieres' AND policyname='Filieres are viewable by everyone') THEN
    CREATE POLICY "Filieres are viewable by everyone" ON public.filieres FOR SELECT USING (true);
  END IF;
END $$;

-- =========================================================
-- ANNALES NOTES (rating documents)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.annales_notes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annale_id UUID NOT NULL REFERENCES public.annales(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note      INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(annale_id, user_id)
);

ALTER TABLE public.annales_notes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='annales_notes' AND policyname='Annales notes viewable by everyone') THEN
    CREATE POLICY "Annales notes viewable by everyone" ON public.annales_notes FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='annales_notes' AND policyname='Users can rate annales') THEN
    CREATE POLICY "Users can rate annales" ON public.annales_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================================================
-- PAIEMENTS (transactions centralisées Orange Money / Moov / Stripe)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('subscription', 'formation')),
  ref_id        UUID,            -- subscription.id ou formation.id
  amount_fcfa   INT NOT NULL,
  provider      TEXT NOT NULL CHECK (provider IN ('orange_money', 'moov_money', 'stripe', 'free')),
  provider_ref  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payments' AND policyname='Users can view their own payments') THEN
    CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id, created_at DESC);

-- =========================================================
-- FORMATEUR REQUESTS (demandes de certification)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.formateur_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom         TEXT NOT NULL,
  email       TEXT NOT NULL,
  expertise   TEXT NOT NULL,
  experience  TEXT NOT NULL,
  motivation  TEXT NOT NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formateur_requests ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formateur_requests' AND policyname='Users can see their requests') THEN
    CREATE POLICY "Users can see their requests" ON public.formateur_requests FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='formateur_requests' AND policyname='Users can submit requests') THEN
    CREATE POLICY "Users can submit requests" ON public.formateur_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
