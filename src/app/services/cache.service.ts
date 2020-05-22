import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private values = new Map<number | string, T>();

  getValue(key: number | string) {
    return this.values.get(key);
  }

  setValue(key: number | string, value: T) {
    this.values.set(key, value);
  }
}
