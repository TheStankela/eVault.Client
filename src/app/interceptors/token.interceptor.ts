import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TokenDto } from '../models/tokenModel';
import { ToasterService } from '../services/toaster.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next): any => {
  const authService = inject(AuthService);
  const toasterService = inject(ToasterService);
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);

  const myToken = authService.getToken();

  if (myToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer  ${myToken}` }
    });
  }

  return next(req).pipe(
    catchError((err: any) => {
      if (err.status === 401) {
        return handleUnauthorizedError(req, next, authService, toasterService, router, activatedRoute);
      }
      return throwError(() => err);
    })
  );
};

const handleUnauthorizedError = (
  req: any,
  next: any,
  authService: AuthService,
  toasterService: ToasterService,
  router: Router,
  activatedRoute: ActivatedRoute
) => {

  // Check if the current route is the login route
  const isLoginPage = activatedRoute.snapshot.firstChild?.routeConfig?.path === 'login';

  const refreshToken = authService.getRefreshToken();

  if (!refreshToken) {
    if (!isLoginPage) {
      toasterService.warn("Session expired, Please login again");
    }
    router.navigate(['login']);
    return throwError(() => new Error('Refresh token missing'));
  }

  const tokenDto = new TokenDto();
  tokenDto.accessToken = authService.getToken();
  tokenDto.refreshToken = refreshToken;

  return authService.refreshToken(tokenDto).pipe(
    switchMap((data: TokenDto) => {

      if (!data.accessToken || !data.refreshToken) {
        // If the token renewal doesn't return valid tokens, log out
        if (!isLoginPage) {
          toasterService.warn("Invalid session, Please login again");
        }
        router.navigate(['login']);
        return throwError(() => new Error('Token renewal failed'));
      }

      authService.storeRefreshToken(data.refreshToken);
      authService.storeToken(data.accessToken);

      req = req.clone({
        setHeaders: { Authorization: `Bearer ${data.accessToken}` }
      });
      
      return next(req);
    }),
    catchError((err) => {
      if (!isLoginPage) {
        toasterService.warn("Token is expired, please login again.");
      }
      router.navigate(['login']);
      return throwError(() => new Error('Token expired'));
    })
  );
};
