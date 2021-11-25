import PageLayout from '../components/structure/PageLayout'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../redux/hooks'
import { selectUserLoggedIn } from '../redux/selectors'
import { useEffect, useState } from 'react'

import Messages from './Messages'
import Contacts from './Contacts'
import Gallery from './Gallery'

const page = [
   <Messages />,
  <Contacts />,
  <Gallery />
]

function Home() {
  const navigate = useNavigate()

  const [value, setValue] = useState(0)

  const loggedIn = useAppSelector(selectUserLoggedIn)

  useEffect(() => {
    if (!loggedIn) navigate('/SignIn', { replace: true })
  }, [loggedIn, navigate])

  return (
    <PageLayout title="Home" value={value} setValue={setValue}>
      {page[value]}
    </PageLayout>
  )
}

export default Home