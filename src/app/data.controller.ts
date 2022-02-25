import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('country')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get(':id')
  async getData(): Promise<object[]> {
    return this.dataService.fetchData();
  }
}
