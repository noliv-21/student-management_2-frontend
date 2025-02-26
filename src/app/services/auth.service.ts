// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { currentUser, User } from '../state/model';

interface DecodedToken {
    userId: string;
    isAdmin: boolean;
    exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api';
    private accessToken: string | null = null;

    constructor(private http: HttpClient) {}

    login(credentials: any, role: 'user' | 'admin'): Observable<HttpResponse<any>> {
      const endpoint = role === 'admin' ? `${this.apiUrl}/admin/login` : `${this.apiUrl}/user/login`;
      return this.http.post(endpoint, credentials, { observe: 'response' ,withCredentials:true});
    }

    refreshToken(role: 'user' | 'admin'): Observable<HttpResponse<any>> {
      const endpoint = role === 'admin' ? `${this.apiUrl}/admin/refresh` : `${this.apiUrl}/user/refresh`;
      return this.http.get(endpoint, { observe: 'response' });
    }

    logout(role: 'user' | 'admin'): Observable<any> {
      const endpoint = role === 'admin' ? `${this.apiUrl}/admin/logout` : `${this.apiUrl}/user/logout`;
      return this.http.get(endpoint);
    }

    signup(credentials: any): Observable<HttpResponse<any>> {
      return this.http.post(`${this.apiUrl}/user`, credentials, { observe: 'response' });
    }

    getUsers(): Observable<User[]>{
      return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
    }

    updateUser(user:User):Observable<HttpResponse<any>>{
      return this.http.patch(`${this.apiUrl}/user/edit`,user,{observe:'response'});
    }

    deleteUser(user:User):Observable<HttpResponse<any>>{
      return this.http.delete(`${this.apiUrl}/user/${user.email}`,{observe:'response'});
    }

    fetchCurrentUser(): Observable<currentUser | null>{
      return this.http.get<currentUser>(`${this.apiUrl}/currentUser`,{observe:'response'}).pipe(
        map(response => response.body)
      );
    }

    updateProfileImage(data:{profileImage:string,email:string}):Observable<HttpResponse<any>>{
      return this.http.patch(`${this.apiUrl}/user/uploadImage`,data,{observe:'response'});
    }

    setAccessToken(accessToken: string): void {
      this.accessToken = accessToken;
    }

    getAccessToken(): string | null {
      return this.accessToken;
    }

    removeAccessToken(): void {
      this.accessToken = null;
    }

    getDecodedAccessToken(): DecodedToken | null {
        const token = this.getAccessToken();
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    }

    isLoggedIn(): boolean {
        const decodedToken = this.getDecodedAccessToken();
        if (decodedToken) {
            return decodedToken.exp * 1000 > Date.now();
        }
        return false;
    }

    isAdmin(): boolean {
        const decodedToken = this.getDecodedAccessToken();
        if (decodedToken) {
            return decodedToken.isAdmin;
        }
        return false;
    }
}