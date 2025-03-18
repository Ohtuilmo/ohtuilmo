import React, { useState } from 'react'
import { connect } from 'react-redux'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import TextField from '@material-ui/core/TextField'
import { Radio, RadioGroup, Checkbox } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import './TopicForm.css'

const TopicForm = (props) => {
  const [agreement, setAgreement] = useState(false)

  const boxStyle = {
    backgroundColor: agreement ? '' :'#f0f0f0',
    border: '2px solid #333',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
    margin: '20px auto',
  }

  const organization = props.content.organisation

  console.log('props.content', props.content)

  return (
    <div className="topic-form">
      <div className="preview-button">
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.updatePreview(true)}
        >
          Preview
        </Button>
      </div>
      <form onSubmit={props.onSubmit}>
        <div>
          <TextField
            fullWidth
            required
            label="Title / Aihe"
            margin="normal"
            value={props.content.title}
            onChange={(e) => props.updateTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            required
            label="Customer / Asiakas"
            margin="normal"
            value={props.content.customerName}
            onChange={(e) => props.updateCustomerName(e.target.value)}
          />
        </div>
        <div>
          <TextField
            type="email"
            fullWidth
            required
            label="Contact email / Yhteyshenkilön sähköpostiosoite"
            margin="normal"
            value={props.content.email}
            onChange={(e) => props.updateEmail(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          Customer organization is / Asiakasorganisaatio on
          <RadioGroup
            aria-label="customer-organization"
            name="customer-organization"
            value={props.content.organisation}
            onChange={(e) => props.updateOrganisation(e.target.value)}
          >
            <div>
              <Radio
                checked={organization === 'company'}
                value="company"
              />
              Company / firma
            </div>
            <div>
              <Radio
                checked={organization === 'nonprofit'}
                value="nonprofit"
              />
              Non-profit organization / järjetö
            </div>
            <div>
              <Radio
                value="research"
                checked={organization === 'research'}
              />
              Research institute / tutkimuslaitos
            </div>
            <div>
              <Radio
                checked={organization === 'uh'}
                value="uh"
              />
              University of Helsinki unit / Helsingin Yliopiston yksikkö
            </div>
          </RadioGroup>
        </div>
        <p>
          The fields below have Markdown support. / Seuraavia kenttiä voi
          muotoilla Markdown-notaatiolla. (<a href='https://guides.github.com/features/mastering-markdown/'>Markdown instructions / Markdown ohjeet</a>)
        </p>
        <div>
          <TextField
            fullWidth
            required
            label="Description / Aiheen kuvaus"
            multiline
            rows={props.isEditForm ? '' : 7}
            margin="normal"
            value={props.content.description}
            onChange={(e) => props.updateDescription(e.target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            required
            label="Implementation environment / Toteutusympäristö"
            multiline
            rows={props.isEditForm ? '' : 7}
            margin="normal"
            value={props.content.environment}
            onChange={(e) => props.updateEnvironment(e.target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            label="Special requests / Erityisvaatimukset"
            multiline
            rows={props.isEditForm ? '' : 7}
            margin="normal"
            value={props.content.specialRequests}
            onChange={(e) => props.updateSpecialRequests(e.target.value)}
          />
        </div>
        {false&&<div >
          Kerro seuraavassa kohdassa myös sopivat ajankohdat / tell also what is the suitable timing for your project
          <ul>
            <li>alkukesä / early summer 12.5.-28.6.</li>
            <li>koko kesän projekti / whole summer 13.5.-30.8.</li>
          </ul>
        </div>}
        <div>
          <TextField
            fullWidth
            label="Additional info / Lisätietoja"
            multiline
            rows={props.isEditForm ? '' : 7}
            margin="normal"
            value={props.content.additionalInfo}
            onChange={(e) => props.updateAdditionalInfo(e.target.value)}
          />
        </div>
        {organization === '' && (
          <div>
            <div style={{ padding: 10 }}>
              Select the customer provider organisaation type, from below the contact information
            </div>
            <div style={{ padding: 10 }}>
              Valitse asiakasorganisaation tyyppi yhteystietojen alta
            </div>
          </div>
        )}
        {organization !== 'company' && organization !== '' && (
          <div>
            <div style={{ marginTop: 10 }}>
              As a customer I promise to provide the group with the necessary information and resources for the project.
            </div>
            <div style={{ marginTop: 5 }}>
              Lupaan asiakkaana tarjota ryhmälle tarvittavat tiedot ja resurssit projektia varten.
            </div>

            <div style={{ marginTop: 10 }}>
              <Checkbox
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                color="primary"
              />
              I agree to the above / sitoudyn ylläolevaan
            </div>
          </div>
        )}
        {organization === 'company' && (
          <div style={boxStyle}>
            <div style={{ marginTop: 10 }}>
              If the project is selected for implementation
              <ul>
                <li>As a customer I promise to provide the group with the necessary information and resources for the project</li>
                <li>I commit to paying the support fee of €3,000 (+VAT)</li>
              </ul>
            </div>
            <div style={{ marginTop: 5 }}>
              Mikäli ehdottamani projekti toteutetaan
              <ul>
                <li>lupaan asiakkaana tarjota ryhmälle tarvittavat tiedot ja resurssit projektia varten</li>
                <li>
                  sitoudun maksamaan yrityksiltä veloitettavan 3 000 euron (+alv) tukimaksun
                </li>
              </ul>
            </div>

            <div>
              <div style={{ marginTop: 10 }}>
                <Checkbox
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  color="primary"
                />
                I agree to the above / sitoudyn ylläolevaan
              </div>
            </div>
          </div>
        )}
        <div className="form-buttons">
          <div className="form-button">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={organization === '' || !agreement}
            >
              {props.submitButtonText}
            </Button>
          </div>
          {props.isEditForm && (
            <div className="form-button">
              <Button
                variant="contained"
                color="primary"
                onClick={props.onCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  ...topicFormPageActions
}

const ConnectedTopicForm = connect(
  null,
  mapDispatchToProps
)(TopicForm)

export default ConnectedTopicForm
