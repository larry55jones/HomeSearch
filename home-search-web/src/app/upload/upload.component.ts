import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FtpsLoggerService } from 'ftps-logger-ngx';
import { ApiService } from '../communication/api.service';

@Component({
  selector: 'hsw-upload',
  templateUrl: './upload.component.html',
  styles: [
  ]
})
export class UploadComponent {
  private module = 'UploadComponent';
  private myFiles: File[] = [];

  uploadForm = new FormGroup({
    file: new FormControl('', [Validators.required])
  });

  constructor(private logger: FtpsLoggerService, private api: ApiService, private toastr: NbToastrService, private router: Router) { }

  public onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    this.logger.logDebug(this.module, 'File Change Event', fileList);

    this.myFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      this.myFiles.push(fileList[i]);
    }

    this.logger.logDebug(this.module, 'Saved to My Files', this.myFiles);
  }

  public submitUploadForm() {
    if (!this.guardInvalidFilesList()) {
      return;
    }

    this.logger.logDebug(this.module, 'MyFiles Value on Submit', this.myFiles);

    this.api.upload(this.myFiles).subscribe(
      {
        next: (results: any) => {
          this.logger.logSuccess(this.module, 'Upload Success', results);
          this.router.navigate(['/']);
        },
        error: (err: any) => { this.logger.logError(this.module, 'Upload Error', err); this.toastr.danger('Something Went Wrong', 'Error') },
      }
    )
  }

  private guardInvalidFilesList(): boolean {
    if (!this.myFiles.length) {
      this.logger.logWarning(this.module, `Can't submit empty files list`);
      this.toastr.warning('Please Select Files', 'Form Invalid');
      return false;
    }
    return true;
  }

}
