
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Contact,
  ContactPayload
} from '../../models/contact';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactForm implements OnChanges {

  private fb = inject(FormBuilder);

  @Input() contact: Contact | null = null;
  @Input() saving = false;

  @Output() saveContact = new EventEmitter<ContactPayload>();
  @Output() cancelEdit = new EventEmitter<void>();

onPanInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const uppercaseValue = input.value.toUpperCase();

  input.value = uppercaseValue;
  this.form.controls.pan_no.setValue(uppercaseValue);
}

  form = this.fb.nonNullable.group({
    createdAt: ['', Validators.required],

    first_name: [
      '',
      [Validators.required, Validators.minLength(2)]
    ],

    last_name: [
      '',
      [Validators.required, Validators.minLength(2)]
    ],

    emailId: [
      '',
      [Validators.required, Validators.email]
    ],

    age: [
      18,
      [Validators.required, Validators.min(18), Validators.max(100)]
    ],

    gender: ['', Validators.required],

    mobilenumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],

    pan_no: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
      ]
    ],

    adhaar_no: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{12}$/)
      ]
    ],

    status: [true]
  });

ngOnChanges(): void {
  if (this.contact) {
    console.log('Editing contact:', this.contact);

    this.form.patchValue({
      createdAt: this.contact.createdAt?.slice(0, 10) ?? '',
      first_name: this.contact.first_name,
      last_name: this.contact.last_name,
      emailId: this.contact.emailId,
      age: Number(this.contact.age),
      gender: this.contact.gender,
      mobilenumber: String(this.contact.mobilenumber),
      pan_no: this.contact.pan_no,
      adhaar_no: this.contact.adhaar_no,
      status: this.contact.status
    });
  } else {
    this.form.reset({
      createdAt: new Date().toISOString().slice(0, 10),
      first_name: '',
      last_name: '',
      emailId: '',
      age: 18,
      gender: '',
      mobilenumber: '',
      pan_no: '',
      adhaar_no: '',
      status: true
    });
  }
}

  isInvalid(
    field: keyof typeof this.form.controls
  ): boolean {
    const control = this.form.controls[field];

    return control.invalid &&
      (control.touched || control.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.saveContact.emit({
      ...value,
      mobilenumber: Number(value.mobilenumber),
      pan_no: value.pan_no.toUpperCase()
    });
  }


resetForm(): void {
  const today = new Date();
  const localDate =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

  this.form.reset({
    createdAt: localDate,
    first_name: '',
    last_name: '',
    emailId: '',
    age: 18,
    gender: '',
    mobilenumber: '',
    pan_no: '',
    adhaar_no: '',
    status: true
  });

  this.form.markAsPristine();
  this.form.markAsUntouched();
}
}
