import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const base_url = environment.base_url;

interface RegisterForm {
  name: string, 
  email: string, 
  password1: string, 
  password2: string
}

interface LoginForm {
  name: string, 
  email: string, 
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user!: User;

  constructor( private http: HttpClient ) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' | undefined {
    return this.user.role;
  }

  get uid(): string {
    return this.user.uid || '';
  }

  validateToken(): Observable<boolean> {

    return this.http.get(`${base_url}/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, name, role, uid } = resp.userDB;
        this.user = new User(name, email, '', role, uid);

        localStorage.setItem('token', resp.token);
        localStorage.setItem('menu', JSON.stringify(resp.menu));

        return true
      }),
      catchError(() => of(false))
    )
  }

  validateToken2(): Observable<boolean> {

    return this.http.get(`${base_url}/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, name, role, uid } = resp.userDB;
        this.user = new User(name, email, '', role, uid);

        localStorage.setItem('token', resp.token);
        localStorage.setItem('menu', JSON.stringify(resp.menu));

        return true
      }),
      catchError(err => of(true))
    )

  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/auth`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token),
          localStorage.setItem('menu', JSON.stringify(resp.menu))
        })
      )
  }

  logout() {
    localStorage.clear();
  }

  createUser( formData: RegisterForm ) {

    return this.http.post(`${base_url}/user/new`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', JSON.stringify(resp.menu));
        })
      )
  }
}
