export type UserFilterStatusType = 'activo' | 'inactivo' | 'all';

export type UserType = {
  id: number;
  username: string;
  password: string;
  status: string;

};
