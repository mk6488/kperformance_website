import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

export function initAdmin() {
  const svcEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  const svcFileEnv = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  let svcJson: string | undefined;

  if (svcEnv) {
    svcJson = svcEnv;
  } else if (svcFileEnv) {
    const filePath = path.isAbsolute(svcFileEnv)
      ? svcFileEnv
      : path.join(process.cwd(), svcFileEnv);
    if (!fs.existsSync(filePath)) {
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_FILE not found at ${filePath}`);
    }
    svcJson = fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_FILE in .env.local');
  }

  const parsed = JSON.parse(svcJson);

  if (!getApps().length) {
    initializeApp({
      credential: cert(parsed),
      projectId: process.env.FIREBASE_PROJECT_ID || undefined,
    });
  }
  const db = getFirestore();
  const auth = getAuth();
  return { db, auth };
}

export function isPlainObject(v: any) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

export function getAtPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function setAtPath(obj: any, path: string, value: any) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!isPlainObject(cur[p])) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

export function firstExisting(obj: any, paths: string[]) {
  for (const p of paths) {
    const v = getAtPath(obj, p);
    if (v !== undefined && v !== null && v !== '') return { path: p, value: v };
  }
  return null;
}

export function randomPastDate(daysBack = 60) {
  const ms = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(Date.now() - ms);
}

export function asTimestamp(d: Date) {
  return Timestamp.fromDate(d);
}

export const SERVER_TIME = FieldValue.serverTimestamp();

