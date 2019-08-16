import {Inject, Optional, Injectable} from '@angular/core';
import {Translation} from './types';
import {TranslocoCacheConfig, defaultCacheConfig, TranslocoConfig, TRANSLOCO_CONFIG} from './transloco.config';
import {Observable, from, isObservable, of} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {isObject, isString, now, isFunction} from './helpers';
import {TranslocoCache, TRANSLOCO_CACHE} from './transloco.cache';

const getTimestampKey = key => `${key}/timestamp`;

function isPromise(v: any) {
  return v && isFunction(v.then);
}

function observify(asyncOrValue: any) {
  if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
    return from(asyncOrValue);
  }

  return of(asyncOrValue);
}

@Injectable({providedIn: 'root'})
export class TranslocoCacheHandler {
  private cacheConfig: TranslocoCacheConfig;

  constructor(
      @Inject(TRANSLOCO_CACHE) @Optional() private cacheHandler: TranslocoCache,
      @Inject(TRANSLOCO_CONFIG) private userConfig: TranslocoConfig
  ) {
    const {cache, ...config} = userConfig;
    this.cacheConfig         = {...defaultCacheConfig, ...cache};
    if (this.hasCache()) {
      this.clearOldStorage();
    }
  }

  getTranslations(): Observable<{ [key: string]: Translation }> | null {
    const cache$ = this.getCache<{ [key: string]: Translation }>(this.cacheConfig.translationsStorageKey);
    return cache$ ? cache$.pipe(
        map(item => item ?
            this.decode(this.cacheConfig.translationsStorageKey, item) :
            null
        )
      ) :
      null
  }

  setTranslation(lang: string, translation: Translation): void {
    if (this.hasCache()) {
      this.getTranslations().subscribe(translations => {
        translations       = translations || {};
        translations[lang] = translation;
        this.setCache(this.cacheConfig.translationsStorageKey, this.encode(translations));
      });
    }
  }

  getLang(): Observable<string> | null {
    return this.getCache<string>(this.cacheConfig.langStorageKey);
  }

  setLang(lang: string): void {
    return this.setCache(this.cacheConfig.langStorageKey, lang);
  }

  private hasCache(): boolean {
    return !!this.cacheHandler;
  }

  private getCache<T = any>(key: string): Observable<T | null> | null {
    return this.hasCache()
        ? observify(this.cacheHandler.getItem(key)).pipe(
            take(1)
        )
        : null;
  }

  private setCache(key: string, item: string) {
    if (this.hasCache()) {
      this.setTimestamp(key);
      this.cacheHandler.setItem(key, item);
    }
  }

  private encode(value: any): string {
    return JSON.stringify(value);
  }

  private decode<T>(key: string, item: any): T | null {
    if (isObject(item)) {
      return item;
    } else if (isString(item)) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`storage key: ${key} is not serializable`);
        return null;
      }
    }
    return null;
  }

  private setTimestamp(key: string): void {
    this.cacheHandler.setItem(getTimestampKey(key), now());
  }

  private getTimestamp(key: string): Observable<number> {
    return observify(this.cacheHandler.getItem(getTimestampKey(key))).pipe(map(time => parseInt(time)));
  }

  private clearOldStorage() {
    [this.cacheConfig.translationsStorageKey, this.cacheConfig.langStorageKey].forEach(key =>
        this.getTimestamp(key)
            .pipe(
                tap(time => {
                  if (time && now() - time > this.cacheConfig.lifeTime) {
                    this.cacheHandler.removeItem(key);
                  }
                })
            )
            .subscribe()
    );
  }
}
