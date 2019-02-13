import { Injectable } from '@angular/core';
import { Customer } from './customer';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  COLLECTION = 'customers';
  COLLECTION_PATH = this.COLLECTION + '/';

  getCustomers (): Observable<Customer[]> {
    return this.afs.collection<Customer>(this.COLLECTION).valueChanges().pipe(
      catchError(this.handleError('getCustomers', []))
    );
  }

  getCustomer(customerId: string): Observable<Customer> {
    return this.afs.doc<Customer>(this.COLLECTION_PATH + customerId).valueChanges().pipe(
      catchError(this.handleError('getCustomer', null))
    );
  }

  newCustomer(customer: Customer) {
    const customersCollection = this.afs.collection<Customer>(this.COLLECTION);
    customer.id = this.afs.createId();
    customer.createdDate = (new Date()).toJSON();
    customersCollection.doc(customer.id).set({...customer});
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

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  constructor(
    private afs: AngularFirestore) { }
}
