import PageLayout from '../components/structure/PageLayout'
import { useState } from 'react'
import { useAppSelector } from 'src/redux/hooks'
import { selectUserFamilyId } from 'src/redux/selectors'
import { useEffect } from 'react'
import API from 'src/firebase/api'
import { Fab, ImageList, ImageListItem, useMediaQuery, useTheme } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'

const Gallery = () => {
  const theme = useTheme()

  const [urls, setUrls] = useState<string[]>([])
  // const [loading, setLoading] = useState(false)
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const familyId = useAppSelector(selectUserFamilyId)

  useEffect(() => {
    const api = new API()
    if (!familyId) return
    api.gallery.loadPictures(familyId).then(res => {
      setUrls(res)
    })
  }, [familyId, urls])

  return (
    <PageLayout title="Gallery | TOMAS">
      <div>
        {urls.length > 0 && <ImageList cols={3}>
          {urls.map(item => (
            <ImageListItem>
              <img src={item} alt="" />
            </ImageListItem>
          ))}
        </ImageList>}
        {urls.length === 0 && <ImageList cols={3}>
          <ImageListItem>
            <Skeleton variant="rect" width="20vh" height="20vh" />
          </ImageListItem>
          <ImageListItem>
            <Skeleton variant="rect" width="20vh" height="20vh" />
          </ImageListItem>
          <ImageListItem>
            <Skeleton variant="rect" width="20vh" height="20vh" />
          </ImageListItem>
          <ImageListItem>
            <Skeleton variant="rect" width="20vh" height="20vh" />
          </ImageListItem>
          </ImageList>}
        <Fab color="primary" variant={isMobile ? "circular" : "extended"} style={{ position: 'absolute', bottom: '10vh', right: '5vw' }}>
          <Add />
          {!isMobile && 'Upload'}
        </Fab>
      </div>
    </PageLayout>
  )
}

export default Gallery