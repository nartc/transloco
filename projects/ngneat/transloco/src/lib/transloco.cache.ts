import { InjectionToken } from '@angular/core';
import { MaybeAsync } from './types';

export interface TranslocoCache {
  getItem(key: string): MaybeAsync;

  setItem(key: string, value: any): void;

  removeItem(key: string): void;
}

export const TRANSLOCO_CACHE = new InjectionToken<TranslocoCache>('TRANSLOCO_CACHE');
