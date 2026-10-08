import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import Profile from '../Profile'
import JobItem from '../JobItem'
import './index.css'

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    profileApiStatus: 'initial',
    jobsApiStatus: 'initial',
    searchInput: '',
    employmentTypes: [],
    salaryRange: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: 'inProgress'})
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      this.setState({
        profileDetails: data.profile_details,
        profileApiStatus: 'success',
      })
    } else {
      this.setState({profileApiStatus: 'failure'})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: 'inProgress'})
    const {searchInput, employmentTypes, salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentType = employmentTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobsList: data.jobs,
        jobsApiStatus: 'success',
      })
    } else {
      this.setState({jobsApiStatus: 'failure'})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {value} = event.target
    this.setState(
      prevState => ({
        employmentTypes: prevState.employmentTypes.includes(value)
          ? prevState.employmentTypes.filter(each => each !== value)
          : [...prevState.employmentTypes, value],
      }),
      this.getJobs,
    )
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  renderProfileView = () => {
    const {profileDetails} = this.state
    return <Profile profileData={profileDetails} />
  }

  renderProfileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailure = () => (
    <div className="profile-failure">
      <button type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  renderProfileSection = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case 'success':
        return this.renderProfileView()
      case 'failure':
        return this.renderProfileFailure()
      case 'inProgress':
        return this.renderProfileLoader()
      default:
        return null
    }
  }

  renderJobsLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobItem key={job.id} jobData={job} />
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case 'success':
        return this.renderJobsList()
      case 'failure':
        return this.renderJobsFailureView()
      case 'inProgress':
        return this.renderJobsLoader()
      default:
        return null
    }
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-section">
            {this.renderProfileSection()}
            <hr className="separator" />
            <h1 className="filters-heading">Type of Employment</h1>
            <ul className="filters-list">
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId} className="filter-item">
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label
                    htmlFor={each.employmentTypeId}
                    className="filter-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="separator" />
            <h1 className="filters-heading">Salary Range</h1>
            <ul className="filters-list">
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId} className="filter-item">
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    name="salary"
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label htmlFor={each.salaryRangeId} className="filter-label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-section">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
