import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth_service/auth.service';
import { SeriesService } from '../../services/series_service/series.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../styles.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any = null;
  allSeries: any[] = [];
  filteredSeries: any[] = [];
  selectedSeries: any = null;

  constructor(
    private auth_service: AuthService,
    private series_service: SeriesService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth_service.getCurrentUser();
    this.loadAllSeries();
  }

  loadAllSeries(): void {
    this.series_service.getAllSeries().subscribe({
      next: (series) => {
        this.allSeries = series.map(s => {
        const local = this.series_service.getLocalRating(s.tmdb_id);
        return {
          ...s,
          average_rating: local.average_rating,
          rating_count: local.rating_count
        };
      });
      this.filteredSeries = [...this.allSeries];
      },
      error: (err) => console.error('Failed to load all series', err)
    });
  }

  showDetails(item: any) {
    console.log('showDetails called:', item);
    this.selectedSeries = item;
  }

  closeModal() {
    this.selectedSeries = null;
  }

  toggleFavorite(seriesId: number): void {
    if (!seriesId || !this.currentUser) return;

    const email = this.currentUser.emailId;
    if (this.series_service.isFavorite(email, seriesId)) {
      this.series_service.removeFromFavorites(email, seriesId);
    } else {
      this.series_service.addToFavorites(email, seriesId);
    }
  }

  isFavorite(seriesId: number): boolean {
    if (!this.currentUser) return false;
    return this.series_service.isFavorite(this.currentUser.emailId, seriesId);
  }

  filterSeries(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredSeries = this.allSeries;
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    this.filteredSeries = this.allSeries.filter(series =>
      series.name.toLowerCase().includes(lowerTerm)
    );
  }
}