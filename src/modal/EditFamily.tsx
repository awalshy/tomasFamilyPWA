import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { selectAllMembers, selectUserId, selectUserFamilyId } from "../redux/selectors"
import { Card, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { Delete } from "@material-ui/icons"
import { removeMember, loadFamily } from "../redux/slices/Family"
import { TUser } from "../types/User"
import { useEffect, useState } from 'react'
import ListSkeleton from "src/components/structure/ListSkeleton"

function EditFamily() {
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)

  const userId = useAppSelector(selectUserId)
  const familyId = useAppSelector(selectUserFamilyId)
  const members = useAppSelector(selectAllMembers).filter(m => m.id !== userId)

  const handleDelete = (member: TUser) => {
    dispatch(removeMember(member))
  }

  useEffect(() => {
    if (members.length <= 0 && familyId) {
      dispatch(loadFamily(familyId))
      setTimeout(() => setLoading(false), 2000)
    } else setLoading(false)
  }, [dispatch, members, familyId])

  return (<div style={{ padding: 20 }}>
    <Typography style={{ marginBottom: '3vh' }} variant="h4">
      Editer la famille
    </Typography>
    <div>
      <List>
        {members.map(member => (
          <ListItem key={member.id}>
            <ListItemText>
              {`${member.firstName} ${member.lastName}`}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => handleDelete(member)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {members.length === 0 && loading && ['0', '1', '2'].map(key => (
          <ListSkeleton key={key} />
        ))}
        {members.length === 0 && !loading && (
          <Card elevation={3} style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
            <Typography>Vous êtes seul dans votre famille...</Typography>
          </Card>
        )}
      </List>
    </div>
  </div>)
}

export default EditFamily