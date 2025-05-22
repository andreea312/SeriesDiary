import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Series } from '../../model/series.model';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  
  private seriesUrl = 'assets/data/all-series.json';
  private seriesCache: Series[] | null = null;

  constructor(private http: HttpClient){}

  getAllSeries(): Observable<Series[]> {
    if (this.seriesCache) {
      return of(this.seriesCache);
    }
    return this.http.get<Series[]>(this.seriesUrl).pipe(
      tap(series => this.seriesCache = series)
    );
  }

  getSeriesById(id: number): Observable<Series | undefined> {
    if (this.seriesCache) {
      return of(this.seriesCache.find(s => s.tmdb_id === id));
    }
    return this.getAllSeries().pipe(
      map(seriesList => seriesList.find(s => s.tmdb_id === id))
    );
  }

  getFavorites(emailId: string): number[] {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const favs = favorites[emailId] || [];
    return favs.map((id: string | number) => Number(id));
  }

  addToFavorites(emailId: string, seriesId: number): void {
    if (!seriesId) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const userFav: number[] = favorites[emailId] ? favorites[emailId].map((id: string | number) => Number(id)) : [];
    if (!userFav.includes(seriesId)) {
      userFav.push(seriesId);
    }
    favorites[emailId] = userFav;
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  removeFromFavorites(emailId: string, seriesId: number): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    const userFav: number[] = favorites[emailId] ? favorites[emailId].map((id: string | number) => Number(id)) : [];
    favorites[emailId] = userFav.filter(id => id !== seriesId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  isFavorite(emailId: string, seriesId: number): boolean {
    const favs = this.getFavorites(emailId);
    return favs.includes(seriesId);
  }

  getLocalRating(tmdbId: number): { average_rating: number; rating_count: number } {
    const key = `series-reviews-${tmdbId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return { average_rating: 0, rating_count: 0 };

    const reviews = JSON.parse(saved);
    const rating_count = reviews.length;
    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    const average_rating = parseFloat((sum / rating_count).toFixed(1));
    return { average_rating, rating_count };
  }
}