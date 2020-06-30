import { history } from 'helpers'

export default function error({response}){
  switch (response.status) {
    case 404:
      history.push('/not-found')
      break
      
    case 401:
      history.goBack()
      break
  }
}