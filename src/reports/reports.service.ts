import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ReportDto } from './dtos/report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: ReportDto, user: User) {
    const report = this.repo.create(reportDto);

    report.user = user;

    return this.repo.save(report);
  }

  async approve(reportId: number, isApproved: boolean) {
    const report = await this.repo.findOneBy({ id: reportId });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.isApproved = isApproved;

    return this.repo.save(report);
  }
}
