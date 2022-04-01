import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReportDto {
  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @Min(1950)
  @Max(new Date().getFullYear())
  @IsNumber()
  year: number;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  mileage: number;
}
