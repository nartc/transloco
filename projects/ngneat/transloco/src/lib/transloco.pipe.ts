import { ChangeDetectorRef, Inject, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from './transloco.service';
import { HashMap } from './types';
import { defaultConfig, TRANSLOCO_CONFIG, TranslocoConfig } from './transloco.config';
import { switchMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TRANSLOCO_SCOPE } from './transloco-scope';
import { TRANSLOCO_LANG } from './transloco-lang';

@Pipe({
  name: 'transloco',
  pure: false
})
export class TranslocoPipe implements PipeTransform, OnDestroy {
  subscription: Subscription;
  value: string = '';
  lastKey: string;
  lastParams: HashMap;
  private listenToLangChange: boolean;
  private langName: string;

  constructor(
    private translocoService: TranslocoService,
    @Inject(TRANSLOCO_CONFIG) private config: TranslocoConfig,
    @Optional() @Inject(TRANSLOCO_SCOPE) private providerScope: string | null,
    @Optional() @Inject(TRANSLOCO_LANG) private providerLang: string | null,
    private cdr: ChangeDetectorRef
  ) {
    const { listenToLangChange } = { ...defaultConfig, ...this.config };
    this.listenToLangChange = listenToLangChange;
  }

  transform(key: string, params: HashMap = {}): string {
    if (!key) {
      return key;
    }

    if (key === this.lastKey && JSON.stringify(params) === JSON.stringify(this.lastParams)) {
      return this.value;
    }

    /* Cache this key and params */
    this.lastKey = key;
    this.lastParams = params;

    /* Clean previous subscription if exists */
    this.subscription && this.subscription.unsubscribe();

    this.subscription = this.translocoService.langChanges$
      .pipe(
        switchMap(activeLang => {
          const lang = this.providerLang || activeLang;
          this.langName = this.providerScope ? `${this.providerScope}/${lang}` : lang;
          return this.translocoService.load(this.langName);
        }),
        this.listenToLangChange ? source => source : take(1)
      )
      .subscribe(() => this.updateValue(key, params));

    return this.value;
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  private updateValue(key: string, params?: HashMap): void {
    const translation = this.translocoService.translate(key, params, this.langName);
    this.value = translation || key;
    this.cdr.markForCheck();
  }
}
