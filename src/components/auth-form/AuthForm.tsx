'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider/AuthProvider';
import { AuthCredentials } from '@/lib/api-client/types/auth';
import { apiClient } from '@/lib/api-client/apiClient';

import Link from 'next/link';
import Image from 'next/image';

import styles from './auth-form.module.scss';

import logo from '/public/assets/logo.svg';
import IconRenderer from '../shared/icon-renderer/IconRenderer';

interface AuthFormProps {
  authType: 'login' | 'signup';
}

export default function AuthForm({ authType }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { SignIn } = useAuth();

  const loginMutation = useMutation<void, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      await SignIn(credentials);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setErrorMessage(error.message || 'Login failed. Please try again.');
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const result = await apiClient.auth.signup(credentials);

      if (!result.success) {
        throw new Error(result.message || 'Signup failed');
      }

      // After successful signup, use SignIn to handle token storage and navigation
      await SignIn(credentials);
    },
    onError: (error: Error) => {
      console.error('Signup failed:', error);
      setErrorMessage(error.message || 'Sign up failed. Please try again.');
    },
  });

  const mutation = authType === 'login' ? loginMutation : signupMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    mutation.mutate({ email, password });
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles['form-elements']}>
        <Image className={styles['logo']} src={logo} alt="logo" />
        <p className={styles['form-heading-txt']}>
          {authType === 'login' ? 'Access' : 'Create'} your Mural
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={mutation.isPending}>
            {authType === 'login' ? 'Login' : 'Sign Up'}
            <IconRenderer
              config={{ icon: 'arrowUpRight', type: 'predefined' }}
            />
          </button>
          {errorMessage && (
            <p className={styles['error-txt']} role="alert">
              {errorMessage}
            </p>
          )}
        </form>
        <p className={styles['form-footer-txt']}>
          {authType === 'login' ? (
            <>
              Don't have an account? <br />
              <Link href="/sign-up" prefetch>
                {' '}
                Sign up!
              </Link>
            </>
          ) : (
            <>
              Already have an account? <br />
              <Link href="/login" prefetch>
                {' '}
                Login!
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
