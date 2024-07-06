export class UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
