import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent {
  eventCode!: string;
  name!: string;
  errorMsg!: string;
  codeValid = false;

  constructor(
    private readonly eventService: EventService,
    private readonly router: Router
  ) {}

  joinEvent(): void {
    this.eventService.joinEvent(this.eventCode).subscribe({
      next: (event) => {
        if (event) {
          this.router.navigate(['/event', this.eventCode]);
        } else {
          this.errorMsg = 'Event not found';
        }
      },
      error: (error) => {
        this.errorMsg = 'Error joining event';
      },
    });
  }

  isValidEventCode() {
    this.codeValid = this.eventCode.length == 5 && this.name.length > 0;
  }
}
