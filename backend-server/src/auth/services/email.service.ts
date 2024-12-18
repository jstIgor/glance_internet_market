import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailResponse, Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow('RESEND_API_KEY'));
  }

  async sendVerificationEmail(email: string, token: string): Promise<CreateEmailResponse> {
    const verificationUrl = `${this.configService.get('APPLICATION_URL')}/api/auth/verify-email?token=${token}`;
    const result = await this.resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });
    if(result.error) {
      throw new InternalServerErrorException('Error sending verification email, ' + result.error.message);
    }
    
    return result
  }

  async sendRestorePasswordEmail(email: string, token: string): Promise<CreateEmailResponse> {
    const verificationUrl = `${this.configService.get('APPLICATION_URL')}/api/auth/restore-password?token=${token}`;
    const result = await this.resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: 'Restore password',
      html: `
        <h1>Restore password</h1>
        <p>Please click the link below to restore your password:</p>
        <a href="${verificationUrl}">Restore password</a>
      `,
    });
    if(result.error) {
      throw new InternalServerErrorException('Error sending verification email, ' + result.error.message);
    }
    
    return result
  }
} 