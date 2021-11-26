import { Typography } from '@material-ui/core'
import UploadPicture from 'src/components/app/UploadPicture'

function UploadPictureModal() {
  return (<div style={{ padding: 20 }}>
    <Typography style={{ marginBottom: '3vh' }} variant="h4">
      Télécharger des images
    </Typography>
    <div>
      <UploadPicture />
    </div>
  </div>)
}

export default UploadPictureModal