import { BottomNavigation, BottomNavigationAction, useTheme } from '@material-ui/core'
import {
  Image as GalleryIcon,
  People as ContactIcon,
  Chat as MessagesIcon,
} from '@material-ui/icons'
import { useLocation, useNavigate } from 'react-router'
import { useAppSelector } from 'src/redux/hooks'
import { selectAppTheme } from 'src/redux/selectors'

function BottomNav({ value, setValue }: { value?: number; setValue?: (v: number) => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()

  const dark = useAppSelector(selectAppTheme)

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        style={dark ? { backgroundColor: theme.palette.primary.main } : {}}
        value={value}
        onChange={(_event, newValue) => {
          if (setValue) setValue(newValue)
          if (location.pathname !== '/') navigate('/')
        }}
      >
        <BottomNavigationAction style={dark ? { color: theme.palette.text.primary } : undefined} label="Conversations" icon={<MessagesIcon style={dark ? { color: theme.palette.text.primary } : undefined} />} />
        <BottomNavigationAction style={dark ? { color: theme.palette.text.primary } : undefined} label="Contacts" icon={<ContactIcon style={dark ? { color: theme.palette.text.primary } : undefined} />} />
        <BottomNavigationAction style={dark ? { color: theme.palette.text.primary } : undefined} label="Gallerie" icon={<GalleryIcon style={dark ? { color: theme.palette.text.primary } : undefined} />} />
      </BottomNavigation>
    </div>
  )
}

export default BottomNav
