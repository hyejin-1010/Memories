import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  uploadFile: File;

  constructor(
    private store: StoreService,
    public dialogRef: MatDialogRef<ImageUploadComponent>,
  ) { }

  ngOnInit() {
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
      formData
    });
  }
}
