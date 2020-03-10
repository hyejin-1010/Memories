import { Component, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { CommonPopupResultBody } from '../common-popup/common-popup.component';
import { ClubService } from '../services/club.service';
import { StoreService, ClubModel } from '../services/store.service';
import { skip, take } from 'rxjs/operators';

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

    this.store.currentClub$.pipe(take(2), skip(1)).subscribe((currentClub) => {
      if (!currentClub || !currentClub._id) { return; }
      const club = this.clubs.find(c => c._id === currentClub._id);
      if (club) { club.expanded = true; }
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
}
