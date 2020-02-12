import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupOptions } from '../services/popup.service';

export interface CommonPopupResultBody {
  value?: string;
  text?: string;
  action: boolean;
}

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss']
})
export class CommonPopupComponent implements OnInit {
  title: string;
  contents: string;
  titleOnly: boolean;
  input: boolean;
  placeholder: string;
  type: 'confirm' | 'alert' = 'alert';
  default: string;
  maxLength: number;
  inputText: string;

  constructor(
    private dialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: PopupOptions
  ) { }

  ngOnInit() {
    this.title = this.dialogData.title;
    this.contents = this.dialogData.contents;
    this.titleOnly = this.dialogData.titleOnly;
    this.input = this.dialogData.input;
    this.placeholder = this.dialogData.inputPlaceholder;
    this.type = this.dialogData.type;
    this.default = this.dialogData.default;
    this.maxLength = this.dialogData.maxLength || -1;
  }

  done(e?) {
    if (e && e.code.toLowerCase() !== 'enter') { return; }

    const body: CommonPopupResultBody = {
      action: true
    };
    if (this.input) {
      if (!this.inputText && !this.default) {
        // 예외
        alert('input창에 입력해주세요');
        return;
      }

      body.text = this.inputText || this.default;
    }
    this.dialogRef.close(body);
  }

  cancel() {
    const body: CommonPopupResultBody = {
      action: false
    };
    this.dialogRef.close(body);
  }
}
