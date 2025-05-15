import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true })
export class FilterPipe implements PipeTransform {
  transform(items: any[] | null | undefined, searchText: string, field: string): any[] {
    // Handle null/undefined input
    if (!items) return [];
    
    // Handle empty search
    if (!searchText) return items;
    
    // Perform filtering
    return items.filter(item => 
      item[field]?.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}