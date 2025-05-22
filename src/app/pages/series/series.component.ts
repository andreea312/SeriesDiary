import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SeriesService } from '../../services/series_service/series.service';
import { AuthService } from '../../services/auth_service/auth.service';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  currentUser: any = null;
  series: any;
  reviews: { user: string; rating: number; comment: string; date: string }[] = [];
  userRating: number = 0;
  userComment: string = '';

  constructor(private route: ActivatedRoute, private series_service: SeriesService, private auth_service: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.auth_service.getCurrentUser();
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = parseInt(idStr, 10);
      this.series_service.getSeriesById(id).subscribe(data => {
        this.series = data;
        this.loadReviews();
      });
    }
  }

  loadReviews(): void {
    const key = `series-reviews-${this.series.tmdb_id}`;
    const saved = localStorage.getItem(key);
    this.reviews = saved ? JSON.parse(saved) : [];
    this.updateAverageRating();
  }

  submitRating(): void {
    if (!this.isFormValid()) {
      alert('Please enter a valid rating and comment.');
      return;
    }

    const review = {
      user: this.currentUser.fullName || 'Anonymous',
      rating: this.userRating,
      comment: this.userComment,
      date: new Date().toISOString()
    };

    const key = `series-reviews-${this.series.tmdb_id}`;
    this.reviews.unshift(review);
    localStorage.setItem(key, JSON.stringify(this.reviews));

    this.updateAverageRating();
    this.userRating = 0;
    this.userComment = '';
    alert('Review submitted!');
  }

  updateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.series.average_rating = 0;
      this.series.rating_count = 0;
      return;
    }

    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.series.average_rating = parseFloat((sum / this.reviews.length).toFixed(1));
    this.series.rating_count = this.reviews.length;
  }

  isFormValid(): boolean {
    const ratingValid = this.userRating >= 0 && this.userRating <= 10;
    const commentValid = this.userComment.trim().length > 0;
    return ratingValid && commentValid;
  }
}