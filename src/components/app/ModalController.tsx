import { Modal, Paper, Theme, makeStyles, createStyles } from '@material-ui/core'
import { closeModal } from '../../redux/slices/App'
import { selectUserId, selectModal } from '../../redux/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { MODALS } from 'src/types/App'

// Modals
import UploadPictureModal from '../../modal/UploadPictureModal'

const getModal = (modal: MODALS, _ownerId: string, _params: any): JSX.Element => {
  if (modal === MODALS.UPLOAD_PICTURE) return <UploadPictureModal />
  // if (modal == MODALS.DISP_ADDR) return <DisplayAddr person={params.person as TPerson} addr={params.addr as TAddr} />
  return <div></div>
}

const ModalController = () => {
  const dispatch = useDispatch()
  const classes: any = useStyles()

  const modal = useSelector(selectModal)
  const ownerId = useSelector(selectUserId)

  if (!modal) return <></>

  return (
    <Modal
      open={modal != null}
      onClose={() => dispatch(closeModal())}
      className={classes.modal}
    >
      <Paper className={classes.paper}>
        {getModal(modal.name, ownerId || '', modal.params)}
      </Paper>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  modal: {
    [theme.breakpoints.down('lg')]: {
      margin: theme.spacing(2)
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(12)
    },
  },
  paper: {
    borderRadius: 12,
    backgroundColor: theme.palette.grey[300],
    maxHeight: '95vh'
  }
}))

export default ModalController