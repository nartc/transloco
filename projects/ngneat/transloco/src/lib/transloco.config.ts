import { InjectionToken } from '@angular/core';

export type TranslocoCacheConfig = {
  lifeTime?: number; // storage life time in seconds (e.g day = 86400)
  translationsStorageKey?: string;
  langStorageKey?: string;
};

export type TranslocoConfig = {
  defaultLang: string;
  listenToLangChange?: boolean;
  prodMode?: boolean;
  fallbackLang?: string | string[];
  failedRetries?: number;
  cache?: TranslocoCacheConfig;
};

export const TRANSLOCO_CONFIG = new InjectionToken('TRANSLOCO_CONFIG', {
  providedIn: 'root',
  factory: () => {
    return {};
  }
});

export const defaultCacheConfig: TranslocoCacheConfig = {
  lifeTime: 86400,
  translationsStorageKey: '@transloco/translations',
  langStorageKey: '@transloco/lang'
};

export const defaultConfig: TranslocoConfig = {
  defaultLang: 'en',
  listenToLangChange: false,
  prodMode: false,
  failedRetries: 2,
  cache: defaultCacheConfig
};
