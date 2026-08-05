import { useLocation, useNavigate, useParams } from 'react-router-dom'

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()

    return (
      <Component
        {...props}
        location={location}
        history={{
          push: navigate,
          replace: (path) => navigate(path, { replace: true }),
          location: location,
        }}
        match={{ params }}
      />
    )
  }
  return ComponentWithRouterProp
}
