import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { OrderPaginationDto, CreateOrderDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(this.client.send('createOrder', createOrderDto))
      return order
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      ) 
      return orders
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(this.client.send('findOneOrder', { id })) 
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Patch("status/:id")
  async updateStatus(@Param("id", ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('updateOrderStatus', {id, status: statusDto.status})
      )
      return order
    } catch (error) {
      throw new RpcException(error);
    }
  }
}