import { UserInfoService } from './../../services/user-info.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  public userInfo:any = this.user.info;
  constructor(public user:UserInfoService) { }

  ngOnInit() { }

}
