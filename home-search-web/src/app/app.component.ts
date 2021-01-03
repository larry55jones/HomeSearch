import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { FtpsLoggerService } from 'ftps-logger-ngx';
import { ConfigService } from './config.service';

@Component({
  selector: 'hsw-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  themeValue = 'default';

  constructor(private logger: FtpsLoggerService, private config: ConfigService, private theme: NbThemeService) { }

  ngOnInit(): void {
    this.setupLogger();
    this.listenForTheme();
    this.setTheme(this.recallTheme());
  }

  toggleTheme() {
    this.setTheme(this.themeValue === 'default' ? 'dark' : 'default');
  }

  private setupLogger() {
    this.logger.saveConfigs(this.config.appConfig.log_config);
    this.logger.logDebug('Test', 'Test Debug Message');
    this.logger.logSuccess('Test', 'Test Success Message');
    this.logger.logWarning('Test', 'Test Warning Message');
    this.logger.logError('Test', 'Test Error Message');
    this.logger.logInfo('Test', 'Test Info Message');
  }

  private setTheme(theme: string) {
    this.theme.changeTheme(theme);

    localStorage.setItem('theme', theme);
  }

  private recallTheme() {
    const curVal = localStorage.getItem('theme');
    return curVal ?? 'default';
  }

  private listenForTheme(): void {
    this.theme.onThemeChange().subscribe({
      next: (t: any) => {
        this.logger.logDebug('APP', 'Theme Changed', t);
        this.themeValue = t.name;
      }
    });
  }
}
