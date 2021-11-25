import { makeStyles, createStyles, Theme } from '@material-ui/core'

interface IHeader {
  imageSrc: string,
  title: string
}

function Header({ imageSrc, title }: IHeader) {
  const styles: any = useStyles()

  return (
    <div className={styles.headerRoot}>
      <div className={styles.image}>
        <img
          src={imageSrc}
          width="100%"
          height="100%"
          alt=""
        />
      </div>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  )
}

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    image: {
      width: '40%',
      height: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
    },
    titleContainer: {
      height: '80%',
      width: '60%',
      padding: 20,
    },
    headerRoot: {
      width: '100%',
      height: '15vh',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 20
    }
  })
)

export default Header