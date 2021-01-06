import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FtpsLoggerService } from 'ftps-logger-ngx';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ApiService } from '../communication/api.service';
import { StatefulComponent } from '../shared/stateful/stateful.component';
import { HomeForSale } from './home-for-sale';

enum State {
  Loading = 'Loading',
  Data = 'Data',
  Error = 'Error'
}

@Component({
  selector: 'hsw-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends StatefulComponent implements OnInit {
  private module = 'HomeComponent';
  private homes: HomeForSale[] = [];
  private filterTextStream = new Subject<string>();
  private filterTextChanged$ = this.filterTextStream.asObservable();

  State = State;
  homesFiltered: HomeForSale[] = [];
  selectedFilter = 'unread';
  filterText = '';

  constructor(private api: ApiService, private logger: FtpsLoggerService, private toastr: NbToastrService) {
    super();
  }

  ngOnInit(): void {
    this.loadHomes();
    this.listenToFilterText();
  }

  filterSelectionChange(newSelection: string) {
    this.logger.logDebug(this.module, 'Filter Selection Changed', newSelection, this.selectedFilter);
    this.setState(State.Loading);
    setTimeout(() => { this.filterHomes(); this.setState(State.Data); }, 100);
  }

  filterTextChanged(evnt: any) {
    this.logger.logDebug(this.module, 'Filter Text Changed', evnt, this.filterText);
    this.filterTextStream.next(this.filterText);
  }

  setFilterText(newText: string) {
    this.filterText = newText;
    this.filterTextStream.next(this.filterText);
  }

  getHeaderText(): string {
    let text = '';
    if (this.isState(State.Loading)) {
      return 'Loading...';
    }
    text = `${this.homesFiltered.length} Homes `;
    switch (this.selectedFilter) {
      case 'unread':
        text += 'To Check';
        break;
      case 'saved':
        text += 'Saved';
        break;
      default:
        text += 'Total';
        break;
    }
    return text;
  }

  saveHome(home: HomeForSale) {
    this.logger.logInfo(this.module, 'Save Home Called', home);
    this.setState(State.Loading);

    this.api.saveHome(home.Id).subscribe({
      next: (updatedHome: HomeForSale) => {
        this.logger.logSuccess(this.module, 'Home Saved!', updatedHome);
        this.toastr.success('Home Saved!');

        // update home in local storage without reloading everything
        const existingHome = this.homes.find(h => h.Id === updatedHome.Id);
        if (existingHome != null) {
          existingHome.Status = updatedHome.Status;
        }
        this.filterHomes();
        this.setState(State.Data);
      },
      error: (err: any) => {
        this.logger.logError(this.module, 'Error Saving Home', err);
        this.toastr.danger('Reloading Data', 'Error Saving Home');
        this.loadHomes();
      }
    });
  }

  ignoreHome(home: HomeForSale) {
    this.logger.logInfo(this.module, 'Ignore Home Called', home);
    this.setState(State.Loading);

    this.api.ignoreHome(home.Id).subscribe({
      next: (updatedHome: HomeForSale) => {
        this.logger.logSuccess(this.module, 'Home Ignored!', updatedHome);
        this.toastr.success(updatedHome.StreetName, 'Home Ignored');

        // update home in local storage without reloading everything
        const existingHome = this.homes.find(h => h.Id === updatedHome.Id);
        if (existingHome != null) {
          this.homes.splice(this.homes.indexOf(existingHome), 1);
        }
        this.filterHomes();
        this.setState(State.Data);
      },
      error: (err: any) => {
        this.logger.logError(this.module, 'Error Ignoring Home', err);
        this.toastr.danger('Reloading Data', 'Error Ignoring Home');
        this.loadHomes();
      }
    });
  }

  ignoreHomeAndZip(home: HomeForSale) {
    this.logger.logInfo(this.module, 'Ignore Home And Zip Called', home);
    this.setState(State.Loading);

    this.api.ignoreHomeAndZip(home.Id).subscribe({
      next: (ignoredZip: string | null) => {
        if (!ignoredZip) {
          this.logger.logSuccess(this.module, 'Weird Response from Ignore Home and Zip!', ignoredZip);
          this.loadHomes();
          return;
        }

        this.logger.logSuccess(this.module, 'Home And Zip Ignored!', ignoredZip);
        this.toastr.success(ignoredZip, 'Zip Code Ignored');
        this.loadHomes();
      },
      error: (err: any) => {
        this.logger.logError(this.module, 'Error Ignoring Home and Zip', err);
        this.toastr.danger('Reloading Data', 'Error Ignoring Home and Zip');
        this.loadHomes();
      }
    });
  }

  //#region Private

  private loadHomes() {
    this.setState(State.Loading);

    this.api.getHomes().subscribe({
      next: this.afterHomesLoaded.bind(this),
      error: (err: any) => {
        this.logger.logError(this.module, 'Load Homes Error', err);
        this.setState(State.Error);
      }
    });
  }

  private afterHomesLoaded(homes: HomeForSale[]) {
    this.logger.logSuccess(this.module, 'Loaded Homes', homes);
    this.homes = homes;
    if (!this.homes.some(h => h.Status === 0)) {
      this.selectedFilter = 'saved';
    }
    this.filterHomes();
    this.setState(State.Data);
  }

  private filterHomes() {
    switch (this.selectedFilter) {
      case 'unread':
        this.homesFiltered = this.homes.filter(h => h.Status === 0);
        break;
      case 'saved':
        this.homesFiltered = this.homes.filter(h => h.Status === 1);
        break;
      default:
        this.homesFiltered = this.homes;
        break;
    }

    if (this.filterText && this.filterText.length) {
      this.homesFiltered = this.homesFiltered.filter(h => h.AddressFull.toLowerCase().includes(this.filterText.toLowerCase()));
    }
  }

  private listenToFilterText() {
    this.filterTextChanged$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: (newVal: string) => {
        this.logger.logInfo(this.module, 'Filter Text Changed After Debounce', newVal);
        this.filterHomes();
      }
    });
  }

  //#endregion

}
