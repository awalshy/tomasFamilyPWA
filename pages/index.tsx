import type { NextPage } from 'next'
import firebase from 'firebase'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        router.replace('/SignIn')
      } else {
        router.push('/Messages')
      }
    })
  }, [])
  return <div></div>
}

export default Home