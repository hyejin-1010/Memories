import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  uploadFile: File;
  albums: { _id: string, title: string }[] = [];
  album: string;

  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit() {
    this.albums = this.dialogData.albums;
  }

  fileChange(event) {
    this.uploadFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img: any = document.getElementById('previewImg');
      img.src = e.target.result;
    };
    reader.readAsDataURL(this.uploadFile);
  }

  upload() {
    if (!this.uploadFile) { return; }
    const formData = new FormData();
    formData.set('userFile', this.uploadFile);
    this.dialogRef.close({
      formData,
      album: this.album
    });
  }
}
