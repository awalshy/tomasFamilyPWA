import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import {
  Image as GalleryIcon,
  People as ContactIcon,
  Chat as MessagesIcon,
} from '@material-ui/icons'
import { useLocation, useNavigate } from 'react-router'

function BottomNav({ value, setValue }: { value?: number; setValue?: (v: number) => void }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => {
          if (setValue) setValue(newValue)
          if (location.pathname !== '/') navigate('/')
        }}
      >
        <BottomNavigationAction label="Conversations" icon={<MessagesIcon />} />
        <BottomNavigationAction label="Contacts" icon={<ContactIcon />} />
        <BottomNavigationAction label="Gallerie" icon={<GalleryIcon />} />
      </BottomNavigation>
    </div>
  )
}

export default BottomNav
