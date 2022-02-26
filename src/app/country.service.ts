import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(private connection: Connection) {}

  async fetchAll(): Promise<Object[]> {
    return this.connection.manager.query(
      'select distinct(country) as country, country_code as code from data;',
    );
  }
}
