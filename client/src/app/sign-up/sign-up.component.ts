import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  uid: string;
  pw: string;
  pwConfirm: string;
  email: string;
  last: string;
  first: string;
  nickname: string;

  validUID = false;
  validEmail = false;
  validPW = false;
  validPWConfirm = false;

  isDone = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private common: CommonService,
  ) { }

  ngOnInit() {
  }

  // 아이디 중복 체크
  checkUid() {
    this.validUID = true;
    this.api.get(`idcheck/${this.uid}`).subscribe((resp) => {
      if (!resp) { return; }
      if (resp.success) {
        alert('이미 존재하는 아이디 입니다.');
      }

      this.validUID = !resp.success;
      this.checkDone();
    });
  }

  changeUID() {
    this.validUID = false;
    this.checkDone();
  }

  changePW(confirm: boolean = false) {
    this.validPWConfirm = false;
    if (this.pw.length > 6) {
      if (!confirm) {
        this.validPW = this.pw.length > 6;
      }
      if (this.validPW) { this.validPWConfirm = this.pw === this.pwConfirm; }
    } else if (!confirm) {
      this.validPW = false;
    }

    this.checkDone();
  }

  changeEmail() {
    this.validEmail = this.common.isValidateEmail(this.email);
    this.checkDone();
  }

  checkDone() {
    this.isDone = this.validUID && this.validPW && this.validPWConfirm
                  && this.validEmail && this.last && this.first && this.nickname && true;
  }

  goToLogin() {
    this.router.navigate(['signin']);
  }

  done() {
    this.api.post('signup', {
      uid: this.uid,
      password: this.pwConfirm,
      email: this.email,
      last: this.last,
      first: this.first,
      nickname: this.nickname
    }).subscribe((resp) => {
      if (resp.success) { // 회원가입 성공
        this.router.navigate(['signin']);
      } else { // 회원가입 실패
      }
    });
  }
}
