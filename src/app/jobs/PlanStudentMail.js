import { format, parseISO } from 'date-fns';
import pt_BR from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class PlanStudentMail {
  get key() {
    return 'PlanStudentMail';
  }

  async handle({ data }) {
    const { enrollment, studant, plan } = data;

    await Mail.sendMail({
      to: `${studant.name} <${studant.email}>`,
      subject: 'Novo plano',
      template: 'newPlanStudent',
      context: {
        name: studant.name,
        enrollment_title: plan.title,
        price: `R$:${enrollment.price.toLocaleString('pt-BR')}`,
        date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h' 'de' yyyy",
          {
            locale: pt_BR,
          }
        ),
      },
    });
  }
}

export default new PlanStudentMail();
