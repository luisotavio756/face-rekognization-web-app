import React, { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, onClick, ...rest }: ButtonProps) => {
  return <button onClick={onClick} className={styles.button} type="button">{ children }</button>;
}

export default Button;
