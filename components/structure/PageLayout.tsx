import React from 'react'
import Head from 'next/head'

import Nav from './Nav'

export type TLayoutProps = {
  children: JSX.Element[] | JSX.Element
  title: string
  subtitle?: string
}

const PageLayout = ({ children, title, subtitle }: TLayoutProps) => {
  return (
    <div>
      <Head>
        <title>{title + ' - Peuple'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main style={{ overflowX: 'hidden' }}>
        <Nav subtitle={subtitle}>{children}</Nav>
      </main>
    </div>
  )
}

export default PageLayout