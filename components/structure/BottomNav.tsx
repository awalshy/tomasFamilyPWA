import React, { useState } from 'react'
import {
  BottomNavigation,
  BottomNavigationAction
} from '@material-ui/core'
import {
  Image as GalleryIcon,
  People as ContactIcon,
  Chat as MessagesIcon
} from '@material-ui/icons'
import { useRouter } from 'next/router'

const pageMap = [
  '/Messages',
  '/Contacts',
  '/Gallery'
]

function BottomNav() {
  const router = useRouter()
  console.log('PATHNAME:', router.pathname)
  const [value, setValue] = useState(pageMap.findIndex(m => m === router.pathname))

  if (value < 0) router.replace('/SignIn')
  
  return (
    <BottomNavigation
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue)
        router.push(pageMap[newValue])
      }}
    >
      <BottomNavigationAction label="Conversations" icon={<MessagesIcon />} />
      <BottomNavigationAction label="Contacts" icon={<ContactIcon />} />
      <BottomNavigationAction label="Gallerie" icon={<GalleryIcon />} />
    </BottomNavigation>
  )
}

export default BottomNav