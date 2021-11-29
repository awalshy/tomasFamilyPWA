import { TextField, Typography } from '@material-ui/core'
import { Check } from '@material-ui/icons'
import { useState, useEffect, useCallback } from 'react'

import { useAppDispatch } from 'src/redux/hooks'
import { signUpUser } from 'src/redux/slices/App'

interface IAccountCreate {
  done: () => void
}

function AccountCreation({ done }: IAccountCreate) {
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [error, setError] = useState('')
  const [pwdMatch, setPwdMatch] = useState(false)
  const [once, setOnce] = useState(false)

  const checkPwdMatch = useCallback(async () => {
    if (pwdConfirm !== password) {
      setError('Les Mots de Passes ne sont pas identiques')
      setPwdMatch(false)
    } else if (password === '') {
      setError('Veuillez entrer un mot de passe')
      setPwdMatch(false)
    } else {
      setError('')
      setPwdMatch(true)
      if (password !== '' && email !== '' && !once)
        try {
          setOnce(true)
          dispatch(signUpUser({ email, password }))
            .unwrap()
            .then((_res) => {
              done()
            })
        } catch (err) {
          console.error('ERROR', err)
          setOnce(false)
        }
    }
  }, [pwdConfirm, password, email, dispatch, done, once])

  useEffect(() => {
    if (email && password && pwdConfirm) checkPwdMatch()
  }, [pwdConfirm, password, email, checkPwdMatch])

  return (
    <div
      style={{ display: 'flex', marginLeft: '25%', marginRight: '25%', flexDirection: 'column' }}
    >
      <TextField
        style={{ margin: 10, width: '80%' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <TextField
        error={error !== ''}
        style={{ margin: 10, width: '80%' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de Passe"
        type="password"
      />
      <TextField
        error={error !== ''}
        style={{ margin: 10, width: '80%' }}
        value={pwdConfirm}
        onChange={(e) => {
          setPwdConfirm(e.target.value)
        }}
        type="password"
        placeholder="Confirmer le Mot de Passe"
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          marginTop: 15,
        }}
      >
        {pwdMatch && (
          <Typography
            variant="body1"
            style={{ display: 'flex', alignItems: 'center', color: 'green' }}
          >
            Mots de Passes indentiques
            <Check />
          </Typography>
        )}
        {error && (
          <Typography variant="body2" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AccountCreation
