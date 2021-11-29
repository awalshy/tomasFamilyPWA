import { CircularProgress, Typography } from '@material-ui/core'

import { useAppSelector } from 'src/redux/hooks'
import { selectMemberById } from 'src/redux/selectors'
import { RootState } from 'src/redux/store'

interface IPeakMember {
  id: string
}

function PeakMember({ id }: IPeakMember) {
  const member = useAppSelector((state: RootState) => selectMemberById(state, id))

  if (!member) return <CircularProgress variant="indeterminate" color="primary" />

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5">{`${
        member.firstName
      } ${member.lastName.toLocaleUpperCase()}`}</Typography>
    </div>
  )
}

export default PeakMember
