import { Injectable } from '@angular/core';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { }

  isValidateEmail(email): boolean {
    if (!email) { return false; }
    return EMAIL_REGEX.test(email);
  }
}
