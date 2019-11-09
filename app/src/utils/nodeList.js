import { nodeListAddress, minEpoch } from '../config'
const nodeListABI = [
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    name: 'epochInfo',
    outputs: [
      {
        name: 'id',
        type: 'uint256'
      },
      {
        name: 'n',
        type: 'uint256'
      },
      {
        name: 'k',
        type: 'uint256'
      },
      {
        name: 't',
        type: 'uint256'
      },
      {
        name: 'prevEpoch',
        type: 'uint256'
      },
      {
        name: 'nextEpoch',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'whitelist',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint256'
      }
    ],
    name: 'pssStatus',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'nodeDetails',
    outputs: [
      {
        name: 'declaredIp',
        type: 'string'
      },
      {
        name: 'position',
        type: 'uint256'
      },
      {
        name: 'pubKx',
        type: 'uint256'
      },
      {
        name: 'pubKy',
        type: 'uint256'
      },
      {
        name: 'tmP2PListenAddress',
        type: 'string'
      },
      {
        name: 'p2pListenAddress',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'publicKey',
        type: 'address'
      },
      {
        indexed: false,
        name: 'epoch',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'position',
        type: 'uint256'
      }
    ],
    name: 'NodeListed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      }
    ],
    name: 'getNodes',
    outputs: [
      {
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'nodeAddress',
        type: 'address'
      }
    ],
    name: 'getNodeDetails',
    outputs: [
      {
        name: 'declaredIp',
        type: 'string'
      },
      {
        name: 'position',
        type: 'uint256'
      },
      {
        name: 'tmP2PListenAddress',
        type: 'string'
      },
      {
        name: 'p2pListenAddress',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'oldEpoch',
        type: 'uint256'
      },
      {
        name: 'newEpoch',
        type: 'uint256'
      }
    ],
    name: 'getPssStatus',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      },
      {
        name: 'nodeAddress',
        type: 'address'
      }
    ],
    name: 'isWhitelisted',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'oldEpoch',
        type: 'uint256'
      },
      {
        name: 'newEpoch',
        type: 'uint256'
      },
      {
        name: 'status',
        type: 'uint256'
      }
    ],
    name: 'updatePssStatus',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      },
      {
        name: 'nodeAddress',
        type: 'address'
      },
      {
        name: 'allowed',
        type: 'bool'
      }
    ],
    name: 'updateWhitelist',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      },
      {
        name: 'n',
        type: 'uint256'
      },
      {
        name: 'k',
        type: 'uint256'
      },
      {
        name: 't',
        type: 'uint256'
      },
      {
        name: 'nodeList',
        type: 'address[]'
      },
      {
        name: 'prevEpoch',
        type: 'uint256'
      },
      {
        name: 'nextEpoch',
        type: 'uint256'
      }
    ],
    name: 'updateEpoch',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      }
    ],
    name: 'getEpochInfo',
    outputs: [
      {
        name: 'id',
        type: 'uint256'
      },
      {
        name: 'n',
        type: 'uint256'
      },
      {
        name: 'k',
        type: 'uint256'
      },
      {
        name: 't',
        type: 'uint256'
      },
      {
        name: 'nodeList',
        type: 'address[]'
      },
      {
        name: 'prevEpoch',
        type: 'uint256'
      },
      {
        name: 'nextEpoch',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      },
      {
        name: 'nodeAddress',
        type: 'address'
      }
    ],
    name: 'nodeRegistered',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'epoch',
        type: 'uint256'
      },
      {
        name: 'declaredIp',
        type: 'string'
      },
      {
        name: 'pubKx',
        type: 'uint256'
      },
      {
        name: 'pubKy',
        type: 'uint256'
      },
      {
        name: 'tmP2PListenAddress',
        type: 'string'
      },
      {
        name: 'p2pListenAddress',
        type: 'string'
      }
    ],
    name: 'listNode',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

var getLatestEpochInfo = async function(mainnetWeb3) {
  var nodeListContract = new mainnetWeb3.eth.Contract(nodeListABI, nodeListAddress)
  var epochInfo
  var startingEpoch = minEpoch
  while (true) {
    try {
      epochInfo = await nodeListContract.getEpochInfo(startingEpoch)
    } catch (err) {
      break
    }
    if (Number(epochInfo[0]) === 0) {
      break
    }
    startingEpoch++
  }
  return epochInfo
}

var getNodeEndpoint = async function(mainnetWeb3, nodeEthAddress) {
  var nodeListContract = new mainnetWeb3.eth.Contract(nodeListABI, nodeListAddress)
  var nodeDetails = await nodeListContract.getNodeDetails(nodeEthAddress)
  return nodeDetails[0].split(':')[0]
}

export default {
  getNodeEndpoint,
  getLatestEpochInfo
}
