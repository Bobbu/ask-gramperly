import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  search(query: string): Observable<SearchResponse> {
    const apiUrl = `${environment.searchApiUrl}search?q=${encodeURIComponent(query)}`;

    return this.http.get<SearchResponse>(apiUrl).pipe(
      catchError((error) => {
        console.error('Search failed:', error);
        return of({
          query,
          results: [],
          totalResults: 0,
        });
      })
    );
  }
}
