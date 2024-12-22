import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toasterService = inject(ToasterService);

  if (authService.getIsLoggedIn()) {
    return true;
  } else {
    toasterService.error("You're not logged in.");
    router.navigate(['login']);
    return false;
  }
};


