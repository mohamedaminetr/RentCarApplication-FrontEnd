export class User {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  age: number = 0;
  sexe: string = ''; // Matches VARCHAR(10)
  birthday: Date | string = ''; // Matches DATE
  email: string = '';
  password: string = '';
  phone: string = '';
  role: 'admin' | 'staff' | 'client' = 'admin'; // Default 'admin' per your SQL
  created_at: Date | string = new Date();

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);

      // Optional: Convert date strings to Date objects if they exist
      if (data.birthday) this.birthday = new Date(data.birthday);
      if (data.created_at) this.created_at = new Date(data.created_at);
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
