import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

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

  @Patch('/:reportId')
  @UseGuards(AuthGuard)
  async approveReport(
    @Param('reportId') reportId: string,
    @Body() body: ApproveReportDto,
  ) {
    console.log(body);
    const report = await this.reportsService.approve(
      parseInt(reportId),
      body.isApproved,
    );

    return report;
  }
}
