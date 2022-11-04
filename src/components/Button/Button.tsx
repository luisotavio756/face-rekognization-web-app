import React, { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...rest }: ButtonProps) => {
  return <button className={styles.button} type="button" {...rest}>{ children }</button>;
}

export default Button;
