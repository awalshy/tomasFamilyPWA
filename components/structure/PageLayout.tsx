import React from 'react'
import Head from 'next/head'

import Nav from './Nav'
import BottomNav from './BottomNav'
import { useMediaQuery, useTheme } from '@material-ui/core'

export type TLayoutProps = {
  children: JSX.Element[] | JSX.Element
  title: string,
}

const PageLayout = ({ children, title }: TLayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <div>
      <Head>
        <title>{title + ' | TOMAS'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main style={{ overflowX: 'hidden' }}>
        <Nav>{children}</Nav>
        {isMobile && <BottomNav />}
      </main>
    </div>
  )
}

export default PageLayout