const ucWords = (word) => {
  const words = word.split(' ')
  const upper = words.map(item => `${item.substr(0, 1).toUpperCase()}${item.substr(1)}`)
  return upper.join(' ')
}

export default ucWords