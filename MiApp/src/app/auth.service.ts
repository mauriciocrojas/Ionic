// auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class AuthService {

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session ?? null;
  }

  onAuthStateChange(cb: (signedIn: boolean) => void) {
    return supabase.auth.onAuthStateChange((_ev, session) => cb(!!session));
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw this.mapError(error);
    return data.user;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw this.mapError(error);
    return data.user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw this.mapError(error);
  }

  private mapError(err: { message?: string; status?: number; code?: string }) {
    // Mensajes típicos de Supabase/email+password
    const msg = (err.code || err.message || '').toLowerCase();
    if (msg.includes('invalid login') || msg.includes('invalid_credentials')) {
      return new Error('Correo o clave incorrectos.');
    }
    if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
      return new Error('Tenés que confirmar tu correo antes de iniciar sesión.');
    }
    if (msg.includes('rate limit') || msg.includes('too many')) {
      return new Error('Demasiados intentos. Probá en unos minutos.');
    }
    return new Error(err.message || 'Error de autenticación');
  }

  // auth.service.ts
async getUserEmail(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.email ?? null;
}

}
