
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-message-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-editor.html',
  styleUrl: './message-editor.css'
})
export class MessageEditor {
  private fb = inject(FormBuilder);

  showAttributes = false;
  searchTerm = '';
  notification = '';

  attributes = [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'City',
    'Company Name'
  ];

  form = this.fb.nonNullable.group({
    imageUrl: [''],
    videoUrl: [''],
    documentUrl: [''],
    latitude: [''],
    longitude: [''],
    message: ['', Validators.required],
    variable1: [''],
    variable2: [''],
    yesPayload: ['Yes'],
    noPayload: ['No'],
    unsubscribePayload: ['Unsubscribe'],
    websiteUrl: ['']
  });

  get filteredAttributes(): string[] {
    return this.attributes.filter(attribute =>
      attribute.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleAttributes(): void {
    this.showAttributes = !this.showAttributes;
  }

  selectAttribute(attribute: string): void {
    this.form.patchValue({
      variable1: attribute
    });
    this.showAttributes = false;
  }

  cancel(): void {
    this.form.reset();
    this.notification = '';
    this.showAttributes = false;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification = 'Please complete the required fields.';
      return;
    }

    console.log('Message configuration:', this.form.getRawValue());
    this.notification = 'Message configuration completed successfully!';
  }
}
