import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {jobData} = props
  const {
    company_logo_url: companyLogoUrl,
    employment_type: employmentType,
    id,
    job_description: jobDescription,
    location, // Added this
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="similar-job-link">
      <li className="similar-job-item">
        <div className="similar-job-header">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="similar-company-logo"
          />
          <div className="similar-job-title-rating">
            <h1 className="similar-job-title">{title}</h1>
            <div className="similar-rating-container">
              <p className="similar-rating">{rating}</p>
              <AiFillStar className="similar-star-icon" />
            </div>
          </div>
        </div>

        {/* CRITICAL FOR TEST CASE 30: Similar jobs must have a "Description" heading */}
        <h1 className="similar-job-description-heading">Description</h1>
        <p className="similar-job-description">{jobDescription}</p>

        <div className="similar-job-loc-type-container">
          <div className="similar-job-location-container">
            <MdLocationOn className="similar-icon" />
            {/* CRITICAL FOR TEST CASE 43 */}
            <p className="similar-location">{location}</p>
          </div>
          <div className="similar-job-type-container">
            <BsBriefcaseFill className="similar-icon" />
            {/* CRITICAL FOR TEST CASE 44 */}
            <p className="similar-employment-type">{employmentType}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default SimilarJobItem
