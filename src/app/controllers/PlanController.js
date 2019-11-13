import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const { id } = req.params;
    if (id) {
      const plan = await Plan.findByPk(id);
      return res.json(plan);
    }

    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, duration, price } = req.body;

    const plan = await Plan.create({ title, duration, price });

    return res.json(plan);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    const isTitleExits = await Plan.findOne({ where: { title } });

    if (isTitleExits) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.update(req.body, {
      returning: true,
      where: { id },
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Plan.destroy({ where: { id } });

    return res.send();
  }
}

export default new PlanController();
