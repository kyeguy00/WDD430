import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  // messageListChangedEvent = new Subject<Message[]>();

  private messages: Message[] = [];
  maxMessageId: number;
  
  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId()
  }

  

  getMessages(): void {
    //return this.messages.slice();
    const url =
      'https://cms-project-38479-default-rtdb.firebaseio.com/messages.json';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get<Message[]>(url, { headers }).subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next([...this.messages]);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  getMessage(id: string): Message {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null!;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = Number(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  private storeMessages(): void {
    const url =
      'https://cms-project-38479-default-rtdb.firebaseio.com/messages.json';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const messagesString = JSON.stringify(this.messages);
  
    this.http.put(url, messagesString, { headers }).subscribe(
      () => {
        console.log('Messages stored successfully.');
      },
      (error: any) => {
        console.error('Error storing messages:', error);
      }
    );
  }
}
