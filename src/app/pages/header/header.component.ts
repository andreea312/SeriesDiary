import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth_service/auth.service';
import { CommonModule } from '@angular/common';
import { UserSignup } from '../../model/userSignup.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;

  @Output() searchChanged = new EventEmitter<string>();

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    if (this.currentUser) {
      console.log("User loaded:", this.currentUser.emailId);
    } else {
      console.log("No current user");
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChanged.emit(input.value);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToFavorites() {
    this.router.navigate(['favorites']);
  }

  logout() {
    this.auth.logout();
  }
}
