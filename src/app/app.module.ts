import { Module, CacheModule } from '@nestjs/common';
import { CountryController } from './country.controller';
import { DataController } from './data.controller';
import { CountryService } from './country.service';
import { DataService } from './data.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [CountryController, DataController],
  providers: [CountryService, DataService],
})
export class AppModule {}
