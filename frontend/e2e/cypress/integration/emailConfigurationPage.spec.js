const getEmailTemplate = (name) =>
  cy.get(`.email-template[data-cy-template="${name}"]`)

const findTemplateTextarea = (templateTitle, templateLanguage) =>
  getEmailTemplate(templateTitle).find(
    `.email-template__field--${templateLanguage} textarea`
  )

// cy.type supports keystrokes e.g. {enter} sends enter key -> need to escape {
const escapeCurlyBracesForCypress = (text) => text.replace(/\{/g, '{{}')

const writeToTemplate = (templateTitle, templateLanguage, text) =>
  findTemplateTextarea(templateTitle, templateLanguage).type(
    escapeCurlyBracesForCypress(text)
  )

const clickSave = () => cy.get('.email-templates-form__submit-button').click()

const visitEmailTemplatesPage = () =>
  cy.visit('/administration/email-templates')

describe('Email configuration page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.deleteAllEmailTemplates()
  })

  describe('updating templates', () => {
    beforeEach(() => {
      visitEmailTemplatesPage()
    })

    it('shows empty fields when no configurations have been made', () => {
      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only topic proposal accepted (finnish) successfully', () => {
      const templateText = 'Hei,\n\nProjekti "{{topicName}}" hyväksyttiin.'
      writeToTemplate('Topic proposal accepted', 'finnish', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only topic proposal accepted (english) successfully', () => {
      const templateText = 'Hello,\n\nProject "{{topicName}}" was accepted.'
      writeToTemplate('Topic proposal accepted', 'english', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only topic proposal rejected (finnish) successfully', () => {
      const templateText = 'Hei,\n\nProjektia "{{topicName}}" ei hyväksytty.'
      writeToTemplate('Topic proposal rejected', 'finnish', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only topic proposal rejected (english) successfully', () => {
      const templateText = 'Hello,\n\nProject "{{topicName}}" was not accepted.'
      writeToTemplate('Topic proposal rejected', 'english', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only customer review link (finnish) successfully', () => {
      const templateText =
        'Hei, vastaathan loppuarviointiin osoitteessa {{secretLink}}'
      writeToTemplate('Customer review link', 'finnish', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Customer review link', 'finnish').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'english').should('be.empty')
    })

    it('updates only customer review link (english) successfully', () => {
      const templateText =
        'Hello, please answer the final review at {{secretLink}}'
      writeToTemplate('Customer review link', 'english', templateText)
      clickSave()

      visitEmailTemplatesPage()

      findTemplateTextarea('Customer review link', 'english').should(
        'have.value',
        templateText
      )

      findTemplateTextarea('Topic proposal accepted', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal accepted', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'finnish').should(
        'be.empty'
      )
      findTemplateTextarea('Topic proposal rejected', 'english').should(
        'be.empty'
      )
      findTemplateTextarea('Customer review link', 'finnish').should('be.empty')
    })

    it('simultaneously updates all email templates successfully', () => {
      const texts = [
        [
          'Topic proposal accepted',
          'finnish',
          'Hei,\n\nProjekti "{{topicName}}" hyväksyttiin.'
        ],
        [
          'Topic proposal accepted',
          'english',
          'Hello,\n\nProject "{{topicName}}" was accepted.'
        ],
        [
          'Topic proposal rejected',
          'finnish',
          'Hei,\n\nProjektia "{{topicName}}" ei hyväksytty.'
        ],
        [
          'Topic proposal rejected',
          'english',
          'Hello,\n\nProject "{{topicName}}" was not accepted.'
        ],
        [
          'Customer review link',
          'finnish',
          'Hei, vastaathan loppuarviointiin osoitteessa {{secretLink}}'
        ],
        [
          'Customer review link',
          'english',
          'Hello, please answer the final review at {{secretLink}}'
        ]
      ]

      texts.forEach(([templateTitle, templateLanguage, text]) => {
        writeToTemplate(templateTitle, templateLanguage, text)
      })
      clickSave()

      visitEmailTemplatesPage()
      texts.forEach(([templateTitle, templateLanguage, text]) => {
        findTemplateTextarea(templateTitle, templateLanguage).contains(text)
      })
    })
  })
})
