import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createReport(@Body() body: ReportDto) {
    const createdReport = await this.reportsService.create(body);

    return createdReport;
  }
}
