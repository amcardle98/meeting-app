import { Component } from '@angular/core';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  eventCode!: string;
  errorMsg!: string;

  joinEvent(): void {
    this.errorMsg = `No event found with code: ${this.eventCode}`;
  }

  isValidEventCode(): boolean {
    return Boolean(this.eventCode) && this.eventCode.length === 5;
  }



}
