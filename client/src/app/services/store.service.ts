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

  constructor() { }

  initialize() {
    this.me = undefined;
    this.clubs = [];
  }
}
