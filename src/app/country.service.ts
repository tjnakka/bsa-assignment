import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Connection } from 'typeorm';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private connection: Connection,
  ) {}

  async fetchAll(): Promise<any> {
    const cacheKey = 'countriesList';
    let cacheData: any = await this.cacheManager.get(cacheKey);

    if (!cacheData) {
      this.logger.debug('Country Data fetched from Database.');
      cacheData = await this.connection.manager.query(
        'select distinct(country) as country, country_code as code from data;',
      );
      await this.cacheManager.set(cacheKey, JSON.stringify(cacheData), {
        ttl: 600,
      });
    } else {
      this.logger.debug('Country Data fetched from Cache.');
      cacheData = JSON.parse(cacheData);
    }

    return cacheData;
  }
}
