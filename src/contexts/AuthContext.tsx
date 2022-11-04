import { createContext, useState } from "react";
import Router from "next/router";

import api from "../services/api";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { AxiosError } from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface SignInData {
  login: string;
  password: string;
}

interface SignInResponse {
  login: string;
  token: string;
}

interface AuthContextData {
  user: string | null;
  isAuthenticated: boolean;
  signIn(data: SignInData): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(() => {
    const { 'faceReko.user': user, 'faceReko.token': token } = parseCookies();

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return user;
    }

    return null;
  });

  async function handleSignIn({ login, password }: SignInData) {
    try {
      const response = await api.post<SignInResponse>('/auth', {
        login,
        password
      });

      const { login: userLogin, token } = response.data;

      setCookie(undefined, 'faceReko.user', userLogin, {
        maxAge: 60 * 60 * 6 // 6 hours
      });

      setCookie(undefined, 'faceReko.token', token, {
        maxAge: 60 * 60 * 6 // 6 hours
      });

      api.defaults.headers.authorization = `Bearer ${token}`;

      setUser(userLogin);

      Router.push('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        const notFoundResponse = error.response?.status === 404;
        const message = notFoundResponse ? 'Usuário não encontrado' :  'Ocorreu um erro ao tentar fazer login';

        alert(message);
      }
    }
  }

  function handleSignOut() {
    destroyCookie(undefined, 'faceReko.user');
    destroyCookie(undefined, 'faceReko.token');

    setUser(null);

    Router.push('/login');
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn: handleSignIn,
      signOut: handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  )
};
