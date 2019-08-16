import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule } from '@ngneat/transloco';
import { TRANSLOCO_CACHE } from '../../projects/ngneat/transloco/src/lib/transloco.cache';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {cache} from './cache';
import { HomeComponent } from './home/home.component';
import { httpLoader } from './loaders/http.loader';
import { OnPushComponent } from './on-push/on-push.component';
import { preLoad } from './preload';

@NgModule({
  declarations: [AppComponent, HomeComponent, OnPushComponent],
  imports: [BrowserModule, AppRoutingModule, TranslocoModule, HttpClientModule],
  providers: [
    preLoad,
    httpLoader,
    // webpackLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        prodMode: environment.production,
        listenToLangChange: true,
        fallbackLang: 'es',
        defaultLang: 'en'
      } as TranslocoConfig
    },
    cache
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
