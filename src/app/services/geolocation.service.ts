import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  geolocationAvailable() {
    return navigator.geolocation;
  }

  getUserLocation() {
    return new Promise<{ latitude: number; longitude: number }>((resolve) => {
      navigator.geolocation.getCurrentPosition((position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      );
    });
  }
}
