import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create a new user object
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    return await newUser.save(); // Save user to the database
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
