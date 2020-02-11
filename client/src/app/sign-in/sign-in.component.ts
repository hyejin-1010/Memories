import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  id: string;
  pw: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  login() {
    let message: string = null;

    if (!this.id) {
      message = '아이디를 입력하주세요.';
    } else if (!this.pw) {
      message = '비밀번호를 입력해주세요.';
    }

    if (message) { return alert(message); }

    this.auth.signIn(this.id, this.pw).subscribe((success) => {
      if (success) {  // 로그인 성공
        this.router.navigate(['/']);
      } else {  // 로그인 실패
        alert('아이디 혹은 비밀번호를 다시 한 번 확인해주세요.');
      }
    });
  }

  signIn() {
    this.router.navigate(['/signup']);
  }
}
