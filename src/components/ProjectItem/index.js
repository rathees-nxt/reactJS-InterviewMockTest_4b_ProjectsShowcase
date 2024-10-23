import './index.css'

const ProjectItem = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="project-item-container">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectItem
