import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  contacts: Contact[] = [];
  selectedGroupContacts: Contact[] = [];
  contactForm: FormGroup;
  contactGroup: FormArray;
  originalContact: Contact;
  contact: Contact;
  editMode: boolean = false;
  id: string;
  showInvalidContactAlert: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact))

      if (this.contact.group) {
        this.contacts = [...this.contact.group];
      }

      if (this.contact && this.contact.group) {
        this.contacts = [...this.contact.group];
        this.selectedGroupContacts = [...this.contact.group]; // Initialize the selectedGroupContacts array
      }
    });
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.contacts.length) {
      return;
    }

    // Remove the contact from the group
    const removedContact = this.contacts.splice(index, 1)[0];

    // Update the selectedGroupContacts array
    this.selectedGroupContacts = this.selectedGroupContacts.filter(contact => contact.id !== removedContact.id);
  }

  onCancel() {
    this.router.navigate(['../contacts']);
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newContact = new Contact(
      values.id,
      values.name,
      values.email,
      values.phone,
      values.imageUrl,
      this.selectedGroupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.editMode = false;
    this.router.navigate(['../contacts']);
  }
  

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    this.showInvalidContactAlert = invalidGroupContact;
    if (invalidGroupContact) {
      return;
    }
    this.contacts.push(selectedContact);
    this.selectedGroupContacts.push(selectedContact);
    
  }
  

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      // newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.contacts.length; i++) {
      if (newContact.id === this.contacts[i].id) {
        return true;
      }
    }
    return false;
  }

  get controls() {
    return (<FormArray>this.contactForm.get('group')).controls;
  }
}
