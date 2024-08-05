import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeetService {

  constructor() { }

  generateLobbyId(): string {
    return 'lobbyId';
  }

  generateEventCody(): string {
    //geneate 5 character random string
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];

    for (let i = 0; i < 5; i++) {
      result.push(randomChars.charAt(Math.floor(Math.random() * randomChars.length)));
    }

    return result.join('');
  }

  joinEvent(eventCode: string): void {
    console.log(`Joining event with code: ${eventCode}`);
  }


  
}
