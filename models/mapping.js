const { formatDuration } = require(`../lib/string`)
const { Model } = require(`sequelize`)
module.exports = (sequelize, DataTypes) => {
  class Mapping extends Model {
    // Concatonates brand, coordinates, and time
    getExtendedBrandString() {
      const timeStr = formatDuration(this.duration)
      const coordinates = `(${this.cartesianX}, ${this.cartesianY})`
      return `${coordinates}, ${timeStr}`
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mapping.belongsTo(models.Respondent, {
        as: `respondent`,
        foreignKey: `respondent_id`,
      })
    }
  }

  Mapping.init(
    {
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING(1024),
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartesianX: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartesianY: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respondent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: `respondents`,
          key: `id`,
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: `Mapping`,
      tableName: `mappings`,
    }
  )
  return Mapping
}
