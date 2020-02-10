import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  account = {
    uid: '',
    password: '',
    email: '',
    last: '',
    first: '',
    nickname: ''
  };

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
  }

  signup() {
    this.api.post('signup', this.account).subscribe((resp) => {
      console.log('chloe test resp', resp);
    });
  }
}
