import { User } from '../users/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultValuePipe, Optional } from '@nestjs/common';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToMany(() => User, (user) => user.reports)
  user: User;
}
