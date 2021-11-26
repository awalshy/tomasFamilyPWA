import { Button, CircularProgress, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import API from 'src/firebase/api'
import { useAppDispatch } from 'src/redux/hooks'
import { signUpUserFamily } from 'src/redux/slices/App'

function FamilyJoin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [familyCode, setFamilyCode] = useState('')
  const [res, setRes] = useState<{ exists: boolean, code?: string, name?: string }>()
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)

  const check = async () => {
    setLoading(true)
    const api = new API()
    const r = await api.families.checkFamily(familyCode)
    setLoading(false)
    if (r.exists)
      setRes(r)
    else {
      setErr(true)
      setTimeout(() => {
        setErr(false)
        setLoading(false)
        setFamilyCode('')
      }, 3000)
    }
  }
  const registerToFamily = async () => {
    dispatch(signUpUserFamily({ familyCode })).unwrap().then(() => {
      navigate('/')
    })
  }

  return (
    <div style={{ display: 'flex', marginLeft: '25%', marginRight: '25%', flexDirection: 'column' }}>
      {!res && !loading && (
        <React.Fragment>
          <TextField
            placeholder="Code de la Famille"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            error={err}
            helperText={err ? 'Cette famille n\'exite pas' : ''}
          />
          <div style={{ marginTop: '1vh', display: 'flex', flexDirection: 'row-reverse' }}>
            <Button
              onClick={check}
              variant="outlined"
              color="primary"
            >
              Vérifier
            </Button>
          </div>
        </React.Fragment>
      )}
      {loading && (
        <CircularProgress color="primary" variant="indeterminate" />
      )}
      {res && !err && (
        <React.Fragment>
          <Typography variant="h4">Nous avons trouvé une famille !</Typography>
          <Typography variant="body1">{`Nom: ${res.name || ''}`}</Typography>
          <Typography variant="body1">{`Confirmation de code: ${res.code}`}</Typography>
          <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '2vh', marginBottom: '2vh' }}>
            <Button
              onClick={registerToFamily}
              variant="outlined"
              color="primary"
            >
              Rejoindre cette famille
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default FamilyJoin