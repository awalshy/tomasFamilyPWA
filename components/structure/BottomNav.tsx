import React, { useState } from 'react'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material'
import {
  Image as GalleryIcon,
  People as ContactIcon,
  Chat as MessagesIcon
} from '@mui/icons-material'
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
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
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
    </Paper>
  )
}

export default BottomNav