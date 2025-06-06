import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode'; // Correcto para v4+

@Injectable({ providedIn: 'root' })
export class TokenService {
  set(token: string) {
    localStorage.setItem('token', token);
  }

  get(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem('token'));
  }

  clear() {
    localStorage.removeItem('token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.get();
    return !!token;
  }

  async isTokenValid(): Promise<boolean> {
    const token = await this.get();
    if (!token) return false;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() < exp * 1000; // JWT usa segundos, Date.now() usa ms
    } catch {
      return false;
    }
  }
}
