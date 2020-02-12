import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin(state);
  }

  checkLogin(state: RouterStateSnapshot): boolean | Observable<boolean> {
    if (this.authService.isLoggedIn$.getValue()) { return true; }

    // 로그인이 안되어 있으므로 로그인 페이지로 이동
    this.router.navigate(['/signin'], {queryParams: {redirectTo: state.url || '/'}});
    return false;
  }
}
