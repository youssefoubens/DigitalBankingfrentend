import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenId',
  standalone: true
})
export class ShortenIdPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    // Display first 6 characters followed by ellipsis if longer
    return value.length > 8 ? `${value.substring(0, 6)}...` : value;
  }
}