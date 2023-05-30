import {Injectable, EventEmitter} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new Subject<Contact[]>();
  
   contacts: Contact [] =[];

   maxContactId: number;

   constructor() {
      this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
   }
   getContacts() {
    return this.contacts.slice();
   }

   getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null!;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.next(this.contacts.slice());
 }

 getMaxId(): number {
  let maxId = 0;

  for (const contact of this.contacts) {
    const currentId = Number(contact.id);
    if (currentId > maxId) {
      maxId = currentId;
    }
  }

  return maxId;
}

 addContact(newContact: Contact): void {
  if (newContact === undefined || newContact === null) {
    return;
  }

  this.maxContactId++;
  newContact.id = this.maxContactId.toString();
  this.contacts.push(newContact);
  const ContactsListClone = this.contacts.slice();
  this.contactChangedEvent.next(ContactsListClone);
}

updateContact(originalContact: Contact, newContact: Contact): void {
  if (!originalContact || !newContact) {
    return;
  }

  const pos = this.contacts.indexOf(originalContact);
  if (pos < 0) {
    return;
  }

  newContact.id = originalContact.id;
  this.contacts[pos] = newContact;
  const contactsListClone = this.contacts.slice();
  this.contactChangedEvent.next(contactsListClone);
}
}