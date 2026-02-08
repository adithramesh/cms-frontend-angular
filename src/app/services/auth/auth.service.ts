import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable,  } from '@angular/core';
import {  Observable, } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequestDTO, AuthResponseDTO } from '../../models/auth.model';
import { environment } from '../../../environments/environment.prod';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private _http = inject(HttpClient)
   private _router = inject(Router);

  private _apiUrl=`${environment.BACK_END_API_URL}/auth/`
  signup(signUpData: AuthRequestDTO): Observable<AuthResponseDTO> {
    const payload = {
      name: signUpData.username ?? 'User',
      email: signUpData.phoneNumber, 
      password: signUpData.password,
    }
    return this._http.post<AuthResponseDTO>(`${this._apiUrl}register`, payload);
  }

  login(loginData: AuthRequestDTO):Observable<AuthResponseDTO>{
    const payload = {
      email:loginData.phoneNumber,
      password:loginData.password
    }
    return this._http.post<AuthResponseDTO>(`${this._apiUrl}login`, payload)
  }
  getCurrentUser(): { id: string; username: string } | null {
      const token = localStorage.getItem('access_token');
      console.log("token", token);
      
      if (!token) return null;
      
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("decoded", decoded);
        
        
        return {
          id: decoded.sub,
          username: decoded.username && typeof decoded.username === 'string' 
                      ? decoded.username 
                      : 'User'
        };
      } catch {
        return null;
      }
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('access_token');
    }

    logoutUser(): void {
    console.log('Interceptor: Logging out user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth');
    this._router.navigate(['/login']);
  }
}
