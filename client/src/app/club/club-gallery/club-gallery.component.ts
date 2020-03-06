import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { PopupService } from 'src/app/services/popup.service';
import { CommonPopupResultBody } from 'src/app/common-popup/common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploadComponent } from 'src/app/image-upload/image-upload.component';

type Tab = 'all' | 'date' | 'album';

@Component({
  selector: 'app-club-gallery',
  templateUrl: './club-gallery.component.html',
  styleUrls: ['./club-gallery.component.scss']
})
export class ClubGalleryComponent implements OnInit {
  uploadedFiles: any[];
  albums: any[] = [];
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
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.store.currentClub$.subscribe((currentClub) => {
      this.images = [];
      this.api.get('gallery', { club: currentClub._id }).subscribe((resp) => {
        const images = resp.data;
        this.images = images.map((image) => {
          image.url = this.imageUrl(image._id);
          return image;
        });
      });

      this.api.get('album', { club: currentClub._id }).subscribe((resp) => {
        if (!resp.success) { return; }
        this.albums = resp.data || [];
        this.albums = this.albums.map((album) => {
          if (album.image) { album.imageUrl = this.imageUrl(album.image._id); }
          return album;
        });
      });
    });
  }

  private imageUrl(id: string): string {
    return `${this.api.HOST}/${this.api.PREFIX}/file/${id}`;
  }

  clickTab(tab: Tab) {
    if (this.currentTab === tab) { return; }
    this.currentTab = tab;
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
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
        if (!resp.success) { return; }
        this.albums.push(resp.data);
      });
    });
  }

  addImage() {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '450px',
      minHeight: '600px',
      height: '600px',
      panelClass: ['no-padding-dialog'],
      data: {
        albums: this.albums.map((album) => ({ _id: album._id, title: album.title }))
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !result.formData) { return; }
      const formData = result.formData;
      formData.set('club', this.store.currentClub._id);
      if (result.album) { formData.set('album', result.album); }
      this.api.post('photo', formData).subscribe((resp) => {
        if (!resp.success) { return; }
        resp.data.url = `${this.api.HOST}/${this.api.PREFIX}/file/${resp.data._id}`;
        this.images.push(resp.data);
      });
    });
  }
}
