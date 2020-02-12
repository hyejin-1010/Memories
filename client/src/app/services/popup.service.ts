import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common-popup/common-popup.component';

export interface PopupOptions {
  width?: string;
  height?: string;
  title: string;
  contents: string;
  type: 'confirm' | 'alert';
  input?: boolean;
  inputPlaceholder?: string;
  default?: string;
  maxLength?: number;
  titleOnly?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private dialog: MatDialog,
  ) { }

  open(options: PopupOptions) {
    return this.dialog.open(CommonPopupComponent, {
      width: options.width || '270px',
      height: options.height,
      minHeight: '125px',
      panelClass: ['no-padding-dialog', 'common-dialog'],
      data: options
    });
  }
}
