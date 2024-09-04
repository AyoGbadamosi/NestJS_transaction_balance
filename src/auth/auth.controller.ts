import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @UseGuards(LocalAuthGuard)
    @Post('login')
    @Post('/login')
    async create(@Body() payload: LoginDto) {
        const user = await this.authService.validateUser(
            payload.username,
            payload.password,
        );
        const data = this.authService.login(user);
        return data;
    }
}
