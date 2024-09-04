import { HttpException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (!user) return null;
        const passwordValid = this.userService.comparePassword(
            password,
            user.password
        );
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        if (user === null) {
            throw new HttpException('invalid username or password', 404);
        }
        console.log(user);
        const payload = {
            name: user.username,
            sub: user._id,
        };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '6h' }),
        };
    }
}

