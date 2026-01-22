import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token));
    return payload.exp * 1000 > Date.now();
  }

  generateJwt() {
    const payload = {
      sub: '1',
      name: 'Admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
    return btoa(JSON.stringify(payload));
  }

  decodeToken(token: string) {
    try {
      // 1. Decode the Base64 string back to a JSON string
      const decodedString = atob(token);

      // 2. Parse the JSON string back into an object
      return JSON.parse(decodedString);
    } catch (error) {
      console.error("Invalid token format", error);
      return null;
    }
  }

}
