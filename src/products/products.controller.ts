import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: "create_product" }, createProductDto)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send<PaginationDto>({ cmd: "find_all_products" }, paginationDto)
    // return "Hello world"
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.productsClient.send({ cmd: "find_one_product" }, { id }))
    } catch (error) {
      throw new RpcException(error)
    }
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.productsClient.send({ cmd: "remove_product" }, { id }))
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() productoDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: "update_product" }, { id: +id ,...productoDto }).pipe(
    catchError(err => { throw new RpcException(err) }))
  }
}
