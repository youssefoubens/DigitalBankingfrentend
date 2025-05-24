import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username',
  standalone: true
})
export class UsernamePipe implements PipeTransform {
  transform(user: any): string {
    if (!user) return 'Guest';
    
    // Return user's name if available
    if (user.name) return user.name;
    
    // Try username next
    if (user.username) return user.username;
    
    // Otherwise return email without domain
    if (user.email) {
      const emailParts = user.email.split('@');
      return emailParts[0];
    }
    
    // Fallback
    return 'User';
  }
}