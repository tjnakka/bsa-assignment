import { Module } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './app/app.module';

const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: `${process.env.PWD}/data.db`,
  logging: true,
};

@Module({
  imports: [TypeOrmModule.forRoot(connectionOptions), AppModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
