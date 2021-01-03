import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NbActionsModule, NbCardModule, NbIconModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbLayoutModule, NbButtonModule } from '@nebular/theme';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ConfigService } from './config.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'upload',
        component: UploadComponent
      }, {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbToastrModule.forRoot(),
    NbActionsModule,
    NbEvaIconsModule,
    NbIconModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (appConfig: ConfigService) => {
        return () => appConfig.load();
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
