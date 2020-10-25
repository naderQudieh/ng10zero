import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthManager {

  constructor(private authService: AuthService) {
  }

  register(data) {
    this.authService.register(data).subscribe((response: any) => {
      this.setUserToken(response.auth_token);
      this.setUserType(response.type || 'CUSTOMER');
      location.reload();
    });
  }

  login(data) {
    this.authService.login(data).subscribe((response: any) => {
      this.setUserToken(response.auth_token);
      this.setUserType('CUSTOMER');
      location.reload();
    });
  }

  loginWithFacebook(data) {
    this.authService.loginWithFacebook(data)
      .subscribe(
        (response: any) => {
          this.setUserType('CUSTOMER');
          this.setUserToken(response.auth_token);
          location.reload();
        }
      );
  }

  logout() {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER-TYPE');
    location.reload();
  }

  getDeviceID() {
    return localStorage.getItem('DEVICE-ID') ? localStorage.getItem('DEVICE-ID') : this.generateRandomString(9);
  }

  setUserToken(token) {
    localStorage.setItem('TOKEN', token);
    return localStorage.getItem('TOKEN');
  }

  getUserToken() {
    return localStorage.getItem('TOKEN');
  }

  setUserType(userType) {
    localStorage.setItem('USER-TYPE', userType);
    return localStorage.getItem('USER-TYPE');
  }

  getUserType() {
    if (localStorage.getItem('TOKEN')) {
      return localStorage.getItem('USER-TYPE');
    } else {
      return 'NaU'; // NaU => Not an User
    }
  }

  async createGuestUser() {
    const data: any = await this.authService.createGuestUser().toPromise();
    this.setUserToken(data.auth_token);
    this.setUserType(data.type);
    return true;
  }

  generateRandomString(stringLength) {
    let randomString = '';
    let randomAscii;
    for (let i = 0; i < stringLength; i++) {
      randomAscii = Math.floor((Math.random() * 25) + 97);
      randomString += String.fromCharCode(randomAscii);
    }
    return randomString;
  }
}
