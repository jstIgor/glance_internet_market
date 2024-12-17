import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService implements OnModuleInit {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not found in environment variables');
    }
    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${this.configService.get('APPLICATION_URL')}/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });
  }
} 