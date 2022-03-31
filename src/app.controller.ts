import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {
    console.log('ads: ', configService.get('DB_NAME'));
    console.log(process.env.DB_NAME);
  }

  @Get()
  async getHello() {
    console.log(await this.configService.get('DB_NAME'));
    console.log(process.env.DB_NAME);
    return this.appService.getHello();
  }
}
