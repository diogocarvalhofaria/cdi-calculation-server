import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class DefaultMessage {

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  @Field(() => Int)
  status: number;

  @Field()
  message: string;
}