import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { getDataModel } from './models';
import { Connection } from 'typeorm';

@Injectable()
export class DataService {
  private logger = new Logger(DataService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly connection: Connection,
  ) {}

  async validateCountryCode(countryCode): Promise<void> {
    const cacheKey = `validate:${countryCode}`;

    let data: any = await this.cacheManager.get(cacheKey);
    if (!data) {
      this.logger.debug('Country Code Validation done from Database.');
      data = await this.connection.manager.query(
        'select distinct(country) from data where country_code=?',
        [countryCode],
      );
      await this.cacheManager.set(cacheKey, JSON.stringify(data), {
        ttl: 600,
      });
    } else {
      this.logger.debug('Country Code Validation done from Cache.');
      data = JSON.parse(data);
    }

    if (data.length == 0)
      throw 'Error: Incorrect Country Code. Please Check and Try again.';
  }

  validateData(data: getDataModel): void {
    let default_start_year = 1990,
      default_end_year = 2017;

    ['country_code', 'category_code'].forEach((param) => {
      if (!data[param]) throw `${param} is Required.`;
    });

    data.start_year = data?.start_year ? data.start_year : default_start_year;
    data.end_year = data?.end_year ? data.end_year : default_end_year;

    if (data.start_year >= data.end_year)
      throw 'Start Year should be less than End Year.';

    if (
      data.start_year < default_start_year ||
      data.start_year > default_end_year
    )
      throw 'Start Year Should be between 1990-2017';

    if (data.end_year > default_end_year)
      throw 'End Year Should be between 1990-2017';

    if (data.category_code.length == 0)
      throw 'Please Add Category Code to get Data.';
  }

  async fetchData(data: getDataModel): Promise<Object[]> {
    let dbQueryParams = [
      data.country_code,
      data.start_year,
      data.end_year,
      ...data.category_code,
    ];
    const cacheKey = JSON.stringify(dbQueryParams);

    let cacheData: any = await this.cacheManager.get(cacheKey);
    if (!cacheData) {
      this.logger.debug('Data Fetched from Database.');
      cacheData = await this.connection.manager.query(
        `SELECT year, country_code, country, category_code, category_clean_name, value
        from "data" d
        where country_code = ? and 
        year >= ? and 
        year <= ? and 
        category_code IN (${data.category_code
          .reduce((str, data) => str + ' ,?', '')
          .substring(2)})
        order By country_code, category_code, "year";`,
        dbQueryParams,
      );
      await this.cacheManager.set(cacheKey, JSON.stringify(cacheData), {
        ttl: 600,
      });
    } else {
      this.logger.debug('Data Fetched from Cache.');
      cacheData = JSON.parse(cacheData);
    }

    return cacheData;
  }
}
