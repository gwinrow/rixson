import { Injectable } from '@angular/core';
import { Booking } from './booking';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  COLLECTION = 'bookings';
  COLLECTION_PATH = this.COLLECTION + '/';
  getBooking(bookingId): Observable<Booking> {
    return this.afs.doc<Booking>(this.COLLECTION_PATH + bookingId).valueChanges();
  }
  getBookings(): Observable<Booking[]> {
    const nowmillis = Date.now();
    return this.afs.collection<Booking>(this.COLLECTION).valueChanges().pipe(
      map((bookings: Booking[]) => bookings.filter(booking => {
        const dateTo = new Date(booking.dateTo);
        return dateTo.getTime() > nowmillis;
        })
      ),
      map((bookings: Booking[]) => bookings.sort((a, b) => {
        const adate = new Date(a.dateFrom);
        const bdate = new Date(b.dateFrom);
        return adate.getTime() - bdate.getTime();
        })
      ),
      catchError(this.handleError('getBookings', []))
    );
  }
  getAllBookings(): Observable<Booking[]> {
    const nowmillis = Date.now();
    return this.afs.collection<Booking>(this.COLLECTION).valueChanges().pipe(
      map((bookings: Booking[]) => bookings.sort((a, b) => {
        const adate = new Date(a.dateFrom);
        const bdate = new Date(b.dateFrom);
        return adate.getTime() - bdate.getTime();
        })
      ),
      catchError(this.handleError('getAllBookings', []))
    );
  }
  getCaravanBookings(caravanId: string): Observable<Booking[]> {
    const nowmillis = Date.now();
    return this.afs.collection<Booking>(this.COLLECTION).valueChanges().pipe(
      map((bookings: Booking[]) => bookings.filter(booking => booking.caravanId === caravanId)),
      map((bookings: Booking[]) => bookings.filter(booking => {
        const dateTo = new Date(booking.dateTo);
        return dateTo.getTime() > nowmillis;
        })
      ),
      map((bookings: Booking[]) => bookings.sort((a, b) => {
        const adate = new Date(a.dateFrom);
        const bdate = new Date(b.dateFrom);
        return adate.getTime() - bdate.getTime();
        })
      ),
      catchError(this.handleError('getCaravanBookings', []))
    );
  }
  updateBooking(booking: Booking, data: Partial<Booking>) {
    this.afs.doc<Booking>(this.COLLECTION_PATH + booking.id).update(data);
  }
  newBooking(booking: Booking) {
    const bookingsCollection = this.afs.collection<Booking>(this.COLLECTION);
    booking.id = this.afs.createId();
    booking.createdDate = (new Date()).toJSON();
    bookingsCollection.doc(booking.id).set({...booking});
  }
  deleteBooking(booking: Booking) {
    this.afs.doc<Booking>(this.COLLECTION_PATH + booking.id).delete();
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
