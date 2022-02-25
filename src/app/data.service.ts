import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DataService {
  constructor(private readonly connection: Connection) {}

  async fetchData(): Promise<Object[]> {
    return this.connection.manager.query(
      'select distinct(country) as country from data;',
    );
  }
}
