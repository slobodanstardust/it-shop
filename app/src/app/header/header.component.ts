import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'its-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  displayStyle: string = 'flex';

  constructor(private router: Router) {
    // For hidding the carousel when administrator page is in use.
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/administrator') this.displayStyle = 'none';
        else this.displayStyle = 'flex';
      }
    })
  }

  ngOnInit(): void {
  }
}
