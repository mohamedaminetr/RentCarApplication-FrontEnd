import { User } from './user.model';

export class AuthResponse {
  token: string = '';

  user: User = new User();

  constructor(data?: Partial<AuthResponse>) {
    if (data) {
      this.token = data.token ?? '';
      if (data.user) {
        this.user = new User(data.user);
      }
    }
  }
}
