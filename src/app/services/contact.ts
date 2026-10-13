import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ContactPayload } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://65c0cfa6dc74300bce8cc64d.mockapi.io/Contact/profile';

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createContact(data: ContactPayload): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, data);
  }

  updateContact(
    id: string,
    data: ContactPayload
  ): Observable<Contact> {
    return this.http.put<Contact>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
