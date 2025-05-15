import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'username', standalone: true })
export class UsernamePipe implements PipeTransform {
  transform(user: any): string {
    return user?.name || user?.email?.split('@')[0] || 'Account';
  }
}