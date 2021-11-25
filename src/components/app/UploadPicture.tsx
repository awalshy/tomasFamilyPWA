import { useState } from 'react'
import firebase from 'firebase'
import { Button, CircularProgress } from '@material-ui/core'
import { useAppSelector } from 'src/redux/hooks'
import { selectUserFamilyId } from 'src/redux/selectors'

type TFile = {
  id?: string
} & File

const UploadPicture = () => {
  const [files, setFiles] = useState<TFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number[]>([])

  const familyId = useAppSelector(selectUserFamilyId)

  const handleUpload = async () => {
    if (!familyId) {
      console.error('No FamilyId')
      return
    }
    setUploading(true)

    files.forEach((file, index) => {
      const ext = file.name.split('.').pop()
      if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
        // dispatch(
        //   enqueueSnack(`Can only be .jpg, .jpeg or .png files`, {
        //     variant: 'error',
        //   })
        // )
        return
      }
      if (!file || !file.id) {
        console.error()
        // dispatch(
        //   enqueueSnack(`An Error Occured`, {
        //     variant: 'error',
        //   })
        // )
        return
      }
      const uploadTask = firebase
        .storage()
        .ref(`${familyId}/images/${file.name}.${ext}`)
        .put(file)
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, 
          snapshot => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(prev => [
              ...prev.slice(0, index),
              percentage,
              ...prev.slice(index + 1)
            ])
          },
          (err: any) => {
            // dispatch(enqueueSnack('Error Uploading Picture', { variant: 'error' }))
            console.error('Error Upload Picture', err)
          })
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {uploading &&
          files.length > 0 &&
          files.map((_file, index) => (
            <div>
              {progress[index] === 100 ? (
                <img
                  src={URL.createObjectURL(files[index])}
                  width={100}
                  height={100}
                  alt=""
                  style={{
                    objectFit: 'cover',
                    objectPosition: '50% 50%',
                    margin: 15,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    margin: 15,
                    width: 100,
                    height: 100,
                    backgroundColor: 'grey',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={progress[index]}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
      <div>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (!e.target.files) return
            setFiles([])
            const files: TFile[] = []
            const progress: number[] = []
            for (let i = 0; i < e.target.files.length; i++) {
              const newFile: TFile = e.target.files[i]
              newFile.id =
                new Date(Date.now())
                  .toLocaleString()
                  .split('/')
                  .join('')
                  .split(' ')
                  .join('')
                  .split(':')
                  .join('')
                  .split(',')
                  .join('') + `${i}`
              files.push(newFile)
              progress.push(0)
            }
            setFiles(files)
            setProgress(progress)
          }}
          disabled={uploading}
        />
        <Button
          variant="contained"
          disabled={uploading}
          color="primary"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </div>
  )
}

export default UploadPicture