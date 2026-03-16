import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '../../swagger.decorators';

export class LoginDto {
  @ApiProperty({ example: 'asha@company.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'S3cureP@ssw0rd' })
  @MinLength(8)
  password!: string;
}