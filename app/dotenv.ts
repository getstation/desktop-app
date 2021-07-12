// @ts-ignore: no declaration file
import * as dotenv from 'dotenv-safe';
import { resolve } from 'path';
import { isPackaged } from './utils/env';

const samplePath = resolve(__dirname, '../.env.example');

if (isPackaged) {
  dotenv.config({
    path: resolve(__dirname, '../.env.production'),
    sample: samplePath,
  });
} else {
  dotenv.config({
    path: resolve(__dirname, '../.env.development'),
    sample: samplePath,
  });
}
