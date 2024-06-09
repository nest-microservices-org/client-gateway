import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  public name: string;
  @IsNumber({
    maxDecimalPlaces: 2
  })
  @Min(1)
  @Type(() => Number)
  public price: number;
}
