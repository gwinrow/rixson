import { Injectable } from '@angular/core';
import { Customer } from './customer';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  COLLECTION = 'customers';
  COLLECTION_PATH = this.COLLECTION + '/';

  getCustomers (): Observable<Customer[]> {
    return this.afs.collection<Customer>(this.COLLECTION).valueChanges().pipe(
      map(customers => customers.sort((a, b) => this.compareCustomers(a, b)))
    );
  }

  compareCustomers(a: Customer, b: Customer): number {
    const nameA = a.secondName.toLowerCase(), nameB = b.secondName.toLowerCase();
    if (nameA < nameB) {
      // sort string ascending
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
      // default return value (no sorting)
    }
  }

  getCustomer(customerId: string): Observable<Customer> {
    return this.afs.doc<Customer>(this.COLLECTION_PATH + customerId).valueChanges();
  }
  updateCustomer(customer: Customer, data: Partial<Customer>) {
    this.afs.doc<Customer>(this.COLLECTION_PATH + customer.id).update(data);
  }
  newCustomer(customer: Customer) {
    const customersCollection = this.afs.collection<Customer>(this.COLLECTION);
    customer.id = this.afs.createId();
    customer.createdDate = (new Date()).toJSON();
    customersCollection.doc(customer.id).set({...customer});
  }
  deleteCustomer(customer: Customer) {
    this.afs.doc<Customer>(this.COLLECTION_PATH + customer.id).delete();
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
