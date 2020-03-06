const MAX = Number.MAX_SAFE_INTEGER

let idCounter = Math.round(Math.random() * MAX)
function createRandomId() {
  idCounter %= MAX
  return idCounter++
}

export default createRandomId
