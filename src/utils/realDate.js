export default function real(date) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  const data = new Date(date);
  return `${months[data.getMonth()]} ${data.getDate()}, ${data.getFullYear()} `
}