import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface User {
  login: string;
  password?: string;
}

const jwtSecret = process.env.APP_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { login, password } = req.body;

  const USERS_LIST = process.env.USERS_LIST as string;
  const usersListDecoded = atob(USERS_LIST);
  const users = JSON.parse(usersListDecoded) as User[];

  const findUser = users.find(user => user.login === login);

  if (!findUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (findUser.password !== password) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = sign({}, jwtSecret, {
    expiresIn: '10s',
  });

  delete findUser.password;

  return res.json({
    login,
    token
  });
}
