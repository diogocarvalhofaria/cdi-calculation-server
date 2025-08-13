import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context: object) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
    console.log(`E-mail enviado para: ${to}`);
  }
}
