import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit{

  
  @ViewChild('msgText', {static: true}) messageInputRef: ElementRef;
  @ViewChild('subject', {static: true}) subjectInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: string = '1';

  constructor(private messageService: MessageService){}

  ngOnInit() {
  }
  
  onSendMessage() {
    const msgText = this.messageInputRef.nativeElement.value;
    const subject = this.subjectInputRef.nativeElement.value;
    const newMessage = new Message('1', subject, msgText, this.currentSender);
    this.messageService.addMessage(newMessage);

    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.messageInputRef.nativeElement.value = '';
  }
}
