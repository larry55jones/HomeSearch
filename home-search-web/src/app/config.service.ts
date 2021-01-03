import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NbThemeService } from '@nebular/theme';
import { LogConfigItem } from 'ftps-logger-ngx';

export interface AppConfigModel {
  api_url: string;
  log_config: LogConfigItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  appConfig: AppConfigModel;

  constructor(private http: HttpClient, private theme: NbThemeService) {
    this.appConfig = {
      api_url: '..',
      log_config: []
    };
  }

  public async load(): Promise<boolean> {
    return this.http.get('appSettings.config', {
      headers: this.getHttpHeaders(),
      responseType: 'text',
    }).toPromise().then((xmlString: string) => this.parseXmlString(xmlString));
  }

  private getHttpHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'text/xml')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method');
  }

  private parseXmlString(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const serverUrlNode = xmlDoc.getElementsByTagName('settings')[0].getElementsByTagName('api_url')[0];

    this.appConfig = {
      api_url: serverUrlNode.textContent ?? '..',
      log_config: this.getLogConfig(xmlDoc),
    };

    // have to console.log here because this happens during app initialization
    console.log('Loaded App Config from XML', this.appConfig);
    return true;
  }

  private getLogConfig(xmlDoc: Document): LogConfigItem[] {
    const logConfig: LogConfigItem[] = [];

    // if no log_config element, return empty list
    const logConfigList = xmlDoc.getElementsByTagName('settings')[0].getElementsByTagName('log_configs');
    if (!logConfigList || !logConfigList.length) {
      console.warn('No Log Configs List Element Found in appSettings.config!', logConfigList);
      return logConfig;
    }

    const logConfigListNode = logConfigList[0];

    logConfigListNode.childNodes.forEach((setting: ChildNode) => {
      if (setting.nodeType === 1) {
        // element types only
        if (this.isValidLogSetting(setting.textContent ?? '')) {
          logConfig.push({
            module: setting.nodeName,
            level: setting.textContent ?? '00000',
          });
        }
      }
    });

    return logConfig;
  }

  private isValidLogSetting(textContent: string) {
    if (textContent.length != 5) {
      return false;
    }

    let valid = true;

    for (let i = 0; i < textContent.length; i++) {
      if (!['0', '1'].includes(textContent[i])) {
        valid = false;
        break;
      }
    }

    return valid;
  }
}
