import PresentationShell from './components/PresentationShell'
import { slides } from './slides/slidesData'

export default function App() {
  return <PresentationShell slides={slides} />
}
