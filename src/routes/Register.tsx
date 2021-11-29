import {
  Card,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@material-ui/core'
import { useState } from 'react'

import AccountCreation from 'src/components/regsiter/AccountCreation'
import AccountDetails from 'src/components/regsiter/AccountDetails'
import FamilyJoin from 'src/components/regsiter/FamilyJoin'
import PageLayout from 'src/components/structure/PageLayout'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectAppLoading } from 'src/redux/selectors'
import { signUpUserDetails } from 'src/redux/slices/App'

const steps = ['Créer un compte', 'Ajouter mes informations', 'Rejoindre ma famille']

function Register() {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const [activeStep, setActiveStep] = useState(0)
  const [done, setDone] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const appLoading = useAppSelector(selectAppLoading)

  const handleNextStep = () => {
    if (activeStep === 0) setActiveStep((p) => p + 1)
    if (activeStep === 1) {
      dispatch(signUpUserDetails({ firstName: firstname, lastName: lastname }))
        .unwrap()
        .then((_res) => setActiveStep((p) => p + 1))
    }
  }
  const handlePrevStep = () => setActiveStep((p) => p - 1)
  const doneFn = () => setDone(true)
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AccountCreation done={doneFn} />
      case 1:
        return (
          <AccountDetails
            firstname={firstname}
            lastname={lastname}
            setFirstname={setFirstname}
            setLastname={setLastname}
          />
        )
      case 2:
        return <FamilyJoin />
      default:
        return <div>Erorr</div>
    }
  }

  return (
    <PageLayout title="Register">
      <Card
        style={Object.assign(
          { padding: 20, borderRadius: 12 },
          !isMobile ? { marginLeft: '20vw', marginRight: '20vw' } : {}
        )}
      >
        <Typography variant="h4">Créer un compte</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>{getStepContent(activeStep)}</div>
        <div>
          <Button disabled={activeStep === 0} onClick={handlePrevStep}>
            Précédent
          </Button>
          <Button
            disabled={activeStep === 0 && !done}
            variant="contained"
            color="primary"
            onClick={handleNextStep}
          >
            {appLoading ? (
              <CircularProgress variant="indeterminate" color="primary" />
            ) : activeStep === steps.length - 1 ? (
              'Terminer'
            ) : (
              'Suivant'
            )}
          </Button>
        </div>
      </Card>
    </PageLayout>
  )
}

export default Register
