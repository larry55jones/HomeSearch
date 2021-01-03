import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FtpsLoggerService } from 'ftps-logger-ngx';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';
import { HomeForSale } from '../home/home-for-sale';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private module = 'API';

  constructor(private http: HttpClient, private logger: FtpsLoggerService, private config: ConfigService) { }

  public getHomes(): Observable<HomeForSale[]> {
    this.logger.logDebug(this.module, 'Getting Homes Called');
    return this.http.get<HomeForSale[]>(this.getUrl('homes'));
  }

  public saveHome(id: number): Observable<HomeForSale> {
    this.logger.logDebug(this.module, 'Save Home Called', id);
    return this.http.post<HomeForSale>(this.getUrl(`homes/save/${id}`), {});
  }

  public ignoreHome(id: number): Observable<HomeForSale> {
    this.logger.logDebug(this.module, 'Ignore Home Called', id);
    return this.http.post<HomeForSale>(this.getUrl(`homes/ignore/${id}`), {});
  }

  public ignoreHomeAndZip(id: number): Observable<string> {
    this.logger.logDebug(this.module, 'Ignore Home and Zip Called', id);
    return this.http.post<string>(this.getUrl(`homes/ignorezip/${id}`), {});
  }

  /**
   * Upload html files
   * @param files Files to Upload
   */
  public upload(files: File[]) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file[]", files[i]);
    }

    this.logger.logInfo(this.module, 'Upload Called', formData.getAll('file[]'));
    return this.http.post<any>(this.getUrl('upload'), formData);
  }

  private getUrl(subPath: string) {
    return `${this.config.appConfig.api_url}/api/${subPath}`;
  }
}
