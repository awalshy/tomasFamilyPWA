import { TextField } from '@material-ui/core'

interface IAccountDetails {
  setFirstname: (v: string) => void,
  setLastname: (v: string) => void,
  lastname: string,
  firstname: string
}

function AccountDetails({
  lastname,
  firstname,
  setFirstname,
  setLastname
}: IAccountDetails) {

  return (
    <div style={{ display: 'flex', marginLeft: '25%', marginRight: '25%', flexDirection: 'column' }}>
      <TextField
        style={{ margin: 10, width: '80%' }}
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        placeholder="Prénom"
      />
      <TextField
        style={{ margin: 10, width: '80%' }}
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Nom de Famille"
      />
    </div>
  )
}

export default AccountDetails