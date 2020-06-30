const getDate = (date) => {
  const data = new Date(date)
  const current = new Date()

  const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

  const diff = current - data

  const min = 60 * 1000
  const hour = min * 60
  const day = hour * 24
  const semana = day * 7

  if (diff < min) {
    return "Just a moment"
  } else if (diff >= min && diff < min * 2) {
    return "A minute ago"
  } else if (diff >= min * 2 && diff < hour) {
    return `${parseInt(diff / min)} minutes ago`
  } else if (diff >= hour && diff < hour * 2) {
    return "A hour ago"
  } else if (diff >= hour * 2 && diff < day) {
    return `${parseInt(diff / hour)} hours ago`
  } else if (diff >= day && diff < day * 2) {
    return "Yesterday"
  } else if (diff >= day * 2 && diff < semana) {
    return `${parseInt(diff / day)} days ago`
  } else if (diff >= semana && diff < semana * 2) {
    return "A week ago"
  } else if (diff > semana * 2) {
    return `${data.getDate()} de ${mes[data.getMonth()]} ${data.getFullYear()}`
  }
}

export default getDate