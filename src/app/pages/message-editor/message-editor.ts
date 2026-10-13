
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

type EditableField =
  | 'variable1'
  | 'variable2'
  | 'yesPayload'
  | 'noPayload'
  | 'unsubscribePayload'
  | 'websiteUrl';

type VariableField = EditableField;

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
  activeVariable: VariableField = 'variable1';
  searchTerm = '';
  activeTab: 'standard' | 'custom' = 'standard';
  notification = '';

  attributes = [
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'City',
    'Company Name'
  ];

  customAttributes: string[] = [];

  form = this.fb.nonNullable.group({
    imageUrl: [''],
    videoUrl: [''],
    documentUrl: [''],
    latitude: [''],
    longitude: [''],
    message: [''],
    variable1: [''],
    variable2: [''],
    yesPayload: [''],
    noPayload: [''],
    unsubscribePayload: [''],
    websiteUrl: ['']
  });

  get filteredAttributes(): string[] {
    const list =
      this.activeTab === 'standard'
        ? this.attributes
        : this.customAttributes;

    return list.filter(attribute =>
      attribute.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      )
    );
  }

  insertEmoji(field: EditableField): void {
    const control = this.form.controls[field];
    const current = control.value || '';

    control.setValue((current + '😊').slice(0, 128));
  }

insertVariable(field: EditableField): void {
  this.toggleVariableAttributes(field);
}

  toggleVariableAttributes(field: VariableField): void {
    if (this.showAttributes && this.activeVariable === field) {
      this.showAttributes = false;
      return;
    }

    this.activeVariable = field;
    this.showAttributes = true;
    this.searchTerm = '';
    this.activeTab = 'standard';
  }

  // Retained for compatibility with the existing HTML.
  toggleAttributes(): void {
    this.toggleVariableAttributes('variable1');
  }

  selectAttribute(attribute: string): void {
    const control = this.form.controls[this.activeVariable];
    control.setValue(attribute);
    this.showAttributes = false;
    this.searchTerm = '';
  }

  setAttributeTab(tab: 'standard' | 'custom'): void {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  cancel(): void {
    this.form.reset();
    this.notification = '';
    this.showAttributes = false;
    this.searchTerm = '';
    this.activeVariable = 'variable1';
    this.activeTab = 'standard';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification = 'Please complete the required fields.';
      return;
    }

    console.log(
      'Message configuration:',
      this.form.getRawValue()
    );

    this.notification =
      'Message configuration completed successfully!';
  }
}
