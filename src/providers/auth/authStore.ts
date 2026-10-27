import type { Session, User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearSession: () => void;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

let unsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setSession: (session) =>
    set({ session, user: session?.user ?? null, isAuthenticated: !!session }),

  setLoading: (isLoading) => set({ isLoading }),

  clearSession: () => set({ user: null, session: null, isAuthenticated: false }),

  initialize: async () => {
    if (!supabase) {
      set({ isLoading: false });
      return;
    }

    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      isAuthenticated: !!data.session,
      isLoading: false,
    });

    unsubscribe?.();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isAuthenticated: !!session });
    });
    unsubscribe = () => listener.subscription.unsubscribe();
  },

  cleanup: () => {
    unsubscribe?.();
    unsubscribe = null;
  },
}));

export function useAuthInit() {
  const initialize = useAuthStore((s) => s.initialize);
  const cleanup = useAuthStore((s) => s.cleanup);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);
}
