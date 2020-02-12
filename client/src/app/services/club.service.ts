import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { StoreService } from './store.service';

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
          this.store.clubs.push(resp.data);
          this.store.clubs$.next(this.store.clubs);
        }
        return resp.success;
      }
    ));
  }
}
