import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity/city.entity';
import { CityController } from './city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
  exports: [CityService],
  controllers: [CityController],
})
export class CityModule {}
