import { Injectable } from '@angular/core';
import { Booking } from './booking';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  COLLECTION = 'caravans';

  getBookings (): Observable<Booking[]> {
    return this.afs.collection<Booking>(this.COLLECTION).valueChanges().pipe(
      catchError(this.handleError('getBookings', []))
    );
  }

  getCaravanBookings(caravanId: string): Observable<Booking[]> {
    return this.afs.collection<Booking>(this.COLLECTION).valueChanges().pipe(
      map((bookings: Booking[]) => bookings.filter(booking => booking.caravanId === caravanId)),
      catchError(this.handleError('getBookings', []))
    );
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
    private afs: AngularFirestore,
    private http: HttpClient) { }
}
