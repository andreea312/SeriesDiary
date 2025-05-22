import { Router } from '@angular/router';
import { UserSignup } from '../../model/userSignup.model';
import { UserLogin } from '../../model/userLogin.model';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AuthService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  getCurrentUser() {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const data = localStorage.getItem('logData');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getAllUsers(): UserSignup[] {
    const users = localStorage.getItem('allUsers');
    return users ? JSON.parse(users) : [];
  }

  saveAllUsers(users: UserSignup[]): void {
    localStorage.setItem('allUsers', JSON.stringify(users));
  }

  signUp(user: UserSignup): Observable<any> {
    const users = this.getAllUsers();
    const exists = users.find(u => u.emailId === user.emailId);
    if (exists) {
      return of({ result: false, message: 'User already exists' });
    }
    user.userId = Date.now();
    users.push(user);
    this.saveAllUsers(users);
    localStorage.setItem('logData', JSON.stringify(user));
    return of({ result: true, data: user });
  }

  login(loginObj: UserLogin): Observable<any> {
    const users = this.getAllUsers();
    const match = users.find(u => u.emailId === loginObj.emailId && u.password === loginObj.password);
    if (match) {
      localStorage.setItem('logData', JSON.stringify(match));
      return of({ result: true, data: match });
    }
    return of({ result: false, message: 'Invalid credentials' });
  }

  logout() {
    localStorage.removeItem('logData');
    this.router.navigate(['/login']);
  }
}