import { Body, Controller, Post } from '@nestjs/common';
import { getDataModel } from './models';
import { DataService } from './data.service';
import { Response, CustomResponse } from '../response';
import { ApiBody } from '@nestjs/swagger';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  @ApiBody({ type: getDataModel })
  @Response()
  async getData(
    res: CustomResponse,
    @Body() data: getDataModel,
  ): Promise<void> {
    await this.dataService.validateData(data);
    await this.dataService.validateCountryCode(data.country_code);
    res.data = await this.dataService.fetchData(data);
  }
}
