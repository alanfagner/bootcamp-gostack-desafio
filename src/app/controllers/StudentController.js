import * as Yup from 'yup';
import Student from '../models/Student';

class StudentsController {
  async index(req, res) {
    try {
      const students = await Student.findAll();
      return res.json(students);
    } catch (err) {
      return res.status(500).json({ error: 'Contact system admin' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    try {
      const student = await Student.create(req.body);

      return res.status(201).json(student);
    } catch (err) {
      return res.status(500).json({ error: 'Contact system admin' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, email, peso, altura } = req.body;
    const { id } = req.params;
    if (email) {
      const emailExists = await Student.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Student email already exists' });
      }
    }

    const student = await Student.findOne({ where: { id } });
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    try {
      await student.update({ name, email, peso, altura });

      return res.json(student);
    } catch (err) {
      return res.status(500).json({ error: 'Contact system admin' });
    }
  }
}
export default new StudentsController();
