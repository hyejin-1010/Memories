import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ClubModel {
  _id: string;
  title: string;
  members: any[];
  created: string;
  owner: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  me: any;
  clubs: ClubModel[];
  clubs$ = new BehaviorSubject<ClubModel[]>([]);      // navbar에서 선택된 global group subject
  // tslint:disable-next-line:variable-name
  private _currentClub: ClubModel;
  currentClub$: BehaviorSubject<ClubModel>;

  constructor() {
    this.initialize();
  }

  get currentClub() {
    return this._currentClub;
  }
  set currentClub(club: ClubModel) {
    this._currentClub = club;
    this.currentClub$.next(this._currentClub);
  }

  initialize() {
    this.me = undefined;
    this.clubs = [];
    this._currentClub = undefined;
    this.currentClub$ = new BehaviorSubject<ClubModel>({} as ClubModel);
  }
}
