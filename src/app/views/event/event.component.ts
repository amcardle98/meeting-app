import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { EventService, Event } from 'src/app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {
  event$: Observable<Event | null> = this.activatedRoute.params.pipe(
    map((params) => params['code']),
    switchMap((code) =>
      this.eventService.getEventByCode(code).pipe(
        catchError(() => of(null)) // Handle errors gracefully
      )
    )
  );

  constructor(
    private readonly eventService: EventService,
    private readonly activatedRoute: ActivatedRoute
  ) {}
}
