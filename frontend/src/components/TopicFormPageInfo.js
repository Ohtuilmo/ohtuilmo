import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import './TopicFormPageInfo.css'

const TopicFormPageInfo = ({ topicOpen, topicMessage, updateShowInfo }) => {
  return (
    <div className="topic-form-page-info">
      {!topicOpen && (
        <div className="topic-form-page-info-message">{topicMessage}</div>
      )}

      <div>
        {/* Not actually dangerous since html is imported from a static source */}
        <Typography dangerouslySetInnerHTML={{ __html: info }} />
      </div>
      {topicOpen && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            window.scrollTo(0, 0)
            updateShowInfo(false)
          }}
        >
          Create Topic
        </Button>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    topicOpen: state.registrationManagement.topicRegistrationOpen,
    topicMessage: state.registrationManagement.topicRegistrationMessage
  }
}

const mapDispatchToProps = {
  ...topicFormPageActions
}

const ConnectedTopicFormPageInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicFormPageInfo)

export default ConnectedTopicFormPageInfo

const info = `<h2>
Become a customer
</h2>

<p>We are always on the lookout for new customers and new projects.</p>

<h4>A typical project</h4>
<p>
  A typical student software engineering project has 5-7 students and a client (you). 
  The client gives requirements for a software that the students implement together.  
  A good project is simple to define and yet complex enough so that it requires all team members to work together. 
  Remember that students participating in the project are doing their BSc degree in Computer Science and they have not yet studied 
  much Data Science or Artificial Intelligence, so "develop an AI of X" is not probably the best topic unless students can benefit from existing libraries.
</p>
<p>
  Projects use an <a href="http://en.wikipedia.org/wiki/Agile_software_development">agile development process</a> 
  that requires active participation from the client throughout the process. 
  A more detailed description of the customer&#39;s role is presented below.
</p>
<p>
  There are two types of software engineering projects. In single period (7 week) project the team works without any other commitments 
  (e.g. studies, work, ..). The long project lasts two periods. We accept mainly prototype systems and systems with no legacy overhead as 
  single period projects. Single period projects are mostly available only during summer term.
</p>

<p>We accept the following types of proposals:</p>

<ol>
  <li>Proposals from companies or communities (client is authorized to submit a proposal),</li>
  <li>Teaching-related proposals (client is a lecturer), and</li>
  <li>Proposals based on someone&#39;s own research (client is a reseacher or a PhD student).</li>
</ol>

<h4>The product</h4>

<p>
  All work done in the project will be released under an open-source license (for example MIT, GNU GPL, Creative Commons, ...). 
  This is non-negotiable, and closed-source projects will not be considered. 
  The immaterial rights for the developed software are transferred to the University of Helsinki, which in turn provides rights to the software 
    to all stakeholders in the spirit of open-source software development. 
    The contracts are available in both <a href="https://github.com/HY-TKTL/TKT20007-Ohjelmistotuotantoprojekti/blob/master/misc/ohtu-sopimus-v5.pdf">Finnish</a> and 
    <a href="https://github.com/HY-TKTL/TKT20007-Ohjelmistotuotantoprojekti/blob/master/misc/ohtu-sopimus-v2-en.pdf">English</a>.
   Note that the English language version is merely a translation and the actual contract will be the one in Finnish.
</p>

<h4>The role of a customer</h4>
<p>
  As a customer, it is expected that you &mdash; or a representative of your company/group &mdash; 
  is able to meet with the team weekly (on intensive projects) or biweekly. During these meetings, 
  the team will both present their progress on the project and ask for feedback.
</p>
<p>
  The project is developed using an agile development process that consists of &quot;sprints&quot;.
  These sprints last one or two weeks. At the start of every sprint, the team will discuss the 
  direction of the project with the customer and they together will determine which new features to implement next. 
  In an ideal case, every sprint results in a usable product that gets more and more refined and implements more and more
  features as the project continues.
</p>`
