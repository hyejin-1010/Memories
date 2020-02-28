import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { PopupService } from 'src/app/services/popup.service';
import { CommonPopupResultBody } from 'src/app/common-popup/common-popup.component';

type Tab = 'all' | 'date' | 'album';

@Component({
  selector: 'app-club-gallery',
  templateUrl: './club-gallery.component.html',
  styleUrls: ['./club-gallery.component.scss']
})
export class ClubGalleryComponent implements OnInit {
  uploadedFiles: any[];
  albums: any[];
  images: any[] = [];

  tabs: { value: Tab, title: string }[] = [
    { value: 'all', title: '전체 사진' },
    { value: 'date', title: '날짜' },
    { value: 'album', title: '앨범' }
  ];
  currentTab: Tab = 'all';

  constructor(
    private api: ApiService,
    private store: StoreService,
    private popup: PopupService,
  ) { }

  ngOnInit() {
    this.store.currentClub$.subscribe((currentClub) => {
      this.images = [];
      this.api.get('gallery', { club: currentClub._id }).subscribe((resp) => {
        const images = resp.data;
        this.images = images.map((image) => {
          image.url = `${this.api.HOST}/${this.api.PREFIX}/file/${image._id}`;
          return image;
        });
      });
    });
  }

  clickTab(tab: Tab) {
    if (this.currentTab === tab) { return; }
    this.currentTab = tab;
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  upload() {
    const formData = new FormData();

    formData.set('userFile', this.uploadedFiles[0]);
    formData.set('club', this.store.currentClub._id);

    this.api.post('photo', formData).subscribe((resp) => {
      console.log('chloe test post photo response', resp);
    });
  }

  createAlbum() {
    this.popup.open({
      title: '앨범 생성',
      contents: '',
      titleOnly: true,
      input: true,
      inputPlaceholder: '앨범 명을 입력해주세요.',
      type: 'confirm'
    }).afterClosed().subscribe((result: CommonPopupResultBody) => {
      if (!result.action) { return; }
      const title = result.text;
      this.api.post('album', {
        title,
        club: this.store.currentClub._id
      }).subscribe((resp) => {
        console.log('chloe test resp', resp);
      });
    });
  }
}
