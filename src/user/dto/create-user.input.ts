import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: 'The name of the user' })
  name: string;

  @Field(() => String, { description: 'The email of the user' })
  email: string;

  @Field(() => String, { description: 'The password of the user' })
  password: string;

}
