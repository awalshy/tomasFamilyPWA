import {
  List,
  ListItem,
  Typography,
  Button,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectAllMembers, selectUserFamilyId, selectUserId } from 'src/redux/selectors'
import { closeModal } from 'src/redux/slices/App'
import { createConversation } from 'src/redux/slices/Conversations'
import { loadFamily } from 'src/redux/slices/Family'

import { TConversation } from 'src/types/Conversation'

function CreateConversation() {
  const dispatch = useAppDispatch()
  const [selected, setSelected] = useState<string[]>([])

  
  const userId = useAppSelector(selectUserId)
  const familyId = useAppSelector(selectUserFamilyId)
  const familyMembers = useAppSelector(selectAllMembers).filter(
    (m) => m.id !== userId && m.firstName !== undefined && m.lastName !== undefined
  )

  const getConvName = (): string => {
    let s = ''
    if (!selected.length) return ''
    selected.forEach((id, index) => {
      const member = familyMembers.find((m) => m.id === id)
      s += member?.firstName
      if (index < selected.length) s += ', '
    })
    return s
  }
  const handleCreate = () => {
    if (!userId) {
      toast.error('Une erreur est servenue')
      return
    }
    dispatch(
      createConversation({
        id: '',
        lastReadId: userId,
        members: [...selected, userId],
        name: getConvName(),
      } as TConversation)
    )
    closeModal()
  }
  const handleChange = (id: string) => {
    const isSelected = selected.includes(id)
    if (isSelected) {
      const index = selected.findIndex((m) => m === id)
      setSelected((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
    } else {
      setSelected((prev) => [...prev, id])
    }
  }

  useEffect(() => {
    if (!familyMembers.length && familyId) dispatch(loadFamily(familyId))
  }, [dispatch, familyMembers, familyId])

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Créer une conversation</Typography>
      <div style={{ overflowY: 'scroll' }}>
        <List>
          {familyMembers.map((member) => (
            <ListItem key={member.id}>
              <ListItemText>{`${member.firstName} ${member.lastName}`}</ListItemText>
              <ListItemSecondaryAction>
                <Checkbox
                  checked={selected.includes(member.id)}
                  onChange={() => handleChange(member.id)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {familyMembers.length === 0 &&
          <Typography>Chargement des membres...</Typography>
        }
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
        <Button variant="outlined" color="secondary" onClick={handleCreate}>
          Créer
        </Button>
      </div>
    </div>
  )
}

export default CreateConversation
