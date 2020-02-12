import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from './store.service';
import { ClubService } from './club.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  token: string;

  constructor(
    private api: ApiService,
    private store: StoreService,
    private club: ClubService,
  ) { }

  signIn(uid: string, password: string, auto: boolean = false): Observable<boolean> {
    return this.api.post('signin', { uid, password }).pipe(
      map((resp) => {
        if (resp.success) {
          const user = resp.data;
          this.store.me = user;
          this.token = user.token;
          if (auto) {
            localStorage.setItem('token', user.token);
          }
          this.isLoggedIn$.next(true);
          this.getClubs();
        }
        return resp.success;
      })
    );
  }

  getMe(): Observable<boolean> {
    return this.api.get(`account/me`).pipe(map(resp => {
      if (resp.success) {
        this.store.me = resp.data;
        this.token = localStorage.getItem('token');
        this.isLoggedIn$.next(true);
        this.getClubs();
      }
      return resp.success;
    }));
  }

  getClubs() {
    this.club.lists().subscribe();
  }
}
