import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  constructor(private readonly eventService: EventService) {}

  async checkUniqueCode(code: string): Promise<string> {
    const event = await firstValueFrom(this.eventService.getEventByCode(code));
    return event ? this.generateUniqueEventCode() : code;
  }

  async generateUniqueEventCode(): Promise<string> {
    let eventCode: string = ''; // Initialize with a default value
    let isUnique = false;

    while (!isUnique) {
      eventCode = this.generateCode(); // Generate a new code
      const uniqueCode = await this.checkUniqueCode(eventCode); // Check if it's unique
      isUnique = uniqueCode === eventCode; // If the returned code is the same, it's unique
    }

    return eventCode; // Now guaranteed to be assigned before returning
  }

  generateCode(): string {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return code;
  }
}
