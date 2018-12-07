import { Injectable } from '@angular/core';
import { Booking } from './booking';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsUrl = 'api/bookings';  // URL to web api

  /** GET Bookings from the server */
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.bookingsUrl)
      .pipe(
        tap(bookings => this.log('fetched Bookings')),
        catchError(this.handleError('getBookings', []))
      );
  }

  getCaravanBookings(caravanId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.bookingsUrl).pipe(
      map((bookings: Booking[]) => bookings.filter(booking => booking.caravan.id === caravanId)),
      tap(bookings => this.log('fetched bookings')),
      catchError(this.handleError('getBookings', []))
    );
  }

  /** GET Booking by id. Will 404 if id not found */
  getBooking(id: number): Observable<Booking> {
    const url = `${this.bookingsUrl}/${id}`;
    return this.http.get<Booking>(url).pipe(
      tap(_ => this.log(`fetched booking id=${id}`)),
      catchError(this.handleError<Booking>(`getBooking id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
//    this.messageService.add(`BookingService: ${message}`);
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
