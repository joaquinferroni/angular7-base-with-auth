import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { UsuarioInfo } from '../_entities/usuarioInfo.entity';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<UsuarioInfo>;
  public currentUser: Observable<UsuarioInfo>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UsuarioInfo>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UsuarioInfo {
    return this.currentUserSubject.value;
  }

  getLoginImage() {
    return this.http.get<any>(`${environment.apiUrl}/Login/GetLoginImage`);
  }


  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/Login/ValidarIngreso`, {
      Usu_Usuario: username, Usu_Clave: password, Men_NombreApp: 'ApexWayWeb'
    })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.Usu_Token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
