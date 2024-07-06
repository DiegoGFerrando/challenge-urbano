export class ContentQuery {
  name?: string;
  description?: string;
  dateCreated?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
