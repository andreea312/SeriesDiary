import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth_service/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SeriesService } from '../../services/series_service/series.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss', '../../../styles.scss']
})
export class FavoritesComponent implements OnInit {
  currentUser: any = null;
  allSeries: any[] = [];
  favoriteSeries: any[] = [];
  filteredFavorites: any[] = [];

  constructor( private auth_service: AuthService,
    private series_service: SeriesService) {}

  ngOnInit(): void {
    this.currentUser = this.auth_service.getCurrentUser();
    this.series_service.getAllSeries().subscribe({
      next: (series) => {
        this.allSeries = series;
        this.loadFavorites();
      },
      error: (err) => {console.error('Failed to load series data', err);}
    });
  }

  loadFavorites(): void {
    if (!this.currentUser) return;
    const favoriteIds = this.series_service.getFavorites(this.currentUser.emailId);
    this.favoriteSeries = this.allSeries
      .filter(series => favoriteIds.includes(series.tmdb_id))
      .map(series => {
        const local = this.series_service.getLocalRating(series.tmdb_id);
        return {
          ...series,
          average_rating: local.average_rating,
          rating_count: local.rating_count
        };
      });

    this.filteredFavorites = [...this.favoriteSeries];
  }

  removeFavorite(tmdbId: number): void {
    if (!this.currentUser) return;
    this.series_service.removeFromFavorites(this.currentUser.emailId, tmdbId);
    this.loadFavorites();
  }

  filterFavorites(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredFavorites = [...this.favoriteSeries];
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    this.filteredFavorites = this.favoriteSeries.filter(series =>
      series.name.toLowerCase().includes(lowerTerm)
    );
  }
}