import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefaultMessage } from '../cummons/default-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async createUser(createUserInput: CreateUserInput) {
    const newUser = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });

    if (newUser) {
      throw new BadRequestException('Usuario já existe');
    }
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    const createdUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    await this.userRepository.save(createdUser);

    return new DefaultMessage(200, 'Usuário criado com sucesso');
  }

  // findAll() {
  //   return `This action returns all user`;
  // }
  //

  async findOne(email: string){
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async updateUser(id: string, updateUserInput: UpdateUserInput) {
    const user = this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const { ...updateData } = updateUserInput;
    await this.userRepository.update({ id: id }, updateData);

    return new DefaultMessage(200, 'Usuário atualizado com sucesso');
  }

  async removeUser(id: string) {
    const removeUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!removeUser) {
      throw new BadRequestException('Usuário não encontrado');
    }
    await this.userRepository.softRemove({ id: id });

    return new DefaultMessage(200, 'Usuário removido com sucesso');
  }
}
