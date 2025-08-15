import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,
  private readonly config: ConfigService) {}

  async sendMail(to: string, subject: string, template: string, context: object) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
    console.log(`E-mail enviado para: ${to}`);
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {

    await this.mailerService.sendMail({
      to: email,
      from: this.config.get<string>('MAIL_FROM'),
      subject: 'Confirme seu E-mail',
      template: 'mailVerification',
      context: {
        name: name,
        url: `${this.config.get<string>('FRONT_URL')}/auth/verify-email?token=${token}`,
      }
    });
  }
}
