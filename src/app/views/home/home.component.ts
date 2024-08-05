import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  page = 'default';
  isHome!: boolean;
  
  constructor() { }

  ngOnInit(): void {
    this.isHome = true;
  }

  join() {
    this.page = 'join';
    console.log('Join event!');
  }

  create() {
    this.page = 'create';
    console.log('Create event!');
  }

}
