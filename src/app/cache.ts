import {Observable, timer} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {TRANSLOCO_CACHE, TranslocoCache} from '../../projects/ngneat/transloco/src/lib/transloco.cache';

export class AsyncCache implements TranslocoCache {

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): Promise<any> | Observable<any> | any {
    return timer(1000).pipe(mapTo(localStorage.getItem(key)));
  }

}

export const cache = {
  provide: TRANSLOCO_CACHE,
  useClass: AsyncCache
};
