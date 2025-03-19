import React, { useState } from 'react'
import { connect } from 'react-redux'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import TextField from '@material-ui/core/TextField'
import { Radio, RadioGroup, Checkbox } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import './TopicForm.css'

const TopicForm = (props) => {
  const [agreement, setAgreement] = useState(false)
  const  timing = props.content.summerDates

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

  const organisation = props.content.organisation

  const timingNotSet = !timing || (timing && !timing.short && !timing.long && props.summerProject)

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
        <div style={{ marginTop: 35 }}>
          Customer organization is / Asiakasorganisaatio on
          <RadioGroup
            aria-label="customer-organization"
            name="customer-organization"
            value={props.content.organisation}
            onChange={(e) => props.updateOrganisation(e.target.value)}
          >
            <div>
              <Radio
                checked={organisation === 'company'}
                value="company"
              />
              Company / yritys
            </div>
            <div>
              <Radio
                checked={organisation === 'nonprofit'}
                value="nonprofit"
              />
              Non-profit organization / järjestö
            </div>
            <div>
              <Radio
                value="research"
                checked={organisation === 'research'}
              />
              Research institute / tutkimuslaitos
            </div>
            <div>
              <Radio
                checked={organisation === 'uh'}
                value="uh"
              />
              University of Helsinki unit / Helsingin Yliopiston yksikkö
            </div>
          </RadioGroup>
        </div>

        {props.summerProject&&(
          <div style={{ marginTop: 35, marginBottom: 40 }}>
            Suitable timing / Sopiva ajankohta
            <div>
              <Checkbox
                checked={timing && timing.short}
                onChange={(e) => props.updateDates({ ...timing, short: e.target.checked })}
                color="primary"
              /> the early summer project {props.dates.short}
            </div>
            <div>
              <Checkbox
                checked={timing && timing.long}
                onChange={(e) => props.updateDates({ ...timing, long: e.target.checked })}
                color="primary"
              /> the whole summer project {props.dates.long}
            </div>
          </div>
        )}

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

        {((organisation && organisation.length === 0) || timingNotSet) && (
          <div style={boxStyle}>
            {organisation && organisation.length === 0 && (
              <>
                <div style={{ padding: 10 }}>
                  Select the customer provider organisaation type, from below the contact information
                </div>
                <div style={{ padding: 10 }}>
                  Valitse asiakasorganisaation tyyppi yhteystietojen alta
                </div>
              </>
            )}
            {(organisation && organisation.length === 0) && timingNotSet && (
              <br />
            )}
            {timingNotSet && (
              <>
                <div style={{ padding: 10 }}>
                Select the suitable timing for the project  from below the contact information
                </div>
                <div style={{ padding: 10 }}>
                Valitse projektille sopiva ajankohta yhteystietojen alta
                </div>
              </>
            )}
          </div>
        )}
        {!timingNotSet && organisation !== 'company' && organisation !== '' && (
          <div style={boxStyle}>
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
              I agree to the above / sitoudun ylläolevaan
            </div>
          </div>
        )}
        {!timingNotSet && organisation === 'company' && (
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
                I agree to the above / sitoudun ylläolevaan
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
              disabled={organisation === '' || !agreement}
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

const mapStateToProps = (state) => {
  return {
    summerProject: state.registrationManagement.summerProject,
    dates: state.registrationManagement.summerDates
  }
}


const mapDispatchToProps = {
  ...topicFormPageActions
}

const ConnectedTopicForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicForm)

export default ConnectedTopicForm
