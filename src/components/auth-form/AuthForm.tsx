'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/lib/state/hooks';
import { setToken } from '@/lib/state/slices/authSlice';

import { AuthCredentials } from '@/lib/api-client/types/auth';
import { FetcherResponse } from '@/lib/api-client/types/response';
import { apiClient } from '@/lib/api-client/apiClient';

import Link from 'next/link';
import Image from 'next/image';

import styles from './auth-form.module.scss';

import logo from '/public/assets/logo.svg';
import arrow from '/public/assets/icons/light-arrow.svg';

interface AuthFormProps {
  authType: 'login' | 'signup';
}

export default function AuthForm({ authType }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const dispatch = useAppDispatch();

  const loginMutation = useMutation<FetcherResponse, Error, AuthCredentials>({
    mutationFn: apiClient.auth.login,
    onSuccess: (result) => {
      if (result.success) {
        localStorage.setItem('token', result.data.access_token);
        dispatch(setToken(result.data.access_token));
        router.push('/dashboard');
      } else {
        // Tratar erro caso necessário
        alert(`Failed to sign up: ${result.message}`);
      }
    },
    onError: (error) => {
      // TODO - implement ui update for errors, like incorrect email or server Error
      console.log(`Failed to login: ${error.message}`);
      alert(`Failed to login: ${error.message}`);
    },
  });

  const signupMutation = useMutation<FetcherResponse, Error, AuthCredentials>({
    mutationFn: apiClient.auth.signup,
    onSuccess: (result) => {
      if (result.success) {
        localStorage.setItem('token', result.data.access_token);
        dispatch(setToken(result.data.access_token));
        router.push('/dashboard');
      } else {
        // Tratar erro caso necessário
        alert(`Failed to sign up: ${result.message}`);
      }
    },
    onError: (error) => {
      // TODO - implement ui update for errors, like incorrect email/password format or server Error
      alert(`Failed to sign up: ${error.message}`);
    },
  });

  const mutation = authType === 'login' ? loginMutation : signupMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            <Image src={arrow} alt="arrow icon" className="btn-arrow-icon" />
          </button>
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
