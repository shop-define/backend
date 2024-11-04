export type UserRole = 'customer' | 'admin';

export type TokenPayload = {
  id: string | number;
  email: string;
  role: UserRole;
};
