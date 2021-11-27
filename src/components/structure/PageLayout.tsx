import Helmet from 'react-helmet'

import Nav from './Nav'
import BottomNav from './BottomNav'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { useAppSelector } from 'src/redux/hooks'
import { selectUserLoggedIn } from 'src/redux/selectors'
import { useLocation } from 'react-router'

export type TLayoutProps = {
  children: JSX.Element[] | JSX.Element
  title: string,
  value?: number,
  setValue?: (v: number) => void
}

const PageLayout = ({ children, title, value, setValue }: TLayoutProps) => {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const loggedIn = useAppSelector(selectUserLoggedIn)

  return (
    <div>
      <Helmet>
        <title>{title + ' | TOMAS'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Helmet>
      <main style={{ overflowX: 'hidden' }}>
        <Nav value={value} setValue={setValue}>{children}</Nav>
        {isMobile && loggedIn && !location.pathname.includes('/Conversation/') &&
          <BottomNav value={value} setValue={setValue} />
        }
      </main>
    </div>
  )
}

export default PageLayout