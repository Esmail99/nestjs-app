import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  afterInsert() {
    console.log('User created: ', this);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('User updated: ', this);
  }

  @AfterRemove()
  afterRemove() {
    console.log('User removed: ', this);
  }
}
