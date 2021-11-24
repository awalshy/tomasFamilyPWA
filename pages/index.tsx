import React from 'react'
import type { NextPage } from 'next'
import firebase from 'firebase'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PageLayout from 'components/structure/PageLayout'

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
  }, [router])
  return (
    <PageLayout title="Dashboard">
      <div>Dasboard</div>
    </PageLayout>
  )
}

export default Home