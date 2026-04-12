import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  /**
   * Saves a value to local storage.
   * @param key The key to store the value under.
   * @param value The value to store.
   */
  public set(key: string, value: any): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  /**
   * Retrieves a value from local storage.
   * @param key The key to retrieve.
   * @returns The parsed value or null if not found.
   */
  public get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? (value as T) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  /**
   * Removes a specific item from local storage.
   * @param key The key to remove.
   */
  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all items from local storage.
   */
  public clear(): void {
    localStorage.clear();
  }
}
