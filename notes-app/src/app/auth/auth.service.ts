import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
    success: boolean,
    data: {
        user: {
            _id: string,
            emailID: string
        }
    }
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);
    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'http://localhost:3000/user',
            {
                email: email,
                password: password
            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(resData.data.user._id, resData.data.user.emailID);
                })
            );
    }

    login(email: string, password: string) {
        return this.http.get<AuthResponseData>(
            'http://localhost:3000/user',
            {
                params: {
                    email: email,
                    password: password
                }
            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(resData.data.user._id, resData.data.user.emailID);
                })
            );
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
    }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.data) {
            return throwError(errorMessage);
        }
        errorMessage = errorRes.error.data.message;
        return throwError(errorMessage);
    }

    private handleAuthentication(_id: string, email: string) {
        const user = new User(_id, email);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    autoLogin() {
        const userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData._id,
            userData.email
        );
        this.user.next(loadedUser);
    }
}