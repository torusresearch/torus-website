const MAX = Number.MAX_SAFE_INTEGER

let idCounter = Math.round(Math.random() * MAX)
function createRandomId() {
  idCounter %= MAX
  idCounter += 1
  return idCounter
}

export default createRandomId
