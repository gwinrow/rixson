import { Injectable } from '@angular/core';
import { Customer } from './customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'api/customers';  // URL to web api

  /** GET customers from the server */
  getCustomers (): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        tap(customers => this.log('fetched customers')),
        catchError(this.handleError('getCustomers', []))
      );
  }

  /** GET customer by id. Will 404 if id not found */
  getCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<Customer>(url).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<Customer>(`getCustomer id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
//    this.messageService.add(`CustomerService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  constructor(
    private http: HttpClient) { }
}
