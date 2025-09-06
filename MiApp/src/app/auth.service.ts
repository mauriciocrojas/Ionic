// auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import type { Session, User } from '@supabase/supabase-js';

type AppError = Error & { code?: string; status?: number };

@Injectable({ providedIn: 'root' })
export class AuthService {

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw this.mapError(error);
    return data.session ?? null;
  }

  /**
   * Nota: en supabase-js v2, onAuthStateChange devuelve { data: { subscription } }.
   * Usá: const { data: { subscription } } = auth.onAuthStateChange(...);
   * y luego subscription.unsubscribe() cuando corresponda.
   */
  onAuthStateChange(cb: (signedIn: boolean) => void) {
    return supabase.auth.onAuthStateChange((_ev, session) => cb(!!session));
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw this.mapError(error);
    return data.user ?? null;
  }

  async signUp(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw this.mapError(error, 'signup');
    return data.user ?? null; // puede venir null si tu proyecto exige confirmación de email
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw this.mapError(error);
  }

  async getUserEmail(): Promise<string | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user?.email ?? null;
  }

  /**
   * Normaliza errores conocidos y agrega 'code' para casos que queremos distinguir en UI.
   * - 'email_exists' -> correo ya registrado (422)
   * - mensajes comunes de login / confirmación / rate limit
   */
  private mapError(err: { message?: string; status?: number; code?: string }, ctx: 'signup' | 'signin' | 'other' = 'other'): AppError {
    const status = err?.status;
    const raw = (err?.code || err?.message || '').toLowerCase();

    // Caso: email ya registrado (suele ser 422 en signUp)
    if (ctx === 'signup' && (status === 422 || raw.includes('already registered') || raw.includes('user already exists'))) {
      const e: AppError = new Error('Ese correo ya está registrado.');
      e.code = 'email_exists';
      e.status = status;
      return e;
    }

    // Credenciales inválidas
    if (raw.includes('invalid login') || raw.includes('invalid_credentials')) {
      const e: AppError = new Error('Correo o clave incorrectos.');
      e.code = 'invalid_credentials';
      e.status = status;
      return e;
    }

    // Email no confirmado
    if (raw.includes('email not confirmed') || raw.includes('email_not_confirmed')) {
      const e: AppError = new Error('Tenés que confirmar tu correo antes de iniciar sesión.');
      e.code = 'email_not_confirmed';
      e.status = status;
      return e;
    }

    // Rate limit
    if (raw.includes('rate limit') || raw.includes('too many')) {
      const e: AppError = new Error('Demasiados intentos. Probá en unos minutos.');
      e.code = 'rate_limited';
      e.status = status;
      return e;
    }

    // Errores de red comunes
    if (raw.includes('fetch') || raw.includes('network') || raw.includes('failed to fetch')) {
      const e: AppError = new Error('Problema de conexión. Verificá tu internet e intentá de nuevo.');
      e.code = 'network_error';
      e.status = status;
      return e;
    }

    const e: AppError = new Error(err.message || 'Error de autenticación');
    e.status = status;
    return e;
  }
}
