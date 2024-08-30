import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

// export class GetUserDto {
//   @IsNotEmpty()
//   @IsString()
//   id: string;
// }
