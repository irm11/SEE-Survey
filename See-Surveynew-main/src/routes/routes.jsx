import { Routes, Route } from 'react-router-dom'
import PageContainer from '../pages/Page-container.jsx'

PageContainer
const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/:pageName" element={<PageContainer />} />
    </Routes>
  )
}

export default RoutesComponent