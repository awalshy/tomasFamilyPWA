import {
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import Header from 'components/structure/Header'
import PageLayout from 'components/structure/PageLayout'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectAllMembers, selectUserFamilyId, selectUserLoggedIn } from 'redux/selectors'
import { PhoneEnabled } from '@mui/icons-material'
import { loadFamily } from 'redux/slices/Family'

const Contact = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const userFamilyId = useAppSelector(selectUserFamilyId)
  const familyMembers = useAppSelector(selectAllMembers)

  useEffect(() => {
    if (!loggedIn) router.replace('/SignIn')
    if (familyMembers.length <= 0 && userFamilyId)
      dispatch(loadFamily(userFamilyId))
  }, [loggedIn])

  return (
    <PageLayout title="Contacts">
      <Header title="Contacts" imageSrc="/calls.svg" />
      <Divider />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {} }>
        <List>
          {familyMembers.map(member => (
            <ListItem
              key={member.id}
              secondaryAction={
                <IconButton>
                  <PhoneEnabled />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>{member.firstName[0] + member.lastName[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText>
                  {member.firstName + ' ' + member.lastName}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </PageLayout>
  )
}

export default Contact