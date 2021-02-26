import { BN } from 'ethereumjs-util'
import Web3 from 'web3'

const web3 = new Web3()
const { sha3 } = web3.utils

class AbiDecoder {
  constructor(abi) {
    this.state = {
      savedABIs: [],
      methodIDs: {},
    }
    this.addABI(abi)
  }

  getABIs() {
    return this.state.savedABIs
  }

  addABI(abiArray) {
    if (Array.isArray(abiArray)) {
      // Iterate new abi to generate method id's
      abiArray.map((abi) => {
        if (abi.name) {
          const signature = sha3(`${abi.name}(${abi.inputs.map((input) => input.type).join(',')})`)
          if (abi.type === 'event') {
            this.state.methodIDs[signature.slice(2)] = abi
          } else {
            this.state.methodIDs[signature.slice(2, 10)] = abi
          }
        }
        return undefined
      })

      this.state.savedABIs = [...this.state.savedABIs, ...abiArray]
    } else {
      throw new TypeError(`Expected ABI array, got ${typeof abiArray}`)
    }
  }

  removeABI(abiArray) {
    if (Array.isArray(abiArray)) {
      // Iterate new abi to generate method id's
      abiArray.map((abi) => {
        if (abi.name) {
          const signature = sha3(`${abi.name}(${abi.inputs.map((input) => input.type).join(',')})`)
          if (abi.type === 'event') {
            if (this.state.methodIDs[signature.slice(2)]) {
              delete this.state.methodIDs[signature.slice(2)]
            }
          } else if (this.state.methodIDs[signature.slice(2, 10)]) {
            delete this.state.methodIDs[signature.slice(2, 10)]
          }
        }
        return undefined
      })
    } else {
      throw new TypeError(`Expected ABI array, got ${typeof abiArray}`)
    }
  }

  getMethodIDs() {
    return this.state.methodIDs
  }

  decodeMethod(data) {
    const methodID = data.slice(2, 10)
    const abiItem = this.state.methodIDs[methodID]
    if (abiItem) {
      const parameters = abiItem.inputs.map((item) => item.type)
      const decoded = web3.eth.abi.decodeParameters(parameters, data.slice(10))

      const returnValueData = {
        name: abiItem.name,
        params: [],
      }

      for (let i = 0; i < decoded.__length__; i += 1) {
        const parameter = decoded[i]
        let parsedParameter = parameter
        const isUint = abiItem.inputs[i].type.indexOf('uint') === 0
        const isInt = abiItem.inputs[i].type.indexOf('int') === 0
        const isAddress = abiItem.inputs[i].type.indexOf('address') === 0

        if (isUint || isInt) {
          const isArray = Array.isArray(parameter)

          if (isArray) {
            parsedParameter = parameter.map((value) => new BN(value).toString())
          } else {
            parsedParameter = new BN(parameter).toString()
          }
        }

        // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
        if (isAddress) {
          const isArray = Array.isArray(parameter)

          if (isArray) {
            parsedParameter = parameter.map((_) => _.toLowerCase())
          } else {
            parsedParameter = parameter.toLowerCase()
          }
        }

        returnValueData.params.push({
          name: abiItem.inputs[i].name,
          value: parsedParameter,
          type: abiItem.inputs[i].type,
        })
      }

      return returnValueData
    }
    return undefined
  }

  decodeLogs(logs) {
    return logs
      .filter((log) => log.topics.length > 0)
      .map((logItem) => {
        const methodID = logItem.topics[0].slice(2)
        const method = this.state.methodIDs[methodID]
        if (method) {
          const logData = logItem.data
          const decodedParameters = []
          let dataIndex = 0
          let topicsIndex = 1

          const dataTypes = []
          method.inputs.map((input) => {
            if (!input.indexed) {
              dataTypes.push(input.type)
            }
            return undefined
          })

          const decodedData = web3.eth.abi.decodeParameters(dataTypes, logData.slice(2))

          // Loop topic and data to get the params
          method.inputs.map((parameter) => {
            const decodedP = {
              name: parameter.name,
              type: parameter.type,
            }

            if (parameter.indexed) {
              decodedP.value = logItem.topics[topicsIndex]
              topicsIndex += 1
            } else {
              decodedP.value = decodedData[dataIndex]
              dataIndex += 1
            }

            if (parameter.type === 'address') {
              decodedP.value = decodedP.value.toLowerCase()
              // 42 because len(0x) + 40
              if (decodedP.value.length > 42) {
                const toRemove = decodedP.value.length - 42
                const temporary = decodedP.value.split('')
                temporary.splice(2, toRemove)
                decodedP.value = temporary.join('')
              }
            }

            if (parameter.type === 'uint256' || parameter.type === 'uint8' || parameter.type === 'int') {
              // ensure to remove leading 0x for hex numbers
              if (typeof decodedP.value === 'string' && decodedP.value.startsWith('0x')) {
                decodedP.value = new BN(decodedP.value.slice(2), 16).toString(10)
              } else {
                decodedP.value = new BN(decodedP.value).toString(10)
              }
            }

            decodedParameters.push(decodedP)
            return undefined
          })

          return {
            name: method.name,
            events: decodedParameters,
            address: logItem.address,
          }
        }
        return undefined
      })
  }
}

export default AbiDecoder
