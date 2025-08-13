import { Controller, Get } from '@nestjs/common';
import { MailService } from '../service/mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-test-email')
  async sendTestEmail() {
    await this.mailService.sendMail(
      'di.c.faria@gmail.com',
      'Teste de Módulo de E-mail',
      'mail', // <--- CORRIJA DE 'exemplo' PARA 'mail'
      {
        // Lembre-se de passar todos os dados que o seu template 'mail.hbs' precisa
        title: 'Teste via Controller',
        name: 'Usuário Incrível',
        message: 'O caminho do template foi configurado corretamente!',
        button_text: 'Verificar',
        button_url: '#'
      },
    );
    return { message: 'E-mail de teste enviado!' };
  }

}