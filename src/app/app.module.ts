import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { DataController } from './data.controller';
import { CountryService } from './country.service';
import { DataService } from './data.service';

@Module({
  controllers: [CountryController, DataController],
  providers: [CountryService, DataService],
})
export class AppModule {}
