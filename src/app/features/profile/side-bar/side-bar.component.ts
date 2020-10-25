import { Component, OnInit } from '@angular/core';
import { AuthManager } from 'src/app/core/managers/auth.manager';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(public authManager: AuthManager) { }

  ngOnInit(): void {
  }

}
