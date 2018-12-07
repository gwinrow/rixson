import { Injectable } from '@angular/core';
import { Caravan } from './caravan';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaravanService {

  private caravansUrl = 'api/caravans';  // URL to web api

  /** GET caravans from the server */
  getCaravans (): Observable<Caravan[]> {
    return this.http.get<Caravan[]>(this.caravansUrl)
      .pipe(
        tap(caravans => this.log('fetched caravans')),
        catchError(this.handleError('getCaravans', []))
      );
  }

  /** GET caravan by id. Will 404 if id not found */
  getCaravan(id: number): Observable<Caravan> {
    const url = `${this.caravansUrl}/${id}`;
    return this.http.get<Caravan>(url).pipe(
      tap(_ => this.log(`fetched caravan id=${id}`)),
      catchError(this.handleError<Caravan>(`getCaravan id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
//    this.messageService.add(`CaravanService: ${message}`);
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
