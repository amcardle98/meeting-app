import { Injectable } from '@angular/core';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class MeetService {
  constructor(private readonly eventService: EventService) {}

  generateLobbyId(): string {
    return 'lobbyId';
  }

  generateEventCode(): Promise<string> {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const generateCode = () => {
      const result = [];
      for (let i = 0; i < 5; i++) {
        result.push(
          randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        );
      }
      return result.join('');
    };

    const checkUniqueCode = (code: string): Promise<string> => {
      return new Promise((resolve) => {
        this.eventService.getEventByCode(code).subscribe({
          next: (event) => {
            if (event) {
              // If not unique, resolve with a new code
              resolve(this.generateEventCode());
            } else {
              // If unique, resolve with the code
              resolve(code);
            }
          },
        });
      });
    };

    const eventCode = generateCode();
    return checkUniqueCode(eventCode);
  }

  joinEvent(eventCode: string): void {
    console.log(`Joining event with code: ${eventCode}`);
  }
}
