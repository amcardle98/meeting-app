import { Component } from '@angular/core';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  eventCode!: string;
  errorMsg!: string;
  loaded = false;

  ngOnInit(): void {
    //wait 2 seconds
    setTimeout(() => {
      this.loaded = true;
    }, 200);
  }

  joinEvent(): void {
    this.errorMsg = `No event found with code: ${this.eventCode}`;
  }

  isValidEventCode(): boolean {
    return Boolean(this.eventCode) && this.eventCode.length === 5;
  }



}
