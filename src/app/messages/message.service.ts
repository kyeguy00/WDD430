import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();

  private messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.maxMessageId = this.getMaxId();
  }

  getMessages(): void {
    const url =
      'http://localhost:3000/messages';
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
      'http://localhost:3000/messages';
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
