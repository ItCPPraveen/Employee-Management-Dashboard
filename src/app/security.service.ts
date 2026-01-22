import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from "./env/environment"

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, environment.cryptoJSKey).toString();
  }

  decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, environment.cryptoJSKey);
    console.log('bytes', bytes.toString(CryptoJS.enc.Utf8));

    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
