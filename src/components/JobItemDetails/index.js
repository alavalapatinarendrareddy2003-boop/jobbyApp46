import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: 'initial',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: 'inProgress'})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
        apiStatus: 'success',
      })
    } else {
      this.setState({apiStatus: 'failure'})
    }
  }

  renderJobDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      company_logo_url: companyLogoUrl,
      company_website_url: companyWebsiteUrl,
      employment_type: employmentType,
      job_description: jobDescription,
      skills,
      life_at_company: lifeAtCompany,
      location,
      package_per_annum: packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="job-details-card">
          <div className="job-header">
            <img
              src={companyLogoUrl} // Updated
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-title-rating">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details">
            <div className="location-employment">
              <p className="location">{location}</p>
              <p className="employment-type">{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="divider" />
          <div className="job-description">
            <h1 className="description-heading">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
          <div className="skills-section">
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list">
              {skills.map(skill => (
                <li key={skill.name} className="skill-item">
                  <img
                    src={skill.image_url} // Note: skill.image_url is already snake_case, but if needed, alias it
                    alt={skill.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company">
            <h1 className="life-heading">Life at Company</h1>
            <div className="life-content">
              <p className="life-description">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.image_url} // Updated
                alt="life at company"
                className="life-image"
              />
            </div>
          </div>
        </div>
        <div className="visit-container">
          <a
            href={companyWebsiteUrl} // Updated
            target="_blank"
            rel="noopener noreferrer"
            className="visit-link"
          >
            <button type="button" className="visit-button">
              Visit
              <BiLinkExternal className="external-icon" />
            </button>
          </a>
        </div>
        <div className="similar-jobs-section">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(job => (
              <SimilarJobItem key={job.id} jobData={job} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="job-details-page">
          {apiStatus === 'inProgress' && this.renderLoader()}
          {apiStatus === 'success' && this.renderJobDetailsView()}
          {apiStatus === 'failure' && this.renderFailureView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
