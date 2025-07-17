import { InputType, Int, Field, ObjectType, HideField } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class CreateUserInput {

  @Field(() => String, { description: 'The name of the user' })
  name: string;

  @Field(() => String, { description: 'The email of the user' })
  email: string;

  @Field()
  password: string;

}
