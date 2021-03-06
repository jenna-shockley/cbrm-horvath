const { QueryTypes } = require(`sequelize`)
const { LoremIpsum } = require(`lorem-ipsum`)
const { randomNumber, randomCircleCoordinates } = require(`../lib/utils`)
const env = process.env.NODE_ENV || `development`
const config = require(`${__dirname}/../config/config`)[env]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    sequelize = new Sequelize(config)
    /* eslint-disable global-require */
    const Respondent = require(`../models/respondent`)(
      sequelize,
      Sequelize.DataTypes
    )
    respondents = await Respondent.findAll()

    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 10,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 5,
      },
    })

    const mappings = []

    function createMapping(respondent_id, idx) {
      obj = {}
      obj.respondent_id = respondent_id
      obj.brand = lorem.generateWords(randomNumber(1, 3))
      if (randomNumber(1, 10) < 3) {
        obj.notes = lorem.generateSentences(randomNumber(1, 2))
      }
      const { x, y } = randomCircleCoordinates(100)
      obj.order = idx + 1
      obj.cartesianX = x
      obj.cartesianY = y
      obj.duration = randomNumber(1, 60)
      obj.createdAt = new Date()
      obj.updatedAt = new Date()
      return obj
    }

    const generateRepondentMappings = async (respondent, idxs) => {
      const respondentMappings = []
      for (const idx of idxs) {
        const newMapping = createMapping(respondent.id, idx)
        respondentMappings.push(newMapping)
        mappings.push(newMapping)
      }
      return Promise.all(respondentMappings)
    }

    // const updateRespondentRecord = async (respondent, respondentMappings) => {
    //   console.log(`Updating respondent record ${respondent.id}`)
    //   respondent.set(`pointCount`, respondentMappings.length)
    //   const duration = Respondent.sumMappingDurations(respondentMappings)
    //   respondent.set(`durationSum`, duration)
    //   console.log(
    //     `pointCount = ${respondent.pointCount}     duration = ${respondent.durationSum}`
    //   )
    //   console.log(JSON.stringify(respondent, null, 2))
    //   await sequelize.query(
    //     `UPDATE respondents SET "durationSum" = ?, pointCount = ?`,
    //     {
    //       replacements: [String(duration), String(respondentMappings.length)],
    //       type: Sequelize.QueryTypes.UPDATE,
    //     }
    //   )
    //   // await respondent.save()
    // }

    const updateRespondentRecords = async () => {
      const respondents = await Respondent.findAll({
        include: [`mappings`],
      })
      /* eslint-disable guard-for-in */
      for (respondent in respondents) {
        respondent.pointCount = respondent.mappings.length
        const duration = Respondent.sumMappingDurations(respondent.mappings)
        respondent.durationSum = duration
        console.log(JSON.stringify(respondent, null, 2))
        /* eslint-disable no-await-in-loop */
        await respondent.save()
      }
    }

    const processRespondents = async () => {
      respondents.forEach(async (respondent) => {
        const count = randomNumber(3, 10)
        const idxs = [...Array(count).keys()]
        const respondentMappings = await generateRepondentMappings(
          respondent,
          idxs
        )
        // await updateRespondentRecord(respondent, respondentMappings)
      })
    }

    const generateData = async () => {
      await processRespondents()
      console.log(`Generated ${mappings.length} mappings.`)
      await queryInterface.bulkInsert(`mappings`, mappings, {})
      await updateRespondentRecords()
    }

    generateData()
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(`mappings`, null, {})
  },
}
