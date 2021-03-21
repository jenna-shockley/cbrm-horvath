const { LoremIpsum } = require(`lorem-ipsum`)
const { nextRespondentId } = require(`../lib/idFactory`)
const { getRandomNumber } = require(`../lib/utils`)
const env = process.env.NODE_ENV || `development`
const config = require(`${__dirname}/../config/config`)[env]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    sequelize = new Sequelize(config)
    const Project = require(`../models/project`)(sequelize, Sequelize.DataTypes)
    projects = await Project.findAll({ attributes: [`id`] })

    // projects = [{ id: 2 }, { id: 3 }]
    respondents = []
    projects.forEach((project) => {
      const count = getRandomNumber(30, 100)
      for (let step = 0; step < count; step++) {
        obj = {}
        obj.respondentId = nextRespondentId()
        obj.project_id = project.id
        obj.createdAt = new Date()
        obj.updatedAt = new Date()
        respondents.push(obj)
      }
    })
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(`respondents`, respondents, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(`respondents`, null, {})
  },
}