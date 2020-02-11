import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private store: StoreService,
  ) { }

  signIn(uid: string, password: string): Observable<boolean> {
    return this.api.post('signin', { uid, password }).pipe(
      map((resp) => {
        if (resp.success) {
          this.store.me = resp.data;
          this.isLoggedIn$.next(true);
        }
        return resp.success;
      })
    );
  }
}
