const mockAnswers = [
  {
    type: 'info',
    header: 'Ohje',
    description:
      'Ohje: Anna avovastauksiin vapaamuotoiset perustelut arvosanaehdotuksille. Voit käyttääapuna vinkkeinä annettuna esimerkkejä asioista, joihin voi kiinnittää huomiota. Voit myöskertoa vapaasti muista mielestäsi olennaisista asioista. Arvioi jokainen ryhmäläinen. Kirjoitaitseäsi koskevat perustelut erityisen huolellisesti. Huomaa, että saadakseen kurssistaarvosanaksi 5 ei jokaisen osa alueen tarvitse olla täydellinen. On luontevaa, että ryhmässäkontribuutioden painopisteet jakautuvat eri tavoin ja tämä on täysin ok myös tällä kurssilla.'
  },
  {
    id: 1,
    type: 'number',
    answer: 5,
    questionHeader: 'Grade (scale 0-5)  '
  },
  {
    id: 2,
    type: 'text',
    answer:
      'Your satisfaction to the resulting product compared to your intial expectations:Your satisfaction to the resulting product compared to your intial expectations:',
    questionHeader:
      'Your satisfaction to the resulting product compared to your intial expectations:'
  },
  {
    id: 3,
    type: 'text',
    answer:
      'Your satisfaction to the resulting product compared to your intial expectations:Your satisfaction to the resulting product compared to your intial expectations:',
    questionHeader: 'The quality of the product and fit for the purpose:'
  },
  {
    id: 4,
    type: 'text',
    answer:
      'Your satisfaction to the resulting product compared to your intial expectations:Your satisfaction to the resulting product compared to your intial expectations:',
    questionHeader:
      'What was the technical skill level of the team compared to your expectations?'
  },
  {
    id: 5,
    type: 'oneliner',
    answer: 'spammyspam@spam.sp',
    questionHeader: 'Your email adderess?'
  }
]

const getAll = (...aliases) => {
  const values = []
  for (const alias of aliases) {
    cy.get(alias).then((value) => values.push(value))
  }
  return cy.wrap(values)
}

describe('Customer review is shown', () => {
  let locals = {}

  before(() => {
    cy.loginAsAdmin()

    cy.createConfiguration({
      name: 'Konfiguraatio A',
      content: '',
      registration_question_set_id: null,
      review_question_set_1_id: null,
      review_question_set_2_id: null,
      customer_review_question_set_id: null
    }).as('conf1')

    cy.createConfiguration({
      name: 'Conf 2',
      content: '',
      registration_question_set_id: null,
      review_question_set_1_id: null,
      review_question_set_2_id: null,
      customer_review_question_set_id: null
    }).as('conf2')

    cy.get('@conf1').then((configuration1) => {
      cy.createTopic(
        {
          title: 'Konfiguraatio A Topic A',
          customerName: 'Super nice customer',
          email: 'asiakas@cee',
          description: 'Decription..',
          environment: 'Webbi',
          specialRequests: '',
          additionalInfo: ''
        },
        configuration1.id
      ).as('conf1_topic1')

      cy.get('@conf1_topic1').then((topic1) => {
        cy.createGroupHack({
          name: 'Group of Konfiguraatio A Topic A',
          topicId: topic1.id,
          configurationId: configuration1.id,
          instructorId: null,
          studentIds: ['012345678', '012345698']
        }).as('conf1_topic1_group')
      })
    })

    cy.get('@conf2').then((configuration2) => {
      cy.createTopic(
        {
          title: 'Conf 2 Topic A',
          customerName: 'Super nice customer',
          email: 'asiakas@cee',
          description: 'Decription..',
          environment: 'Webbi',
          specialRequests: '',
          additionalInfo: ''
        },
        configuration2.id
      ).as('conf2_topic1')

      cy.createTopic(
        {
          title: 'Conf 2 Topic B',
          customerName: 'Super mad customer',
          email: 'aasiakas@bee',
          description: 'Decription..',
          environment: 'Webbi',
          specialRequests: '',
          additionalInfo: ''
        },
        configuration2.id
      ).as('conf2_topic2')

      getAll('@conf2_topic1', '@conf2_topic2').spread((topic1, topic2) => {
        cy.createGroupHack({
          name: 'Group of Conf 2 Topic A',
          topicId: topic1.id,
          configurationId: configuration2.id,
          instructorId: null,
          studentIds: ['012345678', '012345698']
        }).as('conf2_topic1_group')

        cy.createGroupHack({
          name: 'Group of Conf 2 Topic B',
          topicId: topic2.id,
          configurationId: configuration2.id,
          instructorId: null,
          studentIds: ['012345678', '012345698']
        }).as('conf2_topic2_group')
      })
    })

    // don't create review for @conf2_topic2_group
    getAll('@conf1_topic1_group', '@conf2_topic1_group').each((group) => {
      cy.createCustomerReview({
        answer_sheet: mockAnswers,
        group_id: group.id,
        topic_id: group.topicId,
        configuration_id: group.configurationId
      })
    })

    const aliases = [
      'conf1',
      'conf2',
      'conf1_topic1',
      'conf1_topic1_group',
      'conf2_topic1',
      'conf2_topic2',
      'conf2_topic1_group',
      'conf2_topic2_group'
    ]
    for (const alias of aliases) {
      cy.get('@' + alias).then((value) => {
        locals[alias] = value
      })
    }
  })

  it('admin can visit customer reviews page', () => {
    cy.loginAsAdmin()
    cy.visit('/adminstration/customer-reviews')
    cy.contains('Customer reviews')
  })

  it('all configurations are shown', () => {
    cy.loginAsAdmin()
    cy.visit('/adminstration/customer-reviews')
    cy.contains('Customer reviews')
    cy.get('[data-cy="customer-reviews-select"]').click()
    cy.get('[data-cy="all-configurations"]').click()

    const {
      conf1_topic1_group,
      conf2_topic1_group,
      conf2_topic2_group
    } = locals

    cy.contains(conf1_topic1_group.name)
    cy.contains(conf2_topic1_group.name)
    cy.contains(conf2_topic2_group.name)
  })

  it('customer reviews for configuration 1 are shown', () => {
    cy.loginAsAdmin()
    cy.visit('/adminstration/customer-reviews')
    cy.get('[data-cy="customer-reviews-select"]').click()
    cy.get('[data-cy="Konfiguraatio A"]').click()

    const { conf1_topic1_group } = locals

    cy.contains(conf1_topic1_group.name)
  })

  it('customer reviews for configuration 2 are shown', () => {
    cy.loginAsAdmin()
    cy.visit('/adminstration/customer-reviews')
    cy.get('[data-cy="customer-reviews-select"]').click()
    cy.get('[data-cy="Conf 2"]').click()

    const { conf2_topic1_group, conf2_topic2_group } = locals

    cy.contains(conf2_topic1_group.name)
    cy.contains('No review submitted for group ' + conf2_topic2_group.name)
  })

  after(() => {
    const { conf1, conf2 } = locals
    cy.deleteConfiguration(conf1.id)
    cy.deleteConfiguration(conf2.id)
  })
})
