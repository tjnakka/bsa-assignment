import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';
import { Response, CustomResponse } from '../response';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @Response()
  async getAllCountries(res: CustomResponse): Promise<void> {
    res.data = await this.countryService.fetchAll();
  }
}
