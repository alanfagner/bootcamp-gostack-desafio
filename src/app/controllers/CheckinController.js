import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkins = await Checkin.findAll({ where: { student_id } });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const today = new Date();
    const minusSevenDay = subDays(today, 7);
    const chekins = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [minusSevenDay, today],
        },
      },
    });

    if (chekins.length >= 5) {
      return res.status(401).json({ error: '5 checkin limit reached' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Checkin.destroy({ where: { id } });

    return res.send();
  }
}

export default new CheckinController();
