import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'Gucci',
    })
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
