import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    projectsData: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: 'ALL',
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(item => ({
        id: item.id,
        name: item.name,
        imageUrl: item.image_url,
      }))
      this.setState({
        projectsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSelect = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectDetails)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        we cannot seem to find the page you are looking for
      </p>
      <button
        onClick={this.getProjectDetails}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {projectsData} = this.state
    return (
      <ul className="project-list-container">
        {projectsData.map(items => (
          <ProjectItem key={items.id} details={items} />
        ))}
      </ul>
    )
  }

  renderProjectData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.success:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div>
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-img"
          />
        </div>
        <select
          value={activeOptionId}
          className="select"
          onChange={this.onSelect}
        >
          {categoriesList.map(item => (
            <option key={item.id} value={item.id}>
              {item.displayText}
            </option>
          ))}
        </select>
        {this.renderProjectData()}
      </div>
    )
  }
}

export default ProjectsShowcase
