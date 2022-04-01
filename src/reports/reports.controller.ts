import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createReport(
    @Body() body: ReportDto,
    @CurrentUser() currentUser: User,
  ) {
    const createdReport = await this.reportsService.create(body, currentUser);

    const reportToBeReturned = {
      ...createdReport,
      userId: createdReport.user.id,
    };

    delete reportToBeReturned.user;

    return reportToBeReturned;
  }
}
