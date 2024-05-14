import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsOptional()
  @IsEmail()
  cc: string;

  @IsOptional()
  @IsEmail()
  bcc: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  body: string;
}