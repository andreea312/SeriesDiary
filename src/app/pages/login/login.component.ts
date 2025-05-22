import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth_service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserLogin } from '../../model/userLogin.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../styles.scss']
})
export class LoginComponent {
  errorMsg = '';
  showPassword = false;
  loginAttempted = false;
  loginObj: UserLogin = new UserLogin();

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin(): Promise<void> {
    this.errorMsg = '';
    this.loginAttempted = true;

    if (!this.loginObj.emailId || !this.loginObj.password) {
      return;
    }

    this.auth.login(this.loginObj).subscribe((res: any)=>{
      if(res?.data){
        console.log(res);
        localStorage.setItem('logData', JSON.stringify(res.data))
        this.router.navigateByUrl('/home')
      }
      else {
        this.errorMsg = "Invalid credentials!"
      }
    })
  }

  goToSignup() {
    this.router.navigate(['signup']);
  }
}
