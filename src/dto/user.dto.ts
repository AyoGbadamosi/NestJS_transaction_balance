import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';
// import { Role } from 'src/auth/enum/roles.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'Gucci', description: 'The username of the user' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'gucci@example.com',
        description: 'The email of the user',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password',
        description: 'The password of the user',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    // @ApiProperty({
    //     description: 'The role of the user',
    //     enum: Role,
    //     example: Role.Admin,
    // })
    // @IsEnum(Role)
    // readonly role: Role;
}

// export class GetUserDto {
//   @IsNotEmpty()
//   @IsString()
//   id: string;
// }
