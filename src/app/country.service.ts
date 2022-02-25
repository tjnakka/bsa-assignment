import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);
  constructor(private connection: Connection) {}

  async fetchAll(): Promise<Object[]> {
    return this.connection.manager.query('select country from data');
  }
}
