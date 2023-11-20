import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SupermarketDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly latitude: number;

  @IsNotEmpty()
  readonly longitude: number;

  @IsUrl()
  @IsNotEmpty()
  readonly web_page_url: string;
}
