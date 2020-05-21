import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private values = new Map<string, T>();

  getValue(key: string) {
    return this.values.get(key);
  }

  setValue(key: string, value: T) {
    this.values.set(key, value);
  }
}
