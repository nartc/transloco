import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule, TRANSLOCO_TRANSPILER, MessageFormatTranspiler} from '@ngneat/transloco';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {cacheLoaderProviders} from './loaders/cache.loader';
import {httpLoader} from './loaders/http.loader';
import {webpackLoader} from './loaders/webpack.loader';
import {OnPushComponent} from './on-push/on-push.component';
import {preLoad} from './preload';

@NgModule({
  declarations: [AppComponent, HomeComponent, OnPushComponent],
  imports: [BrowserModule, AppRoutingModule, TranslocoModule, HttpClientModule],
  providers: [
    preLoad,
    ...cacheLoaderProviders,
    // httpLoader,
    // webpackLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        prodMode: environment.production,
        listenToLangChange: true,
        fallbackLang: 'es',
        defaultLang: 'en'
      } as TranslocoConfig
    }
    // Uncomment to use MessageFormatTranspiler
    // { provide: TRANSLOCO_TRANSPILER, useClass: MessageFormatTranspiler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
