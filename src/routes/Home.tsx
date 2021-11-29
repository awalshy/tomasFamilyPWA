import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import PageLayout from 'src/components/structure/PageLayout'

import { useAppSelector } from 'src/redux/hooks'
import { selectUserLoggedIn } from 'src/redux/selectors'

import Contacts from './Contacts'
import Gallery from './Gallery'
import Messages from './Messages'

const page = [<Messages />, <Contacts />, <Gallery />]

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
