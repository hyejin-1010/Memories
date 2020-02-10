import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  account = {
    uid: '',
    password: ''
  };

  constructor(
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
  }

  login() {
    let message: string = null;

    if (!this.account.uid) {
      message = '아이디를 입력하주세요.';
    } else if (!this.account.password) {
      message = '비밀번호를 입력해주세요.';
    }

    if (message) { return alert(message); }

    this.api.post('signin', this.account).subscribe(resp => {
      if (resp.success) { // 로그인 성공
        // 메인 페이지로 이동
      } else { // 로그인 실패
        alert('아이디 혹은 비밀번호를 다시 한 번 확인해주세요.');
      }
    });
  }

  register() {
    this.router.navigate(['/signup']);
  }
}
