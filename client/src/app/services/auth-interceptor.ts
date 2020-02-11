import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
// import { AuthService } from './auth.service';
// import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.token || localStorage.getItem('token');

    // if authToken is null, there is an error
    // TypeError: undefined is not an object (evaluating 'value.length'): http.js 308
    if (authToken) {
      // Clone the request and set the new header in one step.
      // const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      const authReq = req.clone({setHeaders: {'x-access-token': authToken}});

      // send cloned request with header to the next handler.
      // console.log("auth request", authReq);
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
