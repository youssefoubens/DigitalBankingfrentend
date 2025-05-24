import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth interceptor function that adds the authentication token to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`Intercepting request: ${req.method} ${req.url}`);
  
  // Skip for login and register
  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
    console.log('Skipping auth token for auth endpoint');
    return next(req);
  }
  
  // Get token from localStorage
  const authDataStr = localStorage.getItem('authData');
  if (!authDataStr) {
    console.log('No auth data found in localStorage, proceeding without token');
    return next(req);
  }
  
  try {
    const authData = JSON.parse(authDataStr);
    let token: string | null = null;
    
    // Try to get token from different possible locations
    if (authData.token) {
      token = authData.token;
    } else if (authData.authData && authData.authData.token) {
      token = authData.authData.token;
    }
    
    if (!token) {
      console.warn('No token found in auth data');
      return next(req);
    }
    
    // Get token type (default to Bearer)
    const tokenType = authData.tokenType || 'Bearer';
    
    // Clone the request with the token
    const authReq = req.clone({
      setHeaders: {
        Authorization: `${tokenType} ${token}`
      }
    });
    
    console.log(`Added auth token to ${req.url}`);
    return next(authReq);
  } catch (e) {
    console.error('Error adding token to request:', e);
    return next(req);
  }
};