import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem("userToken");
  if (token) {
    return true;
  } else {
    router.navigate(["/auth"])
    return false;
  }
};
