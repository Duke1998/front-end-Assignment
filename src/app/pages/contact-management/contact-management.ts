import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { Contact, ContactPayload } from '../../models/contact';
import { ContactService } from '../../services/contact';
import { ContactForm } from '../../components/contact-form/contact-form';



@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contact-management.html',
  styleUrl: './contact-management.css'
})
export class ContactManagement implements OnInit {
  private contactService = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild(ContactForm) contactForm!: ContactForm;


  contacts: Contact[] = [];
  searchTerm = '';
  selectedContact: Contact | null = null;

  loading = false;
  saving = false;
  deletingId: string | null = null;

  notification = '';
  notificationType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadContacts();
  }

  get filteredContacts(): Contact[] {
    const query = this.searchTerm.toLowerCase().trim();

    return this.contacts.filter(contact =>
      `${contact.first_name} ${contact.last_name} ${contact.emailId} ${contact.mobilenumber}`
        .toLowerCase()
        .includes(query)
    );
  }
loadContacts(): void {
  this.loading = true;
  this.cdr.markForCheck();

  this.contactService.getContacts().subscribe({
    next: (data) => {
      this.contacts = [...data];
      this.loading = false;

      this.cdr.markForCheck();

      console.log('Contacts loaded:', this.contacts.length);
    },
    error: (error) => {
      this.loading = false;
      this.cdr.markForCheck();

      console.error('Failed to load contacts:', error);
      this.notify('Failed to load contacts.', 'error');
    }
  });
}

saveContact(data: ContactPayload): void {
  if (this.saving) return;

  this.saving = true;

  const editingId = this.selectedContact?.id;
  const isEditing = !!editingId;

  const request = editingId
    ? this.contactService.updateContact(editingId, data)
    : this.contactService.createContact(data);

  request
    .pipe(finalize(() => this.saving = false))
    .subscribe({
      next: () => {
        this.notify(
          isEditing
            ? 'Contact updated successfully!'
            : 'Contact created successfully!',
          'success'
        );

        this.selectedContact = null;
        this.contactForm.resetForm();
        this.loadContacts();
      },
      error: (error) => {
        console.error('Save contact failed:', error);

        this.notify(
          isEditing
            ? 'Failed to update contact.'
            : 'Failed to create contact.',
          'error'
        );
      }
    });
}

editContact(contact: Contact): void {
  if (!contact.id) {
    this.notify('Contact ID is missing.', 'error');
    return;
  }

  this.selectedContact = { ...contact };

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
  deleteContact(contact: Contact): void {
    if (!contact.id || this.deletingId) return;

    if (!confirm(`Delete ${contact.first_name} ${contact.last_name}?`)) {
      return;
    }

    this.deletingId = contact.id;

    this.contactService.deleteContact(contact.id)
      .pipe(finalize(() => this.deletingId = null))
      .subscribe({
        next: () => {
          this.notify('Contact deleted successfully!', 'success');
          this.loadContacts();
        },
        error: () => this.notify('Unable to delete contact.', 'error')
      });
  }

  cancelEdit(): void {
    this.selectedContact = null;
  }

  notify(message: string, type: 'success' | 'error'): void {
    this.notification = message;
    this.notificationType = type;
  }
}

