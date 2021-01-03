import { Component, OnInit } from '@angular/core';
import { FtpsLoggerService } from 'ftps-logger-ngx';
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

  State = State;
  homes: HomeForSale[] = [];
  homesFiltered: HomeForSale[] = [];
  selectedFilter = 'unread';

  constructor(private api: ApiService, private logger: FtpsLoggerService) {
    super();
  }

  ngOnInit(): void {
    this.loadHomes();
  }

  filterSelectionChange(newSelection: string) {
    this.logger.logDebug(this.module, 'Filter Selection Changed', newSelection, this.selectedFilter);
    this.setState(State.Loading);
    setTimeout(() => { this.filterHomes(); this.setState(State.Data); }, 100);
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

        this.loadHomes();
      },
      error: (err: any) => {
        this.logger.logError(this.module, 'Error Ignoring Home and Zip', err);
        this.loadHomes();
      }
    });
  }

  //#region Private

  private loadHomes() {
    this.setState(State.Loading);

    this.api.getHomes().subscribe({
      next: (homes: HomeForSale[]) => {
        this.logger.logSuccess(this.module, 'Loaded Homes', homes);
        this.homes = homes;
        if (!this.homes.some(h => h.Status === 0)) {
          this.selectedFilter = 'saved';
        }
        this.filterHomes();
        this.setState(State.Data);
      },
      error: (err: any) => {
        this.logger.logError(this.module, 'Load Homes Error', err);
        this.setState(State.Error);
      }
    });
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
  }

  //#endregion

}
