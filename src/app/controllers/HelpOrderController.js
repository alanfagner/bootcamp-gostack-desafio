import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerStudentMail from '../jobs/AnswerStudentMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const { student_id } = req.params;

    const helpOrders = await HelpOrder.findAll({ where: { student_id } });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const helpOrder = await HelpOrder.create({ student_id, question });

    return res.json(helpOrder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        { model: Student, as: 'student', attributes: ['name', 'email'] },
      ],
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exist' });
    }

    const { answer } = req.body;
    const answer_at = new Date();

    await helpOrder.update({ answer, answer_at });

    await Queue.add(AnswerStudentMail.key, { helpOrder });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
