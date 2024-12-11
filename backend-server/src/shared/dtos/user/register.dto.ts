import { User } from './../../../../prisma/__generated__/index.d';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, matches, Matches, MaxLength } from "class-validator";
import { IsString } from "class-validator";

export class RegisterUserDto implements Partial<User>{ 
  @IsEmail()
  @IsNotEmpty({message:"Email обязательно"})
  @MaxLength(120,{message:"Email не может быть больше 120 символов"})
  email:string;
  @IsString()
  @IsNotEmpty({message:"Пароль обязательно"})
  @MaxLength(120,{message:"Пароль не может быть больше 120 символов"})
  password:string;
  @IsString()
  @IsNotEmpty({message:"Имя пользователя обязательно"})
  @MaxLength(20,{message:"Имя пользователя не может быть больше 20 символов"})
  displayName:string;
  @IsOptional()
  @IsString()
  picture:string;
}