// @ts-ignore: no declaration file
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { isPackaged } from './utils/env';

if (isPackaged) {
  dotenv.config({
    path: resolve(__dirname, '../.env.production'),
  });
} else {
  dotenv.config({
    path: resolve(__dirname, '../../../.env.development'),
  });
}
