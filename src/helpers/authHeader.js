export function authHeaderJSON() {
  // return authorization header with jwt token
  let token = JSON.parse(localStorage.getItem('token'))

  if (token && token.access) {
    return {
      headers: {
        'Authorization': 'Bearer ' + token.access
      }
    }
  } else {
    return {}
  }
}

export function authHeaderForm() {
  let token = JSON.parse(localStorage.getItem('token'))

  if (token && token.access) {
    return {
      headers: {
        'Authorization': 'Bearer ' + token.access,
        'content-type': 'multipart/form-data'
      }
    }
  } else {
    return {}
  }
}