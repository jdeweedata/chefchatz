'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AuthResponse, PasswordResetRequest, PasswordResetConfirm } from '@/types/auth'
import { Database } from '@/types/supabase'

export async function signUp(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const origin = process.env.NEXT_PUBLIC_APP_URL

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: email.split('@')[0],
        cooking_level: 'beginner'
      }
    }
  })

  if (error) {
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: 400
      }
    }
  }

  return { data, error: null }
}

export async function signIn(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: 401
      }
    }
  }

  return { data, error: null }
}

export async function signOut(): Promise<AuthResponse> {
  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: 500
      }
    }
  }

  return { data: null, error: null }
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<AuthResponse> {
  const supabase = createServerActionClient<Database>({ cookies })
  const origin = process.env.NEXT_PUBLIC_APP_URL

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${origin}/auth/reset-password`
  })

  if (error) {
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: 400
      }
    }
  }

  return { data: null, error: null }
}

export async function confirmPasswordReset(data: PasswordResetConfirm): Promise<AuthResponse> {
  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.updateUser({
    password: data.password
  })

  if (error) {
    return {
      data: null,
      error: {
        code: error.name,
        message: error.message,
        status: 400
      }
    }
  }

  return { data: null, error: null }
}
