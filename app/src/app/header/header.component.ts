import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'its-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  displayStyle: string = 'flex';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // For hidding the carousel when administrator page is in use.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (/^\/administrator/.test(event.url)) this.displayStyle = 'none';
        else this.displayStyle = 'flex';
      }
    });
  }
}
