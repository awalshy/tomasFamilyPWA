import { Fab, ImageList, ImageListItem, useMediaQuery, useTheme } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import { useState, useEffect } from 'react'

import PageLayout from 'src/components/structure/PageLayout'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectUserFamilyId } from 'src/redux/selectors'
import { openModal } from 'src/redux/slices/App'

import API from 'src/firebase/api'

import { MODALS } from 'src/types/App'

const Gallery = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const [urls, setUrls] = useState<string[]>([])
  // const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const familyId = useAppSelector(selectUserFamilyId)

  useEffect(() => {
    const api = new API()
    if (!familyId) return
    api.gallery.loadPictures(familyId).then((res) => {
      setUrls(res)
    })
  }, [familyId, urls])

  return (
    <PageLayout title="Gallery | TOMAS">
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {}}>
        {urls.length > 0 && (
          <ImageList cols={3}>
            {urls.map((item) => (
              <ImageListItem>
                <img src={item} alt="" />
              </ImageListItem>
            ))}
          </ImageList>
        )}
        {urls.length === 0 && (
          <ImageList cols={3}>
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
          </ImageList>
        )}
        <Fab
          color="secondary"
          variant={isMobile ? 'circular' : 'extended'}
          style={{ position: 'absolute', bottom: '10vh', right: '5vw' }}
          onClick={() =>
            dispatch(
              openModal({
                name: MODALS.UPLOAD_PICTURE,
                params: {},
              })
            )
          }
        >
          <Add />
          {!isMobile && 'Upload'}
        </Fab>
      </div>
    </PageLayout>
  )
}

export default Gallery
