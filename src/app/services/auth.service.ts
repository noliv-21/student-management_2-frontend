// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { currentUser, User } from '../state/model';

interface DecodedToken {
    userEmail: string;
    isAdmin: boolean;
    exp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api';
    // private accessToken: string | null = null;
    private accessTokenKey = 'accessToken'

    constructor(private http: HttpClient) {}

    login(credentials: any, role: 'user' | 'admin'): Observable<HttpResponse<any>> {
      const endpoint = role === 'admin' ? `${this.apiUrl}/admin/login` : `${this.apiUrl}/user/login`;
      return this.http.post(endpoint, credentials, { observe: 'response' ,withCredentials:true});
    }

    logout(role: 'user' | 'admin'): Observable<any> {
      const endpoint = role === 'admin' ? `${this.apiUrl}/admin/logout` : `${this.apiUrl}/user/logout`;
      return this.http.post(endpoint,{},{observe:'response',withCredentials:true});
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

    // fetchCurrentUser(): Observable<currentUser | null>{
    //   return this.http.get<currentUser>(`${this.apiUrl}/currentUser`,{observe:'response'}).pipe(
    //     map(response => response.body)
    //   );
    // }
    fetchCurrentUser(): Observable<currentUser> {
      const token = this.getAccessToken();
      console.log('Fetching current user with token:', !!token);
      return this.http.get<any>(`${this.apiUrl}/auth/currentUser`,{withCredentials:true}).pipe(
        // Ensure we never return null
        map(response => {
          console.log('Current user fetched:', response);
          if (!response) {
            throw new Error('User not found');
          }
          return response.user;
        })
      );

      // return this.http.get<any>(`${this.apiUrl}/auth/currentUserData`,{withCredentials:true}).pipe(
      //   // Ensure we never return null
      //   map(user => {
      //     console.log('Current user fetched:', user);
      //     if (!user) {
      //       throw new Error('User not found');
      //     }
      //     return user;
      //   })
      // );

      // return this.http.get<any>(`${this.apiUrl}/auth/user-profile`, {withCredentials: true}).pipe(
      //   map(response => {
      //     console.log('Current user fetched raw response:', response);
          
      //     if (!response) {
      //       throw new Error('User not found');
      //     }
          
      //     // Extract user data - could be in response.user, response.existingUser, or directly in response
      //     const userData = response.existingUser || response.user || response;
          
      //     // Create a properly formatted currentUser object
      //     const formattedUser: currentUser = {
      //       username: userData.username || (userData.email ? userData.email.split('@')[0] : 'User'),
      //       email: userData.email || userData.userEmail,
      //       isAdmin: !!userData.isAdmin,
      //       profileImage: userData.profileImage
      //     };
          
      //     console.log('Formatted user data:', formattedUser);
      //     return formattedUser;
      //   }),
      //   catchError(error => {
      //     console.error('Error fetching user profile:', error);
      //     throw error;
      //   })
      // );
    }

    updateProfileImage(data:{profileImage:string,email:string}):Observable<HttpResponse<any>>{
      return this.http.patch(`${this.apiUrl}/user/uploadImage`,data,{observe:'response'});
    }
    
    getAccessToken(): string | null {
      // return this.accessToken;
      return localStorage.getItem(this.accessTokenKey);
    }
    setAccessToken(accessToken: string): void {
      // this.accessToken = accessToken;
      return localStorage.setItem(this.accessTokenKey,accessToken);
    }
    refreshAccessToken(): Observable<string> {
      // role: 'user' | 'admin' // as argument
      // const endpoint = role === 'admin' ? `${this.apiUrl}/admin/refresh` : `${this.apiUrl}/user/refresh`;
      // return this.http.post<string>(endpoint, { observe: 'response' });
      console.log('Attempting to refresh token');
      return this.http.post<string>(`${this.apiUrl}/auth/refresh-token`, {},{withCredentials:true});
    }
    removeAccessToken(): void {
      localStorage.removeItem(this.accessTokenKey);
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