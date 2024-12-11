import { IsNotEmpty } from "class-validator"
import { IsString } from "class-validator"
import { IsEmail } from "class-validator"


export class LoginDto {
  @IsString({message:"Email должен быть строкой"})  
  @IsNotEmpty({message:"Email не может быть пустым"})
  @IsEmail({},{message:"Email некорректен"})
  email:string
  @IsString({message:"Пароль должен быть строкой"})
  @IsNotEmpty({message:"Пароль не может быть пустым"})
  password:string
}