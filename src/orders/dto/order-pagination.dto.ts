import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { OrderStatus, orderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(orderStatusList, {
    message: 'Invalid Status',
  })
  status: OrderStatus;

}