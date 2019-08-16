import { APP_INITIALIZER } from '@angular/core';
import { TRANSLOCO_CACHE } from '../../projects/ngneat/transloco/src/lib/transloco.cache';
import { UserService } from './user.service';
import { TranslocoService } from '@ngneat/transloco';

export function preloadUser(userService: UserService, transloco: TranslocoService) {
  return function() {
    return userService.getUser().then(({ lang }) => {
      const l = lang;
      transloco.setActiveLang(l);
      return transloco.load(l).toPromise();
    });
  };
}

export const cache = {
  provide: TRANSLOCO_CACHE,
  useValue: localStorage
};
