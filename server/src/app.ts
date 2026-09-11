import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Security headers with Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // Dynamic CORS configuration: works on localhost, Vercel, and Railway
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true);
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser for HttpOnly refresh tokens
  app.use(cookieParser());

  // Mount API routes under /api
  app.use('/api', routes);

  // Serve static client assets if client/dist exists (single-service full-stack deployment)
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // 404 handler for API routes
  app.use(notFoundHandler);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
