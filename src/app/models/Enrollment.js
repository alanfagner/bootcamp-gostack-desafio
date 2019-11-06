import Sequelize, { Model } from 'sequelize';
import { addMonths, isAfter } from 'date-fns';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
        duration: Sequelize.VIRTUAL,
        price_month: Sequelize.VIRTUAL,
        active: {
          type: Sequelize.VIRTUAL,
          get() {
            return !isAfter(new Date(), this.getDataValue('end_date'));
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async enrollment => {
      enrollment.setDateAndPriceFinally();
    });

    this.addHook('beforeUpdate', async enrollment => {
      enrollment.setDateAndPriceFinally();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }

  setDateAndPriceFinally() {
    if (this.duration && this.price_month) {
      this.end_date = addMonths(this.start_date, this.duration);
      this.price = this.duration * this.price_month;
    }
  }
}

export default Enrollment;
