import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dto/user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const hashedPassword = this.hashPassword(password);
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

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username: username }).exec();
  }


  async updateUser(id: string, updateUserDto: CreateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = this.hashPassword(updateUserDto.password);
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async disableUser(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      return null;
    }
    user.isDisabled = true;
    return user.save();
  }

  comparePassword(password: string, storedPasswordHash: string): boolean {
    const hashedPassword = this.hashPassword(password);
    return hashedPassword === storedPasswordHash;
  }

  hashPassword(password: string) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return hash;
  }

}
