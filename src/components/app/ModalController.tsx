import { Modal, Paper, Theme, makeStyles, createStyles } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'

import { selectUserId, selectModal } from 'src/redux/selectors'
import { closeModal } from 'src/redux/slices/App'

// Modals
import EditFamily from 'src/modal/EditFamily'
import PeakMember from 'src/modal/PeakMember'
import UploadPictureModal from 'src/modal/UploadPictureModal'

import { MODALS } from 'src/types/App'

const getModal = (modal: MODALS, _ownerId: string, params: any): JSX.Element => {
  if (modal === MODALS.UPLOAD_PICTURE) return <UploadPictureModal />
  if (modal === MODALS.EDIT_FAMILY) return <EditFamily />
  if (modal === MODALS.PEAK_MEMBER) return <PeakMember id={params.id} />
  return <div></div>
}

const ModalController = () => {
  const dispatch = useDispatch()
  const classes: any = useStyles()

  const modal = useSelector(selectModal)
  const ownerId = useSelector(selectUserId)

  if (!modal) return <></>

  return (
    <Modal open={modal != null} onClose={() => dispatch(closeModal())} className={classes.modal}>
      <Paper className={classes.paper}>{getModal(modal.name, ownerId || '', modal.params)}</Paper>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      [theme.breakpoints.down('lg')]: {
        margin: theme.spacing(2),
      },
      [theme.breakpoints.up('lg')]: {
        margin: theme.spacing(12),
      },
    },
    paper: {
      borderRadius: 12,
      backgroundColor: theme.palette.grey[300],
      maxHeight: '95vh',
    },
  })
)

export default ModalController
