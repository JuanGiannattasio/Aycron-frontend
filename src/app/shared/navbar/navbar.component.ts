import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public activeMenu: boolean = false;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clickMenu() {
    (this.activeMenu) ? this.activeMenu = false : this.activeMenu = true; 
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
