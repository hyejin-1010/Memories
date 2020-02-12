import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  id: string;
  pw: string;
  autoLogin = false; // 지동 로그인 여부

  redirectTo: string; // 로그인 안 한 사용자가 입력한 url

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {
    this.redirectTo = this.route.snapshot.queryParams.redirectTo;
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.auth.getMe().subscribe((success: boolean) => {
        if (success) {
          this.router.navigate([''], {queryParams: {redirectTo: this.redirectTo}});
        }
      });
    }
  }

  login() {
    let message: string = null;

    if (!this.id) {
      message = '아이디를 입력하주세요.';
    } else if (!this.pw) {
      message = '비밀번호를 입력해주세요.';
    }

    if (message) { return alert(message); }

    this.auth.signIn(this.id, this.pw, this.autoLogin).subscribe((success) => {
      if (success) {  // 로그인 성공
        this.router.navigate([''], {queryParams: {redirectTo: this.redirectTo}});
      } else {  // 로그인 실패
        alert('아이디 혹은 비밀번호를 다시 한 번 확인해주세요.');
      }
    });
  }

  signIn() {
    this.router.navigate(['/signup']);
  }
}
