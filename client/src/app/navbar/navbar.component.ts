import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClubService } from '../services/club.service';
import { StoreService, ClubModel } from '../services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routeQuery: Params;

  constructor(
    private auth: AuthService,
    private club: ClubService,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.init();
      }
    });
  }

  init() {
    this.routeQuery = this.route.snapshot.queryParams;

    this.club.lists().subscribe((clubs) => {
      // 리다이렉트 체크
      if (this.routeQuery.hasOwnProperty('redirectTo')) {
        if (this.checkRedirect()) {
          return;
        }
      }
    });
  }

  private checkRedirect() {
    try {
      const query: string[] = this.routeQuery.redirectTo.split('/').filter(v => v);
      if (query.length === 0) {
        const club: ClubModel = this.store.clubs[0];
        if (club) {
          this.router.navigate([club._id, 'schedule']);
        }
      }

      const isClub = query[0].length === 24;

      if (isClub) {
        const club = this.store.clubs.find((c) => c._id === query[0]);
        if (club) {
          this.store.currentClub = club;
          this.router.navigate([club._id, query[1] || 'schedule']);
          return true;
        }
      }
    } catch (e) {
      return false;
    }

    // 모임 외 다른 것들은 리다이렉트 안시킴
    return false;
  }
}
