import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  // @Query(() => [User], { name: 'user' })
  // findAll() {
  //   return this.userService.findAll();
  // }
  //
  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.findOne(id);
  // }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.removeUser(id);
  }
}
