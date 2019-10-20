import * as Yup from 'yup';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import PlanStudentMail from '../jobs/PlanStudentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const studant = await Student.findByPk(student_id);

    if (!studant) {
      return res.status(400).json({ error: 'Studant does not exist' });
    }

    const isEnrollmentExists = await Enrollment.findOne({
      where: { student_id, plan_id },
    });

    if (isEnrollmentExists) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    const { price, duration } = plan;

    const enrollment = await Enrollment.create({
      start_date,
      student_id,
      plan_id,
      duration,
      price_month: price,
    });

    await Queue.add(PlanStudentMail.key, { enrollment, studant, plan });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { student_id, plan_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const { price, duration } = plan;

    const enrollment = await Enrollment.findOne({
      where: { id, student_id },
    });

    if (!enrollment) {
      return res
        .status(400)
        .json({ error: 'Enrollment and Studant do not exists' });
    }

    await enrollment.update({ ...req.body, price_month: price, duration });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Enrollment.destroy({ where: { id } });

    return res.send();
  }
}

export default new EnrollmentController();
