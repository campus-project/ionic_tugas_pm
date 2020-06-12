import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: any = '';
  password: any = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  setValue(e, key) {
    this[key] = e.target.value;
  }

  login(e) {
    e.preventDefault();

    this.httpClient.post('https://vodeacloud.vodea.xyz/oauth/token', {
      client_id: 2,
      client_secret: 'ol9FSJh3ypk4FdYUu2pL0wp21UransnXSKi5DaGm',
      grant_type: 'password',
      username: this.username,
      password: this.password,
    }).subscribe((response: any) => {
      const data = response.access_token;
      console.log(data);
    });
  }

}
