import {Injectable, EventEmitter} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new Subject<Contact[]>();
  
   contacts: Contact [] =[];

   maxContactId: number;

   constructor(private http: HttpClient) {
      this.contacts = MOCKCONTACTS;
      this.maxContactId = this.getMaxId();
   }
   getContacts(): void {
    const url =
      'https://cms-project-38479-default-rtdb.firebaseio.com/contacts.json';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get<Contact[]>(url, { headers }).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.sortContacts();
        this.contactChangedEvent.next([...this.contacts]);
      },
      (error: any) => {
        console.error(error);
      }
    );
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
    this.storeContacts();
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
  this.storeContacts();
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
  this.storeContacts();
}

private sortContacts(): void {
  this.contacts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });
}

private storeContacts(): void {
  const url =
    'https://cms-project-38479-default-rtdb.firebaseio.com/contacts.json';
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  const contactsString = JSON.stringify(this.contacts);

  this.http.put(url, contactsString, { headers }).subscribe(
    () => {
      console.log('Contacts stored successfully.');
    },
    (error: any) => {
      console.error('Error storing contacts:', error);
    }
  );
}
}