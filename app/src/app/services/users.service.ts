import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';


const USERS_URL: string = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private httpClient: HttpClient) { }

  addUser (newUser: User): Observable<User> {
    return this.httpClient.post(`${USERS_URL}/sign-up`, newUser).pipe(map((data: any) => new User(data.document)));
  }
}
