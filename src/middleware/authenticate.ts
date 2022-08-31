import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Author } from '../models/types/types';

declare global {
    namespace Express {
      interface Request {
        user: any;
      }
    }
  }

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('No token provided.');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided.');
    }
    let decoded: Author | any;
    try {
        decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
        return res.status(401).send('Invalid token.');
    }
    req.user = decoded;
    next();
}

