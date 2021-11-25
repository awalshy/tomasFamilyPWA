import { Skeleton } from '@material-ui/lab'

const ListSkeleton = () => (
  <div style={{ flexDirection: 'row', display: 'flex' }}>
    <Skeleton variant="circle" width={50} height={50} />
    <Skeleton variant="rect" width="90%" height={50} style={{ marginBottom: 5 }} />
    <Skeleton variant="circle" width={50} height={50} />
  </div>
)

export default ListSkeleton