import { Injectable, Logger } from '@nestjs/common';
import { getDataModel } from './models';
import { Connection } from 'typeorm';

@Injectable()
export class DataService {
  private logger = new Logger(DataService.name);
  constructor(private readonly connection: Connection) {}

  async validateCountryCode(countryCode): Promise<void> {
    let data = await this.connection.manager.query(
      'select distinct(country) from data where country_code=?',
      [countryCode],
    );

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
    return this.connection.manager.query(
      `SELECT year, country_code, country, category_code, category_clean_name, value
      from "data" d
      where country_code = ? and 
      year >= ? and 
      year <= ? and 
      category_code IN (${data.category_code
        .reduce((str, data) => str + ' ,?', '')
        .substring(2)})
      order By country_code, category_code, "year";`,
      [
        data.country_code,
        data.start_year,
        data.end_year,
        ...data.category_code,
      ],
    );
  }
}
