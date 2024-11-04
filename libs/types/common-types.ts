export type UserRole = 'customer' | 'seller' | 'admin';

export type TokenPayload = {
  id: number;
  email: string | null;
  roles: UserRole[];
};
