import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/data-access/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interception for auth endpoints or non-API requests
    if (
      request.url.includes('/api/auth/login') ||
      request.url.includes('/api/auth/register') ||
      !request.url.startsWith(environment.apiUrl)
    ) {
      return next.handle(request);
    }

    // Get token
    const token = this.authService.getToken();
    
    // If no token, proceed without modification
    if (!token) {
      return next.handle(request);
    }
    
    // Clone and modify the request to add the authorization header
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next.handle(authReq);
  }
}

// Update app.routes.ts to include:
// { path: 'logout', component: LogoutComponent },