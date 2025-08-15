import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';


@Entity()
@ObjectType()
export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  name: string;

  @HideField()
  @Column()
  password: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  verifiedEmail?: Date;

}
