import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import { SupermarketDto } from '../supermarket/supermarket.dto';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
  constructor(
    private readonly citySupermarketService: CitySupermarketService,
  ) {}

  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.addSupermarketCity(
      cityId,
      supermarketId,
    );
  }

  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketByCityIdSupermarketId(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.findSupermarketByCityIdSupermarketId(
      cityId,
      supermarketId,
    );
  }

  @Get(':cityId/supermarkets')
  async findSupermarketsByCityId(@Param('cityId') cityId: string) {
    return await this.citySupermarketService.findSupermarketsByCityId(cityId);
  }

  @Put(':cityId/supermarkets')
  async associateSupermarketsCity(
    @Body() supermarketsDto: SupermarketDto[],
    @Param('cityId') cityId: string,
  ) {
    const supermarkets = plainToInstance(SupermarketEntity, supermarketsDto);
    return await this.citySupermarketService.associateSupermarketsCity(
      cityId,
      supermarkets,
    );
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.deleteSupermarketCity(
      cityId,
      supermarketId,
    );
  }
}
