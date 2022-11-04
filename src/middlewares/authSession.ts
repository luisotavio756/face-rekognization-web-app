import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export default function authSession(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
): unknown {
  const authHeader = request.headers.authorization;

  if (!authHeader) return response.status(401).json({ message: 'No token provided !' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2) return response.status(401).json({ message: 'Invalid token !' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return response.status(401).json({ message: 'Token bad formated !' });

  try {
    const jwtSecret = process.env.APP_SECRET as string;
    verify(token, jwtSecret);

    return next();
  } catch (error) {

    return response.status(401).json({ message: 'Invalid token !' });
  }
}
