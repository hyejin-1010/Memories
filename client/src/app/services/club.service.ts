import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { StoreService, ClubModel } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(
    private api: ApiService,
    private store: StoreService,
  ) { }

  lists() {
    return this.api.get('club').pipe(
      map((resp) => {
        if (resp.success) {
          this.store.clubs = resp.data;
          this.store.clubs$.next(this.store.clubs);
          const club: ClubModel = this.store.clubs[0];
          if (club && club._id) { this.store.currentClub = club; }
        }
        return resp.success;
      })
    );
  }

  create(title: string) {
    return this.api.post('club', {
      title
    }).pipe(
      map((resp) => {
        if (resp.success) {
          const club: ClubModel = resp.data;
          if (club && club._id) {
            this.store.clubs.push(resp.data);
            this.store.clubs$.next(this.store.clubs);
            this.store.currentClub = club;
          }
        }
        return resp.success;
      }
    ));
  }
}
