import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, map, Observable, of } from 'rxjs';
import { uid } from 'uid';
import { Timestamp } from 'firebase/firestore';

/**
 * @param name - The name of the event
 * @param eventType - The type of event
 * @param dates - The dates of the event (single or multiple)
 * @param description - The description of the event (optional)
 * @param keepAliveTime - The time to keep the event alive (optional)
 */
export class Event {
  name?: string;
  eventType?: string;
  dates: Date[];
  description?: string;
  keepAliveTime?: number;
  eventCode?: string;
  eventCreated?: Date;
  eventEnded?: Date | null;

  constructor() {
    this.dates = [];
  }
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private readonly fs: AngularFirestore) {}

  getEvents(): Observable<Event[]> {
    return this.fs
      .collection('events')
      .valueChanges()
      .pipe(map((events) => events as Event[]));
  }

  getEventByCode(eventCode: string): Observable<Event | null> {
    console.log(eventCode);

    const event = this.fs
      .collection<Event>('events', (ref) =>
        ref.where('eventCode', '==', eventCode)
      )
      .valueChanges()
      .pipe(
        map((events) => {
          if (events.length > 0) {
            const event = events[0];
            // Convert Timestamp to Date if eventCreated is a Firestore Timestamp
            if (event.eventCreated instanceof Timestamp) {
              event.eventCreated = event.eventCreated.toDate();
            }

            for (let date of event.dates) {
              if (date instanceof Timestamp) {
                event.dates[event.dates.indexOf(date)] = date.toDate();
              }
            }

            return event;
          }
          return null; // Return null if no event found
        })
      );

    return event;
  }

  addEvent(event: Partial<Event>): Promise<any> {
    return this.fs.collection('events').add(event);
  }

  joinEvent(eventCode: string): Observable<Event | null> {
    // Check if event exists
    const event = this.getEventByCode(eventCode);

    if (!event) {
      return of(null);
    }

    return event;
  }
}
