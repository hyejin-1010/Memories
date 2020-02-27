import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, ClubModel } from '../services/store.service';
import { Subscription } from 'rxjs';
import { Router, RouterEvent, NavigationStart, NavigationEnd, Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  ready = false;
  routeParams: Params;
  club: ClubModel;

  private routerSubscription: Subscription;

  constructor(
    private store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.ready = false;
        // this.aside.close();
      } else if (event instanceof NavigationEnd) {
        this.routeParams = this.route.snapshot.params;
        const currentClub = this.store.clubs.find((club) => club._id === this.routeParams.id);
        this.store.currentClub = currentClub;
        this.club = currentClub;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.routerSubscription) { this.routerSubscription.unsubscribe(); }
  }

  changeTab(tab: 'schedule' | 'gallery') {
    this.router.navigate([this.club._id, tab]);
  }
}
