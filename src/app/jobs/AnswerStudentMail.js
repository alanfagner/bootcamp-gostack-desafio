import Mail from '../../lib/Mail';

class AnswerStudentMail {
  get key() {
    return 'AnswerStudentMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Pergunta respondida',
      template: 'answerStudent',
      context: {
        name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new AnswerStudentMail();
