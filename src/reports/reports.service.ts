import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ReportDto } from './dtos/report.dto';
import { Report } from './report.entity';
import { EstimateReportDto } from './dtos/estimate-report.dto';

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

  estimateReport(estimateReportDto: EstimateReportDto): Promise<number> {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateReportDto.make })
      .andWhere('model = :model', { model: estimateReportDto.model })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', {
        longitude: estimateReportDto.longitude,
      })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', {
        latitude: estimateReportDto.latitude,
      })
      .andWhere('year - :year BETWEEN -3 AND 3', {
        year: estimateReportDto.year,
      })
      .andWhere('isApproved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateReportDto.mileage })
      .limit(3)
      .getRawOne();
  }
}
