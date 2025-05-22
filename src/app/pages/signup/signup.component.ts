import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth_service/auth.service';
import { UserSignup } from '../../model/userSignup.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../../styles.scss']
})
export class SignupComponent {
  errorMsg = '';
  showPassword = false;
  signupAttempted = false;
  signupObj: UserSignup = new UserSignup();

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSignup(): Promise<void> {
    this.errorMsg = '';
    this.signupAttempted = true;

    if (!this.signupObj.fullName.trim() || !this.signupObj.emailId.trim() || !this.signupObj.password) {
      return;
    }
    
    this.auth.signUp(this.signupObj).subscribe({
      next: (res: any) => {
        if (res?.result === true) {
          alert("User signup success!");
          this.router.navigate(['login']);
        } else if (res?.message?.includes("Sequence contains more than one element")) {
          this.errorMsg = "An account with this email already exists!";
        } else {
          this.errorMsg = "Signup failed!";
        }
      },
      error: (err) => {
        console.error("Signup error:", err);
        this.errorMsg = "Server error during signup!";
      }
    });
  }
}
