export class SectionQuery {
  number?: string;
  schedule?: string;
  start_date?: Date;
  end_date?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
