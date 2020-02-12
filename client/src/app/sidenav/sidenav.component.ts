import { Component, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { CommonPopupResultBody } from '../common-popup/common-popup.component';
import { ClubService } from '../services/club.service';
import { StoreService, ClubModel } from '../services/store.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  clubs: ClubModel[] = [];

  constructor(
    private popup: PopupService,
    private club: ClubService,
    private store: StoreService,
  ) { }

  ngOnInit() {
    this.store.clubs$.subscribe(clubs => {
      this.clubs = clubs;
    });
  }

  addClub() {
    this.popup.open({
      title: '모임 생성',
      contents: '',
      titleOnly: true,
      input: true,
      inputPlaceholder: '모임명을 입력해주세요.',
      type: 'confirm'
    }).afterClosed().subscribe((result: CommonPopupResultBody) => {
      if (!result.action) { return; }
      const title = result.text;
      this.club.create(title).subscribe();
    });
  }

  // 사이드 메뉴의 모임을 클릭했을 경우
  clickClub(club: ClubModel) {
    if (!club || !club._id) { return; }
    if (this.store.currentClub && this.store.currentClub._id === club._id) { return; }
    this.store.currentClub = club;
  }
}
