import {HttpClient} from '@angular/common/http';
import {InjectionToken, Injectable} from '@angular/core';
import {TRANSLOCO_LOADER, TranslocoLoader, Translation} from '@ngneat/transloco';
import {translocoPersistTranslationsFactory} from '../../../projects/ngneat/transloco-persist-translations/src/public-api';

@Injectable({ providedIn: 'root' })
export class HttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(langPath: string) {
    return this.http.get<Translation>(`/assets/i18n/${langPath}.json`);
  }
}

const LOADER = new InjectionToken<TranslocoLoader>('LOADER');

export const cacheLoaderProviders = [
  {
    provide: LOADER,
    useClass: HttpLoader
  },
  {
    provide: TRANSLOCO_LOADER,
    deps: [LOADER],
    useFactory: (loader) => translocoPersistTranslationsFactory(loader, localStorage)
  }
];
