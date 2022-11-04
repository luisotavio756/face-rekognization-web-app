import { FormEvent, useRef } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

import Button from '../components/Button/Button'

import styles from '../styles/Login.module.css'
import { useAuth } from '../hooks/auth.hook';

const Login: NextPage = () => {
  const { signIn } = useAuth();

  const loginRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const login = loginRef.current?.value;
    const password = passRef.current?.value;

    if (!login || !password) {
      alert('Por favor, forneça um login para continuar');

      return ;
    }

    try {
      await signIn({
        login,
        password
      });
    } catch (error) {

    }
  }

  return (
    <div className={styles.container}>
      <Image src='/spyware.png' width={106} height={106} alt="Logo" />
      <div className={styles.title}>
        <h1>Entrar</h1>
        <p>É necessario um login para acessar o serviço</p>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="">Login</label>
          <input placeholder="Digite seu login" ref={loginRef} type="text" required />
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="">Senha</label>
          <input placeholder="*********" ref={passRef} type="password" required />
        </div>

        <Button type="submit">Entrar</Button>
      </form>
    </div>
  )
}

export default Login;
