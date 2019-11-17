import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import Student from '../models/Student';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    try {
      const user = await Student.findOne({ where: { id } });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const { name } = user;

      return res.status(201).json({
        user: {
          id,
          name,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return res.status(500).json({ error: 'Contact system admin' });
    }
  }
}

export default new SessionController();
