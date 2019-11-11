window.alert('HERE1');
try {
(function (e) {
  function webpackJsonpCallback(t) {
    for (var n, s, o = t[0], c = t[1], l = t[2], d = 0, u = []; d < o.length; d++) s = o[d], Object.prototype.hasOwnProperty.call(a, s) && a[s] && u.push(a[s][0]), a[s] = 0;
    for (n in c) Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n]);
    i && i(t);
    while (u.length) u.shift()();
    return r.push.apply(r, l || []), checkDeferredModules()
  }

  function checkDeferredModules() {
    for (var e, t = 0; t < r.length; t++) {
      for (var n = r[t], s = !0, o = 1; o < n.length; o++) {
        var i = n[o];
        0 !== a[i] && (s = !1)
      }
      s && (r.splice(t--, 1), e = __webpack_require__(__webpack_require__.s = n[0]))
    }
    return e
  }
  var t = {},
    a = {
      app: 0
    },
    r = [];

  function __webpack_require__(a) {
    if (t[a]) return t[a].exports;
    var r = t[a] = {
      i: a,
      l: !1,
      exports: {}
    };
    return e[a].call(r.exports, r, r.exports, __webpack_require__), r.l = !0, r.exports
  }
  __webpack_require__.m = e, __webpack_require__.c = t, __webpack_require__.d = function (e, t, a) {
    __webpack_require__.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: a
    })
  }, __webpack_require__.r = function (e) {
    "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, __webpack_require__.t = function (e, t) {
    if (1 & t && (e = __webpack_require__(e)), 8 & t) return e;
    if (4 & t && "object" === typeof e && e && e.__esModule) return e;
    var a = Object.create(null);
    if (__webpack_require__.r(a), Object.defineProperty(a, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e)
      for (var r in e) __webpack_require__.d(a, r, function (t) {
        return e[t]
      }.bind(null, r));
    return a
  }, __webpack_require__.n = function (e) {
    var t = e && e.__esModule ? function getDefault() {
      return e["default"]
    } : function getModuleExports() {
      return e
    };
    return __webpack_require__.d(t, "a", t), t
  }, __webpack_require__.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, __webpack_require__.p = "/";
  var n = window["webpackJsonp"] = window["webpackJsonp"] || [],
    s = n.push.bind(n);
  n.push = webpackJsonpCallback, n = n.slice();
  for (var o = 0; o < n.length; o++) webpackJsonpCallback(n[o]);
  var i = s;
  r.push([0, "chunk-vendors"]), checkDeferredModules()
})({
  0: function (e, t, a) {
    e.exports = a("56d7")
  },
  "01ef": function (e, t, a) {
    "use strict";
    var r = a("4235"),
      n = a.n(r);
    n.a
  },
  "0306": function (e, t, a) {
    e.exports = a.p + "img/eth.19ea3ebe.svg"
  },
  "0341": function (e, t, a) {
    e.exports = a.p + "img/topup.e53e0159.svg"
  },
  "036a": function (e, t, a) {
    e.exports = a.p + "img/edgeless.5f18d23e.jpg"
  },
  "03c9": function (e, t, a) {
    "use strict";
    var r = a("e163"),
      n = a.n(r);
    n.a
  },
  "058f": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAAXNSR0IArs4c6QAAAkBJREFUaAXtWL1OG0EQ3lkb+wDxAGmRkiqiIOkoUkLaCLuIEtqA/QYUaXkCIxoqKAhniYYiKSKlShokpIieJ0iRSMT86G7YdRgzt6zXnIltGc1Jp/nd/Wa+Xe39KJX3Ahqw3Ggh6c36ZMff9vGgpqxhSA5s8TrgGvR7XkAnwJ0D1m1xdFuoSuP8d0/I6ubFO7crGjSKJgh7fGR2a5q6OZ0AhZca0ief1qJDaqlIik8iJkfJv51/Z+JMPl/pTMAYuRdu8APcEsUeBwbCW9B0wPc6b8ge2Tx25wi/Sc698TgIAHywtga1wf1c79kBJduDMMV0h+xuFVOc5IM6oElCcvwBQt1JTBgQBv4TA8HDjh/HWTx90KyX31Q2W98Uwkxcj15k47dWX2cRgJpablxsI6pXqHDeAP24nTKr9QXQngJwhqZC0wXpruwboFmLqgrgr3noJM9r5Tl3YrKDa0BJVmbWA/R6s1bu+hTj4/rugE8S0gUgxE47JhT1pEgShAFhQBgQBoSBcWfg3u90vkYz73m+BMcHoL/EtfLS263zp1ep+omIEU+BAryOV6PP3NdLH/j7iq+AqxR33eLbeYmKffkh30gaKGi17isKwe/35ZIv+NOXkrrJoiouuLEE00WE9KPrt3aK6tjKvdXJr0ZAZR9L+tfls9J06XRnBc5sLO/1oAb26hPfXUDzw23WfBJ6L/PJ+IcH4ipcGvuE+/LqI9lCeYsM5UsDIXaGEZMVGAbLIQxZgRA7EhMGhAFh4PEzcA2ot5DzjAlofAAAAABJRU5ErkJggg=="
  },
  "0676": function (e, t, a) {
    e.exports = a.p + "img/reddit.3e3d0a92.svg"
  },
  "06f1": function (e, t, a) {
    e.exports = a.p + "img/herocoin_logo.f8531284.png"
  },
  "082e": function (e, t, a) {
    "use strict";
    var render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-tooltip", {
          attrs: {
            bottom: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("span", e._g({
                staticClass: "selected-account",
                attrs: {
                  color: e.$vuetify.theme.torus_accept,
                  size: "18"
                },
                on: {
                  click: function (t) {
                    return e.copyToClip(e.address)
                  }
                }
              }, r), [e._t("default")], 2)]
            }
          }], null, !0)
        }, [e.copied ? [e._v(" Copied! ")] : [e._v(" Copy to clipboard ")]], 2)
      },
      r = [],
      n = a("f904"),
      s = a.n(n),
      o = {
        name: "showToolTip",
        data: function data() {
          return {
            copied: !1
          }
        },
        props: ["address"],
        methods: {
          copyToClip: function copyToClip(e) {
            var t = this;
            this.copied = !0, s()(e), setTimeout((function () {
              t.copied = !1
            }), 2500)
          }
        }
      },
      i = o,
      c = (a("322b"), a("2877")),
      l = a("6544"),
      d = a.n(l),
      u = a("3a2f"),
      p = Object(c["a"])(i, render, r, !1, null, "24d02ade", null),
      g = p.exports;
    d()(p, {
      VTooltip: u["a"]
    }), a.d(t, "a", (function () {
      return g
    }))
  },
  "08ef": function (e, t, a) {
    "use strict";
    var r = a("847f"),
      n = a.n(r);
    n.a
  },
  "0960": function (e, t, a) {
    e.exports = a.p + "img/nfticon.47ac5824.png"
  },
  "09de": function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return g
    }));
    a("4160"), a("b0c0"), a("d3b7"), a("159b");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("4879"),
      o = a("80fa"),
      i = a("231f"),
      c = a("5f81"),
      l = a("b00c"),
      d = l.ERC721METADATA_INTERFACE_ID,
      u = l.ERC721ENUMERABLE_INTERFACE_ID,
      p = l.SINGLE_CALL_BALANCES_ADDRESS,
      g = function () {
        function AssetContractController(e) {
          Object(r["a"])(this, AssetContractController), this._provider = e.provider, this.web3 = new s(this._provider), this.name = "AssetsContractController"
        }
        return Object(n["a"])(AssetContractController, [{
          key: "contractSupportsInterface",
          value: function contractSupportsInterface(e, t) {
            var a = this.web3,
              r = new a.eth.Contract(i, e);
            return r.methods.supportsInterface(t).call()
          }
        }, {
          key: "contractSupportsMetadataInterface",
          value: function contractSupportsMetadataInterface(e) {
            return this.contractSupportsInterface(e, d)
          }
        }, {
          key: "contractSupportsEnumerableInterface",
          value: function contractSupportsEnumerableInterface(e) {
            return this.contractSupportsInterface(e, u)
          }
        }, {
          key: "getBalanceOf",
          value: function getBalanceOf(e, t) {
            var a = this.web3,
              r = new a.eth.Contract(o, e);
            return r.methods.balanceOf(t).call()
          }
        }, {
          key: "getCollectibleTokenId",
          value: function getCollectibleTokenId(e, t, a) {
            var r = this.web3,
              n = new r.eth.Contract(i, e);
            return n.methods.tokenOfOwnerByIndex(t, a)
          }
        }, {
          key: "getCollectibleTokenURI",
          value: function getCollectibleTokenURI(e, t) {
            var a = this.web3,
              r = new a.eth.Contract(i, e);
            return r.methods.tokenURI(t).call()
          }
        }, {
          key: "getTokenDecimals",
          value: function getTokenDecimals(e) {
            var t = this.web3,
              a = new t.eth.Contract(o, e);
            return a.methods.decimals().call()
          }
        }, {
          key: "getAssetName",
          value: function getAssetName(e) {
            var t = this.web3,
              a = new t.eth.Contract(i, e);
            return a.methods.name().call()
          }
        }, {
          key: "getAssetSymbol",
          value: function getAssetSymbol(e) {
            var t = this.web3,
              a = new t.eth.Contract(i, e);
            return a.methods.symbol().call()
          }
        }, {
          key: "getOwnerOf",
          value: function getOwnerOf(e, t) {
            var a = this.web3,
              r = new a.eth.Contract(i, e);
            return r.methods.ownerOf(t).call()
          }
        }, {
          key: "getBalancesInSingleCall",
          value: function getBalancesInSingleCall(e, t) {
            var a = this.web3,
              r = new a.eth.Contract(c, p);
            return new Promise((function (a, n) {
              r.methods.balances([e], t).call().then((function (e) {
                var r = {};
                e.length > 0 && t.forEach((function (t, a) {
                  var n = toHex(e[a]);
                  n && "0x0" !== n && (r[t] = n)
                })), a(r)
              })).catch((function (e) {
                return n(e)
              }))
            }))
          }
        }]), AssetContractController
      }()
  },
  "0e70": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEbUlEQVR4nNWb3YtNaxzHPzNzyAV5SxOajAsluTERLtSTQYy3HOQ9kySS8j+4kdwMpZBEIUdyMlcS4uY4dQhJciWiKC9pkHHYLp61mm3t9fL8nvVba+/9raf2zOzn83yf7+y19l6/39qgpx5gqyIvSZuBlSWsI9YmoEKx5hYFa+wocA1vzcWaqwBLCuCbKv6CAvi5tYAhg9ohmAi7W5GtpmgAWiGYGK5aAK1aoARdI18IBrilYyVeRQcA/iEYCt48lBMAyEMwlLB5KC8AcA/BUNLmodwAIDsEQ4mbh/IDgOQQDCVvHuoTANSGYKjD5gH+UGRVhM+/BqwHvgN/K/oQSTOAYcLnvwM6gscfgTGKXuqi8EIla1wHNvL74deGvZi67shoyI/C3SQbfg8cBbocOF3AEewrpKkCWEit0f+Avfi9vEcDe4B/Y7gLFfyqax7W3E/gPLr/JQOcxZ4wK8B8LXAL9u1oGPApB6cNmANMAI4Bz3M7i1cHsBv4gH11/cjBGoX9Z7ENtxNP1jiUw4xUB5U87wyBKxRg4wvbbq3GKfhdG4UuyQH7q4hdZuhCDr+JdUvfEGYrb85FXZ5eM4u20hCe6O1JrMcpvrw2H6pHAN2ZwMjSROzb2fzgsY+2C3yKy/UrHaBfgeFC7hrgBjBYxRnEXg2uE7LagAEHn969iqwQjgl5pxzMnhEy+zJ4uRs1aSFME3DOZBitHucE3M4UjlqXKi6EfwTzl6WY1DB/O+d8J0VDWCOYey/GYNZ4JOBHT9qF9SerQ3DVROSbD0dHDC9JP/DYvLQi1I9tT7cL5kwXrhGd+9LxufuwF0n9kgV8iqID2Lc/V7V4rOEz9yfwLcdaTjLID4HJ+B8CUwTrhIdAEa15oLZL2yOY+xD55iUfsZdG5qqHYKg1eFswf3XM/Kzxp4B/M2a+WggmxWSngHMxhRMdlwXcjhRO7hBMhtE+Ie98Bq8CXBIyD2fwvEMwDmYHsBckEm3BfoqMsu5iy3MStWJrmVk+xSEYB2g4tkvhgTqx5e1uYKonY7PAp3MIRgCtYIsS9dL9FF9eIRghMBwuHR9tzfT0mhiC8QRWsAXKsnU6h9+aEBbngIVjbBG7TNBIBb/LQ9hWBVgF+3ZUlg4oed7Rgi1WjEDWGmulthY4K4CeBN56bMpF7cAu7IXPg8jfBoPfu2oU8L+SL2CoOfoZOB78rMk+AXwJ1lBrjmoqrj1+B+jFvsKkGo79jBFX7mrI9njaDRKvsc3TGQ6c6djm56sUXkPeIOF6i0w/8Vd6q4ArjoyGDMAgOwO/AvZjS1nPhXPVAtC8S0x6Rp0EvAkeT1H0IZJmANLa3yqGCpgDwFVFL3VR3BcmkkZc6dqlF9nQ5wDXANLq9q4hNG0ALk0LlxCaMgBJxyYrhKYLwKdXlxZCUwWQp1GZFELTBKDRpY0LoSkC0GxRR0NoyACqvzpbRH++OoSG/OrsBqy5mjswFRWG0KsFlDY10jQV26OT3N8j1TPgBfYbJk81gL8AVnWxmT4L+WIAAAAASUVORK5CYII="
  },
  "0f6d": function (e, t, a) {
    e.exports = a.p + "img/moon-pay-logo-white.361350c7.svg"
  },
  "0f7c": function (e, t, a) {
    e.exports = a.p + "img/learn-more-intro.10114dad.svg"
  },
  "0fc8": function (e, t, a) {
    e.exports = a.p + "img/signature.45779336.png"
  },
  1: function (e, t) {},
  10: function (e, t) {},
  1086: function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  11: function (e, t) {},
  1186: function (e, t, a) {
    e.exports = a.p + "img/user.dd850e29.svg"
  },
  1196: function (e, t) {
    function webpackEmptyContext(e) {
      var t = new Error("Cannot find module '" + e + "'");
      throw t.code = "MODULE_NOT_FOUND", t
    }
    webpackEmptyContext.keys = function () {
      return []
    }, webpackEmptyContext.resolve = webpackEmptyContext, e.exports = webpackEmptyContext, webpackEmptyContext.id = "1196"
  },
  "11a2": function (e, t, a) {
    e.exports = a.p + "img/rfr.9c999312.svg"
  },
  12: function (e, t) {},
  "12f0": function (e, t, a) {
    e.exports = a.p + "img/havven.f5c3ed44.png"
  },
  13: function (e, t) {},
  1351: function (e, t, a) {
    "use strict";
    a.r(t);
    a("d81d"), a("13d5"), a("0d03");
    var r = a("8189"),
      n = a("2410");

    function migrateFromSnapshotsToDiffs(e) {
      return e.map((function (t, a) {
        return 0 === a ? t : generateHistoryEntry(e[a - 1], t)
      }))
    }

    function generateHistoryEntry(e, t, a) {
      var n = r.compare(e, t);
      return n[0] && (a && (n[0].note = a), n[0].timestamp = Date.now()), n
    }

    function replayHistory(e) {
      var t = n(e),
        a = t.reduce((function (e, t) {
          return r.applyPatch(e, t).newDocument
        }));
      return a
    }

    function snapshotFromTxMeta(e) {
      var t = n(e);
      return delete t.history, t
    }
    t["default"] = {
      generateHistoryEntry: generateHistoryEntry,
      replayHistory: replayHistory,
      snapshotFromTxMeta: snapshotFromTxMeta,
      migrateFromSnapshotsToDiffs: migrateFromSnapshotsToDiffs
    }
  },
  "13b2": function (e, t, a) {
    e.exports = a.p + "img/tusd.20286233.png"
  },
  14: function (e, t) {},
  "146f": function (e, t, a) {
    e.exports = a.p + "img/rock2.5b4b106c.png"
  },
  15: function (e, t) {},
  16: function (e, t) {},
  1646: function (e, t, a) {
    var r = a("7fc8");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("167f9e16", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "164e": function (e, t, a) {
    e.exports = a.p + "img/home-illustration.658a7004.svg"
  },
  "16a8": function (e, t, a) {
    e.exports = a.p + "img/loginwithgoogle.0498e145.png"
  },
  "16a8d": function (e, t, a) {
    "use strict";
    var r = a("d64d"),
      n = a.n(r);
    n.a
  },
  "170f": function (e, t, a) {
    e.exports = a.p + "img/CanYa.d2e12e42.svg"
  },
  1785: function (e, t, a) {
    e.exports = a.p + "img/wallet.a13a6a84.svg"
  },
  "17ac": function (e, t, a) {
    var r = {
      "./address-card-regular.svg": "c22f",
      "./blublu-cross-arms.png": "b022",
      "./blue_arrow_down.svg": "d94f",
      "./blue_arrow_right.svg": "5300",
      "./clock-regular.svg": "3851",
      "./coins.svg": "8f16",
      "./crypto-logo-white.png": "bab5",
      "./crypto-logo.png": "6f9e",
      "./equal.svg": "9101",
      "./etheremon.png": "bf2c",
      "./ethereum-rainbow.svg": "bba3",
      "./favicon.png": "50d0",
      "./favicon_inverted.png": "890f",
      "./file-signature.svg": "b1c2",
      "./footer_waves.png": "7db6",
      "./home-illustration.svg": "164e",
      "./lavender-mask-rtl.svg": "3c2b",
      "./lavender-mask.svg": "9291",
      "./learn-more-intro.png": "5584",
      "./learn-more-intro.svg": "0f7c",
      "./learn-more.svg": "2172",
      "./login-bg.png": "87db",
      "./login-with-torus.png": "9673",
      "./login.png": "d8d9",
      "./loginWhite.png": "8575",
      "./loginwithgoogle.png": "16a8",
      "./logo.png": "cfe5",
      "./logo2x.png": "7467",
      "./logos/0x.svg": "3f16",
      "./logos/0xbitcoin.svg": "9752",
      "./logos/1st.svg": "adb0",
      "./logos/AST.png": "e0c5",
      "./logos/Aion.png": "d0a0",
      "./logos/BAT_icon.svg": "58e9",
      "./logos/Brickblock.svg": "2864",
      "./logos/CanYa.svg": "170f",
      "./logos/Cpollo.svg": "e996",
      "./logos/CryptoKitties-Kitty-13733.svg": "2328",
      "./logos/DAOstack.png": "e69c",
      "./logos/DAY.png": "dd69",
      "./logos/DGD.png": "6b4c",
      "./logos/Dentacoin.png": "e817",
      "./logos/ENTRP.png": "9e74",
      "./logos/FEATURED.POP_.png": "afe3",
      "./logos/IMP.svg": "2939",
      "./logos/J8T.svg": "5c27",
      "./logos/JETCOIN28.png": "8c98",
      "./logos/JOY.png": "8d97",
      "./logos/MLNSymbol.png": "25b9",
      "./logos/Maecenas.jpg": "f32a",
      "./logos/POA20.png": "7048",
      "./logos/ParetoLogo.png": "88ba",
      "./logos/RChain_logo.svg": "b815",
      "./logos/Rmesh.png": "af19",
      "./logos/SPANK.png": "6a36",
      "./logos/SpendCoin.png": "97b1",
      "./logos/StandardBounties.png": "7771",
      "./logos/XSC_Logo.svg": "a442",
      "./logos/aeternity.svg": "b5aa",
      "./logos/appcoins.png": "ce75",
      "./logos/aragon_isotype.svg": "60a2",
      "./logos/augur_logo.png": "bf32",
      "./logos/bancor.png": "664b",
      "./logos/bcap.svg": "a1a6",
      "./logos/bcpt.svg": "f282",
      "./logos/bee_token.svg": "876a",
      "./logos/bitclave.svg": "46c1",
      "./logos/bitmart.png": "1cbb",
      "./logos/bnb.png": "67fd",
      "./logos/bobsrepair.png": "f43e",
      "./logos/box_token.png": "cea9",
      "./logos/bytom-2-logo-png-transparent.png": "7b9b",
      "./logos/c20.svg": "f1b4",
      "./logos/change.png": "4c4c",
      "./logos/chronobank.png": "e881",
      "./logos/cln.png": "ff81",
      "./logos/coindirect-dark.svg": "f61a",
      "./logos/coindirect.svg": "3290",
      "./logos/crypto-logo.png": "50e1",
      "./logos/dai.svg": "b241",
      "./logos/decentraland.png": "507e",
      "./logos/dether.svg": "d90f",
      "./logos/disciplina.svg": "e358",
      "./logos/divi.svg": "4af8",
      "./logos/dragonglass.svg": "c8b1",
      "./logos/dutyof.care-square.png": "b1b4",
      "./logos/edgeless.jpg": "036a",
      "./logos/edu.svg": "b7a6",
      "./logos/ego_badge.png": "a07b",
      "./logos/ely.png": "855f",
      "./logos/ens.svg": "d67d",
      "./logos/eos-logo.jpeg": "94a0",
      "./logos/eth.svg": "0306",
      "./logos/fun.svg": "ea58",
      "./logos/gee-icon.svg": "cdf2",
      "./logos/gladius.svg": "a3ab",
      "./logos/gnosis.svg": "21ca",
      "./logos/goldx.png": "72f8",
      "./logos/golem.svg": "a6c8",
      "./logos/groo.png": "274e",
      "./logos/guppy.png": "401e",
      "./logos/havven.png": "12f0",
      "./logos/havven_nusd.png": "4c22",
      "./logos/herocoin_logo.png": "06f1",
      "./logos/hg_gbt.png": "6907",
      "./logos/hgt.png": "0e70",
      "./logos/hydro.png": "3735",
      "./logos/icon-icx-logo.png": "acf3",
      "./logos/iconomi.png": "98b6",
      "./logos/indorseLogo.jpg": "982a",
      "./logos/ink_protocol.svg": "6f95",
      "./logos/iost.png": "714b",
      "./logos/iqeon.svg": "1805",
      "./logos/knownorigin.svg": "f93b",
      "./logos/kucoin.svg": "b676",
      "./logos/kyber.svg": "4e44",
      "./logos/lend.svg": "1a3e",
      "./logos/like.svg": "a345",
      "./logos/logo-maker-4.svg": "af1f",
      "./logos/loom.svg": "ac9c",
      "./logos/lun.png": "cb13",
      "./logos/metamark.svg": "7c92",
      "./logos/mithril-featured.png": "8191",
      "./logos/modum.svg": "ed34",
      "./logos/nanjcoin.svg": "ebed",
      "./logos/ndc.png": "765c",
      "./logos/neeo.png": "b3d3",
      "./logos/nfticon.png": "0960",
      "./logos/omg.jpg": "92fb",
      "./logos/onlive.svg": "2e86",
      "./logos/pax.svg": "b2f7",
      "./logos/pinakion.svg": "7825",
      "./logos/plat.png": "fd72",
      "./logos/playkey.svg": "c004",
      "./logos/plutus-god.svg": "cdb3",
      "./logos/polyswarm_nectar.svg": "4111",
      "./logos/qtum_28.png": "9777",
      "./logos/quant-network.svg": "bc0f",
      "./logos/rchain.png": "c27b",
      "./logos/redcab.png": "440d",
      "./logos/ren.svg": "922d",
      "./logos/request-network.png": "c7e3",
      "./logos/rfr.svg": "11a2",
      "./logos/rivetz.png": "a3ed",
      "./logos/rlc.svg": "9ea8",
      "./logos/rock2.png": "146f",
      "./logos/santiment.svg": "be5c",
      "./logos/singulardtv.svg": "fd99",
      "./logos/snt.svg": "e239",
      "./logos/spectiv.svg": "21af",
      "./logos/spn.svg": "8136",
      "./logos/starbase.png": "dc3d",
      "./logos/stasis-eurs.svg": "2d00",
      "./logos/storj.jpg": "eb38",
      "./logos/streamr.svg": "e125",
      "./logos/swarm.svg": "6866",
      "./logos/swt.jpg": "ffad",
      "./logos/synthetix.svg": "233c",
      "./logos/synthetix_susd.svg": "3844",
      "./logos/taas-ico.png": "1982",
      "./logos/tkn.svg": "bc4d",
      "./logos/too-real.jpg": "6d04",
      "./logos/tpt.png": "f3c2",
      "./logos/trustcoin.jpg": "cb40",
      "./logos/tusd.png": "13b2",
      "./logos/vechain.png": "cd1b",
      "./logos/viewly.svg": "2cb2",
      "./logos/vslice.png": "787f",
      "./logos/waltonchain.png": "e922",
      "./logos/weth.png": "974a",
      "./logos/wings_logo.svg": "7283",
      "./logos/wyvern-logo.svg": "66de",
      "./logos/xaurum_logo.svg": "698c",
      "./logos/yggdrash.svg": "3d15",
      "./logos/zilliqa.svg": "fb36",
      "./moon-pay-logo-white.svg": "0f6d",
      "./moon-pay-logo.svg": "a299",
      "./people_error.svg": "3783",
      "./plus.svg": "9718",
      "./signature.png": "0fc8",
      "./signature.svg": "2f05",
      "./simplex-logo.png": "beea",
      "./sync-blue.svg": "8c84",
      "./torus-circle.png": "8ce95",
      "./torus-circle.svg": "ab61",
      "./torus-logo-blue.svg": "1cbd",
      "./torus-logo-white.svg": "1fa6",
      "./torus-people-colored.svg": "b2da",
      "./torus-people.png": "364a",
      "./torus_logo.png": "e9d9",
      "./user.svg": "1186",
      "./wallet-blue.svg": "a87c",
      "./wallet.svg": "1785",
      "./wallet_blue_line.svg": "8bc6",
      "./wyre-logo-white.svg": "b0b5",
      "./wyre-logo.svg": "ce20"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "17ac"
  },
  1805: function (e, t, a) {
    e.exports = a.p + "img/iqeon.5894ec73.svg"
  },
  1970: function (e, t, a) {
    var r = a("ab72");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("02749ea0", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  1982: function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEXUExURf///8vP08HHzE5ebUFTYhYrP/f4+Q4kOdsJLg8lOq+2vQ4lOdwKLxkvQ8IMMNwJMKYQMePm6CohOA0lOUoeNt0JL9jb3xcjOMMNMAwlOVtpeA4lOg8lOf///g4kOltqdw0lOg4lOA0kOacQMg4kOP/+/twJL01ebUpbatbb3xQpPkFTY8HHy8DGyw0mOTkfODRHV8DHzK61vcrP1BAmOzlLWtfb3pmjq1tqeA4lN/X29tDV2f7//hEkOEFUZEoeN0ocN/7//xckOQ8kOf7+/xgjOSMiOcQMLw8kOtsJL7K5v8QNMEUfNZQTM////ens7uLl5w4mOCUhN+Lm6P3+/lVlcw4mOSkhOBYkOSogORkvQsMMMawQMkfNkV4AAAHqSURBVHja7dxHUsNAEEBRYYIwbTAg8kiyyTnnnHPO8f7ngA1LhClpRhrq/603fm71Rl1lx/0nOUCAAAECBAgQIECAAAFiC0REoj4ecJUdkFCVp9si2t652LRkIn5/e0SF0+M9OyBqqn+o8HNDxfNDW5a9uT6iQrGrEwgQIECAAAECBAgQIECAAAECBAgQIECA2AaRy6ao3j9e7IDsu0etEb0+3/l2QH65WIk8eXZAVBgNCW9dW5Y9mwEBAgQIECBAgAABAgQIECBAgAABAgRIKpCxWp0tGIPIcpXG5kdCZQbiy6SjscFS9NkiOYi4EzohTo+pR8uXnE5HUJI+U8ue0zsR8YAAAQIECBAgQIAAAQIECBAgQIAAMQ/ZjfeCbiU7L+gG401kwM0E5MAJrmJBSr2SCchGsHbWEKO5cVNnhV8frZZGWy5WQIAAAQIECBAgQIAAAQIECBAgQIAAAQKkUsjNm87vWxZfjEAC517rRPwwf2JmIsH143C1toa3JC+GIA91Ols3tyN663C7gQABAgQIECBAgAABAgQIECBAgAABAgTIN8RLCNIrs2lCljzfSwYi6U5k9Ke/FvozZFXN1KTYoq8Suo98/SL59FLKLSe27NkMCBAgQIAAAQIECBAgQIAAAQIESCV9AtLGnAOyHgPlAAAAAElFTkSuQmCC"
  },
  "19ac": function (e, t, a) {
    "use strict";
    a.r(t),
      function (e) {
        a.d(t, "default", (function () {
          return f
        }));
        a("99af"), a("4de4"), a("7db0"), a("c740"), a("13d5"), a("0d03"), a("b64b"), a("d3b7"), a("ac1f"), a("466d");
        var r = a("9f12"),
          n = a("53fe"),
          s = a("8b83"),
          o = a("c65a"),
          i = a("c03e"),
          c = a("faa1"),
          l = a("c897"),
          d = a("b671"),
          u = a("d177").default,
          p = /^[0-9A-Fa-f]+$/g,
          g = a("5c7d"),
          f = function (t) {
            function PersonalMessageManager(e) {
              var t;
              return Object(r["a"])(this, PersonalMessageManager), t = Object(s["a"])(this, Object(o["a"])(PersonalMessageManager).call(this)), t.store = new l({
                unapprovedPersonalMsgs: {},
                unapprovedPersonalMsgCount: 0
              }), t.messages = [], t
            }
            return Object(i["a"])(PersonalMessageManager, t), Object(n["a"])(PersonalMessageManager, [{
              key: "getUnapprovedMsgs",
              value: function getUnapprovedMsgs() {
                return this.messages.filter((function (e) {
                  return "unapproved" === e.status
                })).reduce((function (e, t) {
                  return e[t.id] = t, e
                }), {})
              }
            }, {
              key: "addUnapprovedMessageAsync",
              value: function addUnapprovedMessageAsync(e, t) {
                var a = this;
                return new Promise((function (r, n) {
                  e.from || n(new Error("MetaMask Message Signature: from field is required."));
                  var s = a.addUnapprovedMessage(e, t);
                  a.once("".concat(s, ":finished"), (function (t) {
                    switch (t.status) {
                      case "signed":
                        return r(t.rawSig);
                      case "rejected":
                        return n(new Error("MetaMask Message Signature: User denied message signature."));
                      default:
                        return n(new Error("MetaMask Message Signature: Unknown problem: ".concat(JSON.stringify(e))))
                    }
                  }))
                }))
              }
            }, {
              key: "addUnapprovedMessage",
              value: function addUnapprovedMessage(e, t) {
                g.debug("PersonalMessageManager addUnapprovedMessage: ".concat(JSON.stringify(e))), t && (e.origin = t.origin), e.data = this.normalizeMsgData(e.data);
                var a = (new Date).getTime(),
                  r = u(),
                  n = {
                    id: r,
                    msgParams: e,
                    time: a,
                    status: "unapproved",
                    type: "personal_sign"
                  };
                return this.addMsg(n), this.emit("update"), r
              }
            }, {
              key: "addMsg",
              value: function addMsg(e) {
                this.messages.push(e), this._saveMsgList()
              }
            }, {
              key: "getMsg",
              value: function getMsg(e) {
                return this.messages.find((function (t) {
                  return t.id === e
                }))
              }
            }, {
              key: "approveMessage",
              value: function approveMessage(e) {
                return this.setMsgStatusApproved(e.metamaskId), this.prepMsgForSigning(e)
              }
            }, {
              key: "setMsgStatusApproved",
              value: function setMsgStatusApproved(e) {
                this._setMsgStatus(e, "approved")
              }
            }, {
              key: "setMsgStatusSigned",
              value: function setMsgStatusSigned(e, t) {
                var a = this.getMsg(e);
                a.rawSig = t, this._updateMsg(a), this._setMsgStatus(e, "signed")
              }
            }, {
              key: "prepMsgForSigning",
              value: function prepMsgForSigning(e) {
                return delete e.metamaskId, Promise.resolve(e)
              }
            }, {
              key: "rejectMsg",
              value: function rejectMsg(e) {
                this._setMsgStatus(e, "rejected")
              }
            }, {
              key: "_setMsgStatus",
              value: function _setMsgStatus(e, t) {
                var a = this.getMsg(e);
                if (!a) throw new Error('PersonalMessageManager - Message not found for id: "'.concat(e, '".'));
                a.status = t, this._updateMsg(a), this.emit("".concat(e, ":").concat(t), a), "rejected" !== t && "signed" !== t || this.emit("".concat(e, ":finished"), a)
              }
            }, {
              key: "_updateMsg",
              value: function _updateMsg(e) {
                var t = this.messages.findIndex((function (t) {
                  return t.id === e.id
                })); - 1 !== t && (this.messages[t] = e), this._saveMsgList()
              }
            }, {
              key: "_saveMsgList",
              value: function _saveMsgList() {
                var e = this.getUnapprovedMsgs(),
                  t = Object.keys(e).length;
                this.store.updateState({
                  unapprovedPersonalMsgs: e,
                  unapprovedPersonalMsgCount: t
                }), this.emit("updateBadge")
              }
            }, {
              key: "normalizeMsgData",
              value: function normalizeMsgData(t) {
                try {
                  var a = d.stripHexPrefix(t);
                  if (a.match(p)) return d.addHexPrefix(a)
                } catch (r) {
                  g.debug("Message was not hex encoded, interpreting as utf8.")
                }
                return d.bufferToHex(e.from(t, "utf8"))
              }
            }, {
              key: "unapprovedPersonalMsgCount",
              get: function get() {
                return Object.keys(this.getUnapprovedMsgs()).length
              }
            }]), PersonalMessageManager
          }(c)
      }.call(this, a("1c35").Buffer)
  },
  "19c9": function (e, t, a) {
    "use strict";
    a.r(t);
    a("b0c0");

    function cleanErrorStack(e) {
      var t = e.name;
      t = void 0 === t ? "Error" : String(t);
      var a = e.message;
      return a = void 0 === a ? "" : String(a), e.stack = "" === t ? e.message : "" === a ? e.name : e.name + ": " + e.message, e
    }
    t["default"] = cleanErrorStack
  },
  "1a00": function (e, t, a) {
    "use strict";
    (function (e) {
      a.d(t, "a", (function () {
        return Y
      }));
      a("4160"), a("d81d"), a("4e827"), a("0d03"), a("d3b7"), a("25f0"), a("159b"), a("96cf");
      var r = a("9f12"),
        n = a("53fe"),
        s = a("8b83"),
        o = a("c65a"),
        i = a("9aa6"),
        c = a("c03e"),
        l = a("b012"),
        d = a("faa1"),
        u = a("4fc9").default,
        p = a("5c7d"),
        g = a("4603").default,
        f = a("8f4f").default,
        v = a("52d3").default,
        h = a("f421").default,
        m = a("d465").default,
        b = a("5f1f").default,
        x = a("80f6").default,
        y = a("ca1f").default,
        w = a("3246").default,
        k = a("09de").default,
        C = a("e306").default,
        A = a("b671").BN,
        T = new A("1000000000"),
        _ = a("a8ea"),
        S = a("1ed9"),
        O = a("6f59"),
        E = a("f234").default,
        I = a("c619"),
        M = a("c848"),
        P = a("da78"),
        R = a("b7b4"),
        L = a("282b"),
        j = a("bc5e"),
        D = a("d660"),
        N = a("226e"),
        B = a("6ec5").default,
        V = a("19ac").default,
        F = a("c1e8").default,
        U = a("c897"),
        H = a("e2c1").default,
        G = a("85bf").default,
        K = "0.0.1",
        Y = function (t) {
          function TorusController(e) {
            var t;
            Object(r["a"])(this, TorusController), t = Object(s["a"])(this, Object(o["a"])(TorusController).call(this)), t.defaultMaxListeners = 20, t.sendUpdate = l(t.privateSendUpdate.bind(Object(i["a"])(t)), 200), t.opts = e;
            var a = e.sessionCachedNetwork || {},
              n = a.host,
              c = a.chainId,
              d = a.networkName,
              p = e.sessionCachedNetwork ? {
                provider: {
                  type: n,
                  rpcTarget: n,
                  chainId: c,
                  ticker: d,
                  nickname: d
                }
              } : {};
            return t.store = new u, t.networkController = new g(p), t.activeControllerConnections = 0, t.currencyController = new m({
              initState: {}
            }), t.currencyController.updateConversionRate(), t.currencyController.scheduleConversionInterval(), t.initializeProvider(), t.provider = t.networkController.getProviderAndBlockTracker().provider, t.blockTracker = t.networkController.getProviderAndBlockTracker().blockTracker, t.recentBlocksController = new h({
              blockTracker: t.blockTracker,
              provider: t.provider,
              networkController: t.networkController
            }), t.accountTracker = new f({
              provider: t.provider,
              blockTracker: t.blockTracker,
              network: t.networkController
            }), t.detectTokensController = new b({
              network: t.networkController,
              provider: t.provider
            }), t.tokenRatesController = new x({
              currency: t.currencyController.store,
              tokensStore: t.detectTokensController.detectedTokensStore
            }), t.on("controllerConnectionChanged", (function (e) {
              e > 0 ? t.accountTracker.start() : t.accountTracker.stop()
            })), t.networkController.on("networkDidChange", (function () {
              t.accountTracker._updateAccounts(), t.detectTokensController.restartTokenDetection(), t.assetDetectionController.restartAssetDetection()
            })), t.keyringController = new G, t.publicConfigStore = t.initPublicConfigStore(), t.txController = new v({
              networkStore: t.networkController.networkStore,
              txHistoryLimit: 40,
              getNetwork: t.networkController.getNetworkState.bind(Object(i["a"])(t)),
              signTransaction: t.keyringController.signTransaction.bind(t.keyringController),
              provider: t.provider,
              blockTracker: t.blockTracker,
              getGasPrice: t.getGasPrice.bind(Object(i["a"])(t)),
              storeProps: t.opts.storeProps
            }), t.txController.on("newUnapprovedTx", (function () {
              return e.showUnapprovedTx()
            })), t.txController.on("tx:status-update", (function (e, a) {
              if ("confirmed" === a || "failed" === a) {
                var r = t.txController.txStateManager.getTx(e);
                t.platform && t.platform.showTransactionNotification(r)
              }
            })), t.assetController = new w({
              network: t.networkController,
              provider: t.provider
            }), t.assetContractController = new k({
              provider: t.provider
            }), t.assetDetectionController = new y({
              network: t.networkController,
              provider: t.provider,
              assetController: t.assetController,
              assetContractController: t.assetContractController
            }), t.networkController.lookupNetwork(), t.messageManager = new B, t.personalMessageManager = new V, t.typedMessageManager = new F({
              networkController: t.networkController
            }), t.store.updateStructure({
              TransactionController: t.txController.store,
              NetworkController: t.networkController.store,
              MessageManager: t.messageManager.store,
              CurrencyController: t.currencyController.store,
              PersonalMessageManager: t.personalMessageManager.store,
              TypedMessageManager: t.typedMessageManager.store
            }), t.updateAndApproveTransaction = H(t.txController.updateAndApproveTransaction, t.txController), t.cancelTransaction = H(t.txController.cancelTransaction, t.txController), "function" === typeof e.rehydrate && setTimeout((function () {
              e.rehydrate()
            }), 50), t
          }
          return Object(c["a"])(TorusController, t), Object(n["a"])(TorusController, [{
            key: "initializeProvider",
            value: function initializeProvider() {
              var e = this,
                t = {
                  static: {
                    eth_syncing: !1,
                    web3_clientVersion: "Torus/v".concat(K)
                  },
                  version: K,
                  getAccounts: function getAccounts(t) {
                    var a, r;
                    return regeneratorRuntime.async((function getAccounts$(n) {
                      while (1) switch (n.prev = n.next) {
                        case 0:
                          if (t.origin, "function" !== typeof e.opts.storeProps) {
                            n.next = 8;
                            break
                          }
                          if (a = e.opts.storeProps(), r = a.selectedAddress, !r) {
                            n.next = 7;
                            break
                          }
                          return n.abrupt("return", [r]);
                        case 7:
                          return n.abrupt("return", []);
                        case 8:
                        case "end":
                          return n.stop()
                      }
                    }))
                  },
                  processTransaction: this.newUnapprovedTransaction.bind(this),
                  processEthSignMessage: this.newUnsignedMessage.bind(this),
                  processTypedMessage: this.newUnsignedTypedMessage.bind(this),
                  processTypedMessageV3: this.newUnsignedTypedMessage.bind(this),
                  processTypedMessageV4: this.newUnsignedTypedMessage.bind(this),
                  processPersonalMessage: this.newUnsignedPersonalMessage.bind(this),
                  getPendingNonce: this.getPendingNonce.bind(this)
                },
                a = this.networkController.initializeProvider(t);
              return a
            }
          }, {
            key: "initPublicConfigStore",
            value: function initPublicConfigStore() {
              var e = this,
                t = new U;

              function selectPublicState(e) {
                var t = {
                  selectedAddress: e.isUnlocked ? e.selectedAddress : void 0,
                  networkVersion: e.network
                };
                return t
              }
              return (this.on("update", (function (a) {
                e.isClientOpenAndUnlocked = a.isUnlocked;
                var r = selectPublicState(a);
                t.putState(r)
              })), t)
            }
          }, {
            key: "getState",
            value: function getState() {
              return this.store.getFlatState()
            }
          }, {
            key: "getApi",
            value: function getApi() {
              var e = this,
                t = this.keyringController,
                a = this.txController,
                r = this.networkController;
              return {
                getState: function getState(t) {
                  return t(null, e.getState())
                },
                setCurrentCurrency: this.setCurrentCurrency.bind(this),
                getGasPrice: function getGasPrice(t) {
                  return t(null, e.getGasPrice())
                },
                setProviderType: H(r.setProviderType, r),
                exportAccount: H(t.exportAccount, t),
                cancelTransaction: H(a.cancelTransaction, a),
                updateTransaction: H(a.updateTransaction, a),
                updateAndApproveTransaction: H(a.updateAndApproveTransaction, a),
                retryTransaction: H(this.retryTransaction, this),
                createCancelTransaction: H(this.createCancelTransaction, this),
                createSpeedUpTransaction: H(this.createSpeedUpTransaction, this),
                getFilteredTxList: H(a.getFilteredTxList, a),
                estimateGas: H(this.estimateGas, this),
                signMessage: H(this.signMessage, this),
                cancelMessage: this.cancelMessage.bind(this),
                signPersonalMessage: H(this.signPersonalMessage, this),
                cancelPersonalMessage: this.cancelPersonalMessage.bind(this),
                signTypedMessage: H(this.signTypedMessage, this),
                cancelTypedMessage: this.cancelTypedMessage.bind(this)
              }
            }
          }, {
            key: "initTorusKeyring",
            value: function initTorusKeyring(e, t) {
              var a = this;
              return new Promise((function (r, n) {
                a.keyringController.deserialize(e).then((function (e) {
                  p.info("keyring deserialized"), r()
                })).catch((function (e) {
                  n(e), p.error("unable to deserialize keyring", e)
                })), a.accountTracker.syncWithAddresses(t)
              }))
            }
          }, {
            key: "addAccount",
            value: function addAccount(e, t) {
              return regeneratorRuntime.async((function addAccount$(a) {
                while (1) switch (a.prev = a.next) {
                  case 0:
                    return a.next = 2, regeneratorRuntime.awrap(this.keyringController.addAccount(e));
                  case 2:
                    this.accountTracker.addAccounts([t]);
                  case 3:
                  case "end":
                    return a.stop()
                }
              }), null, this)
            }
          }, {
            key: "setSelectedAccount",
            value: function setSelectedAccount(e, t) {
              t.jwtToken && (this.assetDetectionController.jwtToken = t.jwtToken, this.assetController.jwtToken = t.jwtToken), console.log("starting detection"), this.detectTokensController.startTokenDetection(e), this.assetDetectionController.startAssetDetection(e)
            }
          }, {
            key: "getBalance",
            value: function getBalance(e, t) {
              var a = this;
              return new Promise((function (r, n) {
                var s = a.accountTracker.store.getState().accounts[e];
                s && s.balance ? r(s.balance) : t.getBalance(e, (function (e, t) {
                  e ? (n(e), p.error(e)) : r(t || "0x0")
                }))
              }))
            }
          }, {
            key: "getGasPrice",
            value: function getGasPrice() {
              var e = this.recentBlocksController,
                t = e.store.getState(),
                a = t.recentBlocks;
              if (0 === a.length) return "0x" + T.toString(16);
              var r = a.map((function (e) {
                  return !e.gasPrices || e.gasPrices.length < 1 ? T : e.gasPrices.map((function (e) {
                    return e.substr(2)
                  })).map((function (e) {
                    return new A(e, 16)
                  })).sort((function (e, t) {
                    return e.gt(t) ? 1 : -1
                  }))[0]
                })).map((function (e) {
                  return e.div(T).toNumber()
                })),
                n = _(65, r),
                s = new A(n);
              return "0x" + s.mul(T).toString(16)
            }
          }, {
            key: "newUnapprovedTransaction",
            value: function newUnapprovedTransaction(e, t) {
              return regeneratorRuntime.async((function newUnapprovedTransaction$(a) {
                while (1) switch (a.prev = a.next) {
                  case 0:
                    return a.abrupt("return", this.txController.newUnapprovedTransaction(e, t));
                  case 1:
                  case "end":
                    return a.stop()
                }
              }), null, this)
            }
          }, {
            key: "newUnsignedMessage",
            value: function newUnsignedMessage(e, t) {
              var a = this.messageManager.addUnapprovedMessageAsync(e, t);
              return this.sendUpdate(), this.opts.showUnconfirmedMessage(), a
            }
          }, {
            key: "signMessage",
            value: function signMessage(e) {
              var t = this;
              p.info("MetaMaskController - signMessage");
              var a = e.metamaskId;
              return this.messageManager.approveMessage(e).then((function (e) {
                return t.keyringController.signMessage(e.from, e.data)
              })).then((function (e) {
                return t.messageManager.setMsgStatusSigned(a, e), t.getState()
              }))
            }
          }, {
            key: "cancelMessage",
            value: function cancelMessage(e, t) {
              var a = this.messageManager;
              a.rejectMsg(e), t && "function" === typeof t && t(null, this.getState())
            }
          }, {
            key: "newUnsignedPersonalMessage",
            value: function newUnsignedPersonalMessage(e, t) {
              var a;
              return regeneratorRuntime.async((function newUnsignedPersonalMessage$(r) {
                while (1) switch (r.prev = r.next) {
                  case 0:
                    return a = this.personalMessageManager.addUnapprovedMessageAsync(e, t), this.sendUpdate(), this.opts.showUnconfirmedMessage(), r.abrupt("return", a);
                  case 4:
                  case "end":
                    return r.stop()
                }
              }), null, this)
            }
          }, {
            key: "signPersonalMessage",
            value: function signPersonalMessage(e) {
              var t = this;
              p.info("MetaMaskController - signPersonalMessage");
              var a = e.metamaskId;
              return this.personalMessageManager.approveMessage(e).then((function (e) {
                return t.keyringController.signPersonalMessage(e.from, e.data)
              })).then((function (e) {
                return t.personalMessageManager.setMsgStatusSigned(a, e), t.getState()
              }))
            }
          }, {
            key: "cancelPersonalMessage",
            value: function cancelPersonalMessage(e, t) {
              var a = this.personalMessageManager;
              a.rejectMsg(e), t && "function" === typeof t && t(null, this.getState())
            }
          }, {
            key: "newUnsignedTypedMessage",
            value: function newUnsignedTypedMessage(e, t, a) {
              var r = this.typedMessageManager.addUnapprovedMessageAsync(e, t, a);
              return this.sendUpdate(), this.opts.showUnconfirmedMessage(), r
            }
          }, {
            key: "signTypedMessage",
            value: function signTypedMessage(e) {
              var t, a, r, n, s;
              return regeneratorRuntime.async((function signTypedMessage$(o) {
                while (1) switch (o.prev = o.next) {
                  case 0:
                    return p.info("MetaMaskController - eth_signTypedData"), t = e.metamaskId, a = e.version, o.prev = 3, o.next = 6, regeneratorRuntime.awrap(this.typedMessageManager.approveMessage(e));
                  case 6:
                    return r = o.sent, n = C(S.normalize(r.from)), o.next = 10, regeneratorRuntime.awrap(this.keyringController.signTypedData(n, r.data, a));
                  case 10:
                    return s = o.sent, this.typedMessageManager.setMsgStatusSigned(t, s), o.abrupt("return", this.getState());
                  case 15:
                    o.prev = 15, o.t0 = o["catch"](3), p.info("TorusController - eth_signTypedData failed.", o.t0), this.typedMessageManager.errorMessage(t, o.t0);
                  case 19:
                  case "end":
                    return o.stop()
                }
              }), null, this, [
                [3, 15]
              ])
            }
          }, {
            key: "cancelTypedMessage",
            value: function cancelTypedMessage(e, t) {
              var a = this.typedMessageManager;
              a.rejectMsg(e), t && "function" === typeof t && t(null, this.getState())
            }
          }, {
            key: "retryTransaction",
            value: function retryTransaction(e, t) {
              var a;
              return regeneratorRuntime.async((function retryTransaction$(r) {
                while (1) switch (r.prev = r.next) {
                  case 0:
                    return r.next = 2, regeneratorRuntime.awrap(this.txController.retryTransaction(e, t));
                  case 2:
                    return r.next = 4, regeneratorRuntime.awrap(this.getState());
                  case 4:
                    return a = r.sent, r.abrupt("return", a);
                  case 6:
                  case "end":
                    return r.stop()
                }
              }), null, this)
            }
          }, {
            key: "createCancelTransaction",
            value: function createCancelTransaction(e, t) {
              var a;
              return regeneratorRuntime.async((function createCancelTransaction$(r) {
                while (1) switch (r.prev = r.next) {
                  case 0:
                    return r.prev = 0, r.next = 3, regeneratorRuntime.awrap(this.txController.createCancelTransaction(e, t));
                  case 3:
                    return r.next = 5, regeneratorRuntime.awrap(this.getState());
                  case 5:
                    return a = r.sent, r.abrupt("return", a);
                  case 9:
                    throw r.prev = 9, r.t0 = r["catch"](0), r.t0;
                  case 12:
                  case "end":
                    return r.stop()
                }
              }), null, this, [
                [0, 9]
              ])
            }
          }, {
            key: "createSpeedUpTransaction",
            value: function createSpeedUpTransaction(e, t) {
              var a;
              return regeneratorRuntime.async((function createSpeedUpTransaction$(r) {
                while (1) switch (r.prev = r.next) {
                  case 0:
                    return r.next = 2, regeneratorRuntime.awrap(this.txController.createSpeedUpTransaction(e, t));
                  case 2:
                    return r.next = 4, regeneratorRuntime.awrap(this.getState());
                  case 4:
                    return a = r.sent, r.abrupt("return", a);
                  case 6:
                  case "end":
                    return r.stop()
                }
              }), null, this)
            }
          }, {
            key: "estimateGas",
            value: function estimateGas(e) {
              var t = this;
              return new Promise((function (a, r) {
                return t.txController.txGasUtil.query.estimateGas(e, (function (e, t) {
                  return e ? r(e) : a(t)
                }))
              }))
            }
          }, {
            key: "setupUntrustedCommunication",
            value: function setupUntrustedCommunication(e, t) {
              var a = E(e);
              this.setupProviderConnection(a.createStream("test"), a.createStream("provider"), t), this.setupPublicConfig(a.createStream("publicConfig"))
            }
          }, {
            key: "setupTrustedCommunication",
            value: function setupTrustedCommunication(e, t) {
              this.setupControllerConnection(e), this.setupProviderConnection(e, t)
            }
          }, {
            key: "setupControllerConnection",
            value: function setupControllerConnection(e) {
              this.activeControllerConnections++, this.emit("controllerConnectionChanged", this.activeControllerConnections)
            }
          }, {
            key: "setupProviderConnection",
            value: function setupProviderConnection(e, t) {
              var a = this.setupProviderEngine(t),
                r = N({
                  engine: a
                });
              e.pipe(r).pipe(e).on("error", (function (e) {
                a._middleware.forEach((function (e) {
                  e.destroy && "function" === typeof e.destroy && e.destroy()
                })), e && p.error(e)
              }))
            }
          }, {
            key: "setupProviderEngine",
            value: function setupProviderEngine(e, t) {
              var a = new M,
                r = this.provider,
                n = this.blockTracker,
                s = P({
                  provider: r,
                  blockTracker: n
                }),
                o = R({
                  provider: r,
                  blockTracker: n
                });
              return o.events.on("notification", (function (e) {
                return a.emit("notification", e)
              })), a.push(L({
                origin: e
              })), a.push(j({
                origin: e
              })), a.push(s), a.push(o.middleware), a.push(D(r)), a
            }
          }, {
            key: "setupPublicConfig",
            value: function setupPublicConfig(e) {
              var t = I(this.publicConfigStore);
              O(t, e, (function (e) {
                t.destroy(), e && p.error(e)
              }))
            }
          }, {
            key: "privateSendUpdate",
            value: function privateSendUpdate() {
              this.emit("update", this.getState())
            }
          }, {
            key: "getPrivateKey",
            value: function getPrivateKey(t) {
              var a = C(t);
              if ("function" === typeof this.opts.storeProps) {
                var r = this.opts.storeProps(),
                  n = r.wallet;
                if (null == a) throw new Error("TxController - No address given.");
                if (null == n[a]) throw new Error("TxController - No private key accessible, please login.");
                return e.from(n[a], "hex")
              }
            }
          }, {
            key: "getPendingNonce",
            value: function getPendingNonce(e) {
              var t, a, r, n;
              return regeneratorRuntime.async((function getPendingNonce$(s) {
                while (1) switch (s.prev = s.next) {
                  case 0:
                    return s.next = 2, regeneratorRuntime.awrap(this.txController.nonceTracker.getNonceLock(e));
                  case 2:
                    return t = s.sent, a = t.nonceDetails, r = t.releaseLock, n = a.params.highestSuggested, r(), s.abrupt("return", n);
                  case 8:
                  case "end":
                    return s.stop()
                }
              }), null, this)
            }
          }, {
            key: "setCurrentCurrency",
            value: function setCurrentCurrency(e, t) {
              var a, r, n;
              return regeneratorRuntime.async((function setCurrentCurrency$(s) {
                while (1) switch (s.prev = s.next) {
                  case 0:
                    return a = this.networkController.getNetworkConfig(), r = a.ticker, s.prev = 1, this.currencyController.setNativeCurrency(r), this.currencyController.setCurrentCurrency(e), s.next = 6, regeneratorRuntime.awrap(this.currencyController.updateConversionRate());
                  case 6:
                    n = {
                      nativeCurrency: r || "ETH",
                      conversionRate: this.currencyController.getConversionRate(),
                      currentCurrency: this.currencyController.getCurrentCurrency(),
                      conversionDate: this.currencyController.getConversionDate()
                    }, t(null, n), s.next = 13;
                    break;
                  case 10:
                    s.prev = 10, s.t0 = s["catch"](1), t(s.t0);
                  case 13:
                  case "end":
                    return s.stop()
                }
              }), null, this, [
                [1, 10]
              ])
            }
          }, {
            key: "setCustomRpc",
            value: function setCustomRpc(e, t) {
              var a, r, n, s = arguments;
              return regeneratorRuntime.async((function setCustomRpc$(o) {
                while (1) switch (o.prev = o.next) {
                  case 0:
                    return a = s.length > 2 && void 0 !== s[2] ? s[2] : "ETH", r = s.length > 3 && void 0 !== s[3] ? s[3] : "", n = s.length > 4 && void 0 !== s[4] ? s[4] : {}, this.networkController.setRpcTarget(e, t, a, r, n), o.abrupt("return", e);
                  case 5:
                  case "end":
                    return o.stop()
                }
              }), null, this)
            }
          }]), TorusController
        }(d)
    }).call(this, a("1c35").Buffer)
  },
  "1a30": function (e, t, a) {
    e.exports = a.p + "img/eye-off-primary.42dd6131.svg"
  },
  "1a3e": function (e, t, a) {
    e.exports = a.p + "img/lend.01e1a697.svg"
  },
  "1b25": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-topup-simplex .help-icon[data-v-0d4c385a]{height:13px;vertical-align:middle}.wallet-topup-simplex .unique-hint[data-v-0d4c385a]  .v-text-field__details{display:none}.wallet-topup-simplex .unique-hint[data-v-0d4c385a]  .error--text .v-text-field__details{display:inherit}.wallet-topup-simplex .unique-hint .v-btn[data-v-0d4c385a]{border-style:dashed}", ""])
  },
  "1cbb": function (e, t, a) {
    e.exports = a.p + "img/bitmart.db15ec47.png"
  },
  "1cbd": function (e, t, a) {
    e.exports = a.p + "img/torus-logo-blue.7d2a4a6b.svg"
  },
  "1ccc": function (e, t, a) {
    e.exports = a.p + "img/apple-touch-icon.38cbd75d.png"
  },
  "1f40": function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "normalizeTxParams", (function () {
      return normalizeTxParams
    })), a.d(t, "validateTxParams", (function () {
      return validateTxParams
    })), a.d(t, "validateFrom", (function () {
      return validateFrom
    })), a.d(t, "validateRecipient", (function () {
      return validateRecipient
    })), a.d(t, "getFinalStates", (function () {
      return getFinalStates
    }));
    a("caad"), a("0d03"), a("d3b7"), a("25f0"), a("2532");
    var r = a("b671"),
      n = r.addHexPrefix,
      s = r.isValidAddress,
      o = {
        from: function from(e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          return t ? n(e).toLowerCase() : n(e)
        },
        to: function to(e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          return t ? n(e).toLowerCase() : n(e)
        },
        nonce: function nonce(e) {
          return n(e)
        },
        value: function value(e) {
          return n(e)
        },
        data: function data(e) {
          return n(e)
        },
        gas: function gas(e) {
          return n(e)
        },
        gasPrice: function gasPrice(e) {
          return n(e)
        }
      };

    function normalizeTxParams(e, t) {
      var a = {};
      for (var r in o) e[r] && (a[r] = o[r](e[r], t));
      return a
    }

    function validateTxParams(e) {
      if (validateFrom(e), validateRecipient(e), "value" in e) {
        var t = e.value.toString();
        if (t.includes("-")) throw new Error("Invalid transaction value of ".concat(e.value, " not a positive number."));
        if (t.includes(".")) throw new Error("Invalid transaction value of ".concat(e.value, " number must be in wei"))
      }
    }

    function validateFrom(e) {
      if ("string" !== typeof e.from) throw new Error("Invalid from address ".concat(e.from, " not a string"));
      if (!s(e.from)) throw new Error("Invalid from address")
    }

    function validateRecipient(e) {
      if ("0x" === e.to || null === e.to) {
        if (!e.data) throw new Error("Invalid recipient address");
        delete e.to
      } else if (void 0 !== e.to && !s(e.to)) throw new Error("Invalid recipient address");
      return e
    }

    function getFinalStates() {
      return ["rejected", "confirmed", "failed", "dropped"]
    }
  },
  "1fa6": function (e, t, a) {
    e.exports = a.p + "img/torus-logo-white.eec7a513.svg"
  },
  2: function (e, t) {},
  2068: function (e, t, a) {
    e.exports = a.p + "img/torus-icon-dark.ea746069.svg"
  },
  2172: function (e, t, a) {
    e.exports = a.p + "img/learn-more.20c75020.svg"
  },
  "21af": function (e, t, a) {
    e.exports = a.p + "img/spectiv.8220c9f8.svg"
  },
  "21ca": function (e, t, a) {
    e.exports = a.p + "img/gnosis.72200cb8.svg"
  },
  2291: function (e, t, a) {
    e.exports = a.p + "img/wallet.e04ea481.svg"
  },
  2328: function (e, t, a) {
    e.exports = a.p + "img/CryptoKitties-Kitty-13733.432a3a81.svg"
  },
  "233c": function (e, t, a) {
    e.exports = a.p + "img/synthetix.d2554190.svg"
  },
  "23c2": function (e, t, a) {
    e.exports = a.p + "img/file-text-grey.3c0068b4.svg"
  },
  "25b9": function (e, t, a) {
    e.exports = a.p + "img/MLNSymbol.9bce0945.png"
  },
  "274e": function (e, t, a) {
    e.exports = a.p + "img/groo.ea8ca8aa.png"
  },
  2798: function (e, t, a) {
    e.exports = a.p + "img/server.2dd0a266.svg"
  },
  "282b": function (e, t) {
    function createOriginMiddleware(e) {
      return function originMiddleware(t, a, r) {
        t.origin = e.origin, r()
      }
    }
    e.exports = createOriginMiddleware
  },
  2864: function (e, t, a) {
    e.exports = a.p + "img/Brickblock.51a2fc7d.svg"
  },
  2939: function (e, t, a) {
    e.exports = a.p + "img/IMP.9fb315e7.svg"
  },
  "2cb2": function (e, t, a) {
    e.exports = a.p + "img/viewly.9b6d623f.svg"
  },
  "2d00": function (e, t, a) {
    e.exports = a.p + "img/stasis-eurs.99a9d456.svg"
  },
  "2e86": function (e, t, a) {
    e.exports = a.p + "img/onlive.f360cd76.svg"
  },
  "2f05": function (e, t, a) {
    e.exports = a.p + "img/signature.4c470b92.svg"
  },
  3: function (e, t) {},
  3034: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-btn{text-transform:inherit}.v-input.v-input--is-readonly .v-input__slot{background:var(--v-disabled-base)}.theme--dark.v-input.v-input--is-readonly fieldset{border-color:var(--v-disabled-base)}.v-text-field__suffix{color:var(--v-text_2-base);font-size:14px}.navbar-line{box-sizing:border-box;border:1px solid #f2f2f2;height:2px}body,html{height:100%}@media only screen and (max-width:599px){.container{padding:12px 0}}", ""])
  },
  "322b": function (e, t, a) {
    "use strict";
    var r = a("b291"),
      n = a.n(r);
    n.a
  },
  3246: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return f
    }));
    a("a4d3"), a("e01a"), a("99af"), a("4de4"), a("7db0"), a("4160"), a("caad"), a("c975"), a("b0c0"), a("e439"), a("dbb4"), a("b64b"), a("d3b7"), a("2532"), a("159b");
    var r = a("284c"),
      n = (a("96cf"), a("2fa7")),
      s = a("9f12"),
      o = a("53fe");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(n["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var i = a("1131"),
      c = i.toChecksumAddress,
      l = a("5c7d"),
      d = a("c897"),
      u = a("5e5c"),
      p = a("db49").default,
      g = {
        allCollectibleContracts: {},
        allCollectibles: {},
        allTokens: {},
        collectibleContracts: [],
        collectibles: [],
        tokens: []
      },
      f = function () {
        function AssetController() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          Object(s["a"])(this, AssetController);
          var t = {
            accounts: {}
          };
          this.name = "AssetsController", this.store = new d(t), this.network = e.network, this.assetContractController = e.assetContractController, this.selectedAddress = e.selectedAddress, this.selectedAddress && this.store.updateState({
            accounts: Object(n["a"])({}, this.selectedAddress, g)
          }), this.jwtToken = ""
        }
        return Object(o["a"])(AssetController, [{
          key: "setSelectedAddress",
          value: function setSelectedAddress(e) {
            this.selectedAddress = e, Object.keys(this.store.getState().accounts).includes(e) || this.store.updateState({
              accounts: _objectSpread({}, this.store.getState().accounts, Object(n["a"])({}, e, g))
            })
          }
        }, {
          key: "setJwtToken",
          value: function setJwtToken(e) {
            this.jwtToken = e
          }
        }, {
          key: "getCollectibleApi",
          value: function getCollectibleApi(e, t) {
            return "https://api.opensea.io/api/v1/asset/".concat(e, "/").concat(t)
          }
        }, {
          key: "getCollectibleContractInformationApi",
          value: function getCollectibleContractInformationApi(e) {
            return "https://api.opensea.io/api/v1/asset_contract/".concat(e)
          }
        }, {
          key: "getCollectibleTokenURI",
          value: function getCollectibleTokenURI(e, t) {
            var a, r;
            return regeneratorRuntime.async((function getCollectibleTokenURI$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return n.prev = 0, n.next = 3, regeneratorRuntime.awrap(this.assetContractController.contractSupportsMetadataInterface(e));
                case 3:
                  if (a = n.sent, a) {
                    n.next = 6;
                    break
                  }
                  return n.abrupt("return", "");
                case 6:
                  return n.next = 8, regeneratorRuntime.awrap(assetsContract.getCollectibleTokenURI(e, t));
                case 8:
                  return r = n.sent, n.abrupt("return", r);
                case 12:
                  n.prev = 12, n.t0 = n["catch"](0), l.error(n.t0);
                case 15:
                case "end":
                  return n.stop()
              }
            }), null, this, [
              [0, 12]
            ])
          }
        }, {
          key: "getCollectibleInformationFromApi",
          value: function getCollectibleInformationFromApi(e, t) {
            var a, r, n, s, o, i;
            return regeneratorRuntime.async((function getCollectibleInformationFromApi$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  return a = this.getCollectibleApi(e, t), c.next = 3, regeneratorRuntime.awrap(u.get("".concat(p.api, "/opensea?url=").concat(encodeURIComponent(a)), {
                    headers: {
                      Authorization: "Bearer ".concat(this.jwtToken)
                    }
                  }));
                case 3:
                  return r = c.sent, n = r.data, s = n.name, o = n.description, i = n.image_original_url, c.abrupt("return", {
                    image: i,
                    name: s,
                    description: o
                  });
                case 6:
                case "end":
                  return c.stop()
              }
            }), null, this)
          }
        }, {
          key: "getCollectibleInformationFromTokenURI",
          value: function getCollectibleInformationFromTokenURI(e, t) {
            var a, r, n;
            return regeneratorRuntime.async((function getCollectibleInformationFromTokenURI$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  return s.next = 2, regeneratorRuntime.awrap(this.getCollectibleTokenURI(e, t));
                case 2:
                  return a = s.sent, s.next = 5, regeneratorRuntime.awrap(util.get(a));
                case 5:
                  return r = s.sent, n = Object.prototype.hasOwnProperty.call(r, "image") ? "image" : "image_url", s.abrupt("return", {
                    image: r[n],
                    name: r.name
                  });
                case 8:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "getCollectibleInformation",
          value: function getCollectibleInformation(e, t) {
            var a;
            return regeneratorRuntime.async((function getCollectibleInformation$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return r.prev = 0, r.next = 3, regeneratorRuntime.awrap(this.getCollectibleInformationFromApi(e, t));
                case 3:
                  if (a = r.sent, !a) {
                    r.next = 6;
                    break
                  }
                  return r.abrupt("return", a);
                case 6:
                  return r.next = 8, regeneratorRuntime.awrap(this.getCollectibleInformationFromTokenURI(e, t));
                case 8:
                  if (a = r.sent, !a) {
                    r.next = 11;
                    break
                  }
                  return r.abrupt("return", a);
                case 11:
                  return r.abrupt("return", {});
                case 14:
                  r.prev = 14, r.t0 = r["catch"](0), l.error(r.t0);
                case 17:
                case "end":
                  return r.stop()
              }
            }), null, this, [
              [0, 14]
            ])
          }
        }, {
          key: "getCollectibleContractInformationFromApi",
          value: function getCollectibleContractInformationFromApi(e) {
            var t, a, r, n, s, o, i, c;
            return regeneratorRuntime.async((function getCollectibleContractInformationFromApi$(l) {
              while (1) switch (l.prev = l.next) {
                case 0:
                  return t = this.getCollectibleContractInformationApi(e), l.next = 3, regeneratorRuntime.awrap(u.get("".concat(p.api, "/opensea?url=").concat(encodeURIComponent(t)), {
                    headers: {
                      Authorization: "Bearer ".concat(this.jwtToken)
                    }
                  }));
                case 3:
                  return a = l.sent, r = a.data, n = r.name, s = r.symbol, o = r.image_url, i = r.description, c = r.total_supply, l.abrupt("return", {
                    name: n,
                    symbol: s,
                    image_url: o,
                    description: i,
                    total_supply: c
                  });
                case 6:
                case "end":
                  return l.stop()
              }
            }), null, this)
          }
        }, {
          key: "getCollectibleContractInformationFromContract",
          value: function getCollectibleContractInformationFromContract(e) {
            var t, a, r;
            return regeneratorRuntime.async((function getCollectibleContractInformationFromContract$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return t = this.assetContractController, n.next = 3, regeneratorRuntime.awrap(t.getAssetName(e));
                case 3:
                  return a = n.sent, n.next = 6, regeneratorRuntime.awrap(t.getAssetSymbol(e));
                case 6:
                  return r = n.sent, n.abrupt("return", {
                    name: a,
                    symbol: r
                  });
                case 8:
                case "end":
                  return n.stop()
              }
            }), null, this)
          }
        }, {
          key: "getCollectibleContractInformation",
          value: function getCollectibleContractInformation(e) {
            var t;
            return regeneratorRuntime.async((function getCollectibleContractInformation$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  return a.prev = 0, a.next = 3, regeneratorRuntime.awrap(this.getCollectibleContractInformationFromApi(e));
                case 3:
                  if (t = a.sent, !t) {
                    a.next = 6;
                    break
                  }
                  return a.abrupt("return", t);
                case 6:
                  return a.next = 8, regeneratorRuntime.awrap(this.getCollectibleContractInformationFromContract(e));
                case 8:
                  if (t = a.sent, !t) {
                    a.next = 11;
                    break
                  }
                  return a.abrupt("return", t);
                case 11:
                  return a.abrupt("return", {});
                case 14:
                  a.prev = 14, a.t0 = a["catch"](0), l.error("getCollectibleContractInformation ", err);
                case 17:
                case "end":
                  return a.stop()
              }
            }), null, this, [
              [0, 14]
            ])
          }
        }, {
          key: "addIndividualCollectible",
          value: function addIndividualCollectible(e, t, a) {
            var s, o, i, d, u, p, g, f, v, h, m, b, x, y, w, k;
            return regeneratorRuntime.async((function addIndividualCollectible$(C) {
              while (1) switch (C.prev = C.next) {
                case 0:
                  if (C.prev = 0, s = c(e), o = this.selectedAddress, i = this.store.getState().accounts[o], d = i.allCollectibles, u = i.collectibles, p = this.network.getNetworkNameFromNetworkCode(), g = u.find((function (e) {
                      return e.address === s && e.tokenId === t
                    })), !g) {
                    C.next = 9;
                    break
                  }
                  return C.abrupt("return", u);
                case 9:
                  if (!a) {
                    C.next = 13;
                    break
                  }
                  C.t0 = a, C.next = 16;
                  break;
                case 13:
                  return C.next = 15, regeneratorRuntime.awrap(this.getCollectibleInformation(s, t));
                case 15:
                  C.t0 = C.sent;
                case 16:
                  return f = C.t0, v = f.name, h = f.image, m = f.description, b = {
                    address: s,
                    tokenId: t,
                    name: v,
                    image: h,
                    description: m
                  }, x = [].concat(Object(r["a"])(u), [b]), y = d[o], w = _objectSpread({}, y, {}, Object(n["a"])({}, p, x)), k = _objectSpread({}, d, {}, Object(n["a"])({}, o, w)), this.store.updateState({
                    accounts: _objectSpread({}, this.store.getState().accounts, Object(n["a"])({}, o, _objectSpread({}, i, {
                      allCollectibles: k,
                      collectibles: x
                    })))
                  }), C.abrupt("return", x);
                case 29:
                  C.prev = 29, C.t1 = C["catch"](0), l.error(C.t1);
                case 32:
                case "end":
                  return C.stop()
              }
            }), null, this, [
              [0, 29]
            ])
          }
        }, {
          key: "addToken",
          value: function addToken(e, t, a, s) {
            var o, i, d, u, p, g, f, v, h, m, b, x, y;
            return regeneratorRuntime.async((function addToken$(w) {
              while (1) switch (w.prev = w.next) {
                case 0:
                  return w.prev = 0, address = c(e), o = this.selectedAddress, i = this.store.getState().accounts[o], d = i.allTokens, u = i.tokens, p = this.network.getNetworkNameFromNetworkCode(), g = p.networkType, f = {
                    address: address,
                    symbol: t,
                    decimals: a,
                    image: s
                  }, v = u.find((function (e) {
                    return e.address === address
                  })), v ? (h = u.indexOf(v), u[h] = f) : u.push(f), m = d[o], b = Object.assign({}, m, Object(n["a"])({}, g, u)), x = Object.assign({}, d, Object(n["a"])({}, o, b)), y = Object(r["a"])(u), this.store.updateState({
                    accounts: _objectSpread({}, this.store.getState().accounts, Object(n["a"])({}, o, _objectSpread({}, i, {
                      allTokens: x,
                      tokens: y
                    })))
                  }), w.abrupt("return", y);
                case 17:
                  w.prev = 17, w.t0 = w["catch"](0), l.error(err);
                case 20:
                case "end":
                  return w.stop()
              }
            }), null, this, [
              [0, 17]
            ])
          }
        }, {
          key: "addCollectibleContract",
          value: function addCollectibleContract(e, t, a) {
            var s, o, i, l, d, u, p, g, f, v, h, m, b, x, y, w, k, C, A;
            return regeneratorRuntime.async((function addCollectibleContract$(T) {
              while (1) switch (T.prev = T.next) {
                case 0:
                  if (s = c(e), o = this.selectedAddress, i = this.store.getState().accounts[o], l = i.allCollectibleContracts, d = i.collectibleContracts, u = this.network.getNetworkNameFromNetworkCode(), p = d.find((function (e) {
                      return e.address === s
                    })), !p) {
                    T.next = 8;
                    break
                  }
                  return T.abrupt("return", d);
                case 8:
                  if (!a) {
                    T.next = 12;
                    break
                  }
                  g = {
                    name: a.contractName,
                    symbol: a.contractSymbol,
                    image_url: a.contractImage,
                    total_supply: a.contractSupply,
                    description: a.contractDescription
                  }, T.next = 15;
                  break;
                case 12:
                  return T.next = 14, regeneratorRuntime.awrap(this.getCollectibleContractInformation(s));
                case 14:
                  g = T.sent;
                case 15:
                  if (f = g, v = f.name, h = f.symbol, m = f.image_url, b = f.description, x = f.total_supply, (!t || m) && 0 !== Object.keys(g).length) {
                    T.next = 18;
                    break
                  }
                  return T.abrupt("return", d);
                case 18:
                  return y = {
                    address: s,
                    description: b,
                    logo: m,
                    name: v,
                    symbol: h,
                    totalSupply: x
                  }, w = [].concat(Object(r["a"])(d), [y]), k = l[o], C = _objectSpread({}, k, Object(n["a"])({}, u, w)), A = _objectSpread({}, l, Object(n["a"])({}, o, C)), this.store.updateState({
                    accounts: _objectSpread({}, this.store.getState().accounts, Object(n["a"])({}, o, _objectSpread({}, i, {
                      allCollectibleContracts: A,
                      collectibleContracts: w
                    })))
                  }), T.abrupt("return", w);
                case 25:
                case "end":
                  return T.stop()
              }
            }), null, this)
          }
        }, {
          key: "addCollectible",
          value: function addCollectible(e, t, a, r) {
            var n, s, o;
            return regeneratorRuntime.async((function addCollectible$(i) {
              while (1) switch (i.prev = i.next) {
                case 0:
                  return i.prev = 0, n = c(e), i.next = 4, regeneratorRuntime.awrap(this.addCollectibleContract(n, r, a));
                case 4:
                  if (s = i.sent, o = s.find((function (e) {
                      return e.address === n
                    })), !o) {
                    i.next = 9;
                    break
                  }
                  return i.next = 9, regeneratorRuntime.awrap(this.addIndividualCollectible(n, t, a));
                case 9:
                  i.next = 14;
                  break;
                case 11:
                  i.prev = 11, i.t0 = i["catch"](0), l.error(i.t0);
                case 14:
                case "end":
                  return i.stop()
              }
            }), null, this, [
              [0, 11]
            ])
          }
        }]), AssetController
      }()
  },
  3256: function (e, t, a) {
    var r = {
      "./torus-logo-blue.svg": "1cbd",
      "./torus-logo-white.svg": "1fa6"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "3256"
  },
  3290: function (e, t, a) {
    e.exports = a.p + "img/coindirect.814b399d.svg"
  },
  3355: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, "@media(max-width:598px){.bcg[data-v-25af4da3],.bcg-logo[data-v-25af4da3],.hide-xs[data-v-25af4da3]{display:none}}.selected-account[data-v-25af4da3]{cursor:pointer}.selected-account[data-v-25af4da3]:hover{background-color:var(--v-torus_reject_mild-base);opacity:.5;color:#fff}.selected-account.active[data-v-25af4da3]{background-color:var(--v-torus_active-base)}.divWrapSvgStyle[data-v-25af4da3],.svg-bcg-color[data-v-25af4da3]{background-color:var(--v-torus_svg_bcg-base)}.svg-setting-small[data-v-25af4da3]{width:24px;height:24px}.svg-setting-medium[data-v-25af4da3]{width:38px;height:38px}.divWrapSvgStyle[data-v-25af4da3],.svg-setting-large[data-v-25af4da3]{width:80px;height:80px}.divWrap[data-v-25af4da3],.divWrapSvgStyle[data-v-25af4da3]{justify-content:center;align-items:center}.spanWrap[data-v-25af4da3]{justify-content:start;align-items:center}.divWrap[data-v-25af4da3]{display:block}.divWrapSvgStyle[data-v-25af4da3]{border-radius:50%;box-shadow:0 0 3px rgba(0,0,0,.16)}.divWrapSvgStyle[data-v-25af4da3],.spanWrap[data-v-25af4da3]{display:inline-flex}.higherZ[data-v-25af4da3]{position:fixed;z-index:100;bottom:0;left:0;right:0;height:75px}.selected-account[data-v-25af4da3],.text-bluish[data-v-25af4da3]{color:var(--v-torus_blue-base)}.text-grayish[data-v-25af4da3]{color:var(--v-torus_reject-base)}.bcg[data-v-25af4da3]{position:relative}.bcg-logo[data-v-25af4da3]{height:32px}.bcg-top10[data-v-25af4da3]{right:20%;bottom:50%}hr[data-v-25af4da3]{display:block;height:1px;border:0;border-top:1px solid #ccc;margin:0 35% 0 15px;padding:0}.btnStyle[data-v-25af4da3]{width:141px;height:41px;border:#fff;border-radius:45px;box-shadow:0 3px 6px rgba(0,0,0,.16)}.v-card__text[data-v-25af4da3]{padding:12px}.card-upper-icon[data-v-25af4da3]{position:absolute;top:8px;right:8px;width:12px;height:12px}.v-divider[data-v-25af4da3]{margin:0 0 12px}.key-item[data-v-25af4da3]{max-width:200px;word-break:break-all;line-height:1em;margin-top:2px}.dialog-launcher[data-v-25af4da3]{cursor:pointer}.note-list .v-list-item[data-v-25af4da3]{min-height:inherit}.theme--dark.v-sheet[data-v-25af4da3],.theme--light.v-sheet[data-v-25af4da3]{background:transparent}.theme--dark.v-card[data-v-25af4da3],.theme--light.v-card[data-v-25af4da3]{background:var(--v-background_body_1-base)}.word-break[data-v-25af4da3]{word-break:break-all}[data-v-25af4da3] .v-expansion-panel .vjs-tree .vjs-value__string{color:var(--v-primary-base)!important}[data-v-25af4da3] .v-expansion-panel .vjs-tree .vjs-tree__brackets{color:grey!important;display:none}[data-v-25af4da3] .vjs-tree .vjs-tree__content.has-line{border-left:1px solid #bfcbd9}.v-expansion-panel[data-v-25af4da3]{background:transparent!important;margin-bottom:5px}.v-expansion-panel[data-v-25af4da3]:before{box-shadow:none;border-left:2px solid var(--v-primary-base);border-radius:0}.v-expansion-panel[data-v-25af4da3]:not(:first-child):after{border-top:0}.v-expansion-panel-header[data-v-25af4da3]{color:var(--v-primary-base)!important}.background_3[data-v-25af4da3],.typedMessageBox[data-v-25af4da3]{background:transparent!important}.asset-name[data-v-25af4da3]{line-height:35px}", ""])
  },
  3458: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".qr-container img[data-v-ca7c7bc0]{width:260px}", ""])
  },
  3488: function (e, t, a) {
    e.exports = a.p + "img/network.8191e409.svg"
  },
  "355e": function (e, t, a) {
    "use strict";
    var r = a("5dc1"),
      n = a.n(r);
    n.a
  },
  "364a": function (e, t, a) {
    e.exports = a.p + "img/torus-people.5e7d2e6f.png"
  },
  3668: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".privacy-security-container .v-sheet[data-v-096a6986]{background:transparent}", ""])
  },
  "36d0": function (e, t, a) {
    "use strict";
    var r = a("3887"),
      n = a.n(r);
    n.a
  },
  "36dc": function (e, t, a) {
    "use strict";
    a.r(t);
    a("d3b7"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("58f5"),
      o = a("fa7d"),
      i = o.hexToBn,
      c = o.BnMultiplyByFraction,
      l = o.bnToHex,
      d = a("b671"),
      u = d.addHexPrefix,
      p = "0x5208",
      g = function () {
        function TxGasUtil(e) {
          Object(r["a"])(this, TxGasUtil), this.query = new s(e)
        }
        return Object(n["a"])(TxGasUtil, [{
          key: "analyzeGasUsage",
          value: function analyzeGasUsage(e) {
            var t, a;
            return regeneratorRuntime.async((function analyzeGasUsage$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return r.next = 2, regeneratorRuntime.awrap(this.query.getBlockByNumber("latest", !1));
                case 2:
                  return t = r.sent, r.prev = 3, r.next = 6, regeneratorRuntime.awrap(this.estimateTxGas(e, t.gasLimit));
                case 6:
                  a = r.sent, r.next = 14;
                  break;
                case 9:
                  return r.prev = 9, r.t0 = r["catch"](3), e.simulationFails = {
                    reason: r.t0.message,
                    errorKey: r.t0.errorKey,
                    debug: {
                      blockNumber: t.number,
                      blockGasLimit: t.gasLimit
                    }
                  }, "transactionErrorNoContract" === r.t0.errorKey && (e.simulationFails.debug.getCodeResponse = r.t0.getCodeResponse), r.abrupt("return", e);
                case 14:
                  return this.setTxGas(e, t.gasLimit, a), r.abrupt("return", e);
                case 16:
                case "end":
                  return r.stop()
              }
            }), null, this, [
              [3, 9]
            ])
          }
        }, {
          key: "estimateTxGas",
          value: function estimateTxGas(e, t) {
            var a, r, n, s, o, d, u, g;
            return regeneratorRuntime.async((function estimateTxGas$(f) {
              while (1) switch (f.prev = f.next) {
                case 0:
                  if (a = e.txParams, e.gasLimitSpecified = Boolean(a.gas), !e.gasLimitSpecified) {
                    f.next = 4;
                    break
                  }
                  return f.abrupt("return", a.gas);
                case 4:
                  if (r = a.to, n = Boolean(r), !n) {
                    f.next = 20;
                    break
                  }
                  return f.next = 9, regeneratorRuntime.awrap(this.query.getCode(r));
                case 9:
                  if (s = f.sent, o = !s || "0x" === s || "0x0" === s, !o) {
                    f.next = 20;
                    break
                  }
                  if (!a.data) {
                    f.next = 17;
                    break
                  }
                  throw d = new Error("TxGasUtil - Trying to call a function on a non-contract address"), d.errorKey = "transactionErrorNoContract", d.getCodeResponse = s, d;
                case 17:
                  return a.gas = p, e.simpleSend = !0, f.abrupt("return", p);
                case 20:
                  return u = i(t), g = c(u, 19, 20), a.gas = l(g), f.abrupt("return", this.query.estimateGas(a));
                case 24:
                case "end":
                  return f.stop()
              }
            }), null, this)
          }
        }, {
          key: "setTxGas",
          value: function setTxGas(e, t, a) {
            e.estimatedGas = u(a);
            var r = e.txParams;
            if (e.gasLimitSpecified || e.simpleSend) e.estimatedGas = r.gas;
            else {
              var n = this.addGasBuffer(e.estimatedGas, t);
              r.gas = n
            }
          }
        }, {
          key: "addGasBuffer",
          value: function addGasBuffer(e, t) {
            var a = i(e),
              r = i(t),
              n = r.muln(.9),
              s = a.muln(1.5);
            return a.gt(n) ? l(a) : s.lt(n) ? l(s) : l(n)
          }
        }]), TxGasUtil
      }();
    t["default"] = g
  },
  3717: function (e, t, a) {
    var r = a("edaf");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("10064384", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  3735: function (e, t, a) {
    e.exports = a.p + "img/hydro.65d38460.png"
  },
  3783: function (e, t, a) {
    e.exports = a.p + "img/people_error.48898c3a.svg"
  },
  "37cf": function (e, t, a) {
    var r = {
      "./address-card-regular.svg": "c22f",
      "./blue_arrow_down.svg": "d94f",
      "./blue_arrow_right.svg": "5300",
      "./clock-regular.svg": "3851",
      "./coins.svg": "8f16",
      "./equal.svg": "9101",
      "./ethereum-rainbow.svg": "bba3",
      "./file-signature.svg": "b1c2",
      "./home-illustration.svg": "164e",
      "./lavender-mask-rtl.svg": "3c2b",
      "./lavender-mask.svg": "9291",
      "./learn-more-intro.svg": "0f7c",
      "./learn-more.svg": "2172",
      "./logos/0x.svg": "3f16",
      "./logos/0xbitcoin.svg": "9752",
      "./logos/1st.svg": "adb0",
      "./logos/BAT_icon.svg": "58e9",
      "./logos/Brickblock.svg": "2864",
      "./logos/CanYa.svg": "170f",
      "./logos/Cpollo.svg": "e996",
      "./logos/CryptoKitties-Kitty-13733.svg": "2328",
      "./logos/IMP.svg": "2939",
      "./logos/J8T.svg": "5c27",
      "./logos/RChain_logo.svg": "b815",
      "./logos/XSC_Logo.svg": "a442",
      "./logos/aeternity.svg": "b5aa",
      "./logos/aragon_isotype.svg": "60a2",
      "./logos/bcap.svg": "a1a6",
      "./logos/bcpt.svg": "f282",
      "./logos/bee_token.svg": "876a",
      "./logos/bitclave.svg": "46c1",
      "./logos/c20.svg": "f1b4",
      "./logos/coindirect-dark.svg": "f61a",
      "./logos/coindirect.svg": "3290",
      "./logos/dai.svg": "b241",
      "./logos/dether.svg": "d90f",
      "./logos/disciplina.svg": "e358",
      "./logos/divi.svg": "4af8",
      "./logos/dragonglass.svg": "c8b1",
      "./logos/edu.svg": "b7a6",
      "./logos/ens.svg": "d67d",
      "./logos/eth.svg": "0306",
      "./logos/fun.svg": "ea58",
      "./logos/gee-icon.svg": "cdf2",
      "./logos/gladius.svg": "a3ab",
      "./logos/gnosis.svg": "21ca",
      "./logos/golem.svg": "a6c8",
      "./logos/ink_protocol.svg": "6f95",
      "./logos/iqeon.svg": "1805",
      "./logos/knownorigin.svg": "f93b",
      "./logos/kucoin.svg": "b676",
      "./logos/kyber.svg": "4e44",
      "./logos/lend.svg": "1a3e",
      "./logos/like.svg": "a345",
      "./logos/logo-maker-4.svg": "af1f",
      "./logos/loom.svg": "ac9c",
      "./logos/metamark.svg": "7c92",
      "./logos/modum.svg": "ed34",
      "./logos/nanjcoin.svg": "ebed",
      "./logos/onlive.svg": "2e86",
      "./logos/pax.svg": "b2f7",
      "./logos/pinakion.svg": "7825",
      "./logos/playkey.svg": "c004",
      "./logos/plutus-god.svg": "cdb3",
      "./logos/polyswarm_nectar.svg": "4111",
      "./logos/quant-network.svg": "bc0f",
      "./logos/ren.svg": "922d",
      "./logos/rfr.svg": "11a2",
      "./logos/rlc.svg": "9ea8",
      "./logos/santiment.svg": "be5c",
      "./logos/singulardtv.svg": "fd99",
      "./logos/snt.svg": "e239",
      "./logos/spectiv.svg": "21af",
      "./logos/spn.svg": "8136",
      "./logos/stasis-eurs.svg": "2d00",
      "./logos/streamr.svg": "e125",
      "./logos/swarm.svg": "6866",
      "./logos/synthetix.svg": "233c",
      "./logos/synthetix_susd.svg": "3844",
      "./logos/tkn.svg": "bc4d",
      "./logos/viewly.svg": "2cb2",
      "./logos/wings_logo.svg": "7283",
      "./logos/wyvern-logo.svg": "66de",
      "./logos/xaurum_logo.svg": "698c",
      "./logos/yggdrash.svg": "3d15",
      "./logos/zilliqa.svg": "fb36",
      "./moon-pay-logo-white.svg": "0f6d",
      "./moon-pay-logo.svg": "a299",
      "./people_error.svg": "3783",
      "./plus.svg": "9718",
      "./signature.svg": "2f05",
      "./sync-blue.svg": "8c84",
      "./torus-circle.svg": "ab61",
      "./torus-logo-blue.svg": "1cbd",
      "./torus-logo-white.svg": "1fa6",
      "./torus-people-colored.svg": "b2da",
      "./user.svg": "1186",
      "./wallet-blue.svg": "a87c",
      "./wallet.svg": "1785",
      "./wallet_blue_line.svg": "8bc6",
      "./wyre-logo-white.svg": "b0b5",
      "./wyre-logo.svg": "ce20"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "37cf"
  },
  3844: function (e, t, a) {
    e.exports = a.p + "img/synthetix_susd.f8bf35bb.svg"
  },
  3851: function (e, t, a) {
    e.exports = a.p + "img/clock-regular.a06ef5d6.svg"
  },
  3877: function (e, t, a) {
    "use strict";
    var r = a("c0b7"),
      n = a.n(r);
    n.a
  },
  3887: function (e, t, a) {
    var r = a("74a2");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("926bedca", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "3c2b": function (e, t, a) {
    e.exports = a.p + "img/lavender-mask-rtl.39c09425.svg"
  },
  "3d15": function (e, t, a) {
    e.exports = a.p + "img/yggdrash.b3e0db2b.svg"
  },
  "3da9": function (e, t, a) {
    e.exports = a.p + "img/password.2d260bd4.svg"
  },
  "3db1": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-settings .v-expansion-panel[data-v-45dfa3ea]{background-color:transparent}.wallet-settings .v-expansion-panel[data-v-45dfa3ea]:before{box-shadow:none;border-bottom:1px solid var(--v-background_3-base);border-radius:0}.wallet-settings .v-expansion-panel .title[data-v-45dfa3ea],.wallet-settings .v-expansion-panel[data-v-45dfa3ea]  .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{color:var(--v-text_2-base)}.wallet-settings .v-expansion-panel--active+.v-expansion-panel[data-v-45dfa3ea],.wallet-settings .v-expansion-panel--active[data-v-45dfa3ea]:not(:first-child){margin-top:0}", ""])
  },
  "3df7": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".login-panel-left[data-v-1e0cc76e]{background-color:#fff}.login-panel-right[data-v-1e0cc76e]{background-image:url(/images/login-bg.png);background-repeat:no-repeat;background-position:0 0;background-size:auto 100%;background-color:#0364ff}.login-panel-right .caption[data-v-1e0cc76e]{width:80%;margin:auto}.login-btn[data-v-1e0cc76e]{width:70%}.login-btn[data-v-1e0cc76e]  .v-btn__content{justify-content:left}a[data-v-1e0cc76e]{text-decoration:none}.other-login-container[data-v-1e0cc76e]{margin:0 -4px}.other-login-container .other-login-btn[data-v-1e0cc76e]{border:2px solid #e9eaea;border-radius:2px;height:50px;margin-bottom:8px}.background-login[data-v-1e0cc76e]{color:#0f1222;position:relative}@media only screen and (min-width:1264px){.background-login[data-v-1e0cc76e]{background-size:100%}}.text-gray[data-v-1e0cc76e]{color:var(--v-text_1-lighten4)}.login-subtitle[data-v-1e0cc76e]{max-width:514px;margin:0 auto}.background-login[data-v-1e0cc76e],.default[data-v-1e0cc76e],body[data-v-1e0cc76e],html[data-v-1e0cc76e]{height:100%}body[data-v-1e0cc76e],html[data-v-1e0cc76e]{overflow-y:hidden}", ""])
  },
  "3e90": function (e, t, a) {
    var r = a("e452");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("715cead6", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "3eb7": function (e, t, a) {
    e.exports = a.p + "img/account-balance.6aeb9c23.svg"
  },
  "3ecf": function (e, t, a) {
    e.exports = a.p + "img/menu-primary.951cdc95.svg"
  },
  "3f16": function (e, t, a) {
    e.exports = a.p + "img/0x.c4faa69c.svg"
  },
  "3fc1": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-list--dense .v-list-item[data-v-5ad3ba69],.v-list-item--dense[data-v-5ad3ba69]{min-height:30px}", ""])
  },
  "3ff5": function (e, t, a) {
    var r = a("6696");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("1c0f48ee", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  4: function (e, t) {},
  "401e": function (e, t, a) {
    e.exports = a.p + "img/guppy.3ba9155b.png"
  },
  "402c": function (e, t, a) {
    "use strict";
    a("a4d3"), a("4de4"), a("4160"), a("e439"), a("dbb4"), a("b64b"), a("159b");
    var r = a("2fa7"),
      n = a("2b0e"),
      s = a("f309"),
      o = a("7134"),
      render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            width: "24px",
            height: "24px"
          },
          attrs: {
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M7,10L12,15L17,10H7Z"
          }
        })])
      },
      i = [],
      c = a("2877"),
      l = {},
      d = Object(c["a"])(l, render, i, !1, null, null, null),
      u = d.exports,
      SendIconvue_type_template_id_100bf5b0_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "20px",
            height: "12px",
            viewBox: "0 0 20 12",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("title", [e._v("113C096A-23A2-4982-B851-37BD5BB72DFB")]), a("desc", [e._v("Created with sketchtool.")]), a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Home-New-User",
            transform: "translate(-945.000000, -253.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Home-/-Main-Screen-no-money",
            transform: "translate(150.000000, 60.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-7",
            transform: "translate(744.000000, 178.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group",
            transform: "translate(49.000000, 9.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Indent-increase"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M12,7 L21,7",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M16,12 L21,12",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M12,17 L21,17",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M11,12 L3,12",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("polyline", {
          attrs: {
            id: "Stroke-9",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            points: "8 15 11 12 8 9"
          }
        })])])])])])])])
      },
      p = [],
      g = {},
      f = Object(c["a"])(g, SendIconvue_type_template_id_100bf5b0_render, p, !1, null, null, null),
      v = f.exports,
      AddIconvue_type_template_id_56a303c0_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
          }
        }), a("path", {
          attrs: {
            d: "M0 0h24v24H0z",
            fill: "none"
          }
        })])
      },
      h = [],
      m = {},
      b = Object(c["a"])(m, AddIconvue_type_template_id_56a303c0_render, h, !1, null, null, null),
      x = b.exports,
      SearchIconvue_type_template_id_25b928ed_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "13px",
            height: "14px",
            viewBox: "0 0 13 14",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("title", [e._v("D1544A7B-A7A4-4669-B6B4-B5420C4B7809")]), a("desc", [e._v("Created with sketchtool.")]), a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Home-Returning-User",
            transform: "translate(-429.000000, -485.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Home-/-Main-Screen-",
            transform: "translate(150.000000, 60.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-9",
            transform: "translate(0.000000, 411.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Search-Copy",
            transform: "translate(277.000000, 13.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "16",
            height: "16"
          }
        }), a("path", {
          attrs: {
            d: "M8.58333333,12 L7.41666667,12 C5.33333333,12 3.33333333,10 3.33333333,7.91666667 L3.33333333,\n                6.75 C3.33333333,4.66666667 5.33333333,2.66666667 7.41666667,2.66666667 L8.58333333,2.66666667 C10.6666667,\n                2.66666667 12.6666667,4.66666667 12.6666667,6.75 L12.6666667,7.91666667 C12.6666667,10 10.6666667,12 8.58333333,12 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M13.3333329,13.3333333 L11.2599996,11",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])])
      },
      y = [],
      w = {},
      k = Object(c["a"])(w, SearchIconvue_type_template_id_25b928ed_render, y, !1, null, null, null),
      C = k.exports,
      RefreshIconvue_type_template_id_a28bc99e_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "14px",
            viewBox: "0 0 16 14",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("title", [e._v("E1B764FF-ACA4-4767-81CD-A2CBACA53BC1")]), a("desc", [e._v("Created with sketchtool.")]), a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Home-Returning-User",
            transform: "translate(-483.000000, -484.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Home-/-Main-Screen-",
            transform: "translate(150.000000, 60.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-8",
            transform: "translate(333.000000, 422.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Chevron-big-down-Copy-2",
            transform: "translate(0.000000, 1.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "16",
            height: "16"
          }
        }), a("path", {
          attrs: {
            d: "M2.66666667,6 C2.66666667,4 4.66666667,2.66666667 7.25,2.66666667 L8.75,2.66666667 C11.3333333,\n                2.66666667 13.3333333,4 13.3333333,6.66666667",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M13.3333333,10 C13.3333333,12 11.3333333,13.3333333 8.75,13.3333333 L7.25,13.3333333 C4.66666667,\n                13.3333333 2.66666667,12 2.66666667,9.33333333",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("polyline", {
          attrs: {
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            points: "12 6.66666667 13.3333333 8 14.6666667 6.66666667"
          }
        }), a("polyline", {
          attrs: {
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            points: "4 9.33333333 2.66666667 8 1.33333333 9.33333333"
          }
        })])])])])])])
      },
      A = [],
      T = {},
      _ = Object(c["a"])(T, RefreshIconvue_type_template_id_a28bc99e_render, A, !1, null, null, null),
      S = _.exports,
      EthIconvue_type_template_id_120c4d76_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            "enable-background": "new 0 0 40 40"
          },
          attrs: {
            version: "1.1",
            id: "Layer_1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 40 40",
            "xml:space": "preserve"
          }
        }, [a("title", [e._v("deposit-eth")]), a("desc", [e._v("Created with Sketch.")]), a("g", {
          attrs: {
            id: "deposit-eth",
            transform: "translate(0.000000, 14.000000)"
          }
        }, [a("path", {
          attrs: {
            id: "Shape",
            fill: "#38393A",
            d: "M19.9,16L7.5,8.7L19.9,26L32.3,8.7L19.9,16L19.9,16z M20.1-14L7.7,6.4l12.4,7.3l12.4-7.2L20.1-14z"
          }
        })])])
      },
      O = [],
      E = {},
      I = Object(c["a"])(E, EthIconvue_type_template_id_120c4d76_render, O, !1, null, null, null),
      M = I.exports,
      QuestionIconvue_type_template_id_0844dbca_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "none",
            d: "M0 0h24v24H0z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 \n      18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 \n      4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
          }
        })])
      },
      P = [],
      R = {},
      L = Object(c["a"])(R, QuestionIconvue_type_template_id_0844dbca_render, P, !1, null, null, null),
      j = L.exports,
      RadioCheckedIconvue_type_template_id_0f4ce6c2_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 \n      12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 \n      3.58 8 8-3.58 8-8 8z"
          }
        }), a("path", {
          attrs: {
            d: "M0 0h24v24H0z",
            fill: "none"
          }
        })])
      },
      D = [],
      N = {},
      B = Object(c["a"])(N, RadioCheckedIconvue_type_template_id_0f4ce6c2_render, D, !1, null, null, null),
      V = B.exports,
      RadioUncheckedIconvue_type_template_id_05c26fd5_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
          }
        }), a("path", {
          attrs: {
            d: "M0 0h24v24H0z",
            fill: "none"
          }
        })])
      },
      F = [],
      U = {},
      H = Object(c["a"])(U, RadioUncheckedIconvue_type_template_id_05c26fd5_render, F, !1, null, null, null),
      G = H.exports,
      VisibilityOnIconvue_type_template_id_474fe50d_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "30px",
            height: "20px",
            viewBox: "0 0 30 20",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("title", [e._v("04CEE680-81BB-46C3-BC45-DFD097BA4D31")]), a("desc", [e._v("Created with sketchtool.")]), a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Settings->-Privacy-and-Security->-Private-Key",
            transform: "translate(-762.000000, -353.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group",
            transform: "translate(150.000000, 261.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Eye",
            transform: "translate(610.000000, 85.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "34",
            height: "34"
          }
        }), a("path", {
          attrs: {
            d: "M17,25.5 C5.95,25.5 4.25,17 4.25,17 C4.25,17 5.95,8.5 17,8.5 C28.05,8.5 29.75,17 29.75,17 C29.75,17 28.05,25.5 17,25.5 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M19.8333333,17 C19.8333333,18.564 18.564,19.8333333 17,19.8333333 C15.436,19.8333333 14.1666667,\n              18.564 14.1666667,17 C14.1666667,15.436 15.436,14.1666667 17,14.1666667 C18.564,14.1666667 19.8333333,15.436 19.8333333,17 Z",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])
      },
      K = [],
      Y = {},
      q = Object(c["a"])(Y, VisibilityOnIconvue_type_template_id_474fe50d_render, K, !1, null, null, null),
      z = q.exports,
      VisibilityOffIconvue_type_template_id_13fc132e_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "29px",
            height: "24px",
            viewBox: "0 0 29 24",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("title", [e._v("1B92CCE2-9B93-4F86-A062-7A2E91688D40")]), a("desc", [e._v("Created with sketchtool.")]), a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }, [a("g", {
          attrs: {
            id: "Settings->-Privacy-and-Security->-Private-Key-Expanded",
            transform: "translate(-763.000000, -351.000000)",
            stroke: "#A2A5B5",
            "stroke-width": "2.8"
          }
        }, [a("g", {
          attrs: {
            id: "Group-2",
            transform: "translate(150.000000, 261.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Eye-off",
            transform: "translate(615.000000, 92.000000)"
          }
        }, [a("path", {
          attrs: {
            d: "M18.0555556,5.71428571 L23.6111111,0",
            id: "Stroke-1"
          }
        }), a("path", {
          attrs: {
            d: "M18.0555556,0 L23.6111111,5.71428571",
            id: "Stroke-3"
          }
        }), a("path", {
          attrs: {
            d: "M25,11.4285714 C25,11.4285714 23.3333333,20 12.5,20 C1.66666667,20 0,11.4285714 0,\n              11.4285714 C0,11.4285714 1.66666667,2.85714286 12.5,2.85714286",
            id: "Stroke-5"
          }
        }), a("path", {
          attrs: {
            d: "M15.2777778,11.4285714 C15.2777778,13.0057143 14.0333333,14.2857143 12.5,\n              14.2857143 C10.9666667,14.2857143 9.72222222,13.0057143 9.72222222,11.4285714 C9.72222222,\n              9.85142857 10.9666667,8.57142857 12.5,8.57142857 C14.0333333,8.57142857 15.2777778,9.85142857 15.2777778,11.4285714 Z",
            id: "Stroke-7"
          }
        })])])])])])
      },
      W = [],
      Q = {},
      J = Object(c["a"])(Q, VisibilityOffIconvue_type_template_id_13fc132e_render, W, !1, null, null, null),
      Z = J.exports,
      ArrowUpCircleIconvue_type_template_id_b624eb1a_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M13,18H11V10L7.5,13.5L6.08,12.08L12,6.16L17.92,12.08L16.5,13.5L13,10V18M12,2A10,\n      10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,\n      12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
          }
        })])
      },
      X = [],
      $ = {},
      ee = Object(c["a"])($, ArrowUpCircleIconvue_type_template_id_b624eb1a_render, X, !1, null, null, null),
      te = ee.exports,
      ArrowDownCircleIconvue_type_template_id_7056635f_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M11,6H13V14L16.5,10.5L17.92,11.92L12,17.84L6.08,11.92L7.5,10.5L11,14V6M12,22A10,\n      10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,20A8,8 0 0,0 20,\n      12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20Z"
          }
        })])
      },
      ae = [],
      re = {},
      ne = Object(c["a"])(re, ArrowDownCircleIconvue_type_template_id_7056635f_render, ae, !1, null, null, null),
      se = ne.exports,
      ArrowLeftCircleIconvue_type_template_id_4d7fb9c9_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M18,11V13H10L13.5,16.5L12.08,17.92L6.16,12L12.08,6.08L13.5,7.5L10,11H18M2,12A10,\n      10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M4,12A8,8 0 0,0 12,\n      20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12Z"
          }
        })])
      },
      oe = [],
      ie = {},
      ce = Object(c["a"])(ie, ArrowLeftCircleIconvue_type_template_id_4d7fb9c9_render, oe, !1, null, null, null),
      le = ce.exports,
      ArrowRightCircleIconvue_type_template_id_57c40ec1_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M6,13V11H14L10.5,7.5L11.92,6.08L17.84,12L11.92,17.92L10.5,16.5L14,13H6M22,12A10,\n      10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M20,12A8,\n      8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12Z"
          }
        })])
      },
      de = [],
      ue = {},
      pe = Object(c["a"])(ue, ArrowRightCircleIconvue_type_template_id_57c40ec1_render, de, !1, null, null, null),
      ge = pe.exports,
      CoinsSendIconvue_type_template_id_a3a4f526_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            "enable-background": "new 0 0 80 80"
          },
          attrs: {
            version: "1.1",
            id: "Layer_1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 80 80",
            "xml:space": "preserve"
          }
        }, [a("g", [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M13.8,22c-7.4,7.5-3.6,23.1,8.7,35.4C30.7,65.6,40.1,70,47.8,70c4.1,0,7.6-1.2,10.2-3.8l8.2-8.2c2.3-2.2,3.6-5.4,3.8-9.1\n\t\tc0.1-1-0.7-1.8-1.7-1.9c-1,0-1.8,0.7-1.9,1.7c-0.2,2.8-1.1,5.1-2.7,6.8c-5.8,5.8-19.8,1.9-30.4-8.7s-14.7-24.5-8.7-30.4\n\t\tc4.2-4.2,13.2-3.4,22,2c0.9,0.4,1.9,0.2,2.5-0.6c0.4-0.9,0.2-1.9-0.6-2.5C38,8.8,27.7,8.2,22.1,13.8L13.8,22z M18.4,22.5\n\t\tc-0.1,1.1-0.1,2.3,0,3.4l-4.7,4.7c0.3-2.4,1.1-4.5,2.7-6.1L18.4,22.5z M16.4,43l5.6-5.6c0.6,1.2,1.4,2.6,2.2,3.8l-5.7,5.7\n\t\tC17.8,45.6,17.1,44.3,16.4,43z M20.6,49.8l5.7-5.7c1,1.3,2.1,2.7,3.3,3.9l-5.7,5.7C22.7,52.5,21.6,51.2,20.6,49.8z M26.3,56.2\n\t\tl5.7-5.7c1.2,1.1,2.6,2.2,3.8,3.2l-5.7,5.7C28.9,58.4,27.6,57.4,26.3,56.2z M33.1,61.5l5.7-5.7c1.2,0.8,2.6,1.5,3.8,2.2L37,63.6\n\t\tC35.7,63,34.5,62.3,33.1,61.5z M40.5,65.1l5.5-5.5c1.2,0.4,2.5,0.9,3.7,1.2l-5.2,5.2C43.2,65.9,41.9,65.6,40.5,65.1z M15,39.3\n\t\tc-0.5-1.3-0.8-2.7-1.1-3.9l5.2-5.2c0.4,1.2,0.7,2.5,1.2,3.7L15,39.3z M57.4,61.8l-2,2c-1.6,1.6-3.7,2.5-6.3,2.7l4.8-4.8\n\t\tc0.8,0,1.5,0.1,2.2,0.1C56.6,61.8,57,61.8,57.4,61.8z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M69.5,35.3c0.7-0.7,0.7-1.8,0-2.5l-7-7c0,0,0,0,0,0c-0.7-0.7-1.8-0.7-2.5,0c-0.7,0.7-0.7,1.8,0,2.5l4,4H52.3\n\t\tc-1,0-1.7,0.8-1.7,1.7s0.8,1.7,1.7,1.7h11.8l-4,4c-0.6,0.7-0.6,1.7,0,2.4c0.7,0.7,1.8,0.7,2.5,0L69.5,35.3z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M35.3,34c0,1,0.8,1.7,1.7,1.7h0.2c1,0,1.7-0.8,1.7-1.7s-0.8-1.7-1.7-1.7h-0.2C36.1,32.3,35.3,33.1,35.3,34z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M43.3,34c0,1,0.8,1.7,1.7,1.7h0.1c1,0,1.7-0.8,1.7-1.7s-0.8-1.7-1.7-1.7H45C44.1,32.3,43.3,33.1,43.3,34z"
          }
        })])])
      },
      fe = [],
      ve = {},
      he = Object(c["a"])(ve, CoinsSendIconvue_type_template_id_a3a4f526_render, fe, !1, null, null, null),
      me = he.exports,
      CoinsReceiveIconvue_type_template_id_8556b7d0_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            "enable-background": "new 0 0 80 80"
          },
          attrs: {
            version: "1.1",
            id: "Layer_1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 80 80",
            "xml:space": "preserve"
          }
        }, [a("g", [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M13.8,22c-7.4,7.5-3.6,23.1,8.7,35.4C30.7,65.6,40.1,70,47.8,70c4.1,0,7.6-1.2,10.2-3.8l8.2-8.2c2.3-2.2,3.6-5.4,3.8-9.1\n\t\tc0.1-1-0.7-1.8-1.7-1.9c-1,0-1.8,0.7-1.9,1.7c-0.2,2.8-1.1,5.1-2.7,6.8c-5.8,5.8-19.8,1.9-30.4-8.7s-14.7-24.5-8.7-30.4\n\t\tc4.2-4.2,13.2-3.4,22,2c0.9,0.4,1.9,0.2,2.5-0.6c0.4-0.9,0.2-1.9-0.6-2.5C38,8.8,27.7,8.2,22.1,13.8L13.8,22z M18.4,22.5\n\t\tc-0.1,1.1-0.1,2.3,0,3.4l-4.7,4.7c0.3-2.4,1.1-4.5,2.7-6.1L18.4,22.5z M16.4,43l5.6-5.6c0.6,1.2,1.4,2.6,2.2,3.8l-5.7,5.7\n\t\tC17.8,45.6,17.1,44.3,16.4,43z M20.6,49.8l5.7-5.7c1,1.3,2.1,2.7,3.3,3.9l-5.7,5.7C22.7,52.5,21.6,51.2,20.6,49.8z M26.3,56.2\n\t\tl5.7-5.7c1.2,1.1,2.6,2.2,3.8,3.2l-5.7,5.7C28.9,58.4,27.6,57.4,26.3,56.2z M33.1,61.5l5.7-5.7c1.2,0.8,2.6,1.5,3.8,2.2L37,63.6\n\t\tC35.7,63,34.5,62.3,33.1,61.5z M40.5,65.1l5.5-5.5c1.2,0.4,2.5,0.9,3.7,1.2l-5.2,5.2C43.2,65.9,41.9,65.6,40.5,65.1z M15,39.3\n\t\tc-0.5-1.3-0.8-2.7-1.1-3.9l5.2-5.2c0.4,1.2,0.7,2.5,1.2,3.7L15,39.3z M57.4,61.8l-2,2c-1.6,1.6-3.7,2.5-6.3,2.7l4.8-4.8\n\t\tc0.8,0,1.5,0.1,2.2,0.1C56.6,61.8,57,61.8,57.4,61.8z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M42.8,42.2c0.7,0.7,1.8,0.6,2.5,0c0.6-0.7,0.6-1.7,0-2.4l-4-4H53c1,0,1.7-0.8,1.7-1.7c0-1-0.8-1.7-1.7-1.7H41.3l4-4\n\t\tc0.7-0.7,0.7-1.8,0-2.5c-0.7-0.7-1.8-0.7-2.5,0c0,0,0,0,0,0l-7,7c-0.7,0.7-0.7,1.8,0,2.5L42.8,42.2z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M68.3,32.3h-0.2c-1,0-1.7,0.8-1.7,1.7s0.8,1.7,1.7,1.7h0.2c1,0,1.7-0.8,1.7-1.7S69.2,32.3,68.3,32.3z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M60.3,32.3L60.3,32.3c-1.1,0-1.8,0.8-1.8,1.7s0.8,1.7,1.7,1.7h0.1c1,0,1.7-0.8,1.7-1.7S61.3,32.3,60.3,32.3z"
          }
        })])])
      },
      be = [],
      xe = {},
      ye = Object(c["a"])(xe, CoinsReceiveIconvue_type_template_id_8556b7d0_render, be, !1, null, null, null),
      we = ye.exports,
      CoinsTopupIconvue_type_template_id_2554bb16_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            "enable-background": "new 0 0 80 80"
          },
          attrs: {
            version: "1.1",
            id: "Layer_1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 80 80",
            "xml:space": "preserve"
          }
        }, [a("g", [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M13.7,22.2c-7.4,7.4-3.6,22.8,8.7,35.1c8.1,8.1,17.4,12.4,25,12.4c4,0,7.5-1.2,10.1-3.8l8.1-8.1c2.3-2.2,3.6-5.3,3.8-9\n\t\tc0.1-1-0.7-1.8-1.7-1.8c-1,0-1.8,0.7-1.8,1.7c-0.2,2.8-1.1,5.1-2.7,6.7c-5.8,5.8-19.6,1.8-30.1-8.7s-14.5-24.2-8.7-30.1\n\t\tc4.2-4.2,13-3.4,21.8,2c0.9,0.4,1.9,0.2,2.5-0.6c0.4-0.9,0.2-1.9-0.6-2.5C37.7,9.1,27.5,8.5,22,14L13.7,22.2z M18.3,22.7\n\t\tc-0.1,1.1-0.1,2.3,0,3.4l-4.6,4.6c0.3-2.4,1.1-4.5,2.6-6L18.3,22.7z M16.4,42.9l5.5-5.5c0.6,1.2,1.4,2.5,2.2,3.8l-5.6,5.6\n\t\tC17.7,45.6,17,44.2,16.4,42.9z M20.5,49.8l5.7-5.7c1,1.3,2.1,2.6,3.2,3.9l-5.7,5.7C22.6,52.4,21.5,51.1,20.5,49.8z M26.2,56.1\n\t\tl5.7-5.7c1.2,1.1,2.5,2.2,3.8,3.2l-5.7,5.7C28.7,58.2,27.4,57.2,26.2,56.1z M32.9,61.3l5.6-5.6c1.2,0.8,2.5,1.5,3.8,2.2l-5.5,5.5\n\t\tC35.5,62.8,34.2,62.1,32.9,61.3z M40.2,64.9l5.4-5.4c1.2,0.4,2.5,0.9,3.7,1.2l-5.2,5.2C42.9,65.7,41.6,65.3,40.2,64.9z M15,39.3\n\t\tc-0.5-1.3-0.8-2.6-1.1-3.9l5.2-5.2c0.4,1.2,0.7,2.5,1.2,3.7L15,39.3z M57,61.6l-2,2c-1.6,1.6-3.7,2.5-6.2,2.6l4.7-4.7\n\t\tc0.8,0,1.5,0.1,2.2,0.1C56.1,61.6,56.5,61.6,57,61.6z"
          }
        }), a("path", {
          attrs: {
            fill: "currentColor",
            d: "M60.7,47.4v-7.9h7.9c0.7,0,1.3-0.6,1.3-1.3v-6.5c0-0.7-0.6-1.3-1.3-1.3h-7.9v-7.9c0-0.7-0.6-1.3-1.3-1.3h-6.5\n\t\tc-0.7,0-1.3,0.6-1.3,1.3v7.9h-7.9c-0.7,0-1.3,0.6-1.3,1.3v6.5c0,0.7,0.6,1.3,1.3,1.3h7.9v7.9c0,0.7,0.6,1.3,1.3,1.3h6.5\n\t\tC60.2,48.7,60.8,48.1,60.7,47.4L60.7,47.4z M59.4,36.7c-0.7,0-1.3,0.6-1.3,1.3V46h-3.8v-7.9c0-0.7-0.6-1.3-1.3-1.3h-8v-3.8h7.9\n\t\tc0.7,0,1.3-0.6,1.3-1.3v-7.9H58v7.9c0,0.7,0.6,1.3,1.3,1.3h7.9v3.8H59.4z"
          }
        })])])
      },
      ke = [],
      Ce = {},
      Ae = Object(c["a"])(Ce, CoinsTopupIconvue_type_template_id_2554bb16_render, ke, !1, null, null, null),
      Te = Ae.exports,
      ChevronLeftIconvue_type_template_id_44bc4868_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
          }
        })])
      },
      _e = [],
      Se = {},
      Oe = Object(c["a"])(Se, ChevronLeftIconvue_type_template_id_44bc4868_render, _e, !1, null, null, null),
      Ee = Oe.exports,
      ChevronRightIconvue_type_template_id_3ab19df1_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            version: "1.1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          }
        })])
      },
      Ie = [],
      Me = {},
      Pe = Object(c["a"])(Me, ChevronRightIconvue_type_template_id_3ab19df1_render, Ie, !1, null, null, null),
      Re = Pe.exports,
      ChevronDoubleRightIconvue_type_template_id_4050e4d8_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          staticStyle: {
            width: "24px",
            height: "24px"
          },
          attrs: {
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z"
          }
        })])
      },
      Le = [],
      je = {},
      De = Object(c["a"])(je, ChevronDoubleRightIconvue_type_template_id_4050e4d8_render, Le, !1, null, null, null),
      Ne = De.exports,
      ScanIconvue_type_template_id_9da09ca6_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "16px",
            viewBox: "0 0 16 16",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-3",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Dark-theme-normal-state",
            transform: "translate(-704.000000, -296.000000)",
            fill: "currentColor",
            "fill-rule": "nonzero"
          }
        }, [a("g", {
          attrs: {
            id: "scan",
            transform: "translate(704.000000, 296.000000)"
          }
        }, [a("path", {
          attrs: {
            d: "\n            M0.00165775401,15.1186631 L0.00165775401,12.2660428 C0.00165775401,11.7934997 0.384729626,11.4104278\n            0.857272727,11.4104278 C1.32981583,11.4104278 1.7128877,11.7934997 1.7128877,12.2660428 L1.7128877,14.2630481\n            L3.70989305,14.2630481 C4.18243615,14.2630481 4.56550802,14.64612 4.56550802,15.1186631 C4.56550802,15.5912062\n            4.18243615,15.9742781 3.70989305,15.9742781 L0.857272727,15.9742781 C0.384729626,15.9742781\n            0.00165775401,15.5912062 0.00165775401,15.1186631 L0.00165775401,15.1186631 Z M14.2630481,14.2630481\n            L14.2630481,12.2660428 C14.2630481,11.7934997 14.64612,11.4104278 15.1186631,11.4104278 C15.5912062,11.4104278\n            15.9742781,11.7934997 15.9742781,12.2660428 L15.9742781,15.1186631 C15.9742781,15.5912062 15.5912062,15.9742781\n            15.1186631,15.9742781 L12.2660428,15.9742781 C11.7934997,15.9742781 11.4104278,15.5912062 11.4104278,15.1186631\n            C11.4104278,14.64612 11.7934997,14.2630481 12.2660428,14.2630481 L14.2630481,14.2630481 L14.2630481,14.2630481 Z\n            M15.9742781,0.857272727 L15.9742781,3.70989305 C15.9742781,4.18243615 15.5912062,4.56550802 15.1186631,4.56550802\n            C14.64612,4.56550802 14.2630481,4.18243615 14.2630481,3.70989305 L14.2630481,1.7128877 L12.2660428,1.7128877\n            C11.7934997,1.7128877 11.4104278,1.32981583 11.4104278,0.857272727 C11.4104278,0.384729626 11.7934997,0.00165775401\n            12.2660428,0.00165775401 L15.1186631,0.00165775401 C15.5912062,0.00165775401 15.9742781,0.384729626\n            15.9742781,0.857272727 L15.9742781,0.857272727 Z M1.7128877,1.7128877 L1.7128877,3.70989305 C1.7128877,4.18243615\n            1.32981583,4.56550802 0.857272727,4.56550802 C0.384729626,4.56550802 0.00165775401,4.18243615\n            0.00165775401,3.70989305 L0.00165775401,0.857272727 C0.00165775401,0.384729626 0.384729626,0.00165775401\n            0.857272727,0.00165775401 L3.70989305,0.00165775401 C4.18243615,0.00165775401 4.56550802,0.384729626\n            4.56550802,0.857272727 C4.56550802,1.32981583 4.18243615,1.7128877 3.70989305,1.7128877 L1.7128877,1.7128877\n            L1.7128877,1.7128877 Z M3.70989305,7.13235294 L12.2660428,7.13235294 C12.7385859,7.13235294 13.1216578,7.51542481\n            13.1216578,7.98796791 C13.1216578,8.46051102 12.7385859,8.84358289 12.2660428,8.84358289 L3.70989305,8.84358289\n            C3.23734996,8.84358289 2.85427811,8.460511 2.85427811,7.98796791 C2.85427811,7.51542483 3.23734996,7.13235294\n            3.70989305,7.13235294 Z",
            id: "Shape"
          }
        })])])])])
      },
      Be = [],
      Ve = {},
      Fe = Object(c["a"])(Ve, ScanIconvue_type_template_id_9da09ca6_render, Be, !1, null, null, null),
      Ue = Fe.exports,
      NetworkIconvue_type_template_id_4e82f1a4_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "12px",
            height: "12px",
            viewBox: "0 0 12 12",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-4",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Desktop-Tx-(New)-Copy",
            transform: "translate(-24.000000, -71.000000)",
            fill: "currentColor",
            "fill-rule": "nonzero"
          }
        }, [a("g", {
          attrs: {
            id: "Group-2",
            transform: "translate(24.000000, 68.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "network",
            transform: "translate(0.000000, 3.000000)"
          }
        }, [a("path", {
          attrs: {
            d: "\n              M10.4562495,7.45270693 C11.2289893,7.45514445 11.8765126,6.86883072 11.9505687,6.09964389 \n              C12.0246248,5.33045706 11.5008576,4.63137331 10.7418471,4.48633629 C9.98283657,4.34129927 \n              9.23821209,4.79800989 9.02344306,5.54030831 L5.28819625,5.54030831 L7.37969566,1.91252199 \n              L9.02344306,1.91252199 C9.23059238,2.6284986 9.93304361,3.08289425 10.6710071,2.97828412 \n              C11.4089705,2.87367399 11.9575377,2.24195121 11.9575377,1.49661012 C11.9575377,0.751269021 \n              11.4089705,0.119546236 10.6710071,0.0149361092 C9.93304361,-0.0896740182 9.23059238,0.36472163 \n              9.02344306,1.08069824 L6.9001035,1.08069824 L4.32901193,5.54030831 L2.93401565,5.54030831 \n              C2.72686633,4.8243317 2.0244151,4.36993605 1.28645164,4.47454618 C0.548488178,4.5791563 \n              -1.60198344e-07,5.21087909 -1.60198344e-07,5.95622018 C-1.60198344e-07,6.70156128 0.548488178,\n              7.33328406 1.28645164,7.43789419 C2.0244151,7.54250432 2.72686633,7.08810867 2.93401565,6.37213205 \n              L4.32901193,6.37213205 L6.9001035,10.8596023 L9.02344306,10.8596023 C9.23059238,11.5755789 \n              9.93304361,12.0299745 10.6710071,11.9253644 C11.4089705,11.8207543 11.9575377,11.1890315 \n              11.9575377,10.4436904 C11.9575377,9.69834928 11.4089705,9.0666265 10.6710071,8.96201637 \n              C9.93304361,8.85740625 9.23059238,9.3118019 9.02344306,10.0277785 L7.37969566,10.0277785 \n              L5.28421623,6.37213205 L9.02344306,6.37213205 C9.20698232,7.01130101 9.791251,7.45193697 \n              10.4562495,7.45270693 Z",
            id: "Path"
          }
        })])])])])])
      },
      He = [],
      Ge = {},
      Ke = Object(c["a"])(Ge, NetworkIconvue_type_template_id_4e82f1a4_render, He, !1, null, null, null),
      Ye = Ke.exports,
      LockIconvue_type_template_id_0288fde7_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "32px",
            height: "36px",
            viewBox: "0 0 32 36",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Settings-Expanded",
            transform: "translate(-158.000000, -204.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-5",
            transform: "translate(150.000000, 198.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Lock"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            "fill-rule": "evenodd",
            opacity: "0",
            x: "0",
            y: "0",
            width: "48",
            height: "48"
          }
        }), a("path", {
          attrs: {
            d: "M24,40 C12,40 10,38 10,30 C10,22 12,20 24,20 C36,20 38,22 38,30 C38,38 36,40 24,40 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M16.039,20.58 C16.019,19.89 15.999,19.148 15.999,18.354 C15.999,10 17.999,8 23.999,8 \n            C29.999,8 31.999,10 31.999,18.354 C31.999,19.148 31.981,19.89 31.961,20.58",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M24,28 L24,32",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])
      },
      qe = [],
      ze = {},
      We = Object(c["a"])(ze, LockIconvue_type_template_id_0288fde7_render, qe, !1, null, null, null),
      Qe = We.exports,
      KeyIconvue_type_template_id_c9ed2416_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "28px",
            height: "26px",
            viewBox: "0 0 28 26",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Settings-Expanded",
            transform: "translate(-231.000000, -308.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-5",
            transform: "translate(150.000000, 198.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Key",
            transform: "translate(77.000000, 104.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            "fill-rule": "evenodd",
            opacity: "0",
            x: "0",
            y: "0",
            width: "36",
            height: "36"
          }
        }), a("path", {
          attrs: {
            d: "M12,30 C7.5,30 6,28.5 6,24 C6,19.5 7.5,18 12,18 C16.5,18 18,19.5 18,24 C18,28.5 16.5,30 12,30 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M28.5,7.5 L16.6875,19.3125",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("polyline", {
          attrs: {
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            points: "26.25 9.75 30 13.5 25.5 18 21.75 14.25"
          }
        })])])])])])
      },
      Je = [],
      Ze = {},
      Xe = Object(c["a"])(Ze, KeyIconvue_type_template_id_c9ed2416_render, Je, !1, null, null, null),
      $e = Xe.exports,
      ListIconvue_type_template_id_49a2016f_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "12px",
            viewBox: "0 0 16 12",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Icons",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Faticons",
            transform: "translate(-559.000000, -319.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-List",
            transform: "translate(554.000000, 313.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            "fill-rule": "evenodd",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M10,7 L15,7",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M10,12 L20,12",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M10,17 L18,17",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M7,7 C7,7.552 6.553,8 6,8 C5.447,8 5,7.552 5,7 C5,6.448 5.447,6 6,6 C6.553,6 7,6.448 7,7",
            id: "Fill-7",
            fill: "currentColor",
            "fill-rule": "evenodd"
          }
        }), a("path", {
          attrs: {
            d: "M7,17 C7,17.552 6.553,18 6,18 C5.447,18 5,17.552 5,17 C5,16.448 5.447,16 6,16 C6.553,16 7,16.448 7,17",
            id: "Fill-9",
            fill: "currentColor",
            "fill-rule": "evenodd"
          }
        }), a("path", {
          attrs: {
            d: "M7,12 C7,12.552 6.553,13 6,13 C5.447,13 5,12.552 5,12 C5,11.448 5.447,11 6,11 C6.553,11 7,11.448 7,12",
            id: "Fill-11",
            fill: "currentColor",
            "fill-rule": "evenodd"
          }
        })])])])])
      },
      et = [],
      tt = {},
      at = Object(c["a"])(tt, ListIconvue_type_template_id_49a2016f_render, et, !1, null, null, null),
      rt = at.exports,
      GlobeIconvue_type_template_id_c7e18afa_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "40px",
            height: "40px",
            viewBox: "0 0 40 40",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Settings-Expanded",
            transform: "translate(-154.000000, -441.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-5",
            transform: "translate(150.000000, 198.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Globe",
            transform: "translate(0.000000, 239.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            "fill-rule": "evenodd",
            opacity: "0",
            x: "0",
            y: "0",
            width: "48",
            height: "48"
          }
        }), a("path", {
          attrs: {
            d: "M26.25,41.9998 L21.75,41.9998 C13.05,41.9998 6,34.9498 6,26.2498 L6,21.7498 C6,13.0498 \n              13.05,5.9998 21.75,5.9998 L26.25,5.9998 C34.95,5.9998 42,13.0498 42,21.7498 L42,26.2498 C42,34.9498 \n              34.95,41.9998 26.25,41.9998 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M24.7032,42.0038 C19.5192,39.1958 15.9992,33.7078 15.9992,27.3978 L15.9992,20.6018 C15.9992,14.2978 19.5132,8.8138 24.6872,6.0038",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M22,42.0038 C27.184,39.1958 30.704,33.7078 30.704,27.3978 L30.704,20.6018 C30.704,14.2978 27.19,8.8138 22.014,6.0038",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M42,23.9998 L6,23.9998",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])
      },
      nt = [],
      st = {},
      ot = Object(c["a"])(st, GlobeIconvue_type_template_id_c7e18afa_render, nt, !1, null, null, null),
      it = ot.exports,
      ServerIconvue_type_template_id_15dd760f_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "36px",
            height: "34px",
            viewBox: "0 0 36 34",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Settings-Expanded",
            transform: "translate(-156.000000, -1033.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-5",
            transform: "translate(150.000000, 198.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Server",
            transform: "translate(0.000000, 827.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            "fill-rule": "evenodd",
            opacity: "0",
            x: "0",
            y: "0",
            width: "48",
            height: "48"
          }
        }), a("path", {
          attrs: {
            d: "M24,40 C8,40 8,38 8,34 C8,30 8,28 24,28 C40,28 40,30 40,34 C40,38 40,40 24,40 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M18,34 C18,35.106 17.104,36 16,36 C14.896,36 14,35.106 14,34 C14,32.894 14.896,32 16,32 C17.104,32 18,32.894 18,34",
            id: "Fill-3",
            fill: "currentColor",
            "fill-rule": "evenodd"
          }
        }), a("path", {
          attrs: {
            d: "M24,22 C8,22 8,20 8,16 C8,12 8,10 24,10 C40,10 40,12 40,16 C40,20 40,22 24,22 Z",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M18,16 C18,17.106 17.104,18 16,18 C14.896,18 14,17.106 14,16 C14,14.894 14.896,14 16,14 C17.104,14 18,14.894 18,16",
            id: "Fill-7",
            fill: "currentColor",
            "fill-rule": "evenodd"
          }
        })])])])])])
      },
      ct = [],
      lt = {},
      dt = Object(c["a"])(lt, ServerIconvue_type_template_id_15dd760f_render, ct, !1, null, null, null),
      ut = dt.exports,
      BalanceIconvue_type_template_id_50e2b057_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "21px",
            height: "14px",
            viewBox: "0 0 21 14",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Desktop-Account-2",
            transform: "translate(-26.000000, -139.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Plus-circle-Copy-2",
            transform: "translate(24.000000, 134.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "25",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M9.375,18 C5.76354167,18 5.20833333,17.5 5.20833333,16 C5.20833333,14.5 5.76354167,14 9.375,14 \n            C12.9864583,14 13.5416667,14.5 13.5416667,16 C13.5416667,17.5 12.9864583,18 9.375,18 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M7.29166667,14 C3.68020833,14 3.125,13.5 3.125,12 C3.125,10.5 3.68020833,10 7.29166667,10 \n            C10.903125,10 11.4583333,10.5 11.4583333,12 C11.4583333,13.5 10.903125,14 7.29166667,14 Z",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M9.375,10 C5.76354167,10 5.20833333,9.5 5.20833333,8 C5.20833333,6.5 5.76354167,6 9.375,6 \n            C12.9864583,6 13.5416667,6.5 13.5416667,8 C13.5416667,9.5 12.9864583,10 9.375,10 Z",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M19.7916667,18 C18.75,18 14.5833333,14 14.5833333,13 C14.5833333,12 15.625,11 16.6666667,11 \n            C17.7083333,11 21.875,15 21.875,16 C21.875,17 20.8333333,18 19.7916667,18 Z",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])
      },
      pt = [],
      gt = {},
      ft = Object(c["a"])(gt, BalanceIconvue_type_template_id_50e2b057_render, pt, !1, null, null, null),
      vt = ft.exports,
      ImportIconvue_type_template_id_5ec6bf80_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24"
          }
        }, [a("path", {
          attrs: {
            fill: "currentColor",
            d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
          }
        }), a("path", {
          attrs: {
            d: "M0 0h24v24H0z",
            fill: "none"
          }
        })])
      },
      ht = [],
      mt = {},
      bt = Object(c["a"])(mt, ImportIconvue_type_template_id_5ec6bf80_render, ht, !1, null, null, null),
      xt = bt.exports,
      InfoIconvue_type_template_id_4a4c5e80_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "24px",
            height: "24px",
            viewBox: "0 0 24 24",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Info-circle",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M13.125,21 L10.875,21 C6.526,21 3,17.475 3,13.125 L3,10.875 C3,6.525 6.526,3 10.875,3 \n        L13.125,3 C17.474,3 21,6.525 21,10.875 L21,13.125 C21,17.475 17.474,21 13.125,21 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M12,12 L12,16",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M13,8 C13,8.553 12.552,9 12,9 C11.448,9 11,8.553 11,8 C11,7.447 11.448,7 12,7 C12.552,7 13,7.447 13,8",
            id: "Fill-5",
            fill: "currentColor"
          }
        })])])
      },
      yt = [],
      wt = {},
      kt = Object(c["a"])(wt, InfoIconvue_type_template_id_4a4c5e80_render, yt, !1, null, null, null),
      Ct = kt.exports,
      TransactionIconvue_type_template_id_469989f7_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "14px",
            height: "14px",
            viewBox: "0 0 14 14",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Desktop-Transaction-1",
            transform: "translate(-168.000000, -89.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons/exchange/deactive",
            transform: "translate(167.000000, 88.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icon/exchange/deactive"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle-Copy-4",
            "fill-rule": "nonzero",
            x: "0",
            y: "0",
            width: "16",
            height: "16"
          }
        }), a("g", {
          attrs: {
            id: "shuffle",
            transform: "translate(2.666667, 2.000000)",
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2"
          }
        }, [a("polyline", {
          attrs: {
            id: "Path",
            points: "8 0 11.3333333 0 11.3333333 3.33333333"
          }
        }), a("path", {
          attrs: {
            d: "M0,11.3333333 L11.3333333,0",
            id: "Path"
          }
        }), a("polyline", {
          attrs: {
            id: "Path",
            points: "11.3333333 8.66666667 11.3333333 12 8 12"
          }
        }), a("path", {
          attrs: {
            d: "M7.33333333,8 L11.3333333,12",
            id: "Path"
          }
        }), a("path", {
          attrs: {
            d: "M0,0.666666667 L3.33333333,4",
            id: "Path"
          }
        })])])])])])])
      },
      At = [],
      Tt = {},
      _t = Object(c["a"])(Tt, TransactionIconvue_type_template_id_469989f7_render, At, !1, null, null, null),
      St = _t.exports,
      TopupIconvue_type_template_id_7badb196_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "18px",
            height: "20px",
            viewBox: "0 0 18 20",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Account-2-account",
            transform: "translate(-27.000000, -531.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Account-Menu",
            transform: "translate(24.000000, 357.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group"
          }
        }, [a("g", {
          attrs: {
            id: "Group-2",
            transform: "translate(0.000000, 124.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Info-circle-Copy",
            transform: "translate(0.000000, 48.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M20,6 C20,7.657 16.418,9 12,9 C7.582,9 4,7.657 4,6 C4,4.343 7.582,3 12,3 C16.418,3 20,4.343 20,6 Z",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M20,12 C20,13.66 16.42,15 12,15 C7.58,15 4,13.66 4,12",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M4,18 C4,19.66 7.58,21 12,21 C16.42,21 20,19.66 20,18",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M20,6 L20,18",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M4,6 L4,18",
            id: "Stroke-9",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])])])
      },
      Ot = [],
      Et = {},
      It = Object(c["a"])(Et, TopupIconvue_type_template_id_7badb196_render, Ot, !1, null, null, null),
      Mt = It.exports,
      ActivitiesIconvue_type_template_id_7fa8ea79_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "12px",
            viewBox: "0 0 16 12",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Account-2-account",
            transform: "translate(-28.000000, -583.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Account-Menu",
            transform: "translate(24.000000, 357.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group"
          }
        }, [a("g", {
          attrs: {
            id: "Group-2",
            transform: "translate(0.000000, 124.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Info-circle-Copy-3",
            transform: "translate(0.000000, 96.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M5,7 L14,7",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M18,7 L19,7",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M5,12 L11,12",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M5,17 L15,17",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])])])
      },
      Pt = [],
      Rt = {},
      Lt = Object(c["a"])(Rt, ActivitiesIconvue_type_template_id_7fa8ea79_render, Pt, !1, null, null, null),
      jt = Lt.exports,
      SettingsIconvue_type_template_id_3572b715_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "18px",
            height: "18px",
            viewBox: "0 0 18 18",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Account-2-account",
            transform: "translate(-27.000000, -628.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Account-Menu",
            transform: "translate(24.000000, 357.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group"
          }
        }, [a("g", {
          attrs: {
            id: "Group-2",
            transform: "translate(0.000000, 124.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Info-circle-Copy-2",
            transform: "translate(0.000000, 144.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M10.2314,6.0352 C10.2314,4.0002 10.3734,4.0002 12.0004,4.0002 C13.6274,4.0002 13.7684,4.0002 13.7684,6.0352",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M10.2314,17.9648 C10.2314,19.9998 10.3734,19.9998 12.0004,19.9998 C13.6274,19.9998 13.7684,19.9998 13.7684,17.9648",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M17.9648,10.2314 C19.9998,10.2314 19.9998,10.3734 19.9998,12.0004 C19.9998,13.6274 19.9998,13.7684 17.9648,13.7684",
            id: "Stroke-5",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M6.0352,13.7686 C4.0002,13.7686 4.0002,13.6266 4.0002,11.9996 C4.0002,10.3726 4.0002,10.2316 6.0352,10.2316",
            id: "Stroke-7",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M14.9687,6.5244 C16.4087,5.0934 16.5067,5.1914 17.6537,6.3464 C18.8087,7.4934 18.9067,7.5904 17.4757,9.0314",
            id: "Stroke-9",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M6.5244,14.9688 C5.0934,16.4088 5.1914,16.5068 6.3464,17.6538 C7.4934,18.8088 7.5904,18.9068 9.0314,17.4758",
            id: "Stroke-11",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M17.4756,14.9688 C18.9066,16.4088 18.8086,16.5068 17.6536,17.6538 C16.5066,18.8088 16.4096,18.9068 14.9686,17.4758",
            id: "Stroke-13",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M6.5244,9.0313 C5.0934,7.5913 5.1914,7.4933 6.3464,6.3463 C7.4934,5.1913 7.5904,5.0933 9.0314,6.5243",
            id: "Stroke-15",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M6.5244,9.0313 C6.3204,9.4133 6.1514,9.8133 6.0354,10.2313",
            id: "Stroke-17",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M6.5244,14.9688 C6.3204,14.5868 6.1514,14.1868 6.0354,13.7688",
            id: "Stroke-19",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M14.9687,17.4756 C14.5867,17.6796 14.1867,17.8486 13.7687,17.9646",
            id: "Stroke-21",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M17.9648,10.2314 C17.8488,9.8134 17.6798,9.4134 17.4758,9.0314",
            id: "Stroke-23",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M14.9687,6.5244 C14.5867,6.3204 14.1867,6.1514 13.7687,6.0354",
            id: "Stroke-25",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M17.9648,13.7686 C17.8488,14.1866 17.6798,14.5866 17.4758,14.9686",
            id: "Stroke-27",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M10.2314,17.9648 C9.8134,17.8488 9.4134,17.6798 9.0314,17.4758",
            id: "Stroke-29",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M10.2314,6.0352 C9.8134,6.1512 9.4134,6.3202 9.0314,6.5242",
            id: "Stroke-31",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M15,12 C15,13.657 13.657,15 12,15 C10.343,15 9,13.657 9,12 C9,10.343 10.343,9 12,9 C13.657,9 15,10.343 15,12 Z",
            id: "Stroke-33",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])])])
      },
      Dt = [],
      Nt = {},
      Bt = Object(c["a"])(Nt, SettingsIconvue_type_template_id_3572b715_render, Dt, !1, null, null, null),
      Vt = Bt.exports,
      CloseIconvue_type_template_id_46f43fa1_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "8px",
            height: "8px",
            viewBox: "0 0 8 8",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-2",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Transfer-Error",
            transform: "translate(-963.000000, -89.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-16",
            transform: "translate(445.000000, 65.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Icons-/-Close",
            transform: "translate(510.000000, 16.000000)"
          }
        }, [a("rect", {
          attrs: {
            id: "Rectangle",
            fill: "#000000",
            opacity: "0",
            x: "0",
            y: "0",
            width: "24",
            height: "24"
          }
        }), a("path", {
          attrs: {
            d: "M9,15 L15,9",
            id: "Stroke-1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }), a("path", {
          attrs: {
            d: "M9,9 L15,15",
            id: "Stroke-3",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        })])])])])])
      },
      Ft = [],
      Ut = {},
      Ht = Object(c["a"])(Ut, CloseIconvue_type_template_id_46f43fa1_render, Ft, !1, null, null, null),
      Gt = Ht.exports,
      DownloadIconvue_type_template_id_253c8e54_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "19px",
            height: "19px",
            viewBox: "0 0 19 19",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-4",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }, [a("g", {
          attrs: {
            id: "Home-QRCode",
            transform: "translate(-710.000000, -469.000000)",
            stroke: "currentColor",
            "stroke-width": "2"
          }
        }, [a("g", {
          attrs: {
            id: "Group-7",
            transform: "translate(499.000000, 80.000000)"
          }
        }, [a("g", {
          attrs: {
            id: "Group-23",
            transform: "translate(212.000000, 390.000000)"
          }
        }, [a("path", {
          attrs: {
            d: "M9,17 L9,9",
            id: "Stroke-1"
          }
        }), a("polyline", {
          attrs: {
            id: "Stroke-3",
            points: "6 14 9 17 12 14"
          }
        }), a("path", {
          attrs: {
            d: "M5,11 C1,11 0,9 0,5.5 C0,2 2,0 5.5,0 C9,0 11,1 11,3 C16,3 17,4 17,7 C17,10 16,11 14,11",
            id: "Stroke-5"
          }
        })])])])])])
      },
      Kt = [],
      Yt = {},
      qt = Object(c["a"])(Yt, DownloadIconvue_type_template_id_253c8e54_render, Kt, !1, null, null, null),
      zt = qt.exports,
      CollectibleIconvue_type_template_id_2a847635_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "20px",
            viewBox: "0 0 16 20",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-3",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Home-Collectibles",
            transform: "translate(-270.000000, -418.000000)",
            fill: "currentColor",
            "fill-rule": "nonzero"
          }
        }, [a("path", {
          attrs: {
            d: "M281.030593,418 C282.402515,418 283.286466,418.883951 283.603105,420.467142 C283.876533,421.834285 284.012237,\n          423.462735 284.012237,425.354722 C284.012237,426.476949 283.477691,427.36158 282.46465,427.998452 C283.66492,\n          428.326847 284.461328,428.589912 284.875253,428.796874 C285.817126,429.267811 286,429.724997 286,430.920457 C286,\n          431.791677 285.372541,432.258384 284.388344,432.307551 L284.211014,432.311891 L284.081652,432.29769 L281.4228,\n          431.706834 C281.815295,433.400511 282.121727,434.496763 282.324388,434.95299 L282.359071,435.026848 L282.40994,\n          435.138347 C282.886581,436.29203 281.858257,437.480073 280.633041,437.480073 C279.923312,437.480073 279.356133,\n          437.135751 278.988325,436.505754 L278.907011,436.355326 L278.86186,436.233271 L278.247523,433.775924 L277.620795,\n          436.277215 C277.251613,437.384763 276.38383,437.818654 275.276282,437.449472 C274.224112,437.098748 273.779917,\n          436.298038 274.046434,435.296415 L274.094437,435.13663 L275.027331,431.716017 L272.473014,432.281289 C271.365466,\n          432.650472 270.497683,432.21658 270.128501,431.109033 C269.776898,430.054225 270.153708,429.216892 271.174492,\n          428.81234 L271.332429,428.75493 L273.69282,428.11136 C272.642607,427.536796 272.085662,426.611773 272.085662,\n          425.354722 C272.085662,423.731551 272.220912,422.108554 272.494795,420.467142 C272.815188,418.865175 273.853398,\n          418 275.464858,418 L281.030593,418 Z M280.559527,428.733918 L275.942208,428.733918 L271.677909,\n          429.895974 C271.195246,430.056862 271.099068,430.249219 271.259955,430.731881 C271.408467,431.177416 271.583793,\n          431.293639 272.036087,431.16944 L272.155076,431.133434 L275.733049,430.338328 C276.142009,430.247449 276.504311,\n          430.592762 276.454778,430.991288 L276.437727,431.077361 L275.23548,435.48211 C275.074593,435.964773 275.170771,\n          436.15713 275.653434,436.318018 C276.098969,436.466529 276.297142,436.396002 276.441472,436.03921 L276.476544,\n          435.944009 L277.271649,432.763589 C277.330642,432.527619 277.525658,432.354254 277.76045,432.318641 L277.850173,\n          432.311891 L278.645278,432.311891 C278.88851,432.311891 279.103998,432.459037 279.195492,432.678181 L279.223802,\n          432.763589 L280.001823,435.875673 C280.163134,436.170751 280.353598,436.287416 280.633041,436.287416 C281.09103,\n          436.287416 281.444088,435.863746 281.292326,435.560221 C281.096457,435.168483 280.853876,434.389525 280.555072,\n          433.200465 L280.485115,432.918776 L280.240225,431.887103 L280.050913,431.049819 C279.962992,430.654177 280.284449,\n          430.298179 280.671961,430.32515 L280.762403,430.338328 L284.27489,431.118881 C284.723529,431.113742 284.807342,\n          431.052108 284.807342,430.920457 C284.807342,430.275143 284.796794,430.129051 284.549979,429.975606 L284.483222,\n          429.936798 L284.34188,429.86362 C284.022067,429.703713 283.328186,429.474579 282.277798,429.184077 L282.02908,\n          429.115953 L281.316328,428.926917 L280.559527,428.733918 Z M281.030593,419.192658 L275.464858,\n          419.192658 C274.425969,419.192658 273.873968,419.652658 273.667758,420.682127 C273.408105,422.240049 273.278319,\n          423.797472 273.278319,425.354722 C273.278319,426.55396 274.021077,427.254282 275.708745,427.514191 L275.900163,\n          427.54126 L280.54807,427.54126 C282.117005,427.076336 282.81958,426.357388 282.81958,425.354722 C282.81958,\n          423.536218 282.690249,421.984248 282.433608,420.701041 C282.220176,419.633881 281.778952,419.192658 281.030593,\n          419.192658 Z M275.862411,422.969407 C276.521097,422.969407 277.055068,423.503377 277.055068,\n          424.162064 C277.055068,424.820751 276.521097,425.354722 275.862411,425.354722 C275.203724,425.354722 274.669753,\n          424.820751 274.669753,424.162064 C274.669753,423.503377 275.203724,422.969407 275.862411,422.969407 Z M280.633041,\n          422.969407 C281.291728,422.969407 281.825699,423.503377 281.825699,424.162064 C281.825699,424.820751 281.291728,\n          425.354722 280.633041,425.354722 C279.974354,425.354722 279.440383,424.820751 279.440383,424.162064 C279.440383,\n          423.503377 279.974354,422.969407 280.633041,422.969407 Z",
            id: "Combined-Shape"
          }
        })])])])
      },
      Wt = [],
      Qt = {},
      Jt = Object(c["a"])(Qt, CollectibleIconvue_type_template_id_2a847635_render, Wt, !1, null, null, null),
      Zt = Jt.exports,
      TokenIconvue_type_template_id_522d183e_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("svg", {
          attrs: {
            width: "16px",
            height: "16px",
            viewBox: "0 0 16 16",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
          }
        }, [a("g", {
          attrs: {
            id: "Invision-3",
            stroke: "none",
            "stroke-width": "1",
            fill: "none",
            "fill-rule": "evenodd"
          }
        }, [a("g", {
          attrs: {
            id: "Home-Collectibles",
            transform: "translate(-150.000000, -420.000000)",
            fill: "currentColor"
          }
        }, [a("g", {
          attrs: {
            id: "Group-11",
            transform: "translate(150.000000, 420.000000)"
          }
        }, [a("path", {
          attrs: {
            d: "M8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 C0,\n            3.581722 3.581722,0 8,0 Z M8.61538462,14.3589744 L7.38461538,14.3589744 L7.38461538,15.5897436 L8.61538462,\n            15.5897436 L8.61538462,14.3589744 Z M8,2.28571429 C4.84408714,2.28571429 2.28571429,4.84408714 2.28571429,\n            8 C2.28571429,11.1559129 4.84408714,13.7142857 8,13.7142857 C11.1559129,13.7142857 13.7142857,\n            11.1559129 13.7142857,8 C13.7142857,4.84408714 11.1559129,2.28571429 8,2.28571429 Z M12.7179487,\n            11.8476634 L11.8476634,12.7179487 L12.7179487,13.588234 L13.588234,12.7179487 L12.7179487,\n            11.8476634 Z M3.28205128,11.8476634 L2.41176601,12.7179487 L3.28205128,13.588234 L4.15233655,\n            12.7179487 L3.28205128,11.8476634 Z M1.84615385,7.38461538 L0.615384615,7.38461538 L0.615384615,\n            8.61538462 L1.84615385,8.61538462 L1.84615385,7.38461538 Z M15.3846154,7.38461538 L14.1538462,\n            7.38461538 L14.1538462,8.61538462 L15.3846154,8.61538462 L15.3846154,7.38461538 Z M3.28205128,\n            2.41176601 L2.41176601,3.28205128 L3.28205128,4.15233655 L4.15233655,3.28205128 L3.28205128,\n            2.41176601 Z M12.7179487,2.41176601 L11.8476634,3.28205128 L12.7179487,4.15233655 L13.588234,\n            3.28205128 L12.7179487,2.41176601 Z M8.61538462,0.615384615 L7.38461538,0.615384615 L7.38461538,\n            1.84615385 L8.61538462,1.84615385 L8.61538462,0.615384615 Z",
            id: "Combined-Shape"
          }
        }), a("path", {
          attrs: {
            d: "M8,3.69230769 C10.3790728,3.69230769 12.3076923,5.62092723 12.3076923,8 C12.3076923,10.3790728 10.3790728,\n            12.3076923 8,12.3076923 C5.62092723,12.3076923 3.69230769,10.3790728 3.69230769,8 C3.69230769,\n            5.62092723 5.62092723,3.69230769 8,3.69230769 Z M8,5.53846154 L5.74358974,7.94976452 L8,10.4615385 L10.2564103,\n            7.94976452 L8,5.53846154 Z",
            id: "Combined-Shape"
          }
        })])])])])
      },
      Xt = [],
      $t = {},
      ea = Object(c["a"])($t, TokenIconvue_type_template_id_522d183e_render, Xt, !1, null, null, null),
      ta = ea.exports,
      aa = {
        select: {
          component: u
        },
        send: {
          component: v
        },
        add: {
          component: x
        },
        search: {
          component: C
        },
        refresh: {
          component: S
        },
        eth: {
          component: M
        },
        question: {
          component: j
        },
        radio_checked: {
          component: V
        },
        radio_unchecked: {
          component: G
        },
        visibility_on: {
          component: z
        },
        visibility_off: {
          component: Z
        },
        arrow_up_circle: {
          component: te
        },
        arrow_down_circle: {
          component: se
        },
        arrow_left_circle: {
          component: le
        },
        arrow_right_circle: {
          component: ge
        },
        coins_send: {
          component: me
        },
        coins_receive: {
          component: we
        },
        coins_topup: {
          component: Te
        },
        page_prev: {
          component: Ee
        },
        page_next: {
          component: Re
        },
        page_next_double: {
          component: Ne
        },
        scan: {
          component: Ue
        },
        network: {
          component: Ye
        },
        lock: {
          component: Qe
        },
        key: {
          component: $e
        },
        list: {
          component: rt
        },
        globe: {
          component: it
        },
        server: {
          component: ut
        },
        balance: {
          component: vt
        },
        import: {
          component: xt
        },
        info: {
          component: Ct
        },
        transaction: {
          component: St
        },
        topup: {
          component: Mt
        },
        activities: {
          component: jt
        },
        settings: {
          component: Vt
        },
        close: {
          component: Gt
        },
        download: {
          component: zt
        },
        collectibles: {
          component: Zt
        },
        token: {
          component: ta
        }
      },
      ra = a("b00c");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    n["a"].use(s["a"]);
    t["a"] = new s["a"]({
      theme: {
        dark: !1,
        themes: {
          light: _objectSpread({}, o["a"][ra["THEME_LIGHT_BLUE_NAME"]].theme),
          dark: _objectSpread({}, o["a"][ra["THEME_DARK_BLACK_NAME"]].theme)
        },
        options: {
          customProperties: !0
        }
      },
      icons: {
        values: aa
      }
    })
  },
  "404f": function (e, t, a) {
    var r = a("c54e");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("457a6523", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  4111: function (e, t, a) {
    e.exports = a.p + "img/polyswarm_nectar.c79e0961.svg"
  },
  4235: function (e, t, a) {
    var r = a("81b6");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("0ef38a10", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  4360: function (e, t, a) {
    "use strict";
    a("a4d3"), a("4de4"), a("7db0"), a("4160"), a("caad"), a("b0c0"), a("e439"), a("dbb4"), a("b64b"), a("07ac"), a("e25e"), a("2532"), a("159b");
    var r = a("2fa7"),
      n = a("236e"),
      s = a("5c7d"),
      o = a.n(s),
      i = a("6f59"),
      c = a.n(i),
      l = a("d485"),
      d = a.n(l),
      u = a("7648"),
      p = a("b00c"),
      g = (a("99af"), a("c740"), a("0d03"), a("d3b7"), a("25f0"), a("96cf"), a("2b0e")),
      f = a("2f62"),
      v = a("bfa9"),
      h = a("1131"),
      m = a("db49"),
      b = a("fa7d"),
      x = a("5e5c"),
      y = a("5c7d");

    function notifyUser(e) {
      if (Notification)
        if ("granted" !== Notification.permission) y.info("Notification permission not granted."), Notification.requestPermission();
        else {
          y.info("notification permission granted.");
          var t = new Notification("Confirmed Transaction", {
            body: "View on Etherscan"
          });
          t.onclick = function () {
            window.open(e)
          }
        }
      else alert("Desktop notifications not available in your browser. Try Chromium.")
    }
    var w = {
        userInfo: {
          name: "",
          profileImage: "",
          email: "",
          verifier: "",
          verifierId: "",
          verifierParams: {}
        },
        idToken: "",
        userInfoAccess: p["USER_INFO_REQUEST_NEW"],
        wallet: {},
        weiBalance: {},
        selectedAddress: "",
        selectedCurrency: "USD",
        networkId: 0,
        networkType: {
          host: p["MAINNET"],
          chainId: p["MAINNET_CODE"],
          networkName: p["MAINNET_DISPLAY_NAME"]
        },
        currencyData: {},
        tokenData: {},
        tokenRates: {},
        transactions: [],
        unapprovedTypedMessages: {},
        unapprovedPersonalMsgs: {},
        unapprovedMsgs: {},
        loginInProgress: !1,
        jwtToken: "",
        pastTransactions: [],
        isNewUser: !1,
        theme: p["THEME_LIGHT_BLUE_NAME"],
        assets: {},
        billboard: [],
        contacts: []
      },
      k = w,
      C = (a("d81d"), a("ac1f"), a("3ca3"), a("1276"), a("4c53"), a("ddb0"), a("04e1")),
      A = a.n(C);

    function accountTrackerHandler(e) {
      var t = e.accounts;
      if (t)
        for (var a in t)
          if (Object.prototype.hasOwnProperty.call(t, a)) {
            var r = t[a];
            Q.dispatch("updateWeiBalance", {
              address: r.address,
              balance: r.balance
            })
          }
    }

    function transactionControllerHandler(e) {
      var t = e.transactions;
      if (t) {
        var a = [];
        for (var r in t) t[r] && a.push(t[r]);
        Q.dispatch("updateTransactions", {
          transactions: a
        })
      }
    }

    function assetControllerHandler(e) {
      var t = e.accounts;
      for (var a in o.a.info("received assets"), t)
        if (Object.prototype.hasOwnProperty.call(t, a)) {
          var r = t[a],
            n = r.allCollectibleContracts,
            s = r.allCollectibles,
            i = r.collectibleContracts,
            c = r.collectibles;
          Q.dispatch("updateAssets", {
            allCollectibleContracts: n,
            allCollectibles: s,
            collectibleContracts: i,
            collectibles: c,
            selectedAddress: a
          })
        }
    }

    function typedMessageManagerHandler(e) {
      var t = e.unapprovedTypedMessages;
      Q.dispatch("updateTypedMessages", {
        unapprovedTypedMessages: t
      })
    }

    function personalMessageManagerHandler(e) {
      var t = e.unapprovedPersonalMsgs;
      Q.dispatch("updatePersonalMessages", {
        unapprovedPersonalMsgs: t
      })
    }

    function messageManagerHandler(e) {
      var t = e.unapprovedMsgs;
      Q.dispatch("updateMessages", {
        unapprovedMsgs: t
      })
    }

    function detectTokensControllerHandler(e) {
      var t = e.tokens;
      t.length > 0 && Q.dispatch("updateTokenData", {
        tokenData: t,
        address: u["a"].torusController.detectTokensController.selectedAddress
      })
    }

    function tokenRatesControllerHandler(e) {
      var t = e.contractExchangeRates;
      t && Q.dispatch("updateTokenRates", {
        tokenRates: t
      })
    }
    var T = a("402c"),
      _ = a("7134");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var S, O, E, I, M = a("c059"),
      P = m["default"].baseRoute,
      R = 0,
      L = u["a"].communicationMux.getStream("status"),
      j = u["a"].communicationMux.getStream("oauth"),
      D = !1,
      N = !1,
      B = !1,
      V = {
        logOut: function logOut(e, t) {
          var a = e.commit,
            r = e.dispatch;
          a("logOut", k), r("setTheme", p["THEME_LIGHT_BLUE_NAME"]), Object(b["storageAvailable"])("sessionStorage") && window.sessionStorage.clear(), L.write({
            loggedIn: !1
          }), u["a"].torusController.accountTracker.store.unsubscribe(accountTrackerHandler), u["a"].torusController.txController.store.unsubscribe(transactionControllerHandler), u["a"].torusController.assetController.store.unsubscribe(assetControllerHandler), u["a"].torusController.typedMessageManager.store.unsubscribe(typedMessageManagerHandler), u["a"].torusController.personalMessageManager.store.unsubscribe(personalMessageManagerHandler), u["a"].torusController.messageManager.store.unsubscribe(messageManagerHandler), u["a"].torusController.detectTokensController.detectedTokensStore.unsubscribe(detectTokensControllerHandler), u["a"].torusController.tokenRatesController.store.unsubscribe(tokenRatesControllerHandler)
        },
        loginInProgress: function loginInProgress(e, t) {
          e.commit("setLoginInProgress", t)
        },
        setSelectedCurrency: function setSelectedCurrency(e, t) {
          var a = e.commit,
            r = e.state;
          a("setCurrency", t.selectedCurrency), "ETH" !== t.selectedCurrency && u["a"].torusController.setCurrentCurrency(t.selectedCurrency.toLowerCase(), (function (e, t) {
            e && o.a.error("currency fetch failed"), a("setCurrencyData", t)
          })), "" !== r.jwtToken && t.origin && "store" !== t.origin && Object(x["patch"])("".concat(m["default"].api, "/user"), {
            default_currency: t.selectedCurrency
          }, {
            headers: {
              Authorization: "Bearer ".concat(r.jwtToken),
              "Content-Type": "application/json; charset=utf-8"
            }
          }).then((function (e) {
            o.a.info("successfully patched", e)
          })).catch((function (e) {
            o.a.error(e, "unable to patch currency info")
          }))
        },
        forceFetchTokens: function forceFetchTokens(e, t) {
          var a, r, n;
          return regeneratorRuntime.async((function forceFetchTokens$(t) {
            while (1) switch (t.prev = t.next) {
              case 0:
                return a = e.state, u["a"].torusController.detectTokensController.refreshTokenBalances(), u["a"].torusController.assetDetectionController.restartAssetDetection(), t.prev = 3, t.next = 6, regeneratorRuntime.awrap(Object(x["get"])("".concat(m["default"].api, "/tokenbalances"), {
                  headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: "Bearer ".concat(a.jwtToken)
                  }
                }));
              case 6:
                r = t.sent, n = r.data, n.forEach((function (e) {
                  u["a"].torusController.detectTokensController.detectEtherscanTokenBalance(e.contractAddress, {
                    decimals: e.tokenDecimal,
                    erc20: !0,
                    logo: "eth.svg",
                    name: e.name,
                    balance: e.balance,
                    symbol: e.ticker
                  })
                })), t.next = 14;
                break;
              case 11:
                t.prev = 11, t.t0 = t["catch"](3), o.a.error("etherscan balance fetch failed");
              case 14:
              case "end":
                return t.stop()
            }
          }), null, null, [
            [3, 11]
          ])
        },
        showProviderChangePopup: function showProviderChangePopup(e, t) {
          var a = new n["a"]("torus_provider_change_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
          window.open("".concat(P, "providerchange?instanceId=").concat(u["a"].instanceId), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600"), a.onmessage = function _callee(e) {
            return regeneratorRuntime.async((function _callee$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  if ("popup-loaded" !== e.data) {
                    r.next = 4;
                    break
                  }
                  return r.next = 3, regeneratorRuntime.awrap(a.postMessage({
                    data: {
                      origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                      payload: t
                    }
                  }));
                case 3:
                  a.close();
                case 4:
                case "end":
                  return r.stop()
              }
            }))
          }
        },
        showUserInfoRequestPopup: function showUserInfoRequestPopup(e, t) {
          var a = new n["a"]("user_info_request_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
          window.open("".concat(P, "userinforequest?instanceId=").concat(u["a"].instanceId), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600"), a.onmessage = function _callee2(e) {
            return regeneratorRuntime.async((function _callee2$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  if ("popup-loaded" !== e.data) {
                    r.next = 4;
                    break
                  }
                  return r.next = 3, regeneratorRuntime.awrap(a.postMessage({
                    data: {
                      origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                      payload: t
                    }
                  }));
                case 3:
                  a.close();
                case 4:
                case "end":
                  return r.stop()
              }
            }))
          }
        },
        showWalletPopup: function showWalletPopup(e, t) {
          S = S || window.open("".concat(P, "wallet").concat(t.path || "", "?instanceId=").concat(u["a"].instanceId), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=750"), S.blur(), setTimeout(S.focus(), 0), S.onbeforeunload = function () {
            S = void 0
          }
        },
        updateUserInfo: function updateUserInfo(e, t) {
          e.commit("setUserInfo", t.userInfo)
        },
        updateIdToken: function updateIdToken(e, t) {
          e.commit("setIdToken", t.idToken)
        },
        addWallet: function addWallet(e, t) {
          t.ethAddress && e.commit("setWallet", _objectSpread({}, e.state.wallet, Object(r["a"])({}, t.ethAddress, t.privKey)))
        },
        removeWallet: function removeWallet(e, t) {
          if (t.ethAddress) {
            var a = _objectSpread({}, e.state.wallet);
            if (delete a[t.ethAddress], e.commit("setWallet", _objectSpread({}, a)), e.state.weiBalance[t.ethAddress]) {
              var r = _objectSpread({}, e.state.weiBalance);
              delete r[t.ethAddress], e.commit("setBalance", _objectSpread({}, r))
            }
          }
        },
        updateWeiBalance: function updateWeiBalance(e, t) {
          var a = e.commit,
            n = e.state;
          t.address && a("setWeiBalance", _objectSpread({}, n.weiBalance, Object(r["a"])({}, t.address, t.balance)))
        },
        importAccount: function importAccount(e, t) {
          var a = e.dispatch;
          return new Promise((function (e, r) {
            M.importAccount(t.strategy, t.keyData).then((function (t) {
              a("finishImportAccount", {
                privKey: t
              }).then((function () {
                return e(t)
              })).catch((function (e) {
                return r(e)
              }))
            })).catch((function (e) {
              r(e)
            }))
          }))
        },
        finishImportAccount: function finishImportAccount(e, t) {
          var a = e.dispatch,
            r = e.state;
          return new Promise((function (e, n) {
            var s = t.privKey,
              o = u["a"].generateAddressFromPrivKey(s);
            u["a"].torusController.setSelectedAccount(o, {
              jwtToken: r.jwtToken
            }), a("addWallet", {
              ethAddress: o,
              privKey: s
            }), a("updateSelectedAddress", {
              selectedAddress: o
            }), u["a"].torusController.addAccount(s, o).then((function (t) {
              return e(s)
            })).catch((function (e) {
              return n(e)
            }))
          }))
        },
        updateUserInfoAccess: function updateUserInfoAccess(e, t) {
          var a = e.commit;
          t.approved ? a("setUserInfoAccess", p["USER_INFO_REQUEST_APPROVED"]) : a("setUserInfoAccess", p["USER_INFO_REQUEST_REJECTED"])
        },
        updateTransactions: function updateTransactions(e, t) {
          var a = e.commit;
          a("setTransactions", t.transactions)
        },
        updateTypedMessages: function updateTypedMessages(e, t) {
          var a = e.commit;
          a("setTypedMessages", t.unapprovedTypedMessages)
        },
        updatePersonalMessages: function updatePersonalMessages(e, t) {
          var a = e.commit;
          a("setPersonalMessages", t.unapprovedPersonalMsgs)
        },
        updateMessages: function updateMessages(e, t) {
          var a = e.commit;
          a("setMessages", t.unapprovedMsgs)
        },
        updateAssets: function updateAssets(e, t) {
          var a = e.commit,
            n = t.collectibleContracts.map((function (e) {
              return e.assets = t.collectibles.filter((function (t) {
                return t.address === e.address
              })), e
            }));
          a("setAssets", Object(r["a"])({}, t.selectedAddress, n))
        },
        updateTokenData: function updateTokenData(e, t) {
          var a = e.commit;
          e.state;
          t.tokenData && a("setTokenData", Object(r["a"])({}, t.address, t.tokenData))
        },
        updateTokenRates: function updateTokenRates(e, t) {
          var a = e.commit;
          a("setTokenRates", t.tokenRates)
        },
        updateSelectedAddress: function updateSelectedAddress(e, t) {
          var a = e.commit,
            r = e.state;
          a("setSelectedAddress", t.selectedAddress), u["a"].updateStaticData({
            selectedAddress: t.selectedAddress
          }), u["a"].torusController.setSelectedAccount(t.selectedAddress, {
            jwtToken: r.jwtToken
          })
        },
        updateNetworkId: function updateNetworkId(e, t) {
          e.commit("setNetworkId", t.networkId), u["a"].updateStaticData({
            networkId: t.networkId
          })
        },
        setProviderType: function setProviderType(e, t) {
          var a = t.network;
          return p["SUPPORTED_NETWORK_TYPES"][a.host] && (a = p["SUPPORTED_NETWORK_TYPES"][a.host]), e.commit("setNetworkType", a), t.type && t.type === p["RPC"] ? u["a"].torusController.setCustomRpc(a.host, a.chainId, "ETH", a.networkName) : u["a"].torusController.networkController.setProviderType(a.host)
        },
        triggerLogin: function triggerLogin(e, t) {
          var a = e.dispatch,
            r = t.calledFromEmbed,
            s = t.verifier,
            i = m["default"].torusNodeEndpoints,
            c = Object(b["getRandomNumber"])(i.length);
          if (o.a.info("Verifier: ", s), s === p["GOOGLE"])(function googleLogin() {
            window.auth2 ? window.auth2.signIn().then((function (e) {
              o.a.info("GOOGLE USER: ", e);
              var t = e.getBasicProfile(),
                n = t.getEmail(),
                s = t.getName(),
                i = t.getImageUrl(),
                l = e.getAuthResponse().id_token;
              o.a.info("ID: ", t.getId()), o.a.info("ID Token:", l), o.a.info("Email:", n), o.a.info("Name:", s), o.a.info("Image URL:", i), a("updateIdToken", {
                idToken: l
              }), a("updateUserInfo", {
                userInfo: {
                  profileImage: i,
                  name: s,
                  email: n,
                  verifierId: n.toString().toLowerCase(),
                  verifier: p["GOOGLE"],
                  verifierParams: {
                    verifier_id: n.toString().toLowerCase()
                  }
                }
              }), window.gapi.auth2.getAuthInstance().disconnect().then((function () {
                a("handleLogin", {
                  calledFromEmbed: r,
                  endPointNumber: c
                })
              })).catch((function (e) {
                o.a.error(e), j.write({
                  err: "something went wrong"
                })
              }))
            })).catch((function (e) {
              o.a.error(e), j.write({
                err: "popup closed"
              })
            })) : setTimeout(googleLogin, 1e3)
          })();
          else if (s === p["FACEBOOK"])(function facebookLogin() {
            window.FBInitialized ? window.FB.login((function (e) {
              if (e.authResponse && "connected" === e.status) {
                var t = e.authResponse || {},
                  n = t.accessToken;
                o.a.info("AccessToken:", n), a("updateIdToken", {
                  idToken: n
                }), window.FB.api("/me?fields=name,email,picture.type(large)", (function (e) {
                  o.a.info("Email: ", e.email), o.a.info("Name: ", e.name), o.a.info("Id: ", e.id);
                  var t = e || {},
                    n = t.name,
                    s = t.id,
                    i = t.picture,
                    l = t.email;
                  setTimeout((function () {
                    window.FB.logout((function () {
                      o.a.info("logged out of facebook")
                    }))
                  }), 5e3), a("updateUserInfo", {
                    userInfo: {
                      profileImage: i.data.url,
                      name: n,
                      email: l,
                      verifierId: s.toString(),
                      verifier: p["FACEBOOK"],
                      verifierParams: {
                        verifier_id: s.toString()
                      }
                    }
                  }), a("handleLogin", {
                    calledFromEmbed: r,
                    endPointNumber: c
                  })
                }))
              } else o.a.error("User cancelled login or did not fully authorize."), j.write({
                err: "User cancelled login or did not fully authorize."
              })
            })) : setTimeout(facebookLogin, 1e3)
          })();
          else if (s === p["TWITCH"]) {
            var l = encodeURIComponent(window.btoa(JSON.stringify({
                instanceId: u["a"].instanceId,
                verifier: p["TWITCH"]
              }))),
              d = JSON.stringify({
                id_token: {
                  email: null
                },
                userinfo: {
                  picture: null,
                  preferred_username: null
                }
              }),
              g = new n["a"]("redirect_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
            g.onmessage = function _callee3(e) {
              var t, n, s, i, l, d, u, f, v, h;
              return regeneratorRuntime.async((function _callee3$(m) {
                while (1) switch (m.prev = m.next) {
                  case 0:
                    if (!e.error || "" === e.error) {
                      m.next = 5;
                      break
                    }
                    o.a.error(e.error), j.write({
                      err: e.error
                    }), m.next = 28;
                    break;
                  case 5:
                    if (!e.data || e.data.verifier !== p["TWITCH"]) {
                      m.next = 28;
                      break
                    }
                    return m.prev = 6, t = e.data.verifierParams, n = t.access_token, s = t.id_token, m.next = 10, regeneratorRuntime.awrap(Object(x["get"])("https://id.twitch.tv/oauth2/userinfo", {
                      headers: {
                        Authorization: "Bearer ".concat(n)
                      }
                    }));
                  case 10:
                    i = m.sent, l = A()(s), d = i || {}, u = d.picture, f = d.preferred_username, v = l || {}, h = v.email, a("updateIdToken", {
                      idToken: n.toString()
                    }), a("updateUserInfo", {
                      userInfo: {
                        profileImage: u,
                        name: f,
                        email: h,
                        verifierId: i.sub.toString(),
                        verifier: p["TWITCH"],
                        verifierParams: {
                          verifier_id: i.sub.toString()
                        }
                      }
                    }), a("handleLogin", {
                      calledFromEmbed: r,
                      endPointNumber: c
                    }), m.next = 23;
                    break;
                  case 19:
                    m.prev = 19, m.t0 = m["catch"](6), o.a.error(m.t0), j.write({
                      err: "something went wrong."
                    });
                  case 23:
                    return m.prev = 23, D = !0, g.close(), O.close(), m.finish(23);
                  case 28:
                  case "end":
                    return m.stop()
                }
              }), null, null, [
                [6, 19, 23, 28]
              ])
            }, O = window.open("https://id.twitch.tv/oauth2/authorize?client_id=".concat(m["default"].TWITCH_CLIENT_ID, "&redirect_uri=") + "".concat(m["default"].redirect_uri, "&response_type=token%20id_token&scope=user:read:email+openid&claims=").concat(d, "&state=").concat(l), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600");
            var f = setInterval((function () {
              O.closed && (clearInterval(f), D || (o.a.error("user closed popup"), j.write({
                err: "user closed popup"
              })), D = !1, O = void 0)
            }), 1e3)
          } else if (s === p["REDDIT"]) {
            var v = encodeURIComponent(window.btoa(JSON.stringify({
                instanceId: u["a"].instanceId,
                verifier: p["REDDIT"]
              }))),
              h = new n["a"]("redirect_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
            h.onmessage = function _callee4(e) {
              var t, n, s, i, l;
              return regeneratorRuntime.async((function _callee4$(d) {
                while (1) switch (d.prev = d.next) {
                  case 0:
                    if (!e.error || "" === e.error) {
                      d.next = 5;
                      break
                    }
                    o.a.error(e.error), j.write({
                      err: e.error
                    }), d.next = 26;
                    break;
                  case 5:
                    if (!e.data || e.data.verifier !== p["REDDIT"]) {
                      d.next = 26;
                      break
                    }
                    return d.prev = 6, t = e.data.verifierParams.access_token, d.next = 10, regeneratorRuntime.awrap(Object(x["get"])("https://oauth.reddit.com/api/v1/me", {
                      headers: {
                        Authorization: "Bearer ".concat(t)
                      }
                    }));
                  case 10:
                    n = d.sent, s = n || {}, s.id, i = s.icon_img, l = s.name, a("updateIdToken", {
                      idToken: t
                    }), a("updateUserInfo", {
                      userInfo: {
                        profileImage: i.split("?").length > 0 ? i.split("?")[0] : i,
                        name: l,
                        email: "",
                        verifierId: l.toString().toLowerCase(),
                        verifier: p["REDDIT"],
                        verifierParams: {
                          verifier_id: l.toString().toLowerCase()
                        }
                      }
                    }), a("handleLogin", {
                      calledFromEmbed: r,
                      endPointNumber: c
                    }), d.next = 21;
                    break;
                  case 17:
                    d.prev = 17, d.t0 = d["catch"](6), o.a.error(d.t0), j.write({
                      err: "User cancelled login or something went wrong."
                    });
                  case 21:
                    return d.prev = 21, h.close(), N = !0, E.close(), d.finish(21);
                  case 26:
                  case "end":
                    return d.stop()
                }
              }), null, null, [
                [6, 17, 21, 26]
              ])
            }, E = window.open("https://www.reddit.com/api/v1/authorize?client_id=".concat(m["default"].REDDIT_CLIENT_ID, "&redirect_uri=") + "".concat(m["default"].redirect_uri, "&response_type=token&scope=identity&state=").concat(v), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=450,width=600");
            var y = setInterval((function () {
              E.closed && (clearInterval(y), N || (o.a.error("user closed popup"), j.write({
                err: "user closed popup"
              })), N = !1, E = void 0)
            }), 1e3)
          } else if (s === p["DISCORD"]) {
            var w = encodeURIComponent(window.btoa(JSON.stringify({
                instanceId: u["a"].instanceId,
                verifier: p["DISCORD"]
              }))),
              k = encodeURIComponent("identify email"),
              C = new n["a"]("redirect_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
            C.onmessage = function _callee5(e) {
              var t, n, s, i, l, d, u, g, f;
              return regeneratorRuntime.async((function _callee5$(v) {
                while (1) switch (v.prev = v.next) {
                  case 0:
                    if (!e.error || "" === e.error) {
                      v.next = 5;
                      break
                    }
                    o.a.error(e.error), j.write({
                      err: e.error
                    }), v.next = 27;
                    break;
                  case 5:
                    if (!e.data || e.data.verifier !== p["DISCORD"]) {
                      v.next = 27;
                      break
                    }
                    return v.prev = 6, t = e.data.verifierParams.access_token, v.next = 10, regeneratorRuntime.awrap(Object(x["get"])("https://discordapp.com/api/users/@me", {
                      headers: {
                        Authorization: "Bearer ".concat(t)
                      }
                    }));
                  case 10:
                    n = v.sent, s = n || {}, i = s.id, l = s.avatar, d = s.email, u = s.username, g = s.discriminator, f = null === l ? "https://cdn.discordapp.com/embed/avatars/".concat(g % 5, ".png") : "https://cdn.discordapp.com/avatars/".concat(i, "/").concat(l, ".png?size=2048"), a("updateIdToken", {
                      idToken: t
                    }), a("updateUserInfo", {
                      userInfo: {
                        profileImage: f,
                        name: "".concat(u, "#").concat(g),
                        email: d,
                        verifierId: i.toString(),
                        verifier: p["DISCORD"],
                        verifierParams: {
                          verifier_id: i.toString()
                        }
                      }
                    }), a("handleLogin", {
                      calledFromEmbed: r,
                      endPointNumber: c
                    }), v.next = 22;
                    break;
                  case 18:
                    v.prev = 18, v.t0 = v["catch"](6), o.a.error(v.t0), j.write({
                      err: "User cancelled login or something went wrong."
                    });
                  case 22:
                    return v.prev = 22, C.close(), B = !0, I.close(), v.finish(22);
                  case 27:
                  case "end":
                    return v.stop()
                }
              }), null, null, [
                [6, 18, 22, 27]
              ])
            }, I = window.open("https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=".concat(m["default"].DISCORD_CLIENT_ID) + "&state=".concat(w, "&scope=").concat(k, "&redirect_uri=").concat(encodeURIComponent(m["default"].redirect_uri)), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=800,width=600");
            var T = setInterval((function () {
              I.closed && (clearInterval(T), B || (o.a.error("user closed popup"), j.write({
                err: "user closed popup"
              })), B = !1, I = void 0)
            }), 1e3)
          }
        },
        subscribeToControllers: function subscribeToControllers(e, t) {
          u["a"].torusController.accountTracker.store.subscribe(accountTrackerHandler), u["a"].torusController.txController.store.subscribe(transactionControllerHandler), u["a"].torusController.assetController.store.subscribe(assetControllerHandler), u["a"].torusController.typedMessageManager.store.subscribe(typedMessageManagerHandler), u["a"].torusController.personalMessageManager.store.subscribe(personalMessageManagerHandler), u["a"].torusController.messageManager.store.subscribe(messageManagerHandler), u["a"].torusController.detectTokensController.detectedTokensStore.subscribe(detectTokensControllerHandler), u["a"].torusController.tokenRatesController.store.subscribe(tokenRatesControllerHandler)
        },
        initTorusKeyring: function initTorusKeyring(e, t) {
          e.state, e.dispatch;
          return u["a"].torusController.initTorusKeyring([t.privKey], [t.ethAddress])
        },
        setBillboard: function setBillboard(e) {
          var t = e.commit,
            a = e.state;
          try {
            Object(x["get"])("".concat(m["default"].api, "/billboard"), {
              headers: {
                Authorization: "Bearer ".concat(a.jwtToken)
              }
            }).then((function (e) {
              e.data && t("setBillboard", e.data)
            }))
          } catch (r) {
            reject(r)
          }
        },
        setContacts: function setContacts(e) {
          var t = e.commit,
            a = e.state;
          try {
            Object(x["get"])("".concat(m["default"].api, "/contact"), {
              headers: {
                Authorization: "Bearer ".concat(a.jwtToken)
              }
            }).then((function (e) {
              e.data && t("setContacts", e.data)
            }))
          } catch (r) {
            reject(r)
          }
        },
        addContact: function addContact(e, t) {
          var a = e.commit,
            r = e.state;
          return new Promise((function (e, n) {
            Object(x["post"])("".concat(m["default"].api, "/contact"), t, {
              headers: {
                Authorization: "Bearer ".concat(r.jwtToken),
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then((function (t) {
              a("addContacts", [t.data]), o.a.info("successfully added contact", t), e(t)
            })).catch((function (e) {
              o.a.error(e, "unable to add contact"), n("Unable to add contact")
            }))
          }))
        },
        deleteContact: function deleteContact(e, t) {
          var a = e.commit,
            r = e.state;
          return new Promise((function (e, n) {
            Object(x["remove"])("".concat(m["default"].api, "/contact/").concat(t), {}, {
              headers: {
                Authorization: "Bearer ".concat(r.jwtToken)
              }
            }).then((function (t) {
              var n = r.contacts.findIndex((function (e) {
                return e.id === t.data.id
              })); - 1 !== n && (a("deleteContact", n), o.a.info("successfully deleted contact", t), e(t))
            })).catch((function (e) {
              o.a.error(e, "unable to delete contact"), n("Unable to delete contact")
            }))
          }))
        },
        handleLogin: function handleLogin(e, t) {
          var a = e.state,
            r = e.dispatch,
            n = t.endPointNumber,
            s = t.calledFromEmbed,
            i = m["default"].torusNodeEndpoints,
            c = m["default"].torusIndexes,
            l = a.idToken,
            d = a.userInfo,
            p = d.verifierId,
            g = d.verifier,
            f = d.verifierParams;
          r("loginInProgress", !0), u["a"].getPubKeyAsync(i[n], {
            verifier: g,
            verifierId: p
          }).then((function (e) {
            o.a.info("New private key assigned to user at address ", e);
            var t = u["a"].retrieveShares(i, c, g, f, l),
              a = u["a"].getMessageForSigning(e);
            return Promise.all([t, a])
          })).then((function _callee6(e) {
            var t, a, n;
            return regeneratorRuntime.async((function _callee6$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  return t = e[0], a = e[1], r("addWallet", t), r("subscribeToControllers"), o.next = 6, regeneratorRuntime.awrap(Promise.all([r("initTorusKeyring", t), r("processAuthMessage", {
                    message: a,
                    selectedAddress: t.ethAddress,
                    calledFromEmbed: s
                  })]));
                case 6:
                  r("updateSelectedAddress", {
                    selectedAddress: t.ethAddress
                  }), r("setBillboard"), n = t.ethAddress, s && setTimeout((function () {
                    u["a"].continueEnable(n)
                  }), 50), L.write({
                    loggedIn: !0,
                    rehydrate: !1,
                    verifier: g
                  }), r("loginInProgress", !1);
                case 12:
                case "end":
                  return o.stop()
              }
            }))
          })).catch((function (e) {
            R += 1;
            var t = n;
            while (t === n) t = Object(b["getRandomNumber"])(i.length);
            R < 3 && r("handleLogin", {
              calledFromEmbed: s,
              endPointNumber: t
            }), o.a.error(e)
          }))
        },
        processAuthMessage: function processAuthMessage(e, t) {
          var a = e.commit,
            r = e.dispatch;
          return new Promise((function _callee7(e, n) {
            var s, i, c, l, d, p;
            return regeneratorRuntime.async((function _callee7$(g) {
              while (1) switch (g.prev = g.next) {
                case 0:
                  return g.prev = 0, s = t.message, i = t.selectedAddress, c = t.calledFromEmbed, l = u["a"].hashMessage(s), g.next = 5, regeneratorRuntime.awrap(u["a"].torusController.keyringController.signMessage(i, l));
                case 5:
                  return d = g.sent, g.next = 8, regeneratorRuntime.awrap(Object(x["post"])("".concat(m["default"].api, "/auth/verify"), {
                    public_address: i,
                    signed_message: d
                  }));
                case 8:
                  return p = g.sent, a("setJwtToken", p.token), g.next = 12, regeneratorRuntime.awrap(r("setUserInfoAction", {
                    token: p.token,
                    calledFromEmbed: c,
                    rehydrate: !1
                  }));
                case 12:
                  e(), g.next = 19;
                  break;
                case 15:
                  g.prev = 15, g.t0 = g["catch"](0), o.a.error("Failed Communication with backend", g.t0), n(g.t0);
                case 19:
                case "end":
                  return g.stop()
              }
            }), null, null, [
              [0, 15]
            ])
          }))
        },
        storeUserLogin: function storeUserLogin(e, t) {
          var a = e.state,
            r = "";
          r = t && t.calledFromEmbed ? window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer : window.location.origin, t.rehydrate || Object(x["post"])("".concat(m["default"].api, "/user/recordLogin"), {
            hostname: r
          }, {
            headers: {
              Authorization: "Bearer ".concat(a.jwtToken),
              "Content-Type": "application/json; charset=utf-8"
            }
          })
        },
        setTheme: function setTheme(e, t) {
          var a = e.commit;
          a("setTheme", t);
          var r = _["a"][t || p["THEME_LIGHT_BLUE_NAME"]];
          T["a"].framework.theme.dark = r.isDark, T["a"].framework.theme.themes[r.isDark ? "dark" : "light"] = r.theme
        },
        setUserTheme: function setUserTheme(e, t) {
          var a = e.state,
            r = e.dispatch;
          return new Promise((function (e, n) {
            Object(x["patch"])("".concat(m["default"].api, "/user/theme"), {
              theme: t
            }, {
              headers: {
                Authorization: "Bearer ".concat(a.jwtToken),
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then((function (a) {
              r("setTheme", t), o.a.info("successfully patched", a), e(a)
            })).catch((function (e) {
              o.a.error(e, "unable to patch theme"), n("Unable to update theme")
            }))
          }))
        },
        setUserInfoAction: function setUserInfoAction(e, t) {
          var a = e.commit,
            r = e.dispatch,
            n = e.state;
          return new Promise((function _callee9(e, s) {
            var o, i, c;
            return regeneratorRuntime.async((function _callee9$(l) {
              while (1) switch (l.prev = l.next) {
                case 0:
                  o = t.token, i = t.calledFromEmbed, c = t.rehydrate;
                  try {
                    Object(x["get"])("".concat(m["default"].api, "/user"), {
                      headers: {
                        Authorization: "Bearer ".concat(o)
                      }
                    }).then((function (t) {
                      if (t.data) {
                        var n = t.data || {},
                          s = n.transactions,
                          o = n.contacts,
                          l = n.default_currency,
                          d = n.theme;
                        a("setPastTransactions", s), a("setContacts", o), r("setTheme", d), r("setSelectedCurrency", {
                          selectedCurrency: l,
                          origin: "store"
                        }), r("storeUserLogin", {
                          calledFromEmbed: i,
                          rehydrate: c
                        }), e()
                      }
                    })).catch((function _callee8(t) {
                      return regeneratorRuntime.async((function _callee8$(t) {
                        while (1) switch (t.prev = t.next) {
                          case 0:
                            return t.next = 2, regeneratorRuntime.awrap(Object(x["post"])("".concat(m["default"].api, "/user"), {
                              default_currency: n.selectedCurrency,
                              theme: n.theme
                            }, {
                              headers: {
                                Authorization: "Bearer ".concat(o),
                                "Content-Type": "application/json; charset=utf-8"
                              }
                            }));
                          case 2:
                            a("setNewUser", !0), r("storeUserLogin", {
                              calledFromEmbed: i,
                              rehydrate: c
                            }), e();
                          case 5:
                          case "end":
                            return t.stop()
                        }
                      }))
                    }))
                  } catch (d) {
                    s(d)
                  }
                  case 2:
                  case "end":
                    return l.stop()
              }
            }))
          }))
        },
        rehydrate: function rehydrate(e, t) {
          var a, r, n, s, i, c, l, d, g;
          return regeneratorRuntime.async((function rehydrate$(t) {
            while (1) switch (t.prev = t.next) {
              case 0:
                if (a = e.state, r = e.dispatch, n = a.selectedAddress, s = a.wallet, i = a.networkType, c = a.networkId, l = a.jwtToken, d = a.userInfo.verifier, t.prev = 2, !l) {
                  t.next = 8;
                  break
                }
                if (g = A()(l), !(Date.now() / 1e3 > g.exp)) {
                  t.next = 8;
                  break
                }
                return r("logOut"), t.abrupt("return");
              case 8:
                if (!p["SUPPORTED_NETWORK_TYPES"][i.host]) {
                  t.next = 13;
                  break
                }
                return t.next = 11, regeneratorRuntime.awrap(r("setProviderType", {
                  network: i
                }));
              case 11:
                t.next = 15;
                break;
              case 13:
                return t.next = 15, regeneratorRuntime.awrap(r("setProviderType", {
                  network: i,
                  type: p["RPC"]
                }));
              case 15:
                if (!n || !s[n]) {
                  t.next = 23;
                  break
                }
                return setTimeout((function () {
                  return r("subscribeToControllers")
                }), 50), t.next = 19, regeneratorRuntime.awrap(Promise.all([u["a"].torusController.initTorusKeyring(Object.values(s), Object.keys(s)), r("setUserInfoAction", {
                  token: l,
                  calledFromEmbed: !1,
                  rehydrate: !0
                })]));
              case 19:
                r("updateSelectedAddress", {
                  selectedAddress: n
                }), r("updateNetworkId", {
                  networkId: c
                }), L.write({
                  loggedIn: !0,
                  rehydrate: !0,
                  verifier: d
                }), o.a.info("rehydrated wallet");
              case 23:
                t.next = 28;
                break;
              case 25:
                t.prev = 25, t.t0 = t["catch"](2), o.a.error("Failed to rehydrate", t.t0);
              case 28:
              case "end":
                return t.stop()
            }
          }), null, null, [
            [2, 25]
          ])
        }
      },
      F = (a("acd8"), a("284c"));

    function getters_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function getters_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? getters_ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : getters_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var U = function unApprovedTransactions(e) {
        var t = [];
        for (var a in e.transactions) "unapproved" === e.transactions[a].status && t.push(e.transactions[a]);
        return t
      },
      H = function tokenBalances(e) {
        var t = e || {},
          a = t.weiBalance,
          r = t.tokenData,
          n = t.tokenRates,
          s = t.currencyData,
          o = t.selectedCurrency,
          i = t.networkType,
          c = t.selectedAddress;
        i.host !== p["MAINNET"] && (r = {}, n = {});
        var l = 1;
        "ETH" !== o && (l = s[o.toLowerCase()] || 1);
        var d = [{
          balance: a[c],
          decimals: 18,
          erc20: !1,
          logo: "eth.svg",
          name: "Ethereum",
          symbol: "ETH",
          tokenAddress: "0x"
        }];
        r && r[c] && Object.keys(r[c]).length > 0 && (d = [].concat(Object(F["a"])(d), Object(F["a"])(r[c])));
        var u = 0,
          g = d.map((function (e) {
            var t = parseFloat(Object(h["hexToNumberString"])(e.balance)) / Math.pow(10, parseFloat(e.decimals)) || 0,
              a = 1;
            "0x" !== e.tokenAddress && (a = n[e.tokenAddress.toLowerCase()] || 0);
            var r = l * a,
              s = Object(b["significantDigits"])(t * r || 0, !1, 3);
            return u += s, "ETH" !== o && (s = Object(b["formatCurrencyNumber"])(s)), getters_objectSpread({}, e, {
              id: e.symbol,
              computedBalance: t,
              formattedBalance: "".concat(e.symbol, " ").concat(Object(b["significantDigits"])(t || 0, !1, 3)),
              currencyBalance: "".concat(o, " ").concat(s),
              currencyRateText: "1 ".concat(e.symbol, " = ").concat(Object(b["significantDigits"])(r || 0), " ").concat(o)
            })
          }));
        return u = Object(b["significantDigits"])(u, !1, 3) || 0, "ETH" !== o && (u = Object(b["formatCurrencyNumber"])(u)), {
          finalBalancesArray: g,
          totalPortfolioValue: u
        }
      },
      G = function collectibleBalances(e) {
        var t = e || {},
          a = t.networkType,
          r = t.assets,
          n = t.selectedAddress;
        return a.host !== p["MAINNET"] && (r[n] = []), r[n] || []
      },
      K = {
        unApprovedTransactions: U,
        tokenBalances: H,
        collectibleBalances: G
      };
    a("a434");

    function mutations_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function mutations_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? mutations_ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : mutations_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var Y = {
      setUserInfo: function setUserInfo(e, t) {
        e.userInfo = t
      },
      setIdToken: function setIdToken(e, t) {
        e.idToken = t
      },
      setWallet: function setWallet(e, t) {
        e.wallet = t
      },
      setWeiBalance: function setWeiBalance(e, t) {
        e.weiBalance = t
      },
      setTokenData: function setTokenData(e, t) {
        e.tokenData = mutations_objectSpread({}, e.tokenData, {}, t)
      },
      setTokenRates: function setTokenRates(e, t) {
        e.tokenRates = t
      },
      setSelectedAddress: function setSelectedAddress(e, t) {
        e.selectedAddress = t
      },
      setNetworkId: function setNetworkId(e, t) {
        e.networkId = t
      },
      setNetworkType: function setNetworkType(e, t) {
        e.networkType = t
      },
      setTransactions: function setTransactions(e, t) {
        e.transactions = t
      },
      setLoginInProgress: function setLoginInProgress(e, t) {
        e.loginInProgress = t
      },
      setCurrencyData: function setCurrencyData(e, t) {
        e.currencyData = mutations_objectSpread({}, e.currencyData, Object(r["a"])({}, t.currentCurrency, t.conversionRate))
      },
      setCurrency: function setCurrency(e, t) {
        e.selectedCurrency = t
      },
      setTypedMessages: function setTypedMessages(e, t) {
        e.unapprovedTypedMessages = t
      },
      setPersonalMessages: function setPersonalMessages(e, t) {
        e.unapprovedPersonalMsgs = t
      },
      setMessages: function setMessages(e, t) {
        e.unapprovedMsgs = t
      },
      setJwtToken: function setJwtToken(e, t) {
        e.jwtToken = t
      },
      setUserInfoAccess: function setUserInfoAccess(e, t) {
        e.userInfoAccess = t
      },
      setNewUser: function setNewUser(e, t) {
        e.isNewUser = t
      },
      setPastTransactions: function setPastTransactions(e, t) {
        e.pastTransactions = t
      },
      patchPastTransactions: function patchPastTransactions(e, t) {
        e.pastTransactions = [].concat(Object(F["a"])(e.pastTransactions), [t])
      },
      setTheme: function setTheme(e, t) {
        e.theme = t
      },
      setAssets: function setAssets(e, t) {
        e.assets = mutations_objectSpread({}, e.assets, {}, t)
      },
      setBillboard: function setBillboard(e, t) {
        e.billboard = t
      },
      setContacts: function setContacts(e, t) {
        e.contacts = t
      },
      addContacts: function addContacts(e, t) {
        e.contacts = [].concat(Object(F["a"])(e.contacts), Object(F["a"])(t))
      },
      deleteContact: function deleteContact(e, t) {
        e.contacts.splice(t, 1)
      },
      logOut: function logOut(e, t) {
        Object.keys(e).forEach((function (a) {
          e[a] = t[a]
        }))
      }
    };

    function store_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function store_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? store_ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : store_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }

    function getCurrencyMultiplier() {
      var e = W.state || {},
        t = e.selectedCurrency,
        a = e.currencyData,
        r = 1;
      return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
    }
    var q = m["default"].baseRoute;
    g["a"].use(f["a"]);
    var z = new v["a"]({
        key: "torus-app",
        storage: window.sessionStorage,
        reducer: function reducer(e) {
          return {
            userInfo: e.userInfo,
            userInfoAccess: e.userInfoAccess,
            idToken: e.idToken,
            wallet: e.wallet,
            selectedAddress: e.selectedAddress,
            networkType: e.networkType,
            networkId: e.networkId,
            currencyData: e.currencyData,
            tokenRates: e.tokenRates,
            selectedCurrency: e.selectedCurrency,
            jwtToken: e.jwtToken,
            theme: e.theme,
            billboard: e.billboard,
            contacts: e.contacts
          }
        }
      }),
      W = new f["a"].Store({
        plugins: [z.plugin],
        state: k,
        getters: K,
        mutations: Y,
        actions: store_objectSpread({}, V, {
          showPopup: function showPopup(e, t) {
            var a = e.state,
              r = e.getters,
              s = new n["a"]("torus_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]),
              o = isTorusTransaction(),
              i = 500,
              c = o ? 660 : 400;
            if (window.open("".concat(q, "confirm?instanceId=").concat(u["a"].instanceId), "_blank", "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=".concat(c, ",width=").concat(i)), o) {
              var l = Object(h["fromWei"])(this.state.weiBalance[this.state.selectedAddress].toString());
              s.onmessage = function _callee(e) {
                var t;
                return regeneratorRuntime.async((function _callee$(n) {
                  while (1) switch (n.prev = n.next) {
                    case 0:
                      if ("popup-loaded" !== e.data) {
                        n.next = 5;
                        break
                      }
                      return t = r.unApprovedTransactions[r.unApprovedTransactions.length - 1], n.next = 4, regeneratorRuntime.awrap(s.postMessage({
                        data: {
                          origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                          type: "transaction",
                          txParams: store_objectSpread({}, t, {
                            network: a.networkType.host
                          }),
                          balance: l
                        }
                      }));
                    case 4:
                      s.close();
                    case 5:
                    case "end":
                      return n.stop()
                  }
                }))
              }
            } else {
              var d = getLatestMessageParams(),
                p = d.msgParams,
                g = d.id;
              s.onmessage = function _callee2(e) {
                return regeneratorRuntime.async((function _callee2$(t) {
                  while (1) switch (t.prev = t.next) {
                    case 0:
                      if ("popup-loaded" !== e.data) {
                        t.next = 4;
                        break
                      }
                      return t.next = 3, regeneratorRuntime.awrap(s.postMessage({
                        data: {
                          origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
                          type: "message",
                          msgParams: {
                            msgParams: p,
                            id: g
                          }
                        }
                      }));
                    case 3:
                      s.close();
                    case 4:
                    case "end":
                      return t.stop()
                  }
                }))
              }
            }
          }
        })
      });

    function getLatestMessageParams() {
      var e = 0,
        t = null,
        a = 0;
      for (var r in W.state.unapprovedMsgs) {
        var n = W.state.unapprovedMsgs[r].time;
        n > e && (t = W.state.unapprovedMsgs[r], e = n, a = r)
      }
      for (var s in W.state.unapprovedPersonalMsgs) {
        var o = W.state.unapprovedPersonalMsgs[s].time;
        o > e && (t = W.state.unapprovedPersonalMsgs[s], e = o, a = s)
      }
      if (t) {
        var i;
        try {
          i = Object(h["hexToUtf8"])(t.msgParams.data)
        } catch (d) {
          i = t.msgParams.data
        }
        t.msgParams.message = i
      }
      for (var c in W.state.unapprovedTypedMessages) {
        var l = W.state.unapprovedTypedMessages[c].time;
        l > e && (e = l, t = W.state.unapprovedTypedMessages[c], t.msgParams.typedMessages = t.msgParams.data, a = c)
      }
      return t ? {
        msgParams: t.msgParams,
        id: a
      } : {}
    }

    function isTorusTransaction() {
      if (Object.keys(W.state.unapprovedPersonalMsgs).length > 0) return !1;
      if (Object.keys(W.state.unapprovedMsgs).length > 0) return !1;
      if (Object.keys(W.state.unapprovedTypedMessages).length > 0) return !1;
      if (W.getters.unApprovedTransactions.length > 0) return !0;
      throw new Error("No new transactions.")
    }
    W.subscribe((function (e, t) {
      if ("setTransactions" === e.type && t.jwtToken) {
        var a = e.payload;
        for (var r in a) {
          var n = a[r];
          "submitted" === n.status && r >= 0 && function () {
            var e = n.hash,
              a = Object(h["fromWei"])(Object(h["toBN"])(n.txParams.value).add(Object(h["toBN"])(n.txParams.gas).mul(Object(h["toBN"])(n.txParams.gasPrice)))),
              r = {
                created_at: new Date(n.time),
                from: Object(h["toChecksumAddress"])(n.txParams.from),
                to: Object(h["toChecksumAddress"])(n.txParams.to),
                total_amount: a,
                currency_amount: (getCurrencyMultiplier() * a).toString(),
                selected_currency: t.selectedCurrency,
                status: "submitted",
                network: t.networkType.host,
                transaction_hash: n.hash
              }; - 1 === t.pastTransactions.findIndex((function (e) {
              return e.transaction_hash === r.transaction_hash && e.network === r.network
            })) && (notifyUser(Object(b["getEtherScanHashLink"])(e, t.networkType.host)), Object(x["post"])("".concat(m["default"].api, "/transaction"), r, {
              headers: {
                Authorization: "Bearer ".concat(t.jwtToken),
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then((function (e) {
              e.response.length > 0 && W.commit("patchPastTransactions", store_objectSpread({}, r, {
                id: e.response[0]
              })), o.a.info("successfully added", e)
            })).catch((function (e) {
              return o.a.error(e, "unable to insert transaction")
            })))
          }()
        }
      }
    }));
    var Q = W;

    function setupStoreChannels_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function setupStoreChannels_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? setupStoreChannels_ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : setupStoreChannels_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    u["a"].torusController.networkController.networkStore.subscribe((function (e) {
      Q.dispatch("updateNetworkId", {
        networkId: e
      })
    }));
    var J = new d.a.PassThrough({
      objectMode: !0
    });
    J.on("data", (function () {
      o.a.info("p data:", arguments)
    })), u["a"].communicationMux.getStream("oauth").on("data", (function (e) {
      Q.dispatch("triggerLogin", {
        calledFromEmbed: e.data.calledFromEmbed,
        verifier: e.data.verifier
      })
    })), u["a"].communicationMux.getStream("show_wallet").on("data", (function (e) {
      Q.dispatch("showWalletPopup", {
        path: e.data.path || ""
      })
    })), u["a"].communicationMux.getStream("show_provider_change").on("data", (function (e) {
      if ("show_provider_change" === e.name) {
        var t = u["a"].communicationMux.getStream("provider_change_status");
        e.data.override ? Q.dispatch("setProviderType", e.data).then((function () {
          setTimeout((function () {
            t.write({
              name: "provider_change_status",
              data: {
                success: !0
              }
            })
          }), 100)
        })).catch((function (e) {
          t.write({
            name: "provider_change_status",
            data: {
              success: !1,
              err: e
            }
          })
        })) : Q.dispatch("showProviderChangePopup", setupStoreChannels_objectSpread({}, e.data))
      }
    })), u["a"].communicationMux.getStream("logout").on("data", (function (e) {
      "logOut" === e.name && Q.dispatch("logOut")
    }));
    var Z = u["a"].communicationMux.getStream("user_info");
    Z.on("data", (function (e) {
      if ("user_info_request" === e.name) {
        var t = new n["a"]("user_info_request_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
        switch (Q.state.userInfoAccess) {
          case p["USER_INFO_REQUEST_APPROVED"]:
            t.postMessage({
              data: {
                type: "confirm-user-info-request",
                approve: !0
              }
            });
            break;
          case p["USER_INFO_REQUEST_REJECTED"]:
            t.postMessage({
              data: {
                type: "deny-user-info-request",
                approve: !1
              }
            });
            break;
          case p["USER_INFO_REQUEST_NEW"]:
          default:
            Q.dispatch("showUserInfoRequestPopup", setupStoreChannels_objectSpread({}, e.data));
            break
        }
      }
    })), c()(u["a"].communicationMux.getStream("oauth"), J, (function (e) {
      e && o.a.error(e)
    }));
    var X = new n["a"]("torus_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    X.onmessage = function (e) {
      if ("confirm-transaction" === e.data.type) {
        var t = u["a"].torusController,
          a = Q.state;
        if (Object.keys(a.unapprovedPersonalMsgs).length > 0) {
          var r = a.unapprovedPersonalMsgs[e.data.id].msgParams;
          o.a.info("PERSONAL MSG PARAMS:", r), r.metamaskId = parseInt(e.data.id, 10), t.signPersonalMessage(r)
        } else if (Object.keys(a.unapprovedMsgs).length > 0) {
          var n = a.unapprovedMsgs[e.data.id].msgParams;
          o.a.info(" MSG PARAMS:", n), n.metamaskId = parseInt(e.data.id, 10), t.signMessage(n)
        } else if (Object.keys(a.unapprovedTypedMessages).length > 0) {
          var s = a.unapprovedTypedMessages[e.data.id].msgParams;
          o.a.info("TYPED MSG PARAMS:", s), s.metamaskId = parseInt(e.data.id, 10), t.signTypedMessage(s)
        } else {
          if (!(Object.keys(a.transactions).length > 0)) throw new Error("No new transactions.");
          var i = Q.getters.unApprovedTransactions,
            c = i.find((function (t) {
              return t.id === e.data.id
            }));
          if (o.a.info("STANDARD TX PARAMS:", c), e.data.gasPrice) {
            o.a.info("Changed gas price to:", e.data.gasPrice);
            var l = JSON.parse(JSON.stringify(c));
            l.txParams.gasPrice = e.data.gasPrice, t.txController.updateTransaction(l), c = l, o.a.info("New txMeta: ", c)
          }
          t.updateAndApproveTransaction(c)
        }
      } else if ("deny-transaction" === e.data.type) {
        var d = u["a"].torusController,
          p = Q.state;
        Object.keys(p.unapprovedPersonalMsgs).length > 0 ? d.cancelPersonalMessage(parseInt(e.data.id, 10)) : Object.keys(p.unapprovedMsgs).length > 0 ? d.cancelMessage(parseInt(e.data.id, 10)) : Object.keys(p.unapprovedTypedMessages).length > 0 ? d.cancelTypedMessage(parseInt(e.data.id, 10)) : Object.keys(p.transactions).length > 0 && d.cancelTransaction(parseInt(e.data.id, 10))
      }
    };
    var $ = new n["a"]("torus_provider_change_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    $.onmessage = function (e) {
      if (e.data && "confirm-provider-change" === e.data.type && e.data.approve) {
        o.a.info("Provider change approved", e.data.payload);
        var t = u["a"].communicationMux.getStream("provider_change_status");
        Q.dispatch("setProviderType", e.data.payload).then((function () {
          setTimeout((function () {
            t.write({
              name: "provider_change_status",
              data: {
                success: !0
              }
            })
          }), 100)
        })).catch((function (e) {
          t.write({
            name: "provider_change_status",
            data: {
              success: !1,
              err: e
            }
          })
        }))
      } else e.data && "deny-provider-change" === e.data.type && o.a.info("Provider change denied")
    };
    var ee = new n["a"]("torus_logout_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    ee.onmessage = function (e) {
      o.a.info("received logging message", e), e.data && "logout" === e.data.type && (o.a.info("Logging Out", e.data), Q.dispatch("logOut"))
    };
    var te = new n["a"]("user_info_request_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    te.onmessage = function (e) {
      if (e.data && "confirm-user-info-request" === e.data.type && e.data.approve) {
        o.a.info("User Info Request approved"), Q.dispatch("updateUserInfoAccess", {
          approved: !0
        });
        var t = JSON.parse(JSON.stringify(Q.state.userInfo));
        delete t.verifierParams, Z.write({
          name: "user_info_response",
          data: {
            payload: t,
            approved: !0
          }
        })
      } else e.data && "deny-user-info-request" === e.data.type && (o.a.info("User Info Request denied"), Q.dispatch("updateUserInfoAccess", {
        approved: !1
      }), Z.write({
        name: "user_info_response",
        data: {
          payload: {},
          approved: !1
        }
      }))
    };
    var ae = new n["a"]("account_import_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    ae.onmessage = function (e) {
      e.data && "imported_account" === e.data.name && e.data.payload && (o.a.info("importing user account"), Object.values(Q.state.wallet).includes(e.data.payload.privKey) || Q.dispatch("finishImportAccount", e.data.payload))
    };
    var re = new n["a"]("selected_address_channel_".concat(u["a"].instanceId), b["broadcastChannelOptions"]);
    re.onmessage = function (e) {
      e.data && "selected_address" == e.data.name && e.data.payload && (o.a.info("setting selected address"), Q.state.selectedAddress !== e.data.payload && Q.dispatch("updateSelectedAddress", {
        selectedAddress: e.data.payload
      }))
    };
    var ne = Q;
    t["a"] = ne
  },
  "43b0": function (e, t, a) {
    e.exports = a.p + "img/android-chrome-192x192.6613f286.png"
  },
  "43e5": function (e, t, a) {
    e.exports = a.p + "img/twitch.0a063034.svg"
  },
  "440d": function (e, t, a) {
    e.exports = a.p + "img/redcab.e7244bdc.png"
  },
  4603: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return ee
    }));
    a("99af"), a("caad"), a("0d03"), a("d3b7"), a("e25e"), a("25f0"), a("2532");
    var r = a("2fa7"),
      n = (a("96cf"), a("9f12")),
      s = a("53fe"),
      o = a("8b83"),
      i = a("c65a"),
      c = a("c03e"),
      l = a("eeb9"),
      d = a("faa1"),
      u = a("c897"),
      p = a("908c"),
      g = a("5c7d"),
      f = a("e9d0"),
      v = a("09b1"),
      h = a("d5a1"),
      m = a("2e2a"),
      b = a("ce2d"),
      x = a("9d27"),
      y = a("05b3"),
      w = a("63d3"),
      k = a("0ace"),
      C = a("e2b7"),
      A = a("056c"),
      T = a("1b27"),
      _ = a("579c"),
      S = a("417a"),
      O = a("b2e1").default,
      E = a("c848"),
      I = a("ae75"),
      M = a("ac9a"),
      P = M.createSwappableProxy,
      R = M.createEventEmitterProxy,
      L = {
        type: "mainnet"
      },
      j = {
        ticker: "ETH"
      },
      D = {
        networkList: {}
      },
      N = a("b00c"),
      B = N.ROPSTEN,
      V = N.RINKEBY,
      F = N.KOVAN,
      U = N.MAINNET,
      H = N.LOCALHOST,
      G = N.GOERLI,
      K = N.MATIC,
      Y = N.MATIC_URL,
      q = N.MATIC_CODE,
      z = N.MAINNET_CODE,
      W = N.GOERLI_CODE,
      Q = N.ROPSTEN_CODE,
      J = N.KOVAN_CODE,
      Z = N.RINKEBY_CODE,
      X = N.SUPPORTED_NETWORK_TYPES,
      $ = [B, V, F, U, G],
      ee = function (e) {
        function NetworkController() {
          var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          Object(n["a"])(this, NetworkController), e = Object(o["a"])(this, Object(i["a"])(NetworkController).call(this)), e.defaultMaxListeners = 20;
          var a = t.provider || L;
          return g.info(a), X[a.rpcTarget] || (a.type = "rpc"), e.providerStore = new u(a), e.networkStore = new u("loading"), e.networkConfig = new u(j), e.store = new p({
            provider: e.providerStore,
            network: e.networkStore,
            settings: e.networkConfig
          }), e.on("networkDidChange", e.lookupNetwork), e._provider = null, e._blockTracker = null, e._providerProxy = null, e._blockTrackerProxy = null, e
        }
        return Object(c["a"])(NetworkController, e), Object(s["a"])(NetworkController, [{
          key: "getNetworkNameFromNetworkCode",
          value: function getNetworkNameFromNetworkCode() {
            switch (parseInt(this.getNetworkState())) {
              case z:
                return U;
              case Z:
                return V;
              case Q:
                return B;
              case J:
                return F;
              case W:
                return G;
              default:
                return "loading"
            }
          }
        }, {
          key: "initializeProvider",
          value: function initializeProvider(e) {
            this._baseProviderParams = e;
            var t = this.providerStore.getState(),
              a = t.type,
              r = t.rpcTarget,
              n = t.chainId,
              s = t.ticker,
              o = t.nickname;
            return this._configureProvider({
              type: a,
              rpcTarget: r,
              chainId: n,
              ticker: s,
              nickname: o
            }), this.lookupNetwork(), this._providerProxy
          }
        }, {
          key: "getProviderAndBlockTracker",
          value: function getProviderAndBlockTracker() {
            var e = this._providerProxy,
              t = this._blockTrackerProxy;
            return {
              provider: e,
              blockTracker: t
            }
          }
        }, {
          key: "verifyNetwork",
          value: function verifyNetwork() {
            this.isNetworkLoading() && this.lookupNetwork()
          }
        }, {
          key: "getNetworkState",
          value: function getNetworkState() {
            return this.networkStore.getState()
          }
        }, {
          key: "getNetworkConfig",
          value: function getNetworkConfig() {
            return this.networkConfig.getState()
          }
        }, {
          key: "setNetworkState",
          value: function setNetworkState(e, t) {
            return "loading" === e ? this.networkStore.putState(e) : t ? (e = D.networkList[t] && D.networkList[t].chainId ? D.networkList[t].chainId : e, this.networkStore.putState(e)) : void 0
          }
        }, {
          key: "isNetworkLoading",
          value: function isNetworkLoading() {
            return "loading" === this.getNetworkState()
          }
        }, {
          key: "lookupNetwork",
          value: function lookupNetwork() {
            var e = this;
            if (!this._provider) return g.warn("NetworkController - lookupNetwork aborted due to missing provider");
            var t = this.providerStore.getState(),
              a = t.type,
              r = new S(this._provider),
              n = this.getNetworkState();
            r.sendAsync({
              method: "net_version"
            }, (function (t, r) {
              var s = e.getNetworkState();
              if (n === s) {
                if (t) return e.setNetworkState("loading");
                g.info("web3.getNetwork returned " + r), e.setNetworkState(r, a)
              }
            }))
          }
        }, {
          key: "setRpcTarget",
          value: function setRpcTarget(e, t) {
            var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "ETH",
              r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
              n = arguments.length > 4 ? arguments[4] : void 0,
              s = {
                type: "rpc",
                rpcTarget: e,
                chainId: t,
                ticker: a,
                nickname: r,
                rpcPrefs: n
              };
            this.providerConfig = s
          }
        }, {
          key: "setProviderType",
          value: function setProviderType(e) {
            var t, a, r, n, s = arguments;
            return regeneratorRuntime.async((function setProviderType$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  t = s.length > 1 && void 0 !== s[1] ? s[1] : "", a = s.length > 2 && void 0 !== s[2] ? s[2] : "ETH", r = s.length > 3 && void 0 !== s[3] ? s[3] : "", l.notStrictEqual(e, "rpc", 'NetworkController - cannot call "setProviderType" with type \'rpc\'. use "setRpcTarget"'), l($.includes(e) || e === H || e === K, 'NetworkController - Unknown rpc type "'.concat(e, '"')), n = {
                    type: e,
                    rpcTarget: t,
                    ticker: a,
                    nickname: r
                  }, this.providerConfig = n;
                case 7:
                case "end":
                  return o.stop()
              }
            }), null, this)
          }
        }, {
          key: "resetConnection",
          value: function resetConnection() {
            this.providerConfig = this.getProviderConfig()
          }
        }, {
          key: "getProviderConfig",
          value: function getProviderConfig() {
            return this.providerStore.getState()
          }
        }, {
          key: "_switchNetwork",
          value: function _switchNetwork(e) {
            this.setNetworkState("loading"), this._configureProvider(e), this.emit("networkDidChange")
          }
        }, {
          key: "_configureProvider",
          value: function _configureProvider(e) {
            var t = e.type,
              a = e.rpcTarget,
              n = e.chainId,
              s = e.ticker,
              o = e.nickname,
              i = $.includes(t);
            if (i) this._configureInfuraProvider(e);
            else if (t === H) this._configureLocalhostProvider();
            else if (t === K) this._configureStandardProvider(Object(r["a"])({
              rpcUrl: Y,
              MATIC_CODE: q,
              MATIC: K
            }, "MATIC", K));
            else {
              if ("rpc" !== t) throw new Error('NetworkController - _configureProvider - unknown type "'.concat(t, '"'));
              this._configureStandardProvider({
                rpcUrl: a,
                chainId: n,
                ticker: s,
                nickname: o
              })
            }
          }
        }, {
          key: "_configureInfuraProvider",
          value: function _configureInfuraProvider(e) {
            var t = e.type;
            g.info("NetworkController - configureInfuraProvider", t);
            var a = createInfuraClient({
              network: t
            });
            this._setNetworkClient(a);
            var r = {
              ticker: "ETH"
            };
            this.networkConfig.putState(r)
          }
        }, {
          key: "_configureLocalhostProvider",
          value: function _configureLocalhostProvider() {
            g.info("NetworkController - configureLocalhostProvider");
            var e = createLocalhostClient();
            this._setNetworkClient(e)
          }
        }, {
          key: "_configureStandardProvider",
          value: function _configureStandardProvider(e) {
            var t = e.rpcUrl,
              a = e.chainId,
              r = e.ticker,
              n = e.nickname;
            g.info("NetworkController - configureStandardProvider", t);
            var s = createJsonRpcClient({
              rpcUrl: t
            });
            D.networkList["rpc"] = {
              chainId: a,
              rpcUrl: t,
              ticker: r || "ETH",
              nickname: n
            };
            var o = {
              network: a
            };
            o = f(o, D.networkList["rpc"]), this.networkConfig.putState(o), this._setNetworkClient(s)
          }
        }, {
          key: "_setNetworkClient",
          value: function _setNetworkClient(e) {
            var t = e.networkMiddleware,
              a = e.blockTracker,
              r = O(this._baseProviderParams),
              n = new E;
            n.push(r), n.push(t);
            var s = I(n);
            this._setProviderAndBlockTracker({
              provider: s,
              blockTracker: a
            })
          }
        }, {
          key: "_setProviderAndBlockTracker",
          value: function _setProviderAndBlockTracker(e) {
            var t = e.provider,
              a = e.blockTracker;
            this._providerProxy ? this._providerProxy.setTarget(t) : this._providerProxy = P(t), this._blockTrackerProxy ? this._blockTrackerProxy.setTarget(a) : this._blockTrackerProxy = R(a, {
              eventFilter: "skipInternal"
            }), this._provider = t, t.setMaxListeners(100), this._blockTracker = a
          }
        }, {
          key: "_logBlock",
          value: function _logBlock(e) {
            g.info("BLOCK CHANGED: #".concat(e.number.toString("hex"), " 0x").concat(e.hash.toString("hex"))), this.verifyNetwork()
          }
        }, {
          key: "providerConfig",
          set: function set(e) {
            this.providerStore.updateState(e), this._switchNetwork(e)
          }
        }]), NetworkController
      }(d);

    function createInfuraClient(e) {
      var t = e.network,
        a = T({
          network: t
        }),
        r = k(a),
        n = new _({
          provider: r
        }),
        s = v([createNetworkAndChainIdMiddleware({
          network: t
        }), x({
          blockTracker: n
        }), y(), m({
          blockTracker: n,
          provider: r
        }), b({
          blockTracker: n,
          provider: r
        }), w({
          blockTracker: n
        }), a]);
      return {
        networkMiddleware: s,
        blockTracker: n
      }
    }

    function createNetworkAndChainIdMiddleware(e) {
      var t, a, r = e.network;
      switch (r) {
        case "mainnet":
          a = "1", t = "0x01";
          break;
        case "ropsten":
          a = "3", t = "0x03";
          break;
        case "rinkeby":
          a = "4", t = "0x04";
          break;
        case "kovan":
          a = "42", t = "0x2a";
          break;
        case "goerli":
          a = "5", t = "0x05";
          break;
        default:
          throw new Error('createInfuraClient - unknown network "'.concat(r, '"'))
      }
      return h({
        eth_chainId: t,
        net_version: a
      })
    }

    function createLocalhostClient() {
      var e = C({
          rpcUrl: "https://localhost:8545/"
        }),
        t = k(e),
        a = new _({
          provider: t,
          pollingInterval: 1e3
        }),
        r = v([A({
          blockTracker: a
        }), w({
          blockTracker: a
        }), e]);
      return {
        networkMiddleware: r,
        blockTracker: a
      }
    }

    function createJsonRpcClient(e) {
      var t = e.rpcUrl,
        a = C({
          rpcUrl: t
        }),
        r = k(a),
        n = new _({
          provider: r
        }),
        s = v([A({
          blockTracker: n
        }), x({
          blockTracker: n
        }), y(), w({
          blockTracker: n
        }), a]);
      return {
        networkMiddleware: s,
        blockTracker: n
      }
    }
  },
  "46c1": function (e, t, a) {
    e.exports = a.p + "img/bitclave.bf3f2f53.svg"
  },
  "4aec2": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".svg-setting-tiny[data-v-6527f84c]{width:18px;height:18px}.svg-setting-small[data-v-6527f84c]{width:24px;height:24px}.svg-setting-medium[data-v-6527f84c]{width:38px;height:38px}.svg-setting-large[data-v-6527f84c]{width:80px;height:80px}.spanWrapSvgStyle[data-v-6527f84c]{justify-content:start;align-items:center;display:inline-flex}.text-bluish[data-v-6527f84c]{color:var(--v-torus_blue-base)}.select-width[data-v-6527f84c]{width:80px}[data-v-6527f84c] .nav-selector{display:inline-flex}[data-v-6527f84c] .nav-selector .v-select__selection{margin:0}[data-v-6527f84c] .nav-selector .v-input__slot:before{border:0}[data-v-6527f84c] .nav-selector.v-text-field .v-input__append-inner{margin-top:3px}[data-v-6527f84c] .nav-selector.transaction{max-width:150px}[data-v-6527f84c] .nav-selector.period{max-width:130px}[data-v-6527f84c] .nav-selector .v-icon{color:var(--v-text_2-base)}", ""])
  },
  "4af8": function (e, t, a) {
    e.exports = a.p + "img/divi.dd1076c2.svg"
  },
  "4c22": function (e, t, a) {
    e.exports = a.p + "img/havven_nusd.2bba0934.png"
  },
  "4c4c": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAADTElEQVRIDaWW2cvNQRjHX/tWbmzJrlD2CClbKUr5DxSXXFEu3MmViJAbyZZy6VLhEhFFCpFQtihbluzr53N+53uaznvOa3vqM/PMM888M/PMnPmdbh1dSw+6vxcuvdD7g3blB3yALzbqYp/2nzGUdbeyUejd0R0UmYAyB+bCGOgLjv0MD+AqXIKbEGmOEXunWsfIfJRtcB1ccVfcpn8XLIFspIyFubPEYShdO+AplJOY3lYkhfq+hL0wApTErFpFmY5J2E5AJvqK/q1ox95cuxB9Yz+D7hEoiV21KHMJpqBfAAe56jKAtjdwGc7VuUj9AjKJtWOcXP0azASlMWmUYRhPg45JWwLdwbYJpoLpliF1JlKvARcSfxebrLiB8aBkrlpjC2XzZA7cB2PhdzIIh83wGozj2Ox0P3pvaMg8NNOlY1amvhVKcYWtKH1W0/gEzbGWxskAXn0dXJErUz8OEc84Vz225lqfyE6UxMs90FbzGYVyr+6Q3b2iPQOUMlBlaV/GdyQuj8FJwzv0qT0pfKrGgZJdnEL3oigO+FMxO8oT2AAr4TOYxT5QW5C/u6wih7wW279KFu34fk30coet5H3d6OC/2aHDSv+P9TiNqt2E5Sobzn+pmEZTWC7gW7sJ/Qz9r3ieOdNGrHYTzsbjGHjg/5JWdzcNZoE337b4ktW+bw+p3Xp+Fo/QR4OSq161ui7jOxC38qkzto+Bb3WH6dsDGnNL1XdDJIHSblW7g8h6FGNINnEIvS/UZBFl83PkC7Gu6q6VSYspLok9rotRnkE5mfryOKTeXndyl9mpr8NG+JMd4taxCnI8XpjszvvgA1OTBBtDy09JVpZJHXgSVsBwGACmxpfDIIPBx/8I+LtzvGPyht5Ar50ddY/83pzUCfxCHwYdHOTgLEj9FngZ8jD4yfHNnQ7qinEUx90Hd30eTL0xG6JB8Qt9FpxAXGl2G1urutyV/VdhISiJXbWKMh3jsB2Et5DgTtoV8fPyeWa+0UpiVq0WZRxM0TI4AE8hAdvVL/A5Cn4hckESC1MlOcO0U+uYfDuxaV4Ak8H/Mtoca7qfw104A1fAHSpljMpC2W5CHexzkGmM+LnxdtonLsq/+R8g4mXRbiY6yS9IFh6qVkpsxAAAAABJRU5ErkJggg=="
  },
  "4c95": function (e, t, a) {
    e.exports = a.p + "img/discord.2e066c33.svg"
  },
  "4cf0": function (e, t, a) {
    var r = a("56db");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("6ea178c9", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "4df4": function (e, t, a) {
    var r = a("3df7");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("4d935a3a", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "4e44": function (e, t, a) {
    e.exports = a.p + "img/kyber.c2a14619.svg"
  },
  "4ea4": function (e, t, a) {
    e.exports = a.p + "img/torus-icon-light.104183c5.svg"
  },
  "4ef4": function (e, t, a) {
    e.exports = a.p + "img/facebook.24bcb97a.svg"
  },
  "4f44": function (e, t, a) {
    var r = a("7642");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("586bccd2", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "4fc9": function (e, t, a) {
    "use strict";
    a.r(t);
    a("a4d3"), a("4de4"), a("4160"), a("e439"), a("dbb4"), a("b64b"), a("159b");
    var r = a("2fa7"),
      n = a("9f12"),
      s = a("53fe"),
      o = a("8b83"),
      i = a("c65a"),
      c = a("c03e");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var l = a("a5f5").default,
      d = function (e) {
        function ComposableObservableStore(e, t) {
          var a;
          return Object(n["a"])(this, ComposableObservableStore), a = Object(o["a"])(this, Object(i["a"])(ComposableObservableStore).call(this, e)), a.updateStructure(t), a
        }
        return Object(c["a"])(ComposableObservableStore, e), Object(s["a"])(ComposableObservableStore, [{
          key: "updateStructure",
          value: function updateStructure(e) {
            var t = this;
            this.config = e, this.removeAllListeners();
            var a = function _loop(a) {
              e[a].subscribe((function (e) {
                t.updateState(Object(r["a"])({}, a, e))
              }))
            };
            for (var n in e) a(n)
          }
        }, {
          key: "getFlatState",
          value: function getFlatState() {
            var e = {};
            for (var t in this.config) e = _objectSpread({}, e, {}, this.config[t].getState());
            return e
          }
        }]), ComposableObservableStore
      }(l);
    t["default"] = d
  },
  5: function (e, t) {},
  "507e": function (e, t, a) {
    e.exports = a.p + "img/decentraland.30779288.png"
  },
  "50d0": function (e, t, a) {
    e.exports = a.p + "img/favicon.59438d39.png"
  },
  "50e1": function (e, t, a) {
    e.exports = a.p + "img/crypto-logo.091ce796.png"
  },
  "518f": function (e, t, a) {
    var r = a("a22e");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("2765f471", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "52d3": function (e, t, a) {
    "use strict";
    a.r(t);
    a("a4d3"), a("99af"), a("4de4"), a("7db0"), a("4160"), a("0d03"), a("b0c0"), a("a9e3"), a("9129"), a("e439"), a("dbb4"), a("b64b"), a("d3b7"), a("e25e"), a("25f0"), a("6062"), a("3ca3"), a("159b"), a("ddb0");
    var r = a("2fa7"),
      n = (a("96cf"), a("284c")),
      s = a("9f12"),
      o = a("53fe"),
      i = a("8b83"),
      c = a("c65a"),
      l = a("9aa6"),
      d = a("c03e"),
      u = (a("c975"), a("a15b"), a("d81d"), a("fb6a"), a("a434"), a("ac1f"), a("1276"), a("bf2d")),
      p = a("4879"),
      g = a.n(p),
      f = a("36ba"),
      v = new g.a,
      h = v.utils.sha3,
      m = function () {
        function AbiDecoder(e) {
          Object(s["a"])(this, AbiDecoder), this.state = {
            savedABIs: [],
            methodIDs: {}
          }, this.addABI(e)
        }
        return Object(o["a"])(AbiDecoder, [{
          key: "getABIs",
          value: function getABIs() {
            return this.state.savedABIs
          }
        }, {
          key: "addABI",
          value: function addABI(e) {
            var t = this;
            if (!Array.isArray(e)) throw new Error("Expected ABI array, got " + Object(u["a"])(e));
            e.map((function (e) {
              if (e.name) {
                var a = h(e.name + "(" + e.inputs.map((function (e) {
                  return e.type
                })).join(",") + ")");
                "event" === e.type ? t.state.methodIDs[a.slice(2)] = e : t.state.methodIDs[a.slice(2, 10)] = e
              }
            })), this.state.savedABIs = this.state.savedABIs.concat(e)
          }
        }, {
          key: "removeABI",
          value: function removeABI(e) {
            var t = this;
            if (!Array.isArray(e)) throw new Error("Expected ABI array, got " + Object(u["a"])(e));
            e.map((function (e) {
              if (e.name) {
                var a = h(e.name + "(" + e.inputs.map((function (e) {
                  return e.type
                })).join(",") + ")");
                "event" === e.type ? t.state.methodIDs[a.slice(2)] && delete t.state.methodIDs[a.slice(2)] : t.state.methodIDs[a.slice(2, 10)] && delete t.state.methodIDs[a.slice(2, 10)]
              }
            }))
          }
        }, {
          key: "getMethodIDs",
          value: function getMethodIDs() {
            return this.state.methodIDs
          }
        }, {
          key: "decodeMethod",
          value: function decodeMethod(e) {
            var t = e.slice(2, 10),
              a = this.state.methodIDs[t];
            if (a) {
              for (var r = a.inputs.map((function (e) {
                  return e.type
                })), n = v.eth.abi.decodeParameters(r, e.slice(10)), s = {
                  name: a.name,
                  params: []
                }, o = 0; o < n.__length__; o++) {
                var i = n[o],
                  c = i,
                  l = 0 === a.inputs[o].type.indexOf("uint"),
                  d = 0 === a.inputs[o].type.indexOf("int"),
                  u = 0 === a.inputs[o].type.indexOf("address");
                if (l || d) {
                  var p = Array.isArray(i);
                  c = p ? i.map((function (e) {
                    return new f(e).toString()
                  })) : new f(i).toString()
                }
                if (u) {
                  var g = Array.isArray(i);
                  c = g ? i.map((function (e) {
                    return e.toLowerCase()
                  })) : i.toLowerCase()
                }
                s.params.push({
                  name: a.inputs[o].name,
                  value: c,
                  type: a.inputs[o].type
                })
              }
              return s
            }
          }
        }, {
          key: "decodeLogs",
          value: function decodeLogs(e) {
            var t = this;
            return e.map((function (e) {
              var a = e.topics[0].slice(2),
                r = t.state.methodIDs[a];
              if (r) {
                var n = e.data,
                  s = [],
                  o = 0,
                  i = 1,
                  c = [];
                r.inputs.map((function (e) {
                  e.indexed || c.push(e.type)
                }));
                var l = v.eth.abi.decodeParameters(c, n.slice(2));
                return r.inputs.map((function (t) {
                  var a = {
                    name: t.name,
                    type: t.type
                  };
                  if (t.indexed ? (a.value = e.topics[i], i++) : (a.value = l[o], o++), "address" === t.type && (a.value = a.value.toLowerCase(), a.value.length > 42)) {
                    var r = a.value.length - 42,
                      n = a.value.split("");
                    n.splice(2, r), a.value = n.join("")
                  }
                  "uint256" !== t.type && "uint8" !== t.type && "int" !== t.type || (a.value = new f(a.value).toString(10)), s.push(a)
                })), {
                  name: r.name,
                  events: s,
                  address: e.address
                }
              }
            }))
          }
        }]), AbiDecoder
      }(),
      b = m;

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var x = a("cb69"),
      y = a("c897"),
      w = a("b671"),
      k = a("dbd9"),
      C = a("58f5"),
      A = a("80fa"),
      T = a("231f"),
      _ = new b(A),
      S = new b(T),
      O = a("1131"),
      E = O.toChecksumAddress,
      I = a("0172"),
      M = a("9182").default,
      P = a("36dc").default,
      R = a("8aa9").default,
      L = a("bd8d").default,
      j = a("1f40"),
      D = a("19c9").default,
      N = a("5c7d"),
      B = a("b00c"),
      V = B.TRANSACTION_TYPE_CANCEL,
      F = B.TRANSACTION_TYPE_RETRY,
      U = B.TRANSACTION_TYPE_STANDARD,
      H = B.TRANSACTION_STATUS_APPROVED,
      G = B.TOKEN_METHOD_APPROVE,
      K = B.TOKEN_METHOD_TRANSFER,
      Y = B.TOKEN_METHOD_TRANSFER_FROM,
      q = B.SEND_ETHER_ACTION_KEY,
      z = B.DEPLOY_CONTRACT_ACTION_KEY,
      W = B.CONTRACT_INTERACTION_KEY,
      Q = B.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
      J = a("fa7d"),
      Z = J.hexToBn,
      X = J.bnToHex,
      $ = J.BnMultiplyByFraction,
      ee = function (e) {
        function TransactionController(e) {
          var t;
          return Object(s["a"])(this, TransactionController), t = Object(i["a"])(this, Object(c["a"])(TransactionController).call(this)), t.networkStore = e.networkStore || new y({}), t.preferencesStore = e.preferencesStore || new y({}), t.provider = e.provider, t.blockTracker = e.blockTracker, t.signEthTx = e.signTransaction, t.getGasPrice = e.getGasPrice, t.inProcessOfSigning = new Set, t.memStore = new y({}), t.query = new C(t.provider), t.txGasUtil = new P(t.provider), t.opts = e, t._mapMethods(), t.txStateManager = new M({
            initState: e.initState,
            txHistoryLimit: e.txHistoryLimit,
            getNetwork: t.getNetwork.bind(Object(l["a"])(t))
          }), t._onBootCleanUp(), t.store = t.txStateManager.store, t.nonceTracker = new L({
            provider: t.provider,
            blockTracker: t.blockTracker,
            getPendingTransactions: t.txStateManager.getPendingTransactions.bind(t.txStateManager),
            getConfirmedTransactions: t.txStateManager.getConfirmedTransactions.bind(t.txStateManager)
          }), t.pendingTxTracker = new R({
            provider: t.provider,
            nonceTracker: t.nonceTracker,
            publishTransaction: function publishTransaction(e) {
              return t.query.sendRawTransaction(e)
            },
            getPendingTransactions: function getPendingTransactions() {
              var e = t.txStateManager.getPendingTransactions(),
                a = t.txStateManager.getApprovedTransactions();
              return [].concat(Object(n["a"])(e), Object(n["a"])(a))
            },
            approveTransaction: t.approveTransaction.bind(Object(l["a"])(t)),
            getCompletedTransactions: t.txStateManager.getConfirmedTransactions.bind(t.txStateManager)
          }), t.txStateManager.store.subscribe((function () {
            return t.emit("update:badge")
          })), t._setupListeners(), t._updateMemstore(), t.txStateManager.store.subscribe((function () {
            return t._updateMemstore()
          })), t.networkStore.subscribe((function () {
            t._onBootCleanUp(), t._updateMemstore()
          })), t.preferencesStore.subscribe((function () {
            return t._updateMemstore()
          })), t._updatePendingTxsAfterFirstBlock(), t
        }
        return Object(d["a"])(TransactionController, e), Object(o["a"])(TransactionController, [{
          key: "getChainId",
          value: function getChainId() {
            var e = this.networkStore.getState(),
              getChainId = parseInt(e);
            return Number.isNaN(getChainId) ? 0 : getChainId
          }
        }, {
          key: "addTx",
          value: function addTx(e) {
            this.txStateManager.addTx(e), this.emit("".concat(e.id, ":unapproved"), e)
          }
        }, {
          key: "wipeTransactions",
          value: function wipeTransactions(e) {
            this.txStateManager.wipeTransactions(e)
          }
        }, {
          key: "newUnapprovedTransaction",
          value: function newUnapprovedTransaction(e) {
            var t, a, r = this,
              n = arguments;
            return regeneratorRuntime.async((function newUnapprovedTransaction$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  return t = n.length > 1 && void 0 !== n[1] ? n[1] : {}, N.debug("MetaMaskController newUnapprovedTransaction ".concat(JSON.stringify(e))), s.next = 4, regeneratorRuntime.awrap(this.addUnapprovedTransaction(e));
                case 4:
                  return a = s.sent, a.origin = t.origin, this.txStateManager.updateTx(a, "#newUnapprovedTransaction - adding the origin"), s.abrupt("return", new Promise((function (e, t) {
                    r.txStateManager.once("".concat(a.id, ":finished"), (function (a) {
                      switch (a.status) {
                        case "submitted":
                          return e(a.hash);
                        case "rejected":
                          return t(D(new Error("MetaMask Tx Signature: User denied transaction signature.")));
                        case "failed":
                          return t(D(new Error(a.err.message)));
                        default:
                          return t(D(new Error("MetaMask Tx Signature: Unknown problem: ".concat(JSON.stringify(a.txParams)))))
                      }
                    }))
                  })));
                case 8:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "addUnapprovedTransaction",
          value: function addUnapprovedTransaction(e) {
            var t, a, r, n, s, o, i;
            return regeneratorRuntime.async((function addUnapprovedTransaction$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  if (t = j.normalizeTxParams(e), t.from === this.getSelectedAddress()) {
                    c.next = 3;
                    break
                  }
                  throw new Error("Transaction from address is not valid for this account");
                case 3:
                  return j.validateTxParams(t), c.next = 6, regeneratorRuntime.awrap(this._determineTransactionCategory(e));
                case 6:
                  return a = c.sent, r = a.transactionCategory, n = a.getCodeResponse, s = a.methodParams, o = a.contractParams, i = this.txStateManager.generateTxMeta({
                    txParams: t,
                    type: U,
                    transactionCategory: r,
                    methodParams: s,
                    contractParams: o
                  }), this.addTx(i), c.prev = 13, c.next = 16, regeneratorRuntime.awrap(this.addTxGasDefaults(i, n));
                case 16:
                  i = c.sent, c.next = 25;
                  break;
                case 19:
                  throw c.prev = 19, c.t0 = c["catch"](13), N.warn(c.t0), i.loadingDefaults = !1, this.txStateManager.updateTx(i, "Failed to calculate gas defaults."), c.t0;
                case 25:
                  return this.emit("newUnapprovedTx", i), i.loadingDefaults = !1, this.txStateManager.updateTx(i), c.abrupt("return", i);
                case 29:
                case "end":
                  return c.stop()
              }
            }), null, this, [
              [13, 19]
            ])
          }
        }, {
          key: "addTxGasDefaults",
          value: function addTxGasDefaults(e, t) {
            var a, r, n;
            return regeneratorRuntime.async((function addTxGasDefaults$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  if (a = e.txParams, a.value = a.value ? w.addHexPrefix(a.value) : "0x0", e.gasPriceSpecified = Boolean(a.gasPrice), r = a.gasPrice, r) {
                    s.next = 13;
                    break
                  }
                  if (!this.getGasPrice) {
                    s.next = 9;
                    break
                  }
                  s.t0 = this.getGasPrice(), s.next = 12;
                  break;
                case 9:
                  return s.next = 11, regeneratorRuntime.awrap(this.query.gasPrice());
                case 11:
                  s.t0 = s.sent;
                case 12:
                  r = s.t0;
                case 13:
                  return a.gasPrice = w.addHexPrefix(r.toString(16)), s.next = 16, regeneratorRuntime.awrap(this.txGasUtil.analyzeGasUsage(e, t));
                case 16:
                  return n = s.sent, s.abrupt("return", n);
                case 18:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "retryTransaction",
          value: function retryTransaction(e, t) {
            var a, r, n, s, o, i, c;
            return regeneratorRuntime.async((function retryTransaction$(l) {
              while (1) switch (l.prev = l.next) {
                case 0:
                  return a = this.txStateManager.getTx(e), r = a.txParams, n = t || a.txParams.gasPrice, s = new w.BN(w.stripHexPrefix(this.getGasPrice()), 16), o = new w.BN(w.stripHexPrefix(n), 16), i = o.mul(new w.BN(110, 10)).div(new w.BN(100, 10)), r.gasPrice = s.gt(i) ? "0x".concat(s.toString(16)) : "0x".concat(i.toString(16)), c = this.txStateManager.generateTxMeta({
                    txParams: a.txParams,
                    lastGasPrice: n,
                    loadingDefaults: !1,
                    type: F
                  }), this.addTx(c), this.emit("newUnapprovedTx", c), l.abrupt("return", c);
                case 11:
                case "end":
                  return l.stop()
              }
            }), null, this)
          }
        }, {
          key: "createCancelTransaction",
          value: function createCancelTransaction(e, t) {
            var a, r, n, s, o, i, c;
            return regeneratorRuntime.async((function createCancelTransaction$(l) {
              while (1) switch (l.prev = l.next) {
                case 0:
                  return a = this.txStateManager.getTx(e), r = a.txParams, n = r.gasPrice, s = r.from, o = r.nonce, i = t || X($(Z(n), 11, 10)), c = this.txStateManager.generateTxMeta({
                    txParams: {
                      from: s,
                      to: s,
                      nonce: o,
                      gas: "0x5208",
                      value: "0x0",
                      gasPrice: i
                    },
                    lastGasPrice: n,
                    loadingDefaults: !1,
                    status: H,
                    type: V
                  }), this.addTx(c), l.next = 8, regeneratorRuntime.awrap(this.approveTransaction(c.id));
                case 8:
                  return l.abrupt("return", c);
                case 9:
                case "end":
                  return l.stop()
              }
            }), null, this)
          }
        }, {
          key: "createSpeedUpTransaction",
          value: function createSpeedUpTransaction(e, t) {
            var a, r, n, s, o;
            return regeneratorRuntime.async((function createSpeedUpTransaction$(i) {
              while (1) switch (i.prev = i.next) {
                case 0:
                  return a = this.txStateManager.getTx(e), r = a.txParams, n = r.gasPrice, s = t || X($(Z(n), 11, 10)), o = this.txStateManager.generateTxMeta({
                    txParams: _objectSpread({}, r, {
                      gasPrice: s
                    }),
                    lastGasPrice: n,
                    loadingDefaults: !1,
                    status: H,
                    type: F
                  }), this.addTx(o), i.next = 8, regeneratorRuntime.awrap(this.approveTransaction(o.id));
                case 8:
                  return i.abrupt("return", o);
                case 9:
                case "end":
                  return i.stop()
              }
            }), null, this)
          }
        }, {
          key: "updateTransaction",
          value: function updateTransaction(e) {
            return regeneratorRuntime.async((function updateTransaction$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  this.txStateManager.updateTx(e, "confTx: user updated transaction");
                case 1:
                case "end":
                  return t.stop()
              }
            }), null, this)
          }
        }, {
          key: "updateAndApproveTransaction",
          value: function updateAndApproveTransaction(e) {
            return regeneratorRuntime.async((function updateAndApproveTransaction$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  return this.txStateManager.updateTx(e, "confTx: user approved transaction"), t.next = 3, regeneratorRuntime.awrap(this.approveTransaction(e.id));
                case 3:
                case "end":
                  return t.stop()
              }
            }), null, this)
          }
        }, {
          key: "approveTransaction",
          value: function approveTransaction(e) {
            var t, a, r, n, s;
            return regeneratorRuntime.async((function approveTransaction$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  if (o.prev = 0, !this.inProcessOfSigning.has(e)) {
                    o.next = 3;
                    break
                  }
                  return o.abrupt("return");
                case 3:
                  return this.inProcessOfSigning.add(e), this.txStateManager.setTxStatusApproved(e), a = this.txStateManager.getTx(e), r = a.txParams.from, o.next = 9, regeneratorRuntime.awrap(this.nonceTracker.getNonceLock(r));
                case 9:
                  return t = o.sent, n = a.lastGasPrice ? a.txParams.nonce : t.nextNonce, a.txParams.nonce = w.addHexPrefix(n.toString(16)), a.nonceDetails = t.nonceDetails, this.txStateManager.updateTx(a, "transactions#approveTransaction"), o.next = 16, regeneratorRuntime.awrap(this.signTransaction(e));
                case 16:
                  return s = o.sent, o.next = 19, regeneratorRuntime.awrap(this.publishTransaction(e, s));
                case 19:
                  t.releaseLock(), o.next = 27;
                  break;
                case 22:
                  o.prev = 22, o.t0 = o["catch"](0);
                  try {
                    this.txStateManager.setTxStatusFailed(e, o.t0)
                  } catch (err) {
                    N.error(err)
                  }
                  throw t && t.releaseLock(), o.t0;
                case 27:
                  return o.prev = 27, this.inProcessOfSigning.delete(e), o.finish(27);
                case 30:
                case "end":
                  return o.stop()
              }
            }), null, this, [
              [0, 22, 27, 30]
            ])
          }
        }, {
          key: "signTransaction",
          value: function signTransaction(e) {
            var t, a, r, n, s, o;
            return regeneratorRuntime.async((function signTransaction$(i) {
              while (1) switch (i.prev = i.next) {
                case 0:
                  return t = this.txStateManager.getTx(e), a = this.getChainId(), r = Object.assign({}, t.txParams, {
                    chainId: a
                  }), n = r.from, s = new k(r), i.next = 7, regeneratorRuntime.awrap(this.signEthTx(s, n));
                case 7:
                  return this.txStateManager.setTxStatusSigned(t.id), o = w.bufferToHex(s.serialize()), i.abrupt("return", o);
                case 10:
                case "end":
                  return i.stop()
              }
            }), null, this)
          }
        }, {
          key: "publishTransaction",
          value: function publishTransaction(e, t) {
            var a, r;
            return regeneratorRuntime.async((function publishTransaction$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return a = this.txStateManager.getTx(e), a.rawTx = t, this.txStateManager.updateTx(a, "transactions#publishTransaction"), n.next = 5, regeneratorRuntime.awrap(this.query.sendRawTransaction(t));
                case 5:
                  r = n.sent, this.setTxHash(e, r), this.txStateManager.setTxStatusSubmitted(e);
                case 8:
                case "end":
                  return n.stop()
              }
            }), null, this)
          }
        }, {
          key: "confirmTransaction",
          value: function confirmTransaction(e) {
            var t, a, r;
            return regeneratorRuntime.async((function confirmTransaction$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  if (t = this.txStateManager.getTx(e), t) {
                    n.next = 3;
                    break
                  }
                  return n.abrupt("return");
                case 3:
                  return n.prev = 3, n.next = 6, regeneratorRuntime.awrap(this.query.getTransactionReceipt(t.hash));
                case 6:
                  a = n.sent, r = "string" !== typeof a.gasUsed ? a.gasUsed.toString(16) : a.gasUsed, t.txReceipt = _objectSpread({}, a, {
                    gasUsed: r
                  }), this.txStateManager.updateTx(t, "transactions#confirmTransaction - add txReceipt"), n.next = 15;
                  break;
                case 12:
                  n.prev = 12, n.t0 = n["catch"](3), N.error(n.t0);
                case 15:
                  this.txStateManager.setTxStatusConfirmed(e), this._markNonceDuplicatesDropped(e);
                case 17:
                case "end":
                  return n.stop()
              }
            }), null, this, [
              [3, 12]
            ])
          }
        }, {
          key: "cancelTransaction",
          value: function cancelTransaction(e) {
            return regeneratorRuntime.async((function cancelTransaction$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  this.txStateManager.setTxStatusRejected(e);
                case 1:
                case "end":
                  return t.stop()
              }
            }), null, this)
          }
        }, {
          key: "setTxHash",
          value: function setTxHash(e, t) {
            var a = this.txStateManager.getTx(e);
            a.hash = t, this.txStateManager.updateTx(a, "transactions#setTxHash")
          }
        }, {
          key: "_mapMethods",
          value: function _mapMethods() {
            var e = this;
            this.getState = function () {
              return e.memStore.getState()
            }, this.getNetwork = function () {
              return e.networkStore.getState()
            }, this.getSelectedAddress = function () {
              if ("function" === typeof e.opts.storeProps) {
                var t = e.opts.storeProps() || {},
                  a = t.selectedAddress;
                return a && a.toLowerCase() || ""
              }
              return ""
            }, this.getUnapprovedTxCount = function () {
              return Object.keys(e.txStateManager.getUnapprovedTxList()).length
            }, this.getPendingTxCount = function (t) {
              return e.txStateManager.getPendingTransactions(t).length
            }, this.getFilteredTxList = function (t) {
              return e.txStateManager.getFilteredTxList(t)
            }
          }
        }, {
          key: "_updatePendingTxsAfterFirstBlock",
          value: function _updatePendingTxsAfterFirstBlock() {
            return regeneratorRuntime.async((function _updatePendingTxsAfterFirstBlock$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return e.next = 2, regeneratorRuntime.awrap(this.blockTracker.getLatestBlock());
                case 2:
                  return e.next = 4, regeneratorRuntime.awrap(this.pendingTxTracker.updatePendingTxs());
                case 4:
                case "end":
                  return e.stop()
              }
            }), null, this)
          }
        }, {
          key: "_onBootCleanUp",
          value: function _onBootCleanUp() {
            var e = this;
            this.txStateManager.getFilteredTxList({
              status: "unapproved",
              loadingDefaults: !0
            }).forEach((function (t) {
              e.addTxGasDefaults(t).then((function (t) {
                t.loadingDefaults = !1, e.txStateManager.updateTx(t, "transactions: gas estimation for tx on boot")
              })).catch((function (a) {
                t.loadingDefaults = !1, e.txStateManager.updateTx(t, "failed to estimate gas during boot cleanup."), e.txStateManager.setTxStatusFailed(t.id, a)
              }))
            })), this.txStateManager.getFilteredTxList({
              status: H
            }).forEach((function (t) {
              var a = new Error('Transaction found as "approved" during boot - possibly stuck during signing');
              e.txStateManager.setTxStatusFailed(t.id, a)
            }))
          }
        }, {
          key: "_setupListeners",
          value: function _setupListeners() {
            var e = this;
            this.txStateManager.on("tx:status-update", this.emit.bind(this, "tx:status-update")), this._setupBlockTrackerListener(), this.pendingTxTracker.on("tx:warning", (function (t) {
              e.txStateManager.updateTx(t, "transactions/pending-tx-tracker#event: tx:warning")
            })), this.pendingTxTracker.on("tx:failed", this.txStateManager.setTxStatusFailed.bind(this.txStateManager)), this.pendingTxTracker.on("tx:confirmed", (function (t) {
              return e.confirmTransaction(t)
            })), this.pendingTxTracker.on("tx:dropped", this.txStateManager.setTxStatusDropped.bind(this.txStateManager)), this.pendingTxTracker.on("tx:block-update", (function (t, a) {
              t.firstRetryBlockNumber || (t.firstRetryBlockNumber = a, e.txStateManager.updateTx(t, "transactions/pending-tx-tracker#event: tx:block-update"))
            })), this.pendingTxTracker.on("tx:retry", (function (t) {
              "retryCount" in t || (t.retryCount = 0), t.retryCount++, e.txStateManager.updateTx(t, "transactions/pending-tx-tracker#event: tx:retry")
            }))
          }
        }, {
          key: "_determineTransactionCategory",
          value: function _determineTransactionCategory(e) {
            var t, a, r, n, s, o, i, c, l, d, u, p, g, f, v, h, m, b, x, y, w;
            return regeneratorRuntime.async((function _determineTransactionCategory$(k) {
              while (1) switch (k.prev = k.next) {
                case 0:
                  if (t = e.data, a = e.to, r = E(a), n = t && S.decodeMethod(t), s = t && _.decodeMethod(t), o = "", i = {}, c = {}, l = Object.prototype.hasOwnProperty.call(I, r) ? I[E(a)] : {}, l && l.erc20 && s ? (d = s.name, u = void 0 === d ? "" : d, p = s.params, o = [G, K, Y].find((function (e) {
                      return e.toLowerCase() === u.toLowerCase()
                    })), i = p, c = l) : s ? (g = s.name, f = void 0 === g ? "" : g, v = s.params, o = [G, K, Y].find((function (e) {
                      return e.toLowerCase() === f.toLowerCase()
                    })), i = v, c.erc20 = !0, c.symbol = "ERC20") : n && (h = n.name, m = void 0 === h ? "" : h, b = n.params, o = [Q].find((function (e) {
                      return e.toLowerCase() === m.toLowerCase()
                    })), i = b, c = l, c.erc721 = !0, c.symbol = "ERC721", c.decimals = 0), e.data) {
                    k.next = 13;
                    break
                  }
                  x = q, k.next = 33;
                  break;
                case 13:
                  if (!o) {
                    k.next = 17;
                    break
                  }
                  x = o, k.next = 33;
                  break;
                case 17:
                  if (a) {
                    k.next = 21;
                    break
                  }
                  x = z, k.next = 33;
                  break;
                case 21:
                  return k.prev = 21, k.next = 24, regeneratorRuntime.awrap(this.query.getCode(a));
                case 24:
                  y = k.sent, k.next = 31;
                  break;
                case 27:
                  k.prev = 27, k.t0 = k["catch"](21), y = null, N.warn(k.t0);
                case 31:
                  w = !y || "0x" === y || "0x0" === y, x = w ? q : W;
                case 33:
                  return k.abrupt("return", {
                    transactionCategory: x,
                    getCodeResponse: y,
                    methodParams: i,
                    contractParams: c
                  });
                case 34:
                case "end":
                  return k.stop()
              }
            }), null, this, [
              [21, 27]
            ])
          }
        }, {
          key: "_markNonceDuplicatesDropped",
          value: function _markNonceDuplicatesDropped(e) {
            var t = this,
              a = this.txStateManager.getTx(e),
              r = a.txParams,
              n = r.nonce,
              s = r.from,
              o = this.txStateManager.getFilteredTxList({
                nonce: n,
                from: s
              });
            o.length && o.forEach((function (r) {
              r.id !== e && (r.replacedBy = a.hash, t.txStateManager.updateTx(a, "transactions/pending-tx-tracker#event: tx:confirmed reference to confirmed txHash with same nonce"), t.txStateManager.setTxStatusDropped(r.id))
            }))
          }
        }, {
          key: "_setupBlockTrackerListener",
          value: function _setupBlockTrackerListener() {
            var e = !1,
              t = this._onLatestBlock.bind(this),
              a = this.blockTracker,
              r = this.txStateManager;

            function updateSubscription() {
              var n = r.getPendingTransactions();
              !e && n.length > 0 ? (a.on("latest", t), e = !0) : e && !n.length && (a.removeListener("latest", t), e = !1)
            }
            r.on("tx:status-update", updateSubscription), updateSubscription()
          }
        }, {
          key: "_onLatestBlock",
          value: function _onLatestBlock(e) {
            return regeneratorRuntime.async((function _onLatestBlock$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  return t.prev = 0, t.next = 3, regeneratorRuntime.awrap(this.pendingTxTracker.updatePendingTxs());
                case 3:
                  t.next = 8;
                  break;
                case 5:
                  t.prev = 5, t.t0 = t["catch"](0), N.error(t.t0);
                case 8:
                  return t.prev = 8, t.next = 11, regeneratorRuntime.awrap(this.pendingTxTracker.resubmitPendingTxs(e));
                case 11:
                  t.next = 16;
                  break;
                case 13:
                  t.prev = 13, t.t1 = t["catch"](8), N.error(t.t1);
                case 16:
                case "end":
                  return t.stop()
              }
            }), null, this, [
              [0, 5],
              [8, 13]
            ])
          }
        }, {
          key: "_updateMemstore",
          value: function _updateMemstore() {
            this.pendingTxTracker.updatePendingTxs();
            var e = this.txStateManager.getUnapprovedTxList(),
              t = this.txStateManager.getFilteredTxList({
                from: this.getSelectedAddress(),
                metamaskNetworkId: this.getNetwork()
              });
            this.memStore.updateState({
              unapprovedTxs: e,
              selectedAddressTxList: t
            })
          }
        }]), TransactionController
      }(x);
    t["default"] = ee
  },
  5300: function (e, t, a) {
    e.exports = a.p + "img/blue_arrow_right.33c3e091.svg"
  },
  5584: function (e, t, a) {
    e.exports = a.p + "img/learn-more-intro.1b46c4fd.png"
  },
  "56d7": function (e, t, a) {
    "use strict";
    a.r(t);
    a("e260"), a("e6cf"), a("cca6"), a("a79d");
    var r = a("5c7d"),
      n = a.n(r),
      s = a("2b0e"),
      Appvue_type_template_id_cbf322de_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-app", {
          staticClass: "torus-app"
        }, [a("router-view")], 1)
      },
      o = [],
      i = {},
      c = i,
      l = (a("9e62"), a("5c64"), a("2877")),
      d = a("6544"),
      u = a.n(d),
      p = a("7496"),
      g = Object(l["a"])(c, Appvue_type_template_id_cbf322de_render, o, !1, null, null, null),
      f = g.exports;
    u()(g, {
      VApp: p["a"]
    });
    var v = a("2ebb"),
      h = a.n(v);
    s["a"].use(h.a), s["a"].component("v-knob-control", h.a);
    var m = a("402c"),
      b = (a("99af"), a("a15b"), a("d81d"), a("0d03"), a("d3b7"), a("25f0"), a("3ca3"), a("ddb0"), a("2b3d"), a("96cf"), a("9483")),
      x = a("e493"),
      y = a.n(x),
      w = "sha384-V8CD8Sz70ESZyIE9ncT4ExbMaRpAfy8p+w1K2PRFxO3Ez5m6lYQSUsSQTenPhois",
      k = "".concat("/", "service-worker.js"),
      C = "max-age=3600";
    w === ["SERVICE", "WORKER", "SHA", "INTEGRITY"].join("_") ? Object(b["a"])(k, {
      ready: function ready() {
        n.a.info("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")
      },
      registered: function registered() {
        n.a.info("Service worker has been registered.")
      },
      cached: function cached() {
        n.a.info("Content has been cached for offline use.")
      },
      updatefound: function updatefound() {
        n.a.info("New content is downloading.")
      },
      updated: function updated() {
        n.a.info("New content is available; please refresh.")
      },
      offline: function offline() {
        n.a.info("No internet connection found. App is running in offline mode.")
      },
      error: function error(e) {
        n.a.error("Error during service worker registration:", e)
      }
    }) : navigator.serviceWorker.getRegistrations().then((function (e) {
      var t, a = {
          err: null,
          sw: null
        },
        r = new Promise((function (e, a) {
          t = e
        })),
        s = function removeRegsAndResolveWithError(e) {
          a.err = new Error(e), n.a.error(a.err);
          var r = [];
          navigator.serviceWorker.getRegistrations().then((function (e) {
            e.map((function (e) {
              r.push(e.unregister())
            }))
          })), Promise.all(r).finally((function () {
            t(a)
          }))
        };
      return 0 === e.length ? t({
        err: new Error("no service worker installed")
      }) : e.length > 1 ? s("Should only have one service worker registered") : "all" !== e[0].updateViaCache ? s('updateViaCache should be "all"') : new URL(e[0].active.scriptURL).pathname !== k ? s("unexpected scriptURL ".concat(new URL(e[0].active.scriptURL).pathname, ", expected ").concat(k)) : (a.sw = e[0], t(a)), r
    })).then((function (e) {
      return e.err ? navigator.serviceWorker.register(k, {
        updateViaCache: "all",
        scope: "/"
      }) : Promise.resolve(e.sw)
    })).then((function (e) {
      return fetch(k, {
        cache: "reload"
      }).then((function _callee(t) {
        var a, r;
        return regeneratorRuntime.async((function _callee$(n) {
          while (1) switch (n.prev = n.next) {
            case 0:
              if (t.headers.get("Cache-Control") === C) {
                n.next = 2;
                break
              }
              throw new Error("Unexpected Cache-Control headers, got " + t.headers.get("Cache-Control"));
            case 2:
              return n.next = 4, regeneratorRuntime.awrap(t.text());
            case 4:
              if (a = n.sent, r = y.a.generate({
                  algorithms: ["sha384"]
                }, a), r === w) {
                n.next = 8;
                break
              }
              throw new Error("Service worker integrity check failed, expected ".concat(w, " got ").concat(r));
            case 8:
              return n.abrupt("return", e.update());
            case 9:
            case "end":
              return n.stop()
          }
        }))
      })).catch((function (e) {
        throw new Error("Could not fetch service worker from server, " + e.toString())
      }))
    })).then((function (e) {
      n.a.info("Successfully registered secure service worker", e)
    })).catch((function (e) {
      throw n.a.error("Could not complete service worker installation process, error: ", e), new Error("Could not install service worker")
    }));
    a("404f"), a("4160"), a("b0c0"), a("b64b"), a("159b");
    var A = a("8c4f"),
      T = a("4360"),
      Popupvue_type_template_id_1188b86d_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-container", {
          attrs: {
            fluid: ""
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            md3: ""
          }
        }, [e._v(" Welcome to Torus ")])], 1)], 1)
      },
      _ = [],
      S = a("2f62"),
      O = a("db49"),
      E = {
        name: "popup",
        data: function data() {
          return {}
        },
        mounted: function mounted() {
          var e = setInterval((function () {
              window.gapi && window.gapi.load("auth2", (function () {
                window.auth2 = window.gapi.auth2.init({
                  client_id: O["default"].GOOGLE_CLIENT_ID
                }), clearInterval(e)
              }))
            }), 2e3),
            t = setInterval((function () {
              window.FB && (window.FB.init({
                appId: O["default"].FACEBOOK_APP_ID,
                version: "v4.0"
              }), window.FBInitialized = !0, clearInterval(t))
            }), 2e3)
        }
      },
      I = E,
      M = a("a523"),
      P = a("0e8f"),
      R = a("a7226"),
      L = Object(l["a"])(I, Popupvue_type_template_id_1188b86d_render, _, !1, null, null, null),
      j = L.exports;
    u()(L, {
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var ProviderChangevue_type_template_id_2c6f1cf0_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-container", {
          attrs: {
            "py-6": "",
            "px-0": ""
          }
        }, ["none" === e.type ? [r("page-loader")] : [r("v-layout", {
          attrs: {
            wrap: "",
            "align-center": "",
            "mx-6": "",
            "mb-6": ""
          }
        }, [r("v-flex", {
          staticClass: "text_1--text font-weight-bold headline float-left",
          attrs: {
            xs12: ""
          }
        }, [e._v("Permission")]), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("network-display")], 1)], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            "mb-2": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2 text_2--text"
        }, [e._v("Request from:")]), r("v-card", {
          staticClass: "background lighten-3",
          attrs: {
            flat: ""
          }
        }, [r("v-card-text", [r("div", {
          staticClass: "subtitle-2 primary--text"
        }, [e._v(e._s(e.origin))])]), r("img", {
          staticClass: "card-upper-icon",
          attrs: {
            src: a("94ce")
          }
        })], 1)], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("v-list", {
          staticClass: "note-list"
        }, [r("v-list-item", {
          staticClass: "pa-0"
        }, [r("v-list-item-icon", {
          staticClass: "mr-1"
        }, [r("img", {
          attrs: {
            src: a("75ea"),
            width: "12"
          }
        })]), r("v-list-item-content", {
          staticClass: "pa-1"
        }, [r("div", {
          staticClass: "caption text_2--text"
        }, [e._v(" To change your network to "), r("span", {
          staticClass: "text-capitalize"
        }, [e._v(e._s(e.type && "rpc" === e.type ? e.rpcNetwork.networkName + " : " + e.rpcNetwork.host : e.network.host))])])])], 1)], 1)], 1), r("v-layout", {
          attrs: {
            "px-6": "",
            "mx-3": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "text_2--text",
          attrs: {
            block: "",
            text: "",
            large: ""
          },
          on: {
            click: e.triggerDeny
          }
        }, [e._v("Cancel")])], 1), r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "ml-2",
          attrs: {
            block: "",
            depressed: "",
            large: "",
            color: "primary"
          },
          on: {
            click: e.triggerSign
          }
        }, [e._v("Confirm")])], 1)], 1)], 1)]], 2)
      },
      D = [],
      N = (a("ac1f"), a("841c"), a("236e")),
      PageLoadervue_type_template_id_38a9953b_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          attrs: {
            wrap: "",
            "align-center": "",
            "justify-center": ""
          }
        }, [a("v-flex", {
          attrs: {
            "flex-grow-1": "",
            xs12: ""
          }
        }, [a("div", {
          staticClass: "text-center"
        }, [a("v-progress-circular", {
          attrs: {
            indeterminate: "",
            color: e.$vuetify.theme.torus_blue
          }
        })], 1)])], 1)
      },
      B = [],
      V = {
        name: "PageLoader"
      },
      F = V,
      U = a("490a"),
      H = Object(l["a"])(F, PageLoadervue_type_template_id_38a9953b_render, B, !1, null, null, null),
      G = H.exports;
    u()(H, {
      VFlex: P["a"],
      VLayout: R["a"],
      VProgressCircular: U["a"]
    });
    var NetworkDisplayvue_type_template_id_1cef0512_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return "" !== e.selectedNetwork ? a("v-chip", {
          staticClass: "caption network-chip black--text",
          class: e.isUrlNetwork ? "" : "network-chip--" + e.host + " text-capitalize",
          attrs: {
            small: ""
          }
        }, [a("v-icon", {
          staticClass: "black--text",
          attrs: {
            size: "12"
          },
          domProps: {
            textContent: e._s("$vuetify.icons.network")
          }
        }), e._v(" " + e._s(e.selectedNetwork) + " ")], 1) : e._e()
      },
      K = [],
      Y = {
        props: ["network"],
        computed: {
          selectedNetwork: function selectedNetwork() {
            var e = "";
            return e = this.$store.state.networkType.networkName && "" !== this.$store.state.networkType.networkName ? this.$store.state.networkType.networkName : this.$store.state.networkType.host, e
          },
          host: function host() {
            return this.$store.state.networkType.host
          },
          isUrlNetwork: function isUrlNetwork() {
            return /^((?:http(s)?:\/\/)?([\w.-]+(?:\.[\w\.-]+)+|localhost?)[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)$/.test(this.selectedNetwork)
          }
        }
      },
      q = Y,
      z = (a("8e49"), a("cc20")),
      W = a("132d"),
      Q = Object(l["a"])(q, NetworkDisplayvue_type_template_id_1cef0512_scoped_true_render, K, !1, null, "1cef0512", null),
      J = Q.exports;
    u()(Q, {
      VChip: z["a"],
      VIcon: W["a"]
    });
    var Z = a("fa7d"),
      X = {
        name: "confirm",
        components: {
          PageLoader: G,
          NetworkDisplay: J
        },
        data: function data() {
          return {
            origin: "",
            type: "none",
            network: "",
            rpcNetwork: {},
            payload: {}
          }
        },
        methods: {
          triggerSign: function triggerSign(e) {
            var t;
            return regeneratorRuntime.async((function triggerSign$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("torus_provider_change_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), e.next = 3, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "confirm-provider-change",
                      payload: this.payload,
                      approve: !0
                    }
                  }));
                case 3:
                  t.close(), window.close();
                case 5:
                case "end":
                  return e.stop()
              }
            }), null, this)
          },
          triggerDeny: function triggerDeny(e) {
            var t;
            return regeneratorRuntime.async((function triggerDeny$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("torus_provider_change_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), e.next = 3, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "deny-provider-change",
                      approve: !1
                    }
                  }));
                case 3:
                  t.close(), window.close();
                case 5:
                case "end":
                  return e.stop()
              }
            }))
          }
        },
        mounted: function mounted() {
          var e = this,
            t = new N["a"]("torus_provider_change_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]);
          t.onmessage = function _callee(a) {
            var r, s, o, i, c, l;
            return regeneratorRuntime.async((function _callee$(d) {
              while (1) switch (d.prev = d.next) {
                case 0:
                  r = a.data || {}, s = r.payload, o = s.network, i = s.type, c = r.origin, e.payload = {
                    network: o,
                    type: i
                  }, l = {
                    hostname: ""
                  };
                  try {
                    l = new URL(c)
                  } catch (err) {
                    n.a.error(err)
                  }
                  e.origin = l.hostname, i && "rpc" === i ? (e.rpcNetwork = o, e.type = i) : (e.network = o, e.type = "non-rpc"), t.close();
                case 7:
                case "end":
                  return d.stop()
              }
            }))
          }, t.postMessage({
            data: "popup-loaded"
          })
        }
      },
      $ = X,
      ee = (a("cfe0"), a("8336")),
      te = a("b0af"),
      ae = a("99d9"),
      re = a("8860"),
      ne = a("da13"),
      se = a("5d23"),
      oe = a("34c3"),
      ie = Object(l["a"])($, ProviderChangevue_type_template_id_2c6f1cf0_scoped_true_render, D, !1, null, "2c6f1cf0", null),
      ce = ie.exports;
    u()(ie, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"]
    });
    var UserInfoRequestvue_type_template_id_2b6c7bcd_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-container", {
          attrs: {
            "py-6": "",
            "px-0": ""
          }
        }, ["none" === e.type ? [r("page-loader")] : [r("v-layout", {
          attrs: {
            "align-center": "",
            "mx-6": "",
            "mb-6": ""
          }
        }, [r("div", {
          staticClass: "text-black font-weight-bold headline float-left"
        }, [e._v("Permission")]), r("img", {
          staticClass: "ml-2",
          attrs: {
            src: a("e439a"),
            width: "16"
          }
        })]), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            "mb-2": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2 text_2--text"
        }, [e._v("Request from:")]), r("v-card", {
          staticClass: "grey lighten-3",
          attrs: {
            flat: ""
          }
        }, [r("v-card-text", [r("div", {
          staticClass: "subtitle-2 primary--text"
        }, [e._v(e._s(e.origin))])]), r("img", {
          staticClass: "card-upper-icon",
          attrs: {
            src: a("94ce")
          }
        })], 1)], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("v-list", {
          staticClass: "note-list"
        }, [r("v-list-item", {
          staticClass: "pa-0"
        }, [r("v-list-item-icon", {
          staticClass: "mr-1"
        }, [r("img", {
          attrs: {
            src: a("75ea"),
            width: "12"
          }
        })]), r("v-list-item-content", {
          staticClass: "pa-1"
        }, [r("div", {
          staticClass: "caption text_2--text"
        }, [e._v("To access your Google Email, Photo and Name")])])], 1), "" !== e.message ? r("v-list-item", {
          staticClass: "pa-0"
        }, [r("v-list-item-icon", {
          staticClass: "mr-1"
        }, [r("img", {
          attrs: {
            src: a("75ea"),
            width: "12"
          }
        })]), r("v-list-item-content", {
          staticClass: "pa-1"
        }, [r("div", {
          staticClass: "caption text_2--text"
        }, [e._v(e._s(e.message))])])], 1) : e._e()], 1)], 1), r("v-layout", {
          attrs: {
            "px-6": "",
            "mx-3": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "text_2--text",
          attrs: {
            block: "",
            text: "",
            large: ""
          },
          on: {
            click: e.triggerDeny
          }
        }, [e._v("Cancel")])], 1), r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "ml-2",
          attrs: {
            block: "",
            depressed: "",
            large: "",
            color: "primary"
          },
          on: {
            click: e.triggerSign
          }
        }, [e._v("Confirm")])], 1)], 1)], 1)]], 2)
      },
      le = [],
      de = {
        name: "userInfoRequest",
        components: {
          PageLoader: G
        },
        data: function data() {
          return {
            origin: "",
            type: "none",
            message: ""
          }
        },
        methods: {
          triggerSign: function triggerSign(e) {
            var t;
            return regeneratorRuntime.async((function triggerSign$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("user_info_request_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), e.next = 3, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "confirm-user-info-request",
                      approve: !0
                    }
                  }));
                case 3:
                  t.close(), window.close();
                case 5:
                case "end":
                  return e.stop()
              }
            }))
          },
          triggerDeny: function triggerDeny(e) {
            var t;
            return regeneratorRuntime.async((function triggerDeny$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("user_info_request_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), e.next = 3, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "deny-user-info-request",
                      approve: !1
                    }
                  }));
                case 3:
                  t.close(), window.close();
                case 5:
                case "end":
                  return e.stop()
              }
            }))
          }
        },
        mounted: function mounted() {
          var e = this,
            t = new N["a"]("user_info_request_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]);
          t.onmessage = function _callee(a) {
            var r, s, o, i;
            return regeneratorRuntime.async((function _callee$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  r = a.data || {}, s = r.payload, o = r.origin, i = {
                    hostname: ""
                  };
                  try {
                    i = new URL(o)
                  } catch (err) {
                    n.a.error(err)
                  }
                  e.origin = i.hostname, e.type = "userInfo", e.message = s && s.message ? s.message : "", t.close();
                case 7:
                case "end":
                  return c.stop()
              }
            }))
          }, t.postMessage({
            data: "popup-loaded"
          })
        }
      },
      ue = de,
      pe = (a("7525"), Object(l["a"])(ue, UserInfoRequestvue_type_template_id_2b6c7bcd_scoped_true_render, le, !1, null, "2b6c7bcd", null)),
      ge = pe.exports;
    u()(pe, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"]
    });
    var RedirectCatchvue_type_template_id_949d10d4_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-container", {
          attrs: {
            fluid: ""
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            md3: ""
          }
        }, [e._v("Redirecting you back to Torus App. Please Wait...")]), a("page-loader")], 1)], 1)
      },
      fe = [],
      ve = (a("13d5"), a("1276"), {
        name: "redirect",
        components: {
          PageLoader: G
        },
        mounted: function mounted() {
          var e, t, a, r, s, o;
          return regeneratorRuntime.async((function mounted$(i) {
            while (1) switch (i.prev = i.next) {
              case 0:
                return i.prev = 0, t = this.$router.currentRoute.hash.substr(1), a = t.split("&").reduce((function (e, t) {
                  var a = t.split("=");
                  return e[a[0]] = a[1], e
                }), {}), r = this.$router.currentRoute.query, n.a.info(a, r), s = {}, o = "", Object.keys(a).length > 0 && a.state ? (s = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(a.state)))) || {}, a.error && (o = a.error)) : Object.keys(r).length > 0 && r.state && (s = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(r.state)))) || {}, r.error && (o = r.error)), e = new N["a"]("redirect_channel_".concat(s.instanceId), Z["broadcastChannelOptions"]), i.next = 11, regeneratorRuntime.awrap(e.postMessage({
                  data: {
                    verifier: s.verifier,
                    verifierParams: a
                  },
                  error: o
                }));
              case 11:
                e.close(), i.next = 19;
                break;
              case 14:
                i.prev = 14, i.t0 = i["catch"](0), n.a.info(i.t0, "something went wrong"), e.close(), window.close();
              case 19:
              case "end":
                return i.stop()
            }
          }), null, this, [
            [0, 14]
          ])
        }
      }),
      he = ve,
      me = Object(l["a"])(he, RedirectCatchvue_type_template_id_949d10d4_render, fe, !1, null, null, null),
      be = me.exports;
    u()(me, {
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var Loginvue_type_template_id_1e0cc76e_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("div", {
          class: [{
            "background-login": !e.loggedIn
          }, "default"]
        }, [e.loginInProgress ? [r("v-container", {
          attrs: {
            "fill-height": "",
            "align-content-center": ""
          }
        }, [r("page-loader")], 1)] : [e.gapiLoaded ? [r("v-layout", {
          staticClass: "login-panel-left",
          attrs: {
            wrap: "",
            "fill-height": "",
            "align-center": "",
            "justify-center": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            md6: ""
          }
        }, [e.isLogout ? r("v-layout", {
          attrs: {
            wrap: "",
            "align-center": "",
            "justify-center": "",
            "align-content-center": ""
          }
        }, [r("v-flex", {
          attrs: {
            "text-center": ""
          }
        }, [r("img", {
          attrs: {
            width: "200px",
            height: "auto",
            src: a("b022")
          }
        })]), r("v-flex", {
          attrs: {
            xs12: "",
            "mt-10": ""
          }
        }, [r("div", {
          staticClass: "text-center headline font-weight-bold"
        }, [e._v("You have been logged out")])]), r("v-flex", {
          attrs: {
            xs12: "",
            "mt-4": ""
          }
        }, [r("div", {
          staticClass: "text-center"
        }, [r("v-btn", {
          staticClass: "px-12 title",
          attrs: {
            large: "",
            depressed: "",
            color: "primary",
            type: "button"
          },
          on: {
            click: e.returnHome
          }
        }, [e._v(" Return Home ")])], 1)])], 1) : r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          staticClass: "mb-5",
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("img", {
          attrs: {
            width: "117",
            src: a("1cbd")
          }
        })]), r("v-flex", {
          staticClass: "mb-3",
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("span", {
          staticClass: "display-2 font-weight-bold"
        }, [e._v("Welcome to Torus")])]), r("v-flex", {
          staticClass: "body-1",
          attrs: {
            "mb-6": "",
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("span", [e._v("You are just one step away from getting your digital wallet for your cryptocurrencies")])]), r("v-flex", {
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mb-2": "",
            "mr-auto": ""
          }
        }, [r("v-btn", {
          staticClass: "body-2 login-btn",
          attrs: {
            id: "loginBtn",
            color: "white",
            large: "",
            block: e.$vuetify.breakpoint.xsOnly
          },
          on: {
            click: function (t) {
              return e.triggerLogin({
                verifier: e.GOOGLE,
                calledFromEmbed: !1
              })
            }
          }
        }, [r("img", {
          staticClass: "mr-2",
          attrs: {
            src: a("8d7b")
          }
        }), e._v(" Sign in with Google ")])], 1), r("v-flex", {
          staticClass: "body-1",
          attrs: {
            "mb-2": "",
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("span", [e._v("Or, use another account:")])]), r("v-flex", {
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": "",
            "mb-2": ""
          }
        }, [r("v-layout", {
          staticClass: "other-login-container",
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs3: "",
            "px-1": ""
          }
        }, [r("v-btn", {
          staticClass: "other-login-btn",
          attrs: {
            large: !e.$vuetify.breakpoint.xsOnly,
            outlined: "",
            block: "",
            type: "button",
            title: "Login with Facebook"
          },
          on: {
            click: function (t) {
              return e.triggerLogin({
                verifier: e.FACEBOOK,
                calledFromEmbed: !1
              })
            }
          }
        }, [r("img", {
          attrs: {
            width: "24",
            src: a("4ef4")
          }
        })])], 1), r("v-flex", {
          attrs: {
            xs3: "",
            "px-1": ""
          }
        }, [r("v-btn", {
          staticClass: "other-login-btn",
          attrs: {
            large: !e.$vuetify.breakpoint.xsOnly,
            outlined: "",
            block: "",
            type: "button",
            title: "Login with Reddit"
          },
          on: {
            click: function (t) {
              return e.triggerLogin({
                verifier: e.REDDIT,
                calledFromEmbed: !1
              })
            }
          }
        }, [r("img", {
          attrs: {
            width: "32",
            src: a("0676")
          }
        })])], 1), r("v-flex", {
          attrs: {
            xs3: "",
            "px-1": ""
          }
        }, [r("v-btn", {
          staticClass: "other-login-btn",
          attrs: {
            large: !e.$vuetify.breakpoint.xsOnly,
            outlined: "",
            block: "",
            type: "button",
            title: "Login with Twitch"
          },
          on: {
            click: function (t) {
              return e.triggerLogin({
                verifier: e.TWITCH,
                calledFromEmbed: !1
              })
            }
          }
        }, [r("img", {
          attrs: {
            width: "24",
            src: a("43e5")
          }
        })])], 1), r("v-flex", {
          attrs: {
            xs3: "",
            "px-1": ""
          }
        }, [r("v-btn", {
          staticClass: "other-login-btn",
          attrs: {
            large: !e.$vuetify.breakpoint.xsOnly,
            outlined: "",
            block: "",
            type: "button",
            title: "Login with Discord"
          },
          on: {
            click: function (t) {
              return e.triggerLogin({
                verifier: e.DISCORD,
                calledFromEmbed: !1
              })
            }
          }
        }, [r("img", {
          attrs: {
            width: "24",
            src: a("4c95")
          }
        })])], 1)], 1)], 1), r("v-flex", {
          staticClass: "caption",
          attrs: {
            "mb-6": "",
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("span", [e._v(" By clicking Login, you accept our "), r("a", {
          attrs: {
            href: "https://docs.tor.us/legal/terms-and-conditions",
            target: "_blank"
          }
        }, [r("span", {
          staticClass: "primary--text"
        }, [e._v("Terms and Conditions")])])])]), r("v-flex", {
          staticClass: "caption",
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("span", [e._v(" Note : For first time users, kindly "), r("span", {
          staticClass: "primary--text"
        }, [e._v("enable Pop-ups")]), e._v(" to gain access to your Torus Wallet ")])])], 1)], 1), r("v-flex", {
          staticClass: "hidden-sm-and-down login-panel-right",
          attrs: {
            xs12: "",
            md6: "",
            "fill-height": ""
          }
        }, [r("v-layout", {
          staticClass: "pb-8",
          attrs: {
            wrap: "",
            "fill-height": "",
            "align-end": ""
          }
        }, [r("v-flex", {
          staticClass: "mb-3 text-center",
          attrs: {
            xs9: "",
            sm7: "",
            "ml-auto": "",
            "mr-auto": ""
          }
        }, [r("div", {
          staticClass: "display-1 white--text font-weight-bold"
        }, [e._v("Frictionless Logins")]), r("div", {
          staticClass: "display-1 white--text mb-3"
        }, [e._v("for DApps")]), r("div", {
          staticClass: "caption white--text"
        }, [e._v(" A simple and secure gateway to the decentralized ecosystem via OAuth logins ")])])], 1)], 1)], 1)] : [r("v-container", {
          attrs: {
            "fill-height": "",
            "align-content-center": ""
          }
        }, [r("page-loader")], 1)]]], 2)
      },
      xe = [],
      ye = (a("a4d3"), a("4de4"), a("caad"), a("e439"), a("dbb4"), a("2532"), a("2fa7")),
      we = a("b00c");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(ye["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var ke = {
        name: "login",
        components: {
          PageLoader: G
        },
        data: function data() {
          return {
            gapiLoaded: !1,
            fbLoaded: !1,
            isLogout: !1,
            FACEBOOK: we["FACEBOOK"],
            GOOGLE: we["GOOGLE"],
            TWITCH: we["TWITCH"],
            REDDIT: we["REDDIT"],
            DISCORD: we["DISCORD"]
          }
        },
        methods: _objectSpread({}, Object(S["b"])({
          triggerLogin: "triggerLogin"
        }), {
          returnHome: function returnHome() {
            window.location.href = "/"
          }
        }),
        computed: Object(S["c"])({
          selectedAddress: "selectedAddress",
          loggedIn: function loggedIn(e) {
            return "" !== e.selectedAddress && !e.loginInProgress
          },
          loginInProgress: "loginInProgress"
        }),
        watch: {
          selectedAddress: function selectedAddress(e, t) {
            if (e !== t && "" !== e) {
              var a = this.$route.query.redirect;
              (void 0 === a || a && a.includes("index.html")) && (a = "/wallet"), this.$router.push(a).catch((function (e) {}))
            }
          }
        },
        mounted: function mounted() {
          var e = this,
            t = setInterval((function () {
              window.gapi && window.gapi.load("auth2", (function () {
                window.auth2 = window.gapi.auth2.init({
                  client_id: O["default"].GOOGLE_CLIENT_ID
                }), e.gapiLoaded = !0, clearInterval(t)
              }))
            }), 2e3),
            a = setInterval((function () {
              window.FB && (window.FB.init({
                appId: O["default"].FACEBOOK_APP_ID,
                version: "v4.0"
              }), window.FBInitialized = !0, e.fbLoaded = !0, clearInterval(a))
            }), 2e3);
          "" !== this.selectedAddress && this.$router.push(this.$route.query.redirect || "/wallet").catch((function (e) {}))
        },
        created: function created() {
          this.isLogout = "login" !== this.$route.name
        }
      },
      Ce = ke,
      Ae = (a("e0ee"), Object(l["a"])(Ce, Loginvue_type_template_id_1e0cc76e_scoped_true_render, xe, !1, null, "1e0cc76e", null)),
      Te = Ae.exports;
    u()(Ae, {
      VBtn: ee["a"],
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var Confirmvue_type_template_id_25af4da3_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-container", {
          staticClass: "confirm-container",
          attrs: {
            "py-6": "",
            "px-0": ""
          }
        }, ["transaction" === e.type ? [r("v-layout", {
          attrs: {
            wrap: "",
            "align-center": "",
            "mx-6": "",
            "mb-6": ""
          }
        }, [r("v-flex", {
          staticClass: "text_1--text font-weight-bold headline float-left",
          class: e.isLightHeader ? "text--lighten-3" : "",
          attrs: {
            xs12: ""
          }
        }, [e._v(e._s(e.header))]), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("network-display")], 1)], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [e.transactionCategory === e.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM ? [r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2"
        }, [e._v("Send to")]), r("v-divider"), r("div", [r("span", {
          staticClass: "subtitle-2 float-left text_2--text"
        }, [e._v(e._s(e.amountTo))])])], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2"
        }, [e._v("You send")]), r("v-divider", {
          staticClass: "mb-1"
        }), r("div", [r("img", {
          staticClass: "mr-2 float-left",
          attrs: {
            src: e.assetDetails.logo,
            height: "35px"
          }
        }), r("span", {
          staticClass: "subtitle-2 float-left text_2--text asset-name"
        }, [e._v(e._s(e.assetDetails.name))])])], 1)] : r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2"
        }, [e._v("Amount")]), r("v-divider"), r("div", [r("span", {
          staticClass: "subtitle-2 float-left text_2--text"
        }, [e._v(e._s(e.displayAmountTo))]), r("span", {
          staticClass: "subtitle-2 float-right"
        }, [e._v(e._s(e.displayAmountValue))])]), r("div", {
          staticClass: "caption float-right clearfix"
        }, [e._v(e._s(e.displayAmountConverted))])], 1), r("v-flex", {
          attrs: {
            "px-2": ""
          }
        }, [r("TransactionSpeedSelect", {
          attrs: {
            gas: e.gasEstimate,
            displayAmount: e.value,
            activeGasPriceConfirm: e.gasPrice,
            symbol: "ETH"
          },
          on: {
            onSelectSpeed: e.onSelectSpeed
          }
        })], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "px-6": "",
            "mt-4": "",
            "mb-1": ""
          }
        }, [r("div", {
          staticClass: "subtitle-1 font-weight-bold"
        }, [e._v("Total")]), r("v-divider"), r("div", [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("Cost of Transaction")]), r("span", {
          staticClass: "subtitle-1 float-right primary--text font-weight-bold"
        }, [e._v(e._s(e.costOfTransaction))])]), e.isOtherToken ? r("div", {
          staticClass: "clearfix"
        }, [r("span", {
          staticClass: "subtitle-1 float-right primary--text font-weight-bold"
        }, [e._v("+ " + e._s(e.significantDigits(this.gasCost)) + " ETH")])]) : e._e(), r("div", {
          staticClass: "caption float-right clearfix"
        }, [e._v(e._s(e.costOfTransactionConverted))])], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-3": "",
            "mt-3": ""
          }
        }, [r("v-dialog", {
          attrs: {
            width: "600px"
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("div", e._g({
                staticClass: "subtitle-2 float-right primary--text mx-6",
                attrs: {
                  id: "more-details-link"
                }
              }, a), [e._v("More Details")])]
            }
          }], null, !1, 2230744087),
          model: {
            value: e.detailsDialog,
            callback: function (t) {
              e.detailsDialog = t
            },
            expression: "detailsDialog"
          }
        }, [r("v-card", {
          staticClass: "pa-4 more-details-container"
        }, [r("v-card-text", {
          staticClass: "text_1--text"
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs4: "",
            sm2: ""
          }
        }, [e._v(" Rate "), r("span", {
          staticClass: "float-right mr-4"
        }, [e._v(":")])]), r("v-flex", {
          staticClass: "text_2--text",
          attrs: {
            id: "currency-rate",
            xs8: "",
            sm10: ""
          }
        }, [e._v(e._s(e.getCurrencyRate))]), r("v-flex", {
          attrs: {
            xs4: "",
            sm2: ""
          }
        }, [e._v(" Network "), r("span", {
          staticClass: "float-right mr-4"
        }, [e._v(":")])]), r("v-flex", {
          staticClass: "text_2--text",
          attrs: {
            xs8: "",
            sm10: ""
          }
        }, [r("span", {
          staticClass: "text-capitalize",
          attrs: {
            id: "network"
          }
        }, [e._v(e._s(e.networkName))])]), r("v-flex", {
          attrs: {
            xs4: "",
            sm2: ""
          }
        }, [e._v(" Type "), r("span", {
          staticClass: "float-right mr-4"
        }, [e._v(":")])]), r("v-flex", {
          staticClass: "text_2--text",
          attrs: {
            id: "type",
            xs8: "",
            sm10: ""
          }
        }, [e._v(e._s(e.header))]), e.txData || "" !== e.txDataParams ? r("v-flex", {
          attrs: {
            xs2: ""
          }
        }, [e._v(" Data "), r("span", {
          staticClass: "float-right mr-4"
        }, [e._v(":")])]) : e._e(), r("v-flex", {
          attrs: {
            xs12: "",
            "mt-1": ""
          }
        }, ["" !== e.txDataParams ? r("v-card", {
          attrs: {
            flat: "",
            color: "background_3"
          }
        }, [r("v-card-text", [r("pre", [e._v(e._s(e.txDataParams))])])], 1) : e._e()], 1), e.txData ? r("v-flex", {
          attrs: {
            x12: "",
            "mt-4": ""
          }
        }, [r("div", {
          staticClass: "mb-1"
        }, [e._v("Hex Data:")]), r("v-card", {
          staticStyle: {
            "word-break": "break-all"
          },
          attrs: {
            flat: "",
            color: "background_3"
          }
        }, [r("v-card-text", [e._v(e._s(e.txData))])], 1)], 1) : e._e()], 1)], 1), r("v-card-actions", [r("v-spacer"), r("v-btn", {
          attrs: {
            id: "less-details-link",
            color: "primary",
            text: ""
          },
          on: {
            click: function (t) {
              e.detailsDialog = !1
            }
          }
        }, [e._v("Less Details")])], 1)], 1)], 1)], 1), e.canShowError ? r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: "",
            "px-6": "",
            "mb-6": ""
          }
        }, [r("div", {
          staticClass: "caption error--text"
        }, [e._v(e._s(e.errorMsg))]), e.topUpErrorShow ? r("div", {
          staticClass: "caption mt-1"
        }, [e._v(" Please "), r("v-btn", {
          staticClass: "mx-1 px-2 caption",
          attrs: {
            color: "primary",
            small: "",
            outlined: ""
          },
          on: {
            click: e.topUp
          }
        }, [e._v("Top up")]), e._v(" your wallet ")], 1) : e._e()]) : e._e(), e.showConfirmMessage ? r("v-flex", {
          attrs: {
            xs12: "",
            "px-6": "",
            "mb-6": ""
          }
        }, [r("div", {
          staticClass: "caption error--text"
        }, [e._v(" By confirming this, you grant permission for this contract to spend up to " + e._s(e.displayAmountValue) + " of your tokens. ")])]) : e._e(), r("v-layout", {
          attrs: {
            "px-6": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "text_2--text",
          attrs: {
            block: "",
            text: "",
            large: ""
          },
          on: {
            click: e.triggerDeny
          }
        }, [e._v("Cancel")])], 1), r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-dialog", {
          attrs: {
            "max-width": "550",
            persistent: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("v-btn", e._g({
                staticClass: "ml-2",
                attrs: {
                  id: "confirm-btn",
                  disabled: !e.canApprove,
                  block: "",
                  depressed: "",
                  large: "",
                  color: "primary"
                }
              }, a), [e._v("Confirm")])]
            }
          }], null, !1, 3498973883),
          model: {
            value: e.confirmDialog,
            callback: function (t) {
              e.confirmDialog = t
            },
            expression: "confirmDialog"
          }
        }, [r("transfer-confirm", {
          attrs: {
            toAddress: e.receiver,
            convertedAmount: e.displayAmountConverted,
            displayAmount: e.displayAmountValue,
            speedSelected: e.speed,
            transactionFee: e.txFees,
            selectedCurrency: e.selectedCurrency
          },
          on: {
            onClose: function (t) {
              e.confirmDialog = !1
            },
            onConfirm: e.triggerSign
          }
        })], 1)], 1)], 1)], 2)] : e._e(), "message" === e.type ? [r("v-layout", {
          attrs: {
            wrap: "",
            "align-center": "",
            "mx-6": "",
            "mb-6": ""
          }
        }, [r("v-flex", {
          staticClass: "text_1--text font-weight-bold headline float-left",
          attrs: {
            xs12: ""
          }
        }, [e._v("Permissions")]), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("network-display")], 1)], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            "mb-6": "",
            "mx-6": ""
          }
        }, [r("div", {
          staticClass: "subtitle-2 text_2--text"
        }, [e._v("Request from:")]), r("v-card", {
          staticClass: "background lighten-3",
          attrs: {
            flat: ""
          }
        }, [r("v-card-text", [r("div", {
          staticClass: "subtitle-2 primary--text"
        }, [e._v(e._s(e.origin))])]), r("img", {
          staticClass: "card-upper-icon",
          attrs: {
            src: a("94ce")
          }
        })], 1)], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": "",
            "mx-6": ""
          }
        }, [r("v-list", {
          staticClass: "note-list"
        }, [r("v-list-item", {
          staticClass: "pa-0"
        }, [r("v-list-item-icon", {
          staticClass: "ma-1"
        }, [r("img", {
          attrs: {
            src: a("75ea"),
            width: "12"
          }
        })]), r("v-list-item-content", {
          staticClass: "pa-1"
        }, [r("div", {
          staticClass: "caption text_2--text"
        }, [e._v("This application is requesting for your digital signature.")])])], 1), r("v-list-item", {
          staticClass: "pa-0"
        }, [r("v-list-item-content", {
          staticClass: "pa-1 background lighten-3",
          attrs: {
            flat: ""
          }
        }, [r("v-card", {
          staticClass: "body-2 text-left pa-2 word-break typedMessageBox",
          attrs: {
            flat: ""
          }
        }, ["string" === typeof e.message ? r("v-expansion-panels", [r("p", {
          class: e.$vuetify.theme.dark ? "text_1--text" : "text_2--text",
          staticStyle: {
            "text-align": "left"
          }
        }, [e._v(e._s(e.message))])]) : Array.isArray(e.typedMessages) ? Array.isArray(e.typedMessages) ? r("v-expansion-panels", [r("v-expansion-panel", [r("v-expansion-panel-header", [e._v("data")]), e._l(e.typedMessages, (function (e) {
          return r("v-expansion-panel-content", {
            key: e
          }, [r("vue-json-pretty", {
            attrs: {
              path: "res",
              data: e,
              showline: !0,
              deep: 5
            }
          })], 1)
        }))], 2)], 1) : e._e() : r("v-expansion-panels", e._l(e.typedMessages, (function (t, a) {
          return r("v-expansion-panel", {
            key: a
          }, [r("v-expansion-panel-header", [e._v(e._s(a))]), r("v-expansion-panel-content", [r("vue-json-pretty", {
            attrs: {
              path: "res",
              data: t,
              showline: !0,
              deep: 5
            }
          })], 1)], 1)
        })), 1)], 1)], 1)], 1)], 1)], 1), r("v-layout", {
          attrs: {
            "px-6": "",
            "mx-3": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "text_2--text",
          attrs: {
            block: "",
            text: "",
            large: ""
          },
          on: {
            click: e.triggerDeny
          }
        }, [e._v("Cancel")])], 1), r("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "ml-2",
          attrs: {
            block: "",
            depressed: "",
            large: "",
            color: "primary"
          },
          on: {
            click: e.triggerSign
          }
        }, [e._v("Confirm")])], 1)], 1)], 1)] : e._e(), "none" === e.type ? [r("page-loader")] : e._e()], 2)
      },
      _e = [],
      Se = (a("7db0"), a("c975"), a("b680"), a("07ac"), a("acd8"), a("498a"), a("e587")),
      Oe = a("284c"),
      Ee = a("d538"),
      Ie = a.n(Ee),
      Me = a("1131"),
      Pe = a("082e"),
      TransactionSpeedSelectvue_type_template_id_0058507e_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "mb-3": ""
          }
        }, [a("div", {
          staticClass: "subtitle-2 mb-1 px-4"
        }, [a("span", [e._v(" Select your Transaction Speed "), a("HelpTooltip", {
          attrs: {
            title: "Transaction Fee",
            description: "This is a mandatory processing fee users pay to the Ethereum network for each transaction.\n        A higher fee will speed up the transaction process."
          }
        })], 1), e.$vuetify.breakpoint.xsOnly ? e._e() : a("TransferAdvanceOption", {
          attrs: {
            symbol: e.symbol,
            displayAmount: e.displayAmount,
            gas: e.gas,
            activeGasPrice: e.activeGasPrice
          },
          on: {
            onSave: e.onSaveAdvanceOptions
          }
        })], 1), e.isAdvanceOption ? e._e() : a("v-layout", {
          attrs: {
            xs12: "",
            "justify-space-between": "",
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs6: "",
            "px-4": "",
            "mb-1": ""
          }
        }, [a("v-btn", {
          staticClass: "button-speed",
          class: "average" === e.speedSelected ? "selected" : "",
          attrs: {
            id: "average-speed-btn",
            block: "",
            large: "",
            outlined: ""
          },
          on: {
            click: function (t) {
              return e.selectSpeed("average", e.averageGasPrice)
            }
          }
        }, [a("span", [e._v("~ " + e._s(e.averageGasPriceSpeed) + " Mins")]), a("span", {
          staticClass: "font-weight-light body-2"
        }, [e._v(e._s(e.getGasDisplayString(e.averageGasPrice)))])])], 1), a("v-flex", {
          attrs: {
            xs6: "",
            "px-4": "",
            "mb-1": ""
          }
        }, [a("v-btn", {
          staticClass: "button-speed",
          class: "fastest" === e.speedSelected ? "selected" : "",
          attrs: {
            id: "fastest-speed-btn",
            block: "",
            large: "",
            outlined: ""
          },
          on: {
            click: function (t) {
              return e.selectSpeed("fastest", e.fastestGasPrice)
            }
          }
        }, [a("span", [e._v("~ " + e._s(e.fastestGasPriceSpeed) + " Mins")]), a("span", {
          staticClass: "font-weight-light body-2"
        }, [e._v(e._s(e.getGasDisplayString(e.fastestGasPrice)))])])], 1)], 1), e.isAdvanceOption ? a("v-layout", {
          attrs: {
            "align-center": ""
          }
        }, [a("v-flex", {
          attrs: {
            xs8: "",
            "px-6": "",
            "mb-1": ""
          }
        }, [a("div", {
          staticClass: "subtitle-2 font-weight-bold"
        }, [e._v(" " + e._s(e.getEthAmountDisplay(e.gas, e.activeGasPrice)) + " "), a("span", {
          staticClass: "caption text_2--text"
        }, [e._v("( ~ " + e._s(e.getGasDisplayString(e.activeGasPrice)) + " )")])])]), a("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs4: "",
            "px-4": ""
          }
        }, [a("v-btn", {
          attrs: {
            id: "adv-reset-btn",
            outlined: "",
            color: "primary"
          },
          on: {
            click: e.resetAdvanceOption
          }
        }, [e._v("Reset")])], 1)], 1) : e._e(), a("v-layout", [a("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [e.$vuetify.breakpoint.xsOnly ? a("TransferAdvanceOption", {
          attrs: {
            symbol: e.symbol,
            displayAmount: e.displayAmount,
            gas: e.gas,
            activeGasPrice: e.activeGasPrice
          },
          on: {
            onSave: e.onSaveAdvanceOptions
          }
        }) : e._e()], 1)], 1)], 1)
      },
      Re = [],
      TransferAdvanceOptionvue_type_template_id_32b8e0da_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-dialog", {
          attrs: {
            persistent: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("a", e._g({
                directives: [{
                  name: "show",
                  rawName: "v-show",
                  value: e.displayAmount,
                  expression: "displayAmount"
                }],
                staticClass: "float-right primary--text subtitle-2",
                attrs: {
                  id: "advance-option-link"
                }
              }, r), [e._v("Advanced Options")])]
            }
          }]),
          model: {
            value: e.dialog,
            callback: function (t) {
              e.dialog = t
            },
            expression: "dialog"
          }
        }, [a("v-card", {
          staticClass: "advance-option py-4"
        }, [a("v-container", [a("v-form", {
          ref: "advanceOptionForm",
          attrs: {
            value: e.advanceOptionFormValid,
            "lazy-validation": ""
          },
          on: {
            submit: function (t) {
              return t.preventDefault(), e.saveOptions(t)
            }
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("div", {
          staticClass: "font-weight-bold headline"
        }, [e._v(e._s(e.pageHeader))]), a("div", {
          staticClass: "font-weight-bold subtitle-2"
        }, [e._v("Customize Gas")])]), a("v-flex", {
          attrs: {
            xs12: "",
            "mt-4": ""
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v(" Gas Price (GWEI) "), a("HelpTooltip", {
          attrs: {
            title: "Gas Price"
          },
          scopedSlots: e._u([{
            key: "description",
            fn: function () {
              return [a("div", {
                staticClass: "body-2 text-justify"
              }, [a("span", {
                staticClass: "font-weight-medium"
              }, [e._v("Gas")]), e._v(" is needed to power blockchain transactions. "), a("span", {
                staticClass: "font-weight-medium"
              }, [e._v("Gas Price")]), e._v(" is the amount per unit Gas to pay for a transaction. It is measured in ‘Gwei’. ")]), a("div", {
                staticClass: "caption mt-1"
              }, [e._v(" 1 Gwei=10 "), a("sup", [e._v("-9")]), e._v(" ETH "), a("small", [e._v("(very small USD value)")])])]
            },
            proxy: !0
          }])
        })], 1), a("v-text-field", {
          attrs: {
            id: "gas-price",
            placeholder: "Enter Value",
            outlined: "",
            required: "",
            type: "number"
          },
          model: {
            value: e.advancedActiveGasPrice,
            callback: function (t) {
              e.advancedActiveGasPrice = t
            },
            expression: "advancedActiveGasPrice"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v(" Gas Limit "), a("HelpTooltip", {
          attrs: {
            title: "Gas Limit",
            description: "This is the maximum amount of gas you're willing to spend on a transaction.\n                    A standard ETH transfer requires a gas limit of 21,000 units of gas."
          }
        })], 1), a("v-text-field", {
          attrs: {
            id: "advanced-gas",
            readonly: "",
            outlined: "",
            value: e.advancedGas,
            required: "",
            type: "number"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Send Amount")]), e.$vuetify.breakpoint.xsOnly ? [a("span", {
          staticClass: "float-right"
        }, [e._v(e._s(e.displayAmount) + " " + e._s(e.symbol))]), a("v-divider", {
          staticClass: "mt-1 mb-2"
        })] : a("v-text-field", {
          attrs: {
            suffix: e.symbol,
            outlined: "",
            readonly: "",
            value: e.displayAmount,
            "persistent-hint": "",
            hint: e.displayAmountConverted
          }
        })], 2), a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Transaction Fee")]), e.$vuetify.breakpoint.xsOnly ? [a("span", {
          staticClass: "float-right"
        }, [a("span", {
          attrs: {
            id: "transaction-fee-mobile"
          }
        }, [e._v(e._s(e.gasAmountDisplay))]), e._v(" " + e._s(e.symbol) + " ")]), a("v-divider", {
          staticClass: "mt-1 mb-2"
        })] : a("v-text-field", {
          attrs: {
            id: "transaction-fee",
            suffix: e.symbol,
            outlined: "",
            readonly: "",
            value: e.gasAmountDisplay,
            "persistent-hint": "",
            hint: e.gasAmountConverted
          }
        })], 2), a("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "mt-5" : "",
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("New Total")]), e.$vuetify.breakpoint.xsOnly ? [a("span", {
          staticClass: "float-right subtitle-1 font-weight-bold primary--text"
        }, [e._v(e._s(e.totalCost) + " " + e._s(e.symbol))]), a("v-divider", {
          staticClass: "mt-1 mb-2"
        })] : a("v-text-field", {
          attrs: {
            suffix: e.symbol,
            outlined: "",
            readonly: "",
            value: e.totalCost,
            "persistent-hint": "",
            hint: e.totalCostConverted
          }
        })], 2)], 1)], 1)], 1), a("v-layout", {
          attrs: {
            "mt-4": "",
            "pr-4": ""
          }
        }, [a("v-spacer"), a("v-btn", {
          attrs: {
            large: "",
            text: ""
          },
          on: {
            click: e.onCancel
          }
        }, [e._v("Cancel")]), a("v-btn", {
          staticClass: "ml-4",
          attrs: {
            id: "adv-opt-submit-btn",
            large: "",
            depressed: "",
            color: "primary",
            type: "submit",
            disabled: !e.advanceOptionFormValid
          }
        }, [e._v("Save")])], 1)], 1)], 1)], 1)], 1)
      },
      Le = [],
      je = a("5b32"),
      De = {
        components: {
          HelpTooltip: je["a"]
        },
        props: ["activeGasPrice", "gas", "displayAmount", "symbol"],
        data: function data() {
          return {
            pageHeader: we["WALLET_HEADERS_TRANSFER"],
            dialog: !1,
            advanceOptionFormValid: !0,
            advancedActiveGasPrice: 0,
            advancedGas: 0
          }
        },
        computed: {
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          },
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          totalCost: function totalCost() {
            var e = Math.max(this.gasAmountDisplay.toString().length, this.displayAmount.toString().length);
            return Object(Z["significantDigits"])(parseFloat(this.displayAmount) + parseFloat(this.gasAmount), !1, e - 2)
          },
          gasAmount: function gasAmount() {
            return this.advancedGas * this.advancedActiveGasPrice * Math.pow(10, -9)
          },
          gasAmountDisplay: function gasAmountDisplay() {
            return Object(Z["significantDigits"])(this.gasAmount)
          },
          gasAmountConverted: function gasAmountConverted() {
            return this.convertedDisplay(this.gasAmount)
          },
          displayAmountConverted: function displayAmountConverted() {
            return this.convertedDisplay(parseFloat(this.displayAmount))
          },
          totalCostConverted: function totalCostConverted() {
            return this.convertedDisplay(this.totalCost)
          }
        },
        methods: {
          onCancel: function onCancel(e) {
            this.dialog = !1
          },
          saveOptions: function saveOptions() {
            if (this.$refs.advanceOptionForm.validate()) {
              var e = {
                advancedGas: this.advancedGas,
                advancedActiveGasPrice: this.advancedActiveGasPrice
              };
              this.$emit("onSave", e), this.dialog = !1, this.$refs.advanceOptionForm.resetValidation()
            }
          },
          updateDetails: function updateDetails() {
            this.advancedActiveGasPrice = this.activeGasPrice, this.advancedGas = this.gas
          },
          convertedDisplay: function convertedDisplay(e) {
            var t = this.getCurrencyMultiplier,
              a = Object(Z["significantDigits"])(e * t);
            return "~ ".concat(a, " ").concat(this.selectedCurrency)
          }
        },
        watch: {
          dialog: function dialog(e) {
            e && this.updateDetails()
          }
        },
        created: function created() {
          this.updateDetails()
        }
      },
      Ne = De,
      Be = (a("d575"), a("169a")),
      Ve = a("ce7e"),
      Fe = a("4bd4"),
      Ue = a("2fa4"),
      He = a("8654"),
      Ge = Object(l["a"])(Ne, TransferAdvanceOptionvue_type_template_id_32b8e0da_scoped_true_render, Le, !1, null, "32b8e0da", null),
      Ke = Ge.exports;
    u()(Ge, {
      VBtn: ee["a"],
      VCard: te["a"],
      VContainer: M["a"],
      VDialog: Be["a"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VLayout: R["a"],
      VSpacer: Ue["a"],
      VTextField: He["a"]
    });
    var Ye = {
        components: {
          TransferAdvanceOption: Ke,
          HelpTooltip: je["a"]
        },
        props: ["gas", "displayAmount", "activeGasPriceConfirm", "symbol", "resetSpeed"],
        data: function data() {
          return {
            isAdvanceOption: !1,
            speedSelected: "",
            averageGasPrice: "5",
            fastestGasPrice: "20",
            activeGasPrice: "",
            averageGasPriceSpeed: "",
            fastestGasPriceSpeed: ""
          }
        },
        computed: {
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          }
        },
        methods: {
          onSaveAdvanceOptions: function onSaveAdvanceOptions(e) {
            this.activeGasPrice = parseFloat(e.advancedActiveGasPrice), this.isAdvanceOption = !0, this.updateCosts(!1, parseFloat(e.advancedGas))
          },
          resetAdvanceOption: function resetAdvanceOption() {
            "fastest" === this.speedSelected ? this.activeGasPrice = this.fastestGasPrice : (this.activeGasPrice = this.averageGasPrice, this.speedSelected = "average"), this.isAdvanceOption = !1, this.updateCosts(!0)
          },
          selectSpeed: function selectSpeed(e, t) {
            this.speedSelected !== e && (this.speedSelected = e, this.activeGasPrice = t, this.updateCosts())
          },
          getGasDisplayString: function getGasDisplayString(e) {
            var t = this.getGasAmount(e);
            return "Pay ".concat(Object(Z["significantDigits"])(t), " ").concat(this.selectedCurrency)
          },
          getGasAmount: function getGasAmount(e) {
            var t = this.getCurrencyMultiplier,
              a = this.getEthAmount(this.gas, e),
              r = a * t;
            return r
          },
          getEthAmount: function getEthAmount(e, t) {
            return e * t * Math.pow(10, -9)
          },
          getEthAmountDisplay: function getEthAmountDisplay(e, t) {
            return "".concat(Object(Z["significantDigits"])(this.getEthAmount(e, t)), " ETH")
          },
          updateCosts: function updateCosts(e, t) {
            var a = "average" === this.speedSelected ? this.averageGasPriceSpeed : this.fastestGasPriceSpeed;
            this.$emit("onSelectSpeed", {
              speedSelected: this.speedSelected,
              activeGasPrice: this.activeGasPrice,
              speed: a,
              isReset: !!e,
              gas: t || this.gas
            })
          },
          setSelectedSpeed: function setSelectedSpeed() {
            var e = "",
              t = 0;
            this.fastestGasPrice === this.activeGasPriceConfirm ? (e = "fastest", t = this.fastestGasPrice) : this.averageGasPrice === this.activeGasPriceConfirm ? (e = "average", t = this.averageGasPrice) : (t = this.activeGasPriceConfirm, this.isAdvanceOption = !0), this.speedSelected = e, this.activeGasPrice = t, this.activeGasPriceConfirm && this.updateCosts()
          }
        },
        watch: {
          resetSpeed: function resetSpeed(e) {
            e && (this.speedSelected = "average", this.resetAdvanceOption())
          }
        },
        created: function created() {
          var e = this;
          fetch("https://ethgasstation.info/json/ethgasAPI.json", {
            headers: {},
            referrer: "http://ethgasstation.info/json/",
            referrerPolicy: "no-referrer-when-downgrade",
            body: null,
            method: "GET",
            mode: "cors"
          }).then((function (e) {
            return e.json()
          })).then((function (t) {
            var a = t.average,
              r = t.avgWait,
              n = (t.block_time, t.blockNum, t.fastest),
              s = t.fastestWait,
              o = (t.safeLow, t.safeLowWait, t.speed, [a, n].map((function (e) {
                return parseFloat(e) / 10
              }))),
              i = Object(Se["a"])(o, 2),
              c = i[0],
              l = i[1];
            e.averageGasPrice = c, e.fastestGasPrice = l, e.averageGasPriceSpeed = r, e.fastestGasPriceSpeed = s, e.activeGasPriceConfirm ? e.setSelectedSpeed() : e.selectSpeed("average", c)
          })).catch((function (e) {
            n.a.error(e)
          }))
        }
      },
      qe = Ye,
      ze = (a("570a"), Object(l["a"])(qe, TransactionSpeedSelectvue_type_template_id_0058507e_scoped_true_render, Re, !1, null, "0058507e", null)),
      We = ze.exports;
    u()(ze, {
      VBtn: ee["a"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var TransferConfirmvue_type_template_id_26d86748_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-card", {
          staticClass: "advance-option"
        }, [a("v-card-text", {
          staticClass: "text_1--text py-12"
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("div", {
          staticClass: "font-weight-bold headline"
        }, [e._v(e._s(e.pageHeader))])]), a("v-flex", {
          attrs: {
            xs12: "",
            "mt-4": ""
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "pb-4": ""
          }
        }, [a("div", {
          staticClass: "subtitle-2"
        }, [e._v("Sending to:")]), a("v-divider", {
          staticClass: "my-1"
        }), a("div", {
          staticClass: "caption text_2--text"
        }, [e._v(e._s(e.toAddress))])], 1), a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "pb-4": ""
          }
        }, [a("div", {
          staticClass: "subtitle-2"
        }, [e._v("Amount to send:")]), a("v-divider", {
          staticClass: "my-1"
        }), a("div", [a("div", {
          staticClass: "float-right text-right"
        }, [a("div", {
          staticClass: "body-1 font-weight-bold"
        }, [e._v(e._s(e.displayAmount))]), a("div", {
          staticClass: "caption text_2--text"
        }, [e._v(e._s(e.convertedAmount))])])])], 1), a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "pb-4": ""
          }
        }, [a("div", {
          staticClass: "subtitle-2"
        }, [e._v("Transaction Fee:")]), a("v-divider", {
          staticClass: "my-1"
        }), a("div", [a("div", {
          staticClass: "float-right text-right"
        }, [a("div", {
          staticClass: "body-1 font-weight-bold"
        }, [e._v("~ " + e._s(e.speedSelected) + " Mins")]), a("div", {
          staticClass: "caption text_2--text"
        }, [e._v(e._s(e.significantDigits(e.transactionFee)) + " " + e._s(e.selectedCurrency))])])])], 1)], 1)], 1)], 1), a("v-layout", {
          attrs: {
            "mt-4": "",
            "pr-4": ""
          }
        }, [a("v-spacer"), a("v-btn", {
          attrs: {
            large: "",
            text: ""
          },
          on: {
            click: e.onCancel
          }
        }, [e._v("Cancel")]), a("v-btn", {
          staticClass: "ml-4",
          attrs: {
            id: "confirm-transfer-btn",
            large: "",
            color: "primary",
            type: "button"
          },
          on: {
            click: e.onConfirm
          }
        }, [e._v("Confirm")])], 1)], 1)], 1)
      },
      Qe = [],
      Je = {
        props: ["toAddress", "selectedCurrency", "convertedAmount", "displayAmount", "speedSelected", "transactionFee"],
        data: function data() {
          return {
            pageHeader: we["WALLET_HEADERS_CONFIRM"]
          }
        },
        methods: {
          onCancel: function onCancel(e) {
            this.$emit("onClose")
          },
          onConfirm: function onConfirm() {
            this.$emit("onConfirm"), this.$emit("onClose")
          },
          significantDigits: Z["significantDigits"]
        }
      },
      Ze = Je,
      Xe = Object(l["a"])(Ze, TransferConfirmvue_type_template_id_26d86748_render, Qe, !1, null, null, null),
      $e = Xe.exports;
    u()(Xe, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VLayout: R["a"],
      VSpacer: Ue["a"]
    });
    var et = a("7648"),
      tt = a("5e5c"),
      at = a("eed9");

    function Confirmvue_type_script_lang_js_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function Confirmvue_type_script_lang_js_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? Confirmvue_type_script_lang_js_ownKeys(a, !0).forEach((function (t) {
          Object(ye["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : Confirmvue_type_script_lang_js_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    a("80fa");
    var rt = a("231f"),
      nt = (a("0172"), a("5c7d")),
      st = a("b00c"),
      ot = st.RPC,
      it = st.RPC_DISPLAY_NAME,
      ct = st.CONTRACT_INTERACTION_KEY,
      lt = st.DEPLOY_CONTRACT_ACTION_KEY,
      dt = st.TOKEN_METHOD_APPROVE,
      ut = st.TOKEN_METHOD_TRANSFER,
      pt = st.TOKEN_METHOD_TRANSFER_FROM,
      gt = st.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
      ft = st.SEND_ETHER_ACTION_KEY,
      vt = st.SUPPORTED_NETWORK_TYPES,
      ht = st.OLD_ERC721_LIST,
      mt = Math.pow(10, 9),
      bt = {
        name: "confirm",
        components: {
          PageLoader: G,
          TransactionSpeedSelect: We,
          TransferConfirm: $e,
          VueJsonPretty: Ie.a,
          NetworkDisplay: J
        },
        data: function data() {
          return {
            confirmDialog: !1,
            detailsDialog: !1,
            dialogAdvanceOptions: !1,
            open: !1,
            type: "none",
            origin: "unknown",
            gasPrice: 10,
            gasKnob: 10,
            min: 100,
            max: 4e3,
            balance: 0,
            value: 0,
            amountTo: "",
            amountValue: "",
            tokenPrice: 0,
            amountTokenValueConverted: 0,
            currencyRateDate: "",
            receiver: "unknown",
            dialog: !0,
            message: "",
            selectedToken: "",
            gasCost: 0,
            gasEstimate: 0,
            txData: "",
            txDataParams: "",
            sender: "",
            totalUsdCost: 0,
            totalEthCost: 0,
            totalEthCostDisplay: "",
            errorMsg: "",
            topUpErrorShow: "",
            txFees: 0,
            network: "",
            networkName: "",
            transactionCategory: "",
            dollarValue: 0,
            canApprove: !0,
            canShowError: !1,
            selectedSpeed: "",
            speed: "",
            typedMessages: {},
            id: 0,
            assetDetails: {},
            COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM: gt,
            networks: [].concat(Object(Oe["a"])(Object.values(vt)), [{
              networkName: it,
              host: ot,
              chainId: ""
            }])
          }
        },
        computed: {
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          color: function color() {
            return this.gasPrice < 5 ? "indigo" : this.gasPrice < 10 ? "teal" : this.gasPrice < 30 ? "green" : this.gasPrice < 50 ? "orange" : "red"
          },
          computedBalance: function computedBalance() {
            return Object(Z["significantDigits"])(parseFloat(this.balance).toFixed(5)) || 0
          },
          header: function header() {
            switch (this.transactionCategory) {
              case lt:
                return "Deploy";
              case ct:
                return this.getHeaderByDapp();
              case gt:
                return "Collectible Safe Transfer From";
              case dt:
                return "Approve";
              case ut:
              case ft:
                return "Transfer";
              case pt:
                return "Transfer From";
              default:
                return "Transaction"
            }
          },
          isLightHeader: function isLightHeader() {
            return [lt, ct].indexOf(this.transactionCategory) >= 0
          },
          displayAmountTo: function displayAmountTo() {
            switch (this.transactionCategory) {
              case dt:
              case ut:
              case pt:
                return "To: ".concat(this.slicedAddress(this.amountTo));
              case ft:
              case ct:
                return "To: ".concat(this.slicedAddress(this.receiver));
              case lt:
                return "New Contract";
              default:
                return "Transaction Request"
            }
          },
          displayAmountValue: function displayAmountValue() {
            switch (this.transactionCategory) {
              case dt:
              case ut:
              case pt:
                return "".concat(this.amountDisplay(this.amountValue), " ").concat(this.selectedToken);
              case gt:
                return "ID: ".concat(this.amountValue);
              case ft:
              case ct:
                return "".concat(this.amountDisplay(this.value), " ETH");
              case lt:
                return "Not Applicable";
              default:
                return "Transaction Request"
            }
          },
          displayAmountConverted: function displayAmountConverted() {
            switch (this.transactionCategory) {
              case dt:
              case ut:
              case pt:
                return "~ ".concat(Object(Z["significantDigits"])(this.amountTokenValueConverted), " ").concat(this.selectedCurrency);
              case ft:
              case ct:
                return "~ ".concat(this.dollarValue, " ").concat(this.selectedCurrency);
              case lt:
                return "";
              default:
                return ""
            }
          },
          showConfirmMessage: function showConfirmMessage() {
            return this.transactionCategory === dt
          },
          costOfTransaction: function costOfTransaction() {
            return [dt, ut, pt].indexOf(this.transactionCategory) >= 0 ? "".concat(this.displayAmountValue) : "".concat(this.totalEthCostDisplay, " ETH")
          },
          isOtherToken: function isOtherToken() {
            return [dt, ut, pt].indexOf(this.transactionCategory) >= 0
          },
          costOfTransactionConverted: function costOfTransactionConverted() {
            var e = this.isOtherToken ? Object(Z["significantDigits"])(this.totalUsdCost + this.amountTokenValueConverted, !1, 5) : this.totalUsdCost;
            return "~ ".concat(e, " ").concat(this.selectedCurrency)
          },
          imageType: function imageType() {
            return this.transactionCategory === lt || this.transactionCategory === ct ? "images/file-signature.svg" : "images/user.svg"
          },
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          },
          getCurrencyRate: function getCurrencyRate() {
            var e = this.$store.state.currencyData[this.selectedCurrency.toLowerCase()],
              t = this.isOtherToken ? this.tokenPrice * e : e,
              a = this.isOtherToken ? this.selectedToken : "ETH";
            return "1 ".concat(a, " = ").concat(Object(Z["significantDigits"])(t), " ").concat(this.selectedCurrency, " @ ").concat(this.currencyRateDate)
          }
        },
        watch: {
          gasPrice: function gasPrice(e, t) {
            this.gasCost = e * this.gasEstimate * Math.pow(10, -9), this.txFees = this.gasCost * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()];
            var a = parseFloat(this.value) + this.gasCost;
            this.totalEthCost = a;
            var r = Math.max(Object(Z["significantDigits"])(this.gasCost).toString().length, Object(Z["significantDigits"])(a).toString().length);
            this.totalEthCostDisplay = Object(Z["significantDigits"])(a, !1, r - 2), this.totalUsdCost = Object(Z["significantDigits"])(a * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()] || 0), parseFloat(this.balance) < a && !this.canShowError && (this.errorMsg = "Insufficient Funds", this.canApprove = !1, this.topUpErrorShow = !0)
          },
          gasKnob: function gasKnob(e, t) {
            this.gasPrice = Object(Z["calculateGasPrice"])(e)
          },
          errorMsg: function errorMsg(e, t) {
            if (e !== t) {
              var a = e && "" !== e;
              this.canShowError = a, this.canApprove = !a
            }
          }
        },
        methods: Confirmvue_type_script_lang_js_objectSpread({
          slicedAddress: function slicedAddress(e) {
            return Object(Z["addressSlicer"])(e) || "0x"
          },
          closeBottom: function closeBottom() {
            this.open = !1
          },
          openBottom: function openBottom() {
            this.open = !0
          },
          triggerSign: function triggerSign(e) {
            var t, a;
            return regeneratorRuntime.async((function triggerSign$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("torus_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), a = Object(Me["numberToHex"])(this.gasPrice * mt), e.next = 4, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "confirm-transaction",
                      gasPrice: a,
                      id: this.id
                    }
                  }));
                case 4:
                  t.close(), window.close();
                case 6:
                case "end":
                  return e.stop()
              }
            }), null, this)
          },
          triggerDeny: function triggerDeny(e) {
            var t;
            return regeneratorRuntime.async((function triggerDeny$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  return t = new N["a"]("torus_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]), e.next = 3, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "deny-transaction",
                      id: this.id
                    }
                  }));
                case 3:
                  t.close(), window.close();
                case 5:
                case "end":
                  return e.stop()
              }
            }), null, this)
          },
          topUp: function topUp() {
            this.openWallet()
          },
          openWallet: function openWallet() {
            this.$store.dispatch("showWalletPopup")
          },
          showGasPrice: function showGasPrice(e) {
            return "Fee: $ ".concat(Object(Z["significantDigits"])(parseFloat(this.txFees).toFixed(3)))
          },
          getGasDisplayString: function getGasDisplayString(e, t) {
            var a = this.getCurrencyMultiplier,
              r = this.gasEstimate * t * Math.pow(10, -9),
              n = r * a;
            return "".concat(Object(Z["significantDigits"])(n), " ").concat(this.$store.state.selectedCurrency)
          },
          onSelectSpeed: function onSelectSpeed(e) {
            this.speedSelected = e.speedSelected, this.gasPrice = e.activeGasPrice, this.speed = e.speed, this.gas = e.gas, e.isReset && (this.gasPrice = Object(Z["calculateGasPrice"])(this.gasPrice))
          },
          getNetworkName: function getNetworkName(e) {
            var t = this.networks.find((function (t) {
              return t.host === e
            }));
            return t && -1 !== t && Object.prototype.hasOwnProperty.call(t, "networkName") ? t.networkName : "UnKnown Network"
          },
          getDate: function getDate() {
            var e = new Date,
              t = e.getHours(),
              a = e.getMinutes(),
              r = e.getSeconds(),
              n = t >= 12 ? "PM" : "AM";
            return t %= 12, t = t || 12, "".concat(t, ":").concat(a, ":").concat(r, " ").concat(n)
          },
          amountDisplay: function amountDisplay(e) {
            return Object(Z["significantDigits"])(parseFloat(e).toFixed(5)) ? Object(Z["significantDigits"])(parseFloat(e).toFixed(5)) : parseFloat("0.00").toFixed(2)
          },
          significantDigits: Z["significantDigits"],
          getHeaderByDapp: function getHeaderByDapp() {
            return "www.etheremon.com" === this.origin ? "Claim a Mon" : "Contract Interaction"
          }
        }, Object(S["b"])({})),
        mounted: function mounted() {
          var e = this,
            t = new N["a"]("torus_channel_".concat(new URLSearchParams(window.location.search).get("instanceId")), Z["broadcastChannelOptions"]);
          t.onmessage = function _callee(a) {
            var r, n, s, o, i, c, l, d, u, p, g, f, v, h, m, b, x, y, w, k, C, A, T, _, S, E, I, M, P, R, L, j, D, N, B, V, F, U, H, G, K, Y, q, z, W, Q, J, X;
            return regeneratorRuntime.async((function _callee$($) {
              while (1) switch ($.prev = $.next) {
                case 0:
                  r = a.data || {}, n = r.type, s = r.msgParams, o = r.txParams, i = r.origin, c = r.balance, l = {
                    hostname: ""
                  };
                  try {
                    l = new URL(i)
                  } catch (err) {
                    nt.info(err)
                  }
                  if (nt.info(o), e.origin = l.hostname, "message" !== n) {
                    $.next = 15;
                    break
                  }
                  if (d = s.msgParams || {}, u = d.message, p = d.typedMessages, p) try {
                    p = JSON.parse(p)
                  } catch (ee) {
                    nt.error(ee)
                  }
                  g = s || {}, f = g.id, e.id = f, e.message = u, e.typedMessages = p, e.messageType = p ? "typed" : "normal", $.next = 91;
                  break;
                case 15:
                  if ("transaction" !== n) {
                    $.next = 91;
                    break
                  }
                  if (v = 0, h = o.txParams || {}, m = h.value, b = h.to, x = h.data, y = h.from, w = h.gas, k = h.gasPrice, C = o || {}, A = C.simulationFails, T = C.network, _ = C.id, S = C.transactionCategory, E = C.methodParams, I = C.contractParams, M = A || {}, P = M.reason, m && (v = Object(Me["fromWei"])(m.toString())), e.origin = 0 === e.origin.trim().length ? "Wallet" : e.origin, R = "", I.erc721 ? R = rt.find((function (e) {
                      return e.name && e.name.toLowerCase() === S
                    })) || "" : I.erc20 && (R = rt.find((function (e) {
                      return e.name && e.name.toLowerCase() === S
                    })) || ""), E && Object(at["isArray"])(E) && (S === pt || S === gt ? (D = E || [], N = Object(Se["a"])(D, 3), N[0], L = N[1], j = N[2]) : (B = E || [], V = Object(Se["a"])(B, 2), L = V[0], j = V[1])), nt.info(E, "params"), F = Object(Me["toChecksumAddress"])(b), ht.includes(F.toLowerCase()) && (S = gt, I.erc721 = !0, I.erc20 = !1, I.symbol = "ERC721", I.decimals = 0), U = I, H = U.decimals || 0, e.selectedToken = U.symbol || "ERC20", e.id = _, e.network = T, e.networkName = e.getNetworkName(T), e.transactionCategory = S, G = Object(Me["hexToNumber"])(k) / mt, e.amountTo = L ? L.value : F, e.amountValue = j ? parseFloat(j.value) / Math.pow(10, parseFloat(H)) : "", !E || !I.erc20) {
                    $.next = 56;
                    break
                  }
                  return K = F, Y = "contract_addresses=".concat(K, "&vs_currencies=eth"), q = {}, $.prev = 42, $.next = 45, regeneratorRuntime.awrap(Object(tt["get"])("https://api.coingecko.com/api/v3/simple/token_price/ethereum?".concat(Y)));
                case 45:
                  q = $.sent, $.next = 51;
                  break;
                case 48:
                  $.prev = 48, $.t0 = $["catch"](42), nt.info($.t0);
                case 51:
                  z = q[F.toLowerCase()] && q[F.toLowerCase()].eth ? q[F.toLowerCase()].eth : 0, e.tokenPrice = z, e.amountTokenValueConverted = z * parseFloat(e.amountValue) * e.$store.state.currencyData[e.selectedCurrency.toLowerCase()], $.next = 70;
                  break;
                case 56:
                  if (!E || !I.erc721) {
                    $.next = 70;
                    break
                  }
                  return nt.info(E, I), W = {}, $.prev = 59, Q = "https://api.opensea.io/api/v1/asset/".concat(F, "/").concat(e.amountValue), $.next = 63, regeneratorRuntime.awrap(Object(tt["get"])("".concat(O["default"].api, "/opensea?url=").concat(Q), {
                    headers: {
                      Authorization: "Bearer ".concat(e.$store.state.jwtToken)
                    }
                  }));
                case 63:
                  W = $.sent, e.assetDetails = {
                    name: W.data.name || "",
                    logo: W.data.image_thumbnail_url || ""
                  }, $.next = 70;
                  break;
                case 67:
                  $.prev = 67, $.t1 = $["catch"](59), nt.info($.t1);
                case 70:
                  e.currencyRateDate = e.getDate(), e.receiver = b, e.value = v, e.dollarValue = Object(Z["significantDigits"])(parseFloat(v) * e.$store.state.currencyData[e.selectedCurrency.toLowerCase()]), e.gasPrice = G, e.gasKnob = Object(Z["calculateGasKnob"])(G), e.balance = c, e.balanceUsd = Object(Z["significantDigits"])(parseFloat(c) * e.$store.state.currencyData[e.selectedCurrency.toLowerCase()]), e.gasEstimate = Object(Me["hexToNumber"])(w), e.txData = x, e.txDataParams = "" !== R ? JSON.stringify(R, null, 2) : "", e.sender = y, e.gasCost = G * e.gasEstimate * Math.pow(10, -9), e.txFees = e.gasCost * e.$store.state.currencyData[e.selectedCurrency.toLowerCase()], J = parseFloat(v) + e.gasCost, e.totalEthCost = J, X = Math.max(Object(Z["significantDigits"])(e.gasCost).toString().length, Object(Z["significantDigits"])(J).toString().length), e.totalEthCostDisplay = Object(Z["significantDigits"])(J, !1, X - 2), e.totalUsdCost = Object(Z["significantDigits"])(J * e.$store.state.currencyData[e.selectedCurrency.toLowerCase()] || 0), P && (e.errorMsg = P), parseFloat(e.balance) < J && !e.canShowError && (e.errorMsg = "Insufficient Funds", e.canApprove = !1, e.topUpErrorShow = !0);
                case 91:
                  e.type = n, t.close();
                case 93:
                case "end":
                  return $.stop()
              }
            }), null, null, [
              [42, 48],
              [59, 67]
            ])
          }, t.postMessage({
            data: "popup-loaded"
          })
        }
      },
      xt = bt,
      yt = (a("c6eb"), a("cd55")),
      wt = a("49e2"),
      kt = a("c865"),
      Ct = a("0393"),
      At = Object(l["a"])(xt, Confirmvue_type_template_id_25af4da3_scoped_true_render, _e, !1, null, "25af4da3", null),
      Tt = At.exports;
    u()(At, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardActions: ae["a"],
      VCardText: ae["b"],
      VContainer: M["a"],
      VDialog: Be["a"],
      VDivider: Ve["a"],
      VExpansionPanel: yt["a"],
      VExpansionPanelContent: wt["a"],
      VExpansionPanelHeader: kt["a"],
      VExpansionPanels: Ct["a"],
      VFlex: P["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VSpacer: Ue["a"]
    });
    var Walletvue_type_template_id_3e0880ff_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [a("navbar"), e.$vuetify.theme.dark ? e._e() : a("hr", {
          staticClass: "navbar-line"
        }), a("v-container", [a("router-view")], 1)], 1)
      },
      _t = [],
      Navbarvue_type_template_id_3ed19977_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("nav", {
          staticClass: "header-container pa-0"
        }, [r("v-app-bar", {
          staticClass: "container",
          class: e.$vuetify.breakpoint.xsOnly ? "pa-0" : "px-2 py-0"
        }, [r("router-link", {
          staticClass: "hidden-xs-only",
          attrs: {
            to: {
              name: "walletHome"
            }
          }
        }, [r("img", {
          staticClass: "home-link",
          attrs: {
            width: "135",
            height: "30",
            src: a("3256")("./torus-logo-" + (e.$vuetify.theme.dark ? "white" : "blue") + ".svg")
          }
        })]), r("div", {
          staticClass: "beta-text caption pr-4 hidden-xs-only"
        }, [e._v("Beta")]), r("v-toolbar-title", {
          staticClass: "mt-1 hidden-sm-and-up"
        }, [r("router-link", {
          attrs: {
            id: "logo-home-lnk",
            to: {
              name: "walletHome"
            }
          }
        }, [r("img", {
          attrs: {
            src: a("af40"),
            width: "35",
            height: "30"
          }
        })]), r("div", {
          staticClass: "primary--text subtitle-2 beta-text-mobile"
        }, [e._v("Beta")])], 1), r("v-spacer", {
          staticClass: "hidden-sm-and-up"
        }), r("v-tabs", {
          staticClass: "hidden-xs-only",
          attrs: {
            centered: ""
          }
        }, e._l(e.headerItems, (function (t) {
          return r("v-tab", {
            key: t.name,
            attrs: {
              id: t.name + "-link",
              to: t.route
            }
          }, [e._v(" " + e._s(t.display) + " ")])
        })), 1), r("v-btn", {
          staticClass: "hidden-sm-and-up",
          attrs: {
            id: "menu-dropdown-mobile-btn",
            icon: ""
          },
          on: {
            click: function (t) {
              e.drawer = !e.drawer
            }
          }
        }, [r("img", {
          attrs: {
            src: a("3ecf")
          }
        })]), r("v-menu", {
          attrs: {
            "offset-y": "",
            bottom: "",
            left: "",
            "z-index": "20",
            "close-on-content-click": !1
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("v-btn", e._g({
                staticClass: "hidden-xs-only",
                attrs: {
                  id: "menu-dropdown-btn",
                  small: "",
                  text: ""
                }
              }, a), [r("span", {
                staticClass: "text-capitalize subtitle-2"
              }, [e._v(e._s(e.userName))]), r("v-icon", {
                staticClass: "ml-2 mt-0",
                attrs: {
                  small: ""
                }
              }, [e._v("$vuetify.icons.select")])], 1)]
            }
          }])
        }, [r("account-menu")], 1)], 1), r("v-navigation-drawer", {
          attrs: {
            "disable-resize-watcher": "",
            app: "",
            right: "",
            width: e.$vuetify.breakpoint.xsOnly ? "80%" : ""
          },
          model: {
            value: e.drawer,
            callback: function (t) {
              e.drawer = t
            },
            expression: "drawer"
          }
        }, [r("account-menu", {
          attrs: {
            headerItems: e.headerItems
          }
        })], 1)], 1)
      },
      St = [],
      AccountMenuvue_type_template_id_50bc555c_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-card", {
          staticClass: "account-menu",
          attrs: {
            width: "400"
          }
        }, [a("v-list", [a("v-list-item", [a("v-list-item-avatar", {
          staticClass: "mr-2 mt-4"
        }, [a("img", {
          staticClass: "align-start",
          attrs: {
            src: e.profileImage
          }
        })]), a("v-list-item-content", [a("v-list-item-title", [a("div", {
          staticClass: "font-weight-bold headline"
        }, [a("span", {
          attrs: {
            id: "account-name"
          }
        }, [e._v(e._s(e.userName))]), e._v(" Account ")])]), a("v-list-item-subtitle", [a("div", {
          staticClass: "caption text_2--text"
        }, [a("span", [e._v(e._s(e.userEmail))]), a("v-btn", {
          staticClass: "primary--text float-right mr-5",
          attrs: {
            id: "show-address-btn",
            icon: "",
            small: ""
          },
          on: {
            click: function (t) {
              e.isShowSelectedAddress = !e.isShowSelectedAddress
            }
          }
        }, [a("v-icon", {
          attrs: {
            small: ""
          },
          domProps: {
            textContent: e._s("$vuetify.icons.key")
          }
        })], 1)], 1), e.isShowSelectedAddress ? a("div", {
          staticClass: "caption public-address-container"
        }, [a("show-tool-tip", {
          attrs: {
            address: e.selectedAddress
          }
        }, [e._v(e._s(e.selectedAddress))])], 1) : e._e()])], 1)], 1), a("v-list-item", [a("v-list-item-content", [a("div", {
          staticClass: "subtitle-2 mb-0"
        }, [a("v-icon", {
          staticClass: "mr-2 text_2--text",
          domProps: {
            textContent: e._s("$vuetify.icons.balance")
          }
        }), a("span", {
          staticClass: "text_1--text"
        }, [e._v(e._s(e.totalPortfolioEthValue) + " ETH / " + e._s(e.totalPortfolioValue + " " + e.selectedCurrency))])], 1)])], 1)], 1), a("v-divider"), e.wallets.length > 1 ? a("v-list", e._l(e.filteredWallets, (function (t) {
          return a("v-list-item", {
            key: t.id,
            on: {
              click: function (a) {
                return e.changeAccount(t.address)
              }
            }
          }, [a("v-list-item-content", {
            staticClass: "font-weight-bold"
          }, [a("v-list-item-title", [a("div", {
            staticClass: "font-weight-bold headline text-capitalize text--lighten-4"
          }, [e._v("Account #" + e._s(t.id + 1))])]), a("v-list-item-subtitle", [e._v(e._s(t.address))])], 1)], 1)
        })), 1) : e._e(), e.wallets.length > 1 ? a("v-divider") : e._e(), a("v-list", [a("v-list-item", {
          attrs: {
            id: "import-account-btn"
          },
          on: {
            click: function (t) {
              e.accountImportDialog = !0
            }
          }
        }, [a("v-list-item-action", {
          staticClass: "mr-2"
        }, [a("v-icon", {
          staticClass: "text_2--text",
          domProps: {
            textContent: e._s("$vuetify.icons.import")
          }
        })], 1), a("v-list-item-content", {
          staticClass: "text_1--text font-weight-bold"
        }, [e._v("Import Account")])], 1), a("v-dialog", {
          staticClass: "import-dialog",
          attrs: {
            width: "600"
          },
          model: {
            value: e.accountImportDialog,
            callback: function (t) {
              e.accountImportDialog = t
            },
            expression: "accountImportDialog"
          }
        }, [a("account-import", {
          on: {
            onClose: function (t) {
              e.accountImportDialog = !1
            }
          }
        })], 1)], 1), a("v-divider"), a("v-list", [e._l(e.filteredMenu, (function (t) {
          return a("v-list-item", {
            key: t.name,
            attrs: {
              id: t.name + "-link-mobile",
              link: "",
              router: "",
              to: t.route
            }
          }, [a("v-list-item-action", {
            staticClass: "mr-2"
          }, [a("v-icon", {
            staticClass: "text_2--text",
            attrs: {
              size: "activities" === t.icon ? 12 : 16
            },
            domProps: {
              textContent: e._s("$vuetify.icons." + t.icon)
            }
          })], 1), a("v-list-item-content", [a("v-list-item-title", {
            staticClass: "font-weight-bold text_1--text"
          }, [e._v(e._s(t.display))])], 1)], 1)
        })), a("v-list-item", {
          attrs: {
            href: "https://docs.tor.us/#users",
            target: "_blank"
          }
        }, [a("v-list-item-action", {
          staticClass: "mr-2"
        }, [a("v-icon", {
          staticClass: "text_2--text",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.info")
          }
        })], 1), a("v-list-item-content", {
          staticClass: "text_1--text font-weight-bold"
        }, [e._v("Info and Support")])], 1)], 2), a("v-card-actions", [a("v-btn", {
          staticClass: "text_1--text font-weight-bold mb-6 ml-2",
          attrs: {
            text: ""
          },
          on: {
            click: e.logout
          }
        }, [e._v("Log Out")]), a("v-spacer")], 1)], 1)
      },
      Ot = [],
      Et = (a("fb6a"), a("5319"), function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-card", {
          staticClass: "account-import"
        }, [a("v-container", [a("v-layout", {
          attrs: {
            wrap: "",
            "my-4": ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("div", {
          staticClass: "font-weight-bold headline"
        }, [e._v("Import Account")])]), a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "mt-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Select Import type:")]), a("v-select", {
          attrs: {
            outlined: "",
            "append-icon": "$vuetify.icons.select",
            items: e.options,
            "item-text": "name",
            "item-value": "value"
          },
          on: {
            change: function (t) {
              e.canShowError = !1
            }
          },
          model: {
            value: e.selectedType,
            callback: function (t) {
              e.selectedType = t
            },
            expression: "selectedType"
          }
        })], 1)], 1), "private" === e.selectedType ? [a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-form", {
          ref: "privateKeyForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (e) {
              e.preventDefault()
            }
          },
          model: {
            value: e.privateKeyFormValid,
            callback: function (t) {
              e.privateKeyFormValid = t
            },
            expression: "privateKeyFormValid"
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Input Private Key:")]), a("v-text-field", {
          attrs: {
            outlined: "",
            type: e.showPrivateKey ? "text" : "password",
            rules: [e.rules.required],
            "append-icon": e.showPrivateKey ? "$vuetify.icons.visibility_off" : "$vuetify.icons.visibility_on",
            name: "private-key",
            label: "Private Key",
            "single-line": ""
          },
          on: {
            input: function (t) {
              e.canShowError = !1
            },
            "click:append": e.togglePrivShow
          },
          model: {
            value: e.privateKey,
            callback: function (t) {
              e.privateKey = t
            },
            expression: "privateKey"
          }
        })], 1), a("v-flex", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: e.canShowError,
            expression: "canShowError"
          }],
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "red--text"
        }, [e._v(e._s(e.error))])]), a("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("v-spacer"), a("v-btn", {
          attrs: {
            text: ""
          },
          on: {
            click: e.onClose
          }
        }, [e._v(" Back ")]), a("v-btn", {
          attrs: {
            color: "primary",
            depressed: "",
            loading: e.isLoadingPrivate,
            disabled: !e.privateKeyFormValid || e.isLoadingPrivate
          },
          on: {
            click: function (t) {
              return t.preventDefault(), e.importViaPrivateKey(t)
            }
          }
        }, [e._v(" Import ")])], 1)], 1)], 1)], 1)] : e._e(), "keystore" === e.selectedType ? [a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-form", {
          ref: "jsonFileForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (e) {
              e.preventDefault()
            }
          },
          model: {
            value: e.jsonFileFormValid,
            callback: function (t) {
              e.jsonFileFormValid = t
            },
            expression: "jsonFileFormValid"
          }
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("v-layout", {
          attrs: {
            "align-center": "",
            "justify-space-between": ""
          }
        }, [a("v-flex", {
          attrs: {
            grow: ""
          }
        }, [e._v(" Please upload your JSON File "), a("HelpTooltip", {
          attrs: {
            title: "JSON File",
            description: "This is a type of file format that your stores information on your Private Key."
          }
        })], 1), a("v-flex", {
          attrs: {
            shrink: ""
          }
        }, [a("v-btn", {
          staticClass: "upload-button",
          attrs: {
            outlined: "",
            color: "primary"
          },
          on: {
            click: function (t) {
              return t.preventDefault(), e.$refs.keystoreUpload.click()
            }
          }
        }, [a("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.question")]), e._v(" Upload ")], 1), a("input", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: !1,
            expression: "false"
          }],
          ref: "keystoreUpload",
          attrs: {
            multiple: "false",
            type: "file"
          },
          on: {
            change: e.processFile
          }
        })], 1)], 1), a("div", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: "" !== e.selectedFileName,
            expression: "selectedFileName !== ''"
          }],
          staticClass: "text-right"
        }, [e._v("Selected File: " + e._s(e.selectedFileName))])], 1), a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Enter your password:")]), a("v-text-field", {
          attrs: {
            outlined: "",
            name: "password",
            rules: [e.rules.required],
            "append-icon": e.showJsonPassword ? "$vuetify.icons.visibility_off" : "$vuetify.icons.visibility_on",
            type: e.showJsonPassword ? "text" : "password",
            placeholder: "Password"
          },
          on: {
            "click:append": e.toggleJsonPasswordShow
          },
          model: {
            value: e.jsonPassword,
            callback: function (t) {
              e.jsonPassword = t
            },
            expression: "jsonPassword"
          }
        })], 1), a("v-flex", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: e.canShowError,
            expression: "canShowError"
          }],
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("span", {
          staticClass: "red--text"
        }, [e._v(e._s(e.error))])]), a("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("v-spacer"), a("v-btn", {
          attrs: {
            text: ""
          },
          on: {
            click: e.onClose
          }
        }, [e._v(" Back ")]), a("v-btn", {
          attrs: {
            color: "primary",
            depressed: "",
            loading: e.isLoadingKeystore,
            disabled: !e.jsonFileFormValid || e.isLoadingKeystore
          },
          on: {
            click: function (t) {
              return t.preventDefault(), e.importViaKeyStoreFile(t)
            }
          }
        }, [e._v(" Import ")])], 1)], 1)], 1)], 1)] : e._e()], 2)], 1)], 1)
      }),
      It = [],
      Mt = a("ebbe"),
      Pt = Mt["a"],
      Rt = (a("3877"), a("b974")),
      Lt = Object(l["a"])(Pt, Et, It, !1, null, "e4baa33c", null),
      jt = Lt.exports;
    u()(Lt, {
      VBtn: ee["a"],
      VCard: te["a"],
      VContainer: M["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VSelect: Rt["a"],
      VSpacer: Ue["a"],
      VTextField: He["a"]
    });
    var Dt = {
        props: ["headerItems"],
        components: {
          ShowToolTip: Pe["a"],
          AccountImport: jt
        },
        data: function data() {
          return {
            accountImportDialog: !1,
            isShowSelectedAddress: !1
          }
        },
        computed: {
          userEmail: function userEmail() {
            var e = "";
            switch (this.userInfo.verifier) {
              case we["FACEBOOK"]:
              case we["REDDIT"]:
              case we["TWITCH"]:
              case we["DISCORD"]:
                e = this.userInfo.verifier.charAt(0).toUpperCase() + this.userInfo.verifier.slice(1) + ": ";
                break;
              case we["GOOGLE"]:
                e = "Gmail: "
            }
            return e + ("" !== this.userInfo.email ? this.userInfo.email : this.userInfo.verifierId)
          },
          userName: function userName() {
            var userName = this.userInfo.name.charAt(0).toUpperCase() + this.userInfo.name.slice(1);
            return "s" === userName[userName.length - 1] ? "".concat(userName, "'") : "".concat(userName, "'s")
          },
          profileImage: function profileImage() {
            return this.userInfo.profileImage
          },
          userInfo: function userInfo() {
            return this.$store.state.userInfo
          },
          selectedAddress: function selectedAddress() {
            return this.$store.state.selectedAddress
          },
          slicedSelectedAddress: function slicedSelectedAddress() {
            return Object(Z["addressSlicer"])(this.$store.state.selectedAddress)
          },
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          wallets: function wallets() {
            return Object.keys(this.$store.state.wallet).map((function (e, t) {
              return {
                id: t,
                address: e
              }
            }))
          },
          filteredWallets: function filteredWallets() {
            var e = this;
            return this.wallets.filter((function (t) {
              return t.address !== e.selectedAddress
            }))
          },
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          },
          totalPortfolioValue: function totalPortfolioValue() {
            return this.$store.getters.tokenBalances.totalPortfolioValue || "0"
          },
          totalPortfolioEthValue: function totalPortfolioEthValue() {
            return Object(Z["significantDigits"])(parseFloat(this.totalPortfolioValue.toString().includes(",") ? this.totalPortfolioValue.replace(",", "") : this.totalPortfolioValue) / this.getCurrencyMultiplier)
          },
          filteredMenu: function filteredMenu() {
            return this.headerItems ? this.headerItems.filter((function (e) {
              return "home" !== e.name
            })) : []
          }
        },
        methods: {
          logout: function logout() {
            var e, t;
            return regeneratorRuntime.async((function logout$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  if (e = new URLSearchParams(window.location.search).get("instanceId"), !e || "" === e) {
                    a.next = 6;
                    break
                  }
                  return t = new N["a"]("torus_logout_channel_".concat(e), Z["broadcastChannelOptions"]), a.next = 5, regeneratorRuntime.awrap(t.postMessage({
                    data: {
                      type: "logout"
                    }
                  }));
                case 5:
                  t.close();
                case 6:
                  this.$store.dispatch("logOut"), this.$router.push({
                    path: "/logout"
                  }).catch((function (e) {}));
                case 8:
                case "end":
                  return a.stop()
              }
            }), null, this)
          },
          changeAccount: function changeAccount(e) {
            var t, a;
            return regeneratorRuntime.async((function changeAccount$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  if (this.$store.dispatch("updateSelectedAddress", {
                      selectedAddress: e
                    }), t = new URLSearchParams(window.location.search).get("instanceId"), !t || "" === t) {
                    r.next = 7;
                    break
                  }
                  return a = new N["a"]("selected_address_channel_".concat(t), Z["broadcastChannelOptions"]), r.next = 6, regeneratorRuntime.awrap(a.postMessage({
                    data: {
                      name: "selected_address",
                      payload: e
                    }
                  }));
                case 6:
                  a.close();
                case 7:
                case "end":
                  return r.stop()
              }
            }), null, this)
          }
        }
      },
      Nt = Dt,
      Bt = a("1800"),
      Vt = a("8270"),
      Ft = Object(l["a"])(Nt, AccountMenuvue_type_template_id_50bc555c_render, Ot, !1, null, null, null),
      Ut = Ft.exports;
    u()(Ft, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardActions: ae["a"],
      VDialog: Be["a"],
      VDivider: Ve["a"],
      VIcon: W["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemAction: Bt["a"],
      VListItemAvatar: Vt["a"],
      VListItemContent: se["a"],
      VListItemSubtitle: se["b"],
      VListItemTitle: se["c"],
      VSpacer: Ue["a"]
    });
    var Ht = {
        components: {
          AccountMenu: Ut
        },
        data: function data() {
          return {
            drawer: !1,
            selectedItem: "home",
            headerItems: [{
              name: "home",
              display: "Home",
              route: "/wallet/home",
              icon: "settings"
            }, {
              name: "transfer",
              display: "Transfer",
              route: "/wallet/transfer",
              icon: "transaction"
            }, {
              name: "top-up",
              display: "Top up",
              route: "/wallet/topup",
              icon: "topup"
            }, {
              name: "activity",
              display: "Activity",
              route: "/wallet/history",
              icon: "activities"
            }, {
              name: "settings",
              display: "Settings",
              route: "/wallet/settings",
              icon: "settings"
            }]
          }
        },
        computed: {
          userName: function userName() {
            return this.$store.state.userInfo.name
          }
        }
      },
      Gt = Ht,
      Kt = (a("9fc7"), a("40dc")),
      Yt = a("e449"),
      qt = a("f774"),
      zt = a("71a3"),
      Wt = a("fe57"),
      Qt = a("2a7f"),
      Jt = Object(l["a"])(Gt, Navbarvue_type_template_id_3ed19977_scoped_true_render, St, !1, null, "3ed19977", null),
      Zt = Jt.exports;
    u()(Jt, {
      VAppBar: Kt["a"],
      VBtn: ee["a"],
      VIcon: W["a"],
      VMenu: Yt["a"],
      VNavigationDrawer: qt["a"],
      VSpacer: Ue["a"],
      VTab: zt["a"],
      VTabs: Wt["a"],
      VToolbarTitle: Qt["a"]
    });
    var Xt = {
        components: {
          Navbar: Zt
        }
      },
      $t = Xt,
      ea = (a("d5d8"), Object(l["a"])($t, Walletvue_type_template_id_3e0880ff_render, _t, !1, null, null, null)),
      ta = ea.exports;
    u()(ea, {
      VContainer: M["a"]
    });
    var WalletHomevue_type_template_id_6491ef64_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("router-view")
      },
      aa = [],
      ra = {},
      na = Object(l["a"])(ra, WalletHomevue_type_template_id_6491ef64_render, aa, !1, null, null, null),
      sa = na.exports,
      WalletHomeMainvue_type_template_id_7a3aba5a_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("div", {
          staticClass: "wallet-home"
        }, [r("v-layout", {
          class: e.$vuetify.breakpoint.xsOnly ? "mt-2" : "mt-3",
          attrs: {
            wrap: "",
            "align-center": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs6: "",
            "px-4": ""
          }
        }, [r("div", {
          staticClass: "font-weight-bold headline float-left"
        }, [e._v(e._s(e.pageHeader))])]), r("v-flex", {
          staticClass: "text-right hidden-xs-only",
          attrs: {
            xs6: "",
            "px-4": ""
          }
        }, [r("v-btn", {
          staticClass: "transfer-btn px-12 py-1 mr-4 mt-4",
          attrs: {
            outlined: "",
            large: "",
            color: "primary",
            disabled: e.isFreshAccount
          },
          on: {
            click: e.initiateTransfer
          }
        }, [r("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.send")]), e._v(" Transfer ")], 1), r("v-tooltip", {
          staticClass: "hidden-xs-only",
          attrs: {
            top: "",
            value: e.isFreshAccount
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("v-btn", e._g({
                staticClass: "px-12 py-1 mt-4 topup-btn hidden-xs-only",
                attrs: {
                  depressed: "",
                  large: "",
                  color: "primary"
                },
                on: {
                  click: e.topup
                }
              }, a), [r("v-icon", {
                attrs: {
                  left: ""
                }
              }, [e._v("$vuetify.icons.add")]), e._v(" Top up ")], 1)]
            }
          }])
        }, [r("div", {
          staticClass: "outline-tooltip hidden-xs-only"
        }, [r("span", [e._v("Get ETH!")])])])], 1), r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "mb-2",
          attrs: {
            xs12: ""
          }
        }, [r("v-layout", {
          staticClass: "home-cards",
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "mb-4" : "",
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": "",
            "my-4": ""
          }
        }, [r("v-card", {
          staticClass: "card-total card-shadow"
        }, [r("v-card-title", {
          staticClass: "font-weight-bold subtitle-2 pt-6 px-6"
        }, [r("v-layout", [r("v-flex", [r("span", [e._v("TOTAL VALUE")])]), r("v-flex", {
          attrs: {
            "text-right": ""
          }
        }, [r("export-qr-code")], 1)], 1)], 1), r("v-card-text", {
          staticClass: "pb-8 px-6"
        }, [r("h2", {
          staticClass: "display-2 text_2--text font-weight-bold"
        }, [e._v(" " + e._s(e.totalPortfolioValue) + " "), r("span", {
          staticClass: "body-2 font-weight-light",
          attrs: {
            id: "selected-currency"
          }
        }, [e._v(e._s(e.selectedCurrency))])])])], 1)], 1), e.isFreshAccount ? r("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": "",
            "my-4": ""
          }
        }, [r("v-card", {
          staticClass: "card-shadow"
        }, [r("v-card-text", {
          staticClass: "pt-0",
          class: e.$vuetify.breakpoint.lgAndUp ? "pb-2 px-8" : "pb-3 px-6"
        }, [r("v-layout", [r("v-flex", {
          staticClass: "text_1--text pt-4",
          class: e.$vuetify.breakpoint.xsOnly ? "xs12 text-center" : e.$vuetify.breakpoint.lgAndUp ? "xs8" : "xs9"
        }, [r("div", {
          staticClass: "body-1 font-weight-bold"
        }, [e._v("Welcome to Torus.")]), r("v-dialog", {
          attrs: {
            "max-width": "700"
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("div", {
                staticClass: "body-2'"
              }, [r("a", e._g({
                staticClass: "primary--text font-weight-bold",
                attrs: {
                  id: "learn-more-btn"
                }
              }, a), [e._v("Learn more")]), e._v(" about your wallet today. ")])]
            }
          }], null, !1, 1180648511),
          model: {
            value: e.dialogLearnMore,
            callback: function (t) {
              e.dialogLearnMore = t
            },
            expression: "dialogLearnMore"
          }
        }, [r("LearnMore", {
          on: {
            onClose: function (t) {
              e.dialogLearnMore = !1
            }
          }
        })], 1)], 1), r("v-flex", {
          staticClass: "text-right hidden-xs-only",
          attrs: {
            xs4: "",
            "pt-4": ""
          }
        }, [r("img", {
          staticStyle: {
            height: "90px"
          },
          attrs: {
            src: a("37cf")("./" + (e.$vuetify.theme.dark ? "home-illustration" : "learn-more") + ".svg")
          }
        })])], 1)], 1)], 1)], 1) : e._e(), e._l(e.isFreshAccount ? [] : e.events, (function (e, t) {
          return r("v-flex", {
            key: "event-" + t,
            attrs: {
              xs12: "",
              sm6: "",
              "px-4": "",
              "my-4": ""
            }
          }, [r("promotion-card", {
            attrs: {
              title: e.eventName,
              "image-path": e.imageUrl,
              subtitle: e.description,
              "details-link": e.callToActionLink,
              "details-text": e.callToActionText
            }
          })], 1)
        }))], 2)], 1), r("v-flex", {
          staticClass: "hidden-sm-and-up mb-3",
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [r("v-layout", [r("v-flex", {
          staticClass: "pr-1",
          attrs: {
            xs6: ""
          }
        }, [r("v-btn", {
          staticClass: "transfer-btn-mobile px-12 py-1 mr-4 mt-4",
          attrs: {
            outlined: "",
            large: "",
            block: "",
            color: "primary",
            disabled: e.isFreshAccount
          },
          on: {
            click: e.initiateTransfer
          }
        }, [r("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.send")]), e._v(" Transfer ")], 1)], 1), r("v-flex", {
          staticClass: "pl-1",
          attrs: {
            xs6: ""
          }
        }, [r("v-tooltip", {
          staticClass: "hidden-sm-and-up",
          attrs: {
            top: "",
            value: e.isFreshAccount
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("v-btn", e._g({
                staticClass: "px-12 py-1 mt-4 topup-btn-mobile hidden-sm-and-up",
                attrs: {
                  depressed: "",
                  large: "",
                  block: "",
                  color: "primary"
                },
                on: {
                  click: e.topup
                }
              }, a), [r("v-icon", {
                attrs: {
                  left: ""
                }
              }, [e._v("$vuetify.icons.add")]), e._v(" Top up ")], 1)]
            }
          }])
        }, [r("div", {
          staticClass: "outline-tooltip hidden-sm-and-up"
        }, [r("span", [e._v("Get ETH!")])])])], 1)], 1)], 1), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: "",
            "justify-space-between": "",
            "align-center": ""
          }
        }, [e.showSearch ? r("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("v-text-field", {
          staticClass: "caption search-field",
          attrs: {
            outlined: "",
            "hide-details": "",
            placeholder: "Search",
            "append-icon": "$vuetify.icons.search"
          },
          model: {
            value: e.search,
            callback: function (t) {
              e.search = t
            },
            expression: "search"
          }
        })], 1)], 1)], 1) : e._e(), r("v-flex", {
          staticClass: "balance-filter",
          class: e.showSearch ? "pt-2" : "",
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [r("v-layout", [r("v-flex", {
          staticClass: "refresh",
          attrs: {
            xs7: ""
          }
        }, [r("v-icon", {
          attrs: {
            color: "primary",
            small: ""
          },
          on: {
            click: function (t) {
              return e.refreshBalances()
            }
          }
        }, [e._v("$vuetify.icons.refresh")]), r("span", {
          staticClass: "caption text_2--text"
        }, [e._v("Last update " + e._s(e.lastUpdated))])], 1), r("v-flex", {
          staticClass: "text-right currency",
          attrs: {
            xs5: ""
          }
        }, [r("span", {
          staticClass: "caption text_2--text"
        }, [e._v("CURRENCY:")]), r("v-select", {
          staticClass: "pt-0 mt-0 ml-1 caption currency-selector e2e-currency-selector-container",
          attrs: {
            id: "currency-selector",
            height: "25px",
            "hide-details": "",
            items: e.supportedCurrencies,
            value: e.selectedCurrency,
            "append-icon": "$vuetify.icons.select"
          },
          on: {
            change: e.onCurrencyChange
          }
        })], 1)], 1)], 1)], 1)], 1), r("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "mt-5": ""
          }
        }, [r("v-tabs", {
          model: {
            value: e.activeTab,
            callback: function (t) {
              e.activeTab = t
            },
            expression: "activeTab"
          }
        }, [r("v-tab", {
          staticClass: "home-tab-token"
        }, [r("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.token")]), e._v(" Tokens ")], 1), r("v-tab", {
          staticClass: "home-tab-collectibles"
        }, [r("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.collectibles")]), e._v(" Collectibles ")], 1)], 1)], 1)], 1), r("v-tabs-items", {
          staticClass: "token-tab-content",
          model: {
            value: e.activeTab,
            callback: function (t) {
              e.activeTab = t
            },
            expression: "activeTab"
          }
        }, [r("v-tab-item", [r("token-balances-table", {
          attrs: {
            tokenBalances: e.filteredBalancesArray,
            selected: e.selected
          },
          on: {
            "update:select": e.select
          }
        })], 1), r("v-tab-item", [r("collectibles-list")], 1)], 1)], 1)
      },
      oa = [],
      ia = (a("4d63"), a("466d"), a("4d90"), function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-layout", {
          staticClass: "home-cards token-balance-tab-container",
          attrs: {
            wrap: "",
            "align-center": ""
          }
        }, e._l(e.tokenBalances, (function (t, n) {
          return r("v-flex", {
            key: n,
            staticClass: "xs12 sm6 px-4 my-4",
            style: "order: " + (n > 0 ? n + 1 : n)
          }, [r("v-card", {
            attrs: {
              color: "card-shadow pb-6 pt-1"
            }
          }, [r("v-card-text", {
            staticClass: "text_1--text py-6 px-6"
          }, [r("v-layout", [r("v-flex", {
            attrs: {
              xs6: ""
            }
          }, [r("img", {
            staticClass: "inline-small d-inline-flex",
            attrs: {
              src: a("5c2f")("./" + t.logo),
              onerror: "if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
            }
          }), r("span", {
            staticClass: "subtitle-1 ml-2 d-inline-flex"
          }, [e._v(e._s(t.name))])]), r("v-flex", {
            staticClass: "text-right",
            attrs: {
              xs6: ""
            }
          }, [e._v(" " + e._s(t.formattedBalance) + " ")])], 1), r("v-divider", {
            staticClass: "my-1"
          }), r("v-layout", {
            staticClass: "font-weight-regular text_2--text"
          }, [r("v-flex", {
            attrs: {
              xs6: ""
            }
          }, [e._v(" " + e._s(t.currencyRateText) + " ")]), r("v-flex", {
            staticClass: "text-right",
            attrs: {
              xs6: ""
            }
          }, [e._v(" " + e._s(t.currencyBalance) + " ")])], 1)], 1)], 1)], 1)
        })), 1)
      }),
      ca = [],
      la = {
        props: ["tokenBalances", "selected"],
        data: function data() {
          return {
            pagination: {
              sortBy: "name"
            },
            dialog: !1
          }
        },
        computed: {
          showFooter: function showFooter() {
            return this.tokenBalances.length > 5
          }
        },
        methods: {
          changeSort: function changeSort(e) {
            this.pagination.sortBy === e ? this.pagination.descending = !this.pagination.descending : (this.pagination.sortBy = e, this.pagination.descending = !1)
          },
          selectEmit: function selectEmit(e) {
            this.$emit("update:select", e)
          }
        }
      },
      da = la,
      ua = (a("a7a4"), Object(l["a"])(da, ia, ca, !1, null, "33694992", null)),
      pa = ua.exports;
    u()(ua, {
      VCard: te["a"],
      VCardText: ae["b"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var CollectiblesListvue_type_template_id_762f83a4_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          staticClass: "collectibles-tab-container",
          attrs: {
            wrap: "",
            "align-center": ""
          }
        }, e._l(e.collectibles, (function (t, r) {
          return a("v-flex", {
            key: r,
            staticClass: "xs12 sm6 md4 lg3 px-4 my-4"
          }, [a("v-card", {
            staticClass: "card-shadow"
          }, [a("v-list-item", {
            staticClass: "py-4",
            attrs: {
              "router-link": "",
              to: {
                name: "walletHomeCollectible",
                params: {
                  address: t.address
                }
              }
            }
          }, [a("v-list-item-content", {
            staticClass: "subtitle-1 font-weight-bold"
          }, [e._v(e._s(t.name))]), a("v-list-item-avatar", {
            attrs: {
              size: "100"
            }
          }, [a("v-img", {
            attrs: {
              src: t.logo
            }
          })], 1)], 1)], 1)], 1)
        })), 1)
      },
      ga = [],
      fa = {
        computed: {
          collectibles: function collectibles() {
            return this.$store.getters.collectibleBalances
          }
        }
      },
      va = fa,
      ha = (a("d9fb"), a("adda")),
      ma = Object(l["a"])(va, CollectiblesListvue_type_template_id_762f83a4_scoped_true_render, ga, !1, null, "762f83a4", null),
      ba = ma.exports;
    u()(ma, {
      VCard: te["a"],
      VFlex: P["a"],
      VImg: ha["a"],
      VLayout: R["a"],
      VListItem: ne["a"],
      VListItemAvatar: Vt["a"],
      VListItemContent: se["a"]
    });
    var ExportQrCodevue_type_template_id_ca7c7bc0_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-dialog", {
          attrs: {
            width: "450"
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("v-icon", e._g({
                staticClass: "primary--text",
                attrs: {
                  small: ""
                },
                domProps: {
                  textContent: e._s("$vuetify.icons.key")
                }
              }, a))]
            }
          }]),
          model: {
            value: e.qrDialoag,
            callback: function (t) {
              e.qrDialoag = t
            },
            expression: "qrDialoag"
          }
        }, [r("v-card", [r("div", {
          staticClass: "text-right"
        }, [r("v-btn", {
          attrs: {
            icon: "",
            small: ""
          },
          on: {
            click: function (t) {
              e.qrDialoag = !1
            }
          }
        }, [r("v-icon", {
          attrs: {
            size: "8"
          }
        }, [e._v("$vuetify.icons.close")])], 1)], 1), r("v-card-text", {
          staticClass: "text-center qr-container"
        }, [r("div", {
          staticClass: "headline font-weight-bold mb-4"
        }, [e._v("Your QR code")]), r("vue-qr", {
          ref: "address-qr",
          attrs: {
            logoSrc: a("ab61"),
            margin: 10,
            logoScale: .4,
            logoCornerRadius: 145,
            logoBackgroundColor: "white",
            text: e.transferUrl,
            size: 800,
            dotScale: 1,
            correctLevel: 3
          }
        }), r("div", {
          staticClass: "caption text_2--text"
        }, [r("show-tool-tip", {
          attrs: {
            address: e.selectedAddress
          }
        }, [e._v(e._s(e.slicedAddress))])], 1), r("div", {
          staticClass: "mt-8"
        }, [r("v-btn", {
          staticClass: "px-12",
          attrs: {
            depressed: "",
            color: "primary"
          },
          on: {
            click: e.downloadQr
          }
        }, [r("v-icon", {
          attrs: {
            small: ""
          }
        }, [e._v("$vuetify.icons.download")])], 1)], 1)], 1)], 1)], 1)
      },
      xa = [],
      ya = a("658f"),
      wa = a.n(ya),
      ka = O["default"].baseRoute,
      Ca = {
        components: {
          ShowToolTip: Pe["a"],
          VueQr: wa.a
        },
        data: function data() {
          return {
            qrDialoag: !1
          }
        },
        computed: {
          selectedAddress: function selectedAddress() {
            return this.$store.state.selectedAddress
          },
          slicedAddress: function slicedAddress() {
            return "".concat(this.selectedAddress.slice(0, 20), "...").concat(this.selectedAddress.slice(-10))
          },
          transferUrl: function transferUrl() {
            var e = this.$router.resolve({
              name: "walletTransfer",
              query: {
                to: this.selectedAddress
              }
            }).href;
            return 0 === e.indexOf("/") && (e = e.substr(1)), "".concat(ka).concat(e)
          }
        },
        methods: {
          downloadQr: function downloadQr() {
            var e = this.$refs["address-qr"].$el.src,
              t = document.createElement("a");
            t.href = e, t.download = "qrcode.png", document.body.appendChild(t), t.click(), document.body.removeChild(t)
          }
        }
      },
      Aa = Ca,
      Ta = (a("903c"), Object(l["a"])(Aa, ExportQrCodevue_type_template_id_ca7c7bc0_scoped_true_render, xa, !1, null, "ca7c7bc0", null)),
      _a = Ta.exports;
    u()(Ta, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VDialog: Be["a"],
      VIcon: W["a"]
    });
    var PromotionCardvue_type_template_id_759ee94a_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-card", {
          staticClass: "card-shadow"
        }, [a("v-card-text", {
          staticClass: "pt-0 px-6",
          class: e.$vuetify.breakpoint.lgAndUp ? "pb-2" : "pb-3"
        }, [a("v-layout", [a("v-flex", {
          staticClass: "text_1--text pt-6",
          class: e.$vuetify.breakpoint.xsOnly ? "text-center xs12" : e.$vuetify.breakpoint.lgAndUp ? "xs8" : "xs9"
        }, [a("div", {
          staticClass: "body-1 font-weight-bold"
        }, [e._v(e._s(e.title))]), e._t("subtitle", [a("div", {
          class: e.$vuetify.breakpoint.lgAndUp ? "body-2" : "caption"
        }, [e._v(e._s(e.subtitle))]), a("div", [a("v-btn", {
          staticClass: "px-12 py-1 mt-4 white--text",
          attrs: {
            color: "primary",
            depressed: "",
            href: e.detailsLink,
            target: "_blank"
          }
        }, [e._v(" " + e._s(e.detailsText) + " ")])], 1)])], 2), e._t("image", [a("v-flex", {
          staticClass: "text-right hidden-xs-only",
          attrs: {
            xs4: "",
            "pt-4": ""
          }
        }, [a("img", {
          staticStyle: {
            height: "101px"
          },
          attrs: {
            src: e.imagePath
          }
        })])])], 2)], 1)], 1)
      },
      Sa = [],
      Oa = {
        props: ["title", "subtitle", "imagePath", "detailsLink", "detailsText"]
      },
      Ea = Oa,
      Ia = Object(l["a"])(Ea, PromotionCardvue_type_template_id_759ee94a_render, Sa, !1, null, null, null),
      Ma = Ia.exports;
    u()(Ia, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var LearnMorevue_type_template_id_6a318ad9_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-stepper", {
          staticClass: "learn-more",
          model: {
            value: e.e1,
            callback: function (t) {
              e.e1 = t
            },
            expression: "e1"
          }
        }, [r("v-stepper-items", [r("v-stepper-content", {
          attrs: {
            step: "1"
          }
        }, [r("v-img", {
          attrs: {
            src: a("0f7c")
          }
        }, [r("v-layout", [r("v-flex", {
          staticClass: "mt-12 ml-12",
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "display-1 primary--text text--darken-4 font-weight-bold mb-2"
        }, [e._v("Welcome to")]), r("img", {
          attrs: {
            width: "150",
            src: a("1cbd")
          }
        })])], 1)], 1), r("v-btn", {
          staticClass: "primary--text px-12 next-btn",
          attrs: {
            id: "get-started-btn",
            depressed: "",
            large: "",
            color: "white"
          },
          on: {
            click: function (t) {
              e.e1 = 2
            }
          }
        }, [e._v("Next")])], 1), e._l(e.contents, (function (t) {
          return r("v-stepper-content", {
            key: t.title,
            attrs: {
              step: t.step
            }
          }, [r("v-layout", {
            attrs: {
              "align-center": ""
            }
          }, [r("v-flex", {
            staticClass: "mt-12 ml-12",
            attrs: {
              xs8: ""
            }
          }, [r("div", {
            staticClass: "learn-more-header display-1 font-weight-bold"
          }, [e._v(e._s(t.title))]), r("div", {
            staticClass: "caption text_2--text"
          }, [e._v(e._s(t.subtitle))])]), r("v-flex", {
            staticClass: "mt-12 mr-12 text-right",
            attrs: {
              xs4: ""
            }
          }, [r("img", {
            attrs: {
              width: "110",
              src: a("3256")("./torus-logo-" + (e.$vuetify.theme.dark ? "white" : "blue") + ".svg")
            }
          })])], 1), r("v-list", {
            staticClass: "mx-12 mt-4"
          }, e._l(t.list, (function (t) {
            return r("v-list-item", {
              key: t.name
            }, [r("v-list-item-icon", [r("img", {
              attrs: {
                src: a("643f")("./" + t.icon),
                width: "35"
              }
            })]), r("v-list-item-content", [r("v-list-item-title", {
              staticClass: ".subtitle-1 font-weight-bold"
            }, [e._v(e._s(t.name))]), r("div", {
              staticClass: "caption text_2--text"
            }, [e._v(e._s(t.content))])], 1)], 1)
          })), 1), r("v-btn", {
            staticClass: "primary px-12 next-btn",
            attrs: {
              id: "next-step-btn",
              depressed: "",
              large: ""
            },
            on: {
              click: function (a) {
                return e.nextStep(t.step)
              }
            }
          }, [e._v(" " + e._s(t.step > 2 ? "Done" : "Next") + " ")])], 1)
        }))], 2)], 1)
      },
      Pa = [],
      Ra = {
        data: function data() {
          return {
            e1: 1,
            contents: [{
              title: "Getting Started",
              subtitle: "Here are some key terms to guide you along",
              step: 2,
              list: [{
                icon: "t.svg",
                name: "What is Torus?",
                content: "Torus is a key management solution that aims to provide an easy access to services running on Blockchain."
              }, {
                icon: "wallet.svg",
                name: "Know your Wallet Address",
                content: "A wallet address is similar to a bank account number. \n                It's a unique combination of letters and numbers that looks like this: 0x09438E46Ea66647EA65E4b104C125c82076FDcE5"
              }, {
                icon: "money.svg",
                name: "Get Digital Currency and Tokens",
                content: "You can share your wallet address with others to receive digital currency and tokens."
              }]
            }, {
              title: "Privacy and Security",
              subtitle: "Your Privacy are our top priority",
              step: 3,
              list: [{
                icon: "key-large.svg",
                name: "Private Key",
                content: "This is your password to verify account ownership. Only you are able to access it.\n                If you lose this, you potentially lose ownership of your account and ALL your money."
              }, {
                icon: "password.svg",
                name: "Account Recovery",
                content: "Torus uses Google/Facebook 2 Factor-Authentication for account recovery."
              }]
            }]
          }
        },
        methods: {
          nextStep: function nextStep(e) {
            e < 3 ? this.e1++ : (this.$emit("onClose"), this.e1 = 1)
          }
        }
      },
      La = Ra,
      ja = (a("97ed"), a("7e85")),
      Da = a("e516"),
      Na = a("9c54"),
      Ba = Object(l["a"])(La, LearnMorevue_type_template_id_6a318ad9_scoped_true_render, Pa, !1, null, "6a318ad9", null),
      Va = Ba.exports;
    u()(Ba, {
      VBtn: ee["a"],
      VFlex: P["a"],
      VImg: ha["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VListItemTitle: se["c"],
      VStepper: ja["a"],
      VStepperContent: Da["a"],
      VStepperItems: Na["a"]
    });
    var Fa = {
        name: "walletHome",
        components: {
          TokenBalancesTable: pa,
          CollectiblesList: ba,
          ExportQrCode: _a,
          PromotionCard: Ma,
          LearnMore: Va
        },
        data: function data() {
          return {
            pageHeader: we["WALLET_HEADERS_HOME"],
            supportedCurrencies: ["ETH"].concat(Object(Oe["a"])(O["default"].supportedCurrencies)),
            selected: [],
            search: "",
            lastUpdated: "",
            dialogLearnMore: !1,
            activeTab: 0
          }
        },
        computed: {
          totalPortfolioValue: function totalPortfolioValue() {
            return this.$store.getters.tokenBalances.totalPortfolioValue || "0"
          },
          finalBalancesArray: function finalBalancesArray() {
            var e = this.$store.getters.tokenBalances.finalBalancesArray;
            return e || []
          },
          filteredBalancesArray: function filteredBalancesArray() {
            var e = this.search || "",
              t = new RegExp(e, "i");
            return this.finalBalancesArray.filter((function (e) {
              return e.name.match(t)
            }))
          },
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          isRefreshVisible: function isRefreshVisible() {
            return this.$store.state.networkType.host === we["MAINNET"]
          },
          showSearch: function showSearch() {
            return this.finalBalancesArray.length > 5
          },
          isFreshAccount: function isFreshAccount() {
            return this.$store.state.isNewUser
          },
          events: function events() {
            return this.$store.state.billboard
          }
        },
        methods: {
          select: function select(e) {
            var t = this;
            this.selected = [], this.finalBalancesArray.forEach((function (a) {
              a.id === e.id && t.selected.push(a)
            }))
          },
          onCurrencyChange: function onCurrencyChange(e) {
            this.$store.dispatch("setSelectedCurrency", {
              selectedCurrency: e,
              origin: "home"
            })
          },
          refreshBalances: function refreshBalances() {
            this.$store.dispatch("forceFetchTokens"), this.setDateUpdated()
          },
          initiateTransfer: function initiateTransfer() {
            this.$router.push({
              name: "walletTransfer"
            }).catch((function (e) {}))
          },
          topup: function topup() {
            this.$router.push({
              path: "/wallet/topup"
            }).catch((function (e) {}))
          },
          setDateUpdated: function setDateUpdated() {
            var e = new Date,
              t = e.getDate().toString().padStart(2, "0"),
              a = (e.getMonth() + 1).toString().padStart(2, "0"),
              r = "".concat(t, "/").concat(a, "/").concat(e.getFullYear().toString().substring(2, 4)),
              n = e.getHours().toString().padStart(2, "0"),
              s = e.getMinutes().toString().padStart(2, "0"),
              o = "".concat(n, ":").concat(s);
            this.lastUpdated = "".concat(r, ", ").concat(o)
          }
        },
        mounted: function mounted() {
          this.setDateUpdated(), this.activeTab = "#collectibles" === this.$route.hash ? 1 : 0
        }
      },
      Ua = Fa,
      Ha = (a("01ef"), a("c671")),
      Ga = a("aac8"),
      Ka = a("3a2f"),
      Ya = Object(l["a"])(Ua, WalletHomeMainvue_type_template_id_7a3aba5a_scoped_true_render, oa, !1, null, "7a3aba5a", null),
      qa = Ya.exports;
    u()(Ya, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VCardTitle: ae["c"],
      VDialog: Be["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VSelect: Rt["a"],
      VTab: zt["a"],
      VTabItem: Ha["a"],
      VTabs: Wt["a"],
      VTabsItems: Ga["a"],
      VTextField: He["a"],
      VTooltip: Ka["a"]
    });
    var WalletHomeCollectiblevue_type_template_id_13c9c868_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", [a("v-breadcrumbs", {
          staticClass: "px-4 subtitle-1 font-weight-bold",
          attrs: {
            items: e.breadcrumb
          },
          scopedSlots: e._u([{
            key: "divider",
            fn: function () {
              return [a("v-icon", {
                attrs: {
                  small: ""
                }
              }, [e._v("$vuetify.icons.page_next_double")])]
            },
            proxy: !0
          }])
        }), a("v-layout", {
          attrs: {
            wrap: "",
            "align-end": ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [a("v-select", {
          attrs: {
            items: e.collectibles,
            "item-text": "name",
            "item-value": "address",
            outlined: "",
            "hide-details": "",
            "append-icon": "$vuetify.icons.select",
            "return-object": ""
          },
          on: {
            change: e.changeContract
          },
          scopedSlots: e._u([{
            key: "prepend-inner",
            fn: function () {
              return [e.selectedContract ? a("img", {
                staticClass: "mr-1",
                attrs: {
                  src: e.selectedContract.logo,
                  height: "24px"
                }
              }) : e._e()]
            },
            proxy: !0
          }]),
          model: {
            value: e.selectedContract,
            callback: function (t) {
              e.selectedContract = t
            },
            expression: "selectedContract"
          }
        })], 1), a("v-flex", {
          staticClass: "body-2 text_2--text text-capitalize",
          class: e.$vuetify.breakpoint.xsOnly ? "text-right mt-1" : "pb-1",
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [e._v(" " + e._s(e.platform) + " ")])], 1), e.selectedContract ? a("v-layout", {
          attrs: {
            wrap: "",
            "align-top": "",
            "mt-10": ""
          }
        }, e._l(e.selectedContract.assets, (function (t) {
          return a("v-flex", {
            key: t.tokenId,
            attrs: {
              xs12: "",
              sm3: "",
              md2: "",
              "px-4": "",
              "pb-4": ""
            }
          }, [a("v-expand-transition", [e.$vuetify.breakpoint.xsOnly ? e._e() : a("v-card", {
            staticClass: "mx-auto asset",
            attrs: {
              "max-width": "344",
              ripple: !1
            },
            on: {
              click: function (t) {
                return e.toggleDetails(t)
              }
            }
          }, [a("div", {
            staticClass: "text-center"
          }, [a("img", {
            staticStyle: {
              width: "auto",
              height: "140px"
            },
            attrs: {
              src: t.image
            }
          })]), a("v-card-text", {
            staticClass: "asset-text py-1 px-3"
          }, [a("div", {
            staticClass: "body-2",
            attrs: {
              title: t.name || e.selectedContract.name + " #" + t.tokenId
            }
          }, [e._v(" " + e._s(t.name || e.selectedContract.name + " #" + t.tokenId) + " ")]), a("div", {
            staticClass: "text-right asset-details mt-1"
          }, [a("div", {
            staticClass: "font-weight-medium"
          }, [e._v(e._s(t.costEth || " "))]), a("div", {
            staticClass: "font-weight-light text_2--text"
          }, [e._v(e._s(t.costCurrency || " "))])])]), a("v-card-text", {
            staticClass: "asset-more py-1 px-3"
          }, [a("div", {
            staticClass: "font-weight-medium"
          }, [e._v("Description")]), a("div", {
            staticClass: "ml-2 text_2--text"
          }, [e._v(e._s(t.description))]), a("div", {
            staticClass: "font-weight-medium mt-2"
          }, [e._v("ID")]), a("div", {
            staticClass: "ml-2 text_2--text"
          }, [e._v("#" + e._s(t.tokenId))]), a("div", {
            staticClass: "mt-4"
          }, [a("v-btn", {
            attrs: {
              block: "",
              depressed: "",
              color: "primary"
            },
            on: {
              click: function (a) {
                return e.transferAsset(t)
              }
            }
          }, [e._v("Transfer")]), a("v-btn", {
            attrs: {
              block: "",
              text: ""
            },
            on: {
              click: function (t) {
                return t.stopPropagation(), e.toggleDetails(t)
              }
            }
          }, [e._v("Close")])], 1)])], 1)], 1), a("v-expand-transition", [e.$vuetify.breakpoint.xsOnly ? a("v-card", {
            staticClass: "asset asset--mobile",
            on: {
              click: function (t) {
                return e.toggleDetails(t)
              }
            }
          }, [a("v-list-item", [a("v-list-item-content", {
            staticClass: "asset-text"
          }, [a("div", {
            staticClass: "body-2",
            attrs: {
              title: t.name || e.selectedContract.name + " #" + t.tokenId
            }
          }, [e._v(" " + e._s(t.name || e.selectedContract.name + " #" + t.tokenId) + " ")]), a("div", {
            staticClass: "asset-details mt-8 align-self-baseline"
          }, [a("div", {
            staticClass: "font-weight-medium"
          }, [e._v(e._s(t.costEth || " "))]), a("div", {
            staticClass: "font-weight-light text_2--text"
          }, [e._v(e._s(t.costCurrency || " "))])])]), a("v-list-item-avatar", {
            attrs: {
              size: "100",
              tile: ""
            }
          }, [a("v-img", {
            attrs: {
              src: t.image
            }
          })], 1)], 1), a("v-card-text", {
            staticClass: "asset-more py-1 px-3"
          }, [a("div", {
            staticClass: "font-weight-medium"
          }, [e._v("Description")]), a("div", {
            staticClass: "ml-2 text_2--text"
          }, [e._v(e._s(t.description))]), a("div", {
            staticClass: "font-weight-medium mt-2"
          }, [e._v("ID")]), a("div", {
            staticClass: "ml-2 text_2--text"
          }, [e._v("#" + e._s(t.tokenId))])]), a("v-card-actions", [a("v-flex", {
            attrs: {
              xs6: ""
            }
          }, [a("v-btn", {
            staticClass: "more-info-show",
            attrs: {
              block: "",
              small: "",
              text: ""
            },
            on: {
              click: function (t) {
                return t.stopPropagation(), e.toggleDetails(t)
              }
            }
          }, [e._v("More Info")]), a("v-btn", {
            staticClass: "more-info-hide",
            attrs: {
              block: "",
              small: "",
              text: ""
            },
            on: {
              click: function (t) {
                return t.stopPropagation(), e.toggleDetails(t)
              }
            }
          }, [e._v("Less Info")])], 1), a("v-divider", {
            attrs: {
              inset: "",
              vertical: ""
            }
          }), a("v-flex", {
            attrs: {
              xs6: ""
            }
          }, [a("v-btn", {
            attrs: {
              block: "",
              small: "",
              text: "",
              color: "primary"
            },
            on: {
              click: function (a) {
                return e.transferAsset(t)
              }
            }
          }, [e._v("Transfer")])], 1)], 1)], 1) : e._e()], 1)], 1)
        })), 1) : e._e()], 1)
      },
      za = [];

    function WalletHomeCollectiblevue_type_script_lang_js_ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function WalletHomeCollectiblevue_type_script_lang_js_objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? WalletHomeCollectiblevue_type_script_lang_js_ownKeys(a, !0).forEach((function (t) {
          Object(ye["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : WalletHomeCollectiblevue_type_script_lang_js_ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var Wa = {
        data: function data() {
          return {
            breadcrumb: [{
              text: "Home",
              disabled: !1,
              exact: !0,
              to: "/wallet/home"
            }, {
              text: "Collectibles",
              disabled: !1,
              exact: !0,
              to: "/wallet/home#collectibles"
            }, {
              text: "",
              disabled: !0
            }],
            selectedContract: ""
          }
        },
        computed: {
          platform: function platform() {
            return "Ethereum Blockchain"
          },
          collectibles: function collectibles() {
            return this.$store.getters.collectibleBalances
          }
        },
        watch: {
          collectibles: function collectibles(e, t) {
            e !== t && this.updateFieldsBasedOnRoute()
          }
        },
        methods: {
          changeContract: function changeContract() {
            this.selectedContract && (this.breadcrumb[2].text = this.selectedContract.name, this.breadcrumb[2].href = "collectible?address=".concat(this.selectedContract.address))
          },
          toggleDetails: function toggleDetails(e) {
            e.target.closest(".asset").classList.contains("asset--active") ? e.target.closest(".asset").classList.remove("asset--active") : e.target.closest(".asset").classList.add("asset--active")
          },
          transferAsset: function transferAsset(e) {
            this.$router.push({
              name: "walletTransfer",
              query: WalletHomeCollectiblevue_type_script_lang_js_objectSpread({}, this.$route.query, {
                contract: e.address,
                asset: e.tokenId
              })
            }).catch((function (e) {}))
          },
          updateFieldsBasedOnRoute: function updateFieldsBasedOnRoute() {
            var e = this.$route.params.address;
            this.selectedContract = this.collectibles.find((function (t) {
              return t.address.toLowerCase() === e.toLowerCase()
            })) || this.collectibles[0], this.changeContract()
          }
        },
        mounted: function mounted() {
          this.updateFieldsBasedOnRoute()
        }
      },
      Qa = Wa,
      Ja = (a("355e"), a("2bc5")),
      Za = a("0789"),
      Xa = Object(l["a"])(Qa, WalletHomeCollectiblevue_type_template_id_13c9c868_scoped_true_render, za, !1, null, "13c9c868", null),
      $a = Xa.exports;
    u()(Xa, {
      VBreadcrumbs: Ja["a"],
      VBtn: ee["a"],
      VCard: te["a"],
      VCardActions: ae["a"],
      VCardText: ae["b"],
      VDivider: Ve["a"],
      VExpandTransition: Za["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VImg: ha["a"],
      VLayout: R["a"],
      VListItem: ne["a"],
      VListItemAvatar: Vt["a"],
      VListItemContent: se["a"],
      VSelect: Rt["a"]
    });
    var WalletHistoryvue_type_template_id_6527f84c_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "wallet-activity"
        }, [a("v-layout", {
          attrs: {
            "mt-3": "",
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "mb-4": ""
          }
        }, [a("div", {
          staticClass: "text-black font-weight-bold headline float-left"
        }, [e._v(e._s(e.pageHeader))]), a("div", {
          staticClass: "float-right",
          class: e.$vuetify.breakpoint.xsOnly ? "mt-4" : ""
        }, [a("v-select", {
          staticClass: "pt-0 mt-0 ml-2 subtitle-2 nav-selector transaction",
          attrs: {
            id: "transaction-selector",
            height: "25px",
            "hide-details": "",
            items: e.actionTypes,
            "append-icon": "$vuetify.icons.select"
          },
          model: {
            value: e.selectedAction,
            callback: function (t) {
              e.selectedAction = t
            },
            expression: "selectedAction"
          }
        }), a("v-select", {
          staticClass: "pt-0 mt-0 ml-2 subtitle-2 nav-selector period",
          attrs: {
            id: "period-selector",
            height: "25px",
            "hide-details": "",
            items: e.periods,
            "append-icon": "$vuetify.icons.select"
          },
          model: {
            value: e.selectedPeriod,
            callback: function (t) {
              e.selectedPeriod = t
            },
            expression: "selectedPeriod"
          }
        })], 1)]), a("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            "mb-4": ""
          }
        }, [e.$vuetify.breakpoint.xsOnly ? e._e() : a("tx-history-table", {
          attrs: {
            headers: e.headers,
            selectedAction: e.selectedAction,
            selectedPeriod: e.selectedPeriod,
            transactions: e.calculateFinalTransactions(),
            nonTopupTransactionCount: e.getNonTopupTransactionCount()
          }
        }), e.$vuetify.breakpoint.xsOnly ? a("tx-history-table-mobile", {
          attrs: {
            headers: e.headers,
            selectedAction: e.selectedAction,
            selectedPeriod: e.selectedPeriod,
            transactions: e.calculateFinalTransactions(),
            nonTopupTransactionCount: e.getNonTopupTransactionCount()
          }
        }) : e._e()], 1)], 1)], 1)
      },
      er = [],
      tr = (a("c740"), a("4e827"), function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "activity-table",
          attrs: {
            "data-count": e.transactions.length,
            "data-per-page": e.itemsPerPage,
            "data-count-transfer": e.nonTopupTransactionCount
          }
        }, [a("v-data-table", {
          attrs: {
            headers: e.headers,
            items: e.filteredTransactions,
            expanded: e.expanded,
            "item-key": "id",
            "single-expand": "",
            "hide-default-footer": "",
            page: e.page,
            "items-per-page": e.itemsPerPage
          },
          on: {
            "update:expanded": function (t) {
              e.expanded = t
            },
            "click:row": e.rowClicked,
            "update:page": function (t) {
              e.page = t
            },
            "page-count": function (t) {
              e.pageCount = t
            }
          },
          scopedSlots: e._u([{
            key: "item.action",
            fn: function (t) {
              var r = t.item;
              return [a("span", [a("v-icon", [e._v(e._s(r.actionIcon))]), a("span", {
                staticClass: "transaction-action"
              }, [e._v(e._s(r.action))])], 1)]
            }
          }, {
            key: "item.from",
            fn: function (t) {
              var r = t.item;
              return [a("span", {
                staticStyle: {
                  "word-break": "break-all"
                }
              }, [e._v(e._s(r.from))])]
            }
          }, {
            key: "item.to",
            fn: function (t) {
              var r = t.item;
              return [a("span", {
                staticStyle: {
                  "word-break": "break-all"
                }
              }, [e._v(e._s(r.to))])]
            }
          }, {
            key: "item.date",
            fn: function (t) {
              var r = t.item;
              return [a("span", {
                staticClass: "transaction-date"
              }, [e._v(e._s(r.dateFormatted))])]
            }
          }, {
            key: "item.status",
            fn: function (t) {
              var r = t.item;
              return [a("span", {
                staticClass: "text-capitalize",
                class: "text-" + r.status.toLowerCase()
              }, [e._v(e._s(r.statusText))])]
            }
          }, {
            key: "expanded-item",
            fn: function (t) {
              var r = t.headers,
                n = t.item;
              return [a("td", {
                directives: [{
                  name: "show",
                  rawName: "v-show",
                  value: "" !== n.etherscanLink,
                  expression: "item.etherscanLink !== ''"
                }],
                staticClass: "pa-0 ma-0",
                staticStyle: {
                  height: "inherit"
                },
                attrs: {
                  colspan: r.length
                }
              }, [a("v-flex", {
                staticClass: "pa-4",
                class: e.$vuetify.theme.dark ? "background lighten-2" : "",
                attrs: {
                  xs12: ""
                }
              }, [a("v-layout", {
                attrs: {
                  wrap: ""
                }
              }, [a("v-flex", {
                attrs: {
                  xs4: "",
                  sm1: "",
                  "pr-2": ""
                }
              }, [e._v(" Rate "), a("span", {
                staticClass: "float-right"
              }, [e._v(":")])]), a("v-flex", {
                attrs: {
                  xs8: "",
                  sm11: ""
                }
              }, [e._v("1 ETH = " + e._s(n.ethRate) + " " + e._s(n.currencyUsed) + " @ " + e._s(n.timeFormatted))]), a("v-flex", {
                attrs: {
                  xs4: "",
                  sm1: "",
                  "pr-2": ""
                }
              }, [e._v(" Network "), a("span", {
                staticClass: "float-right"
              }, [e._v(":")])]), a("v-flex", {
                attrs: {
                  xs8: "",
                  sm11: ""
                }
              }, [e._v(e._s(e.mapper[n.networkType] && e.mapper[n.networkType].networkName || ""))]), a("v-flex", {
                staticClass: "text-right",
                attrs: {
                  xs12: ""
                }
              }, [a("a", {
                staticClass: "v-btn",
                attrs: {
                  color: "primary",
                  href: n.etherscanLink,
                  target: "_blank"
                }
              }, [e._v("View On Etherscan")])])], 1)], 1)], 1)]
            }
          }, {
            key: "no-data",
            fn: function () {
              return [a("v-flex", {
                staticClass: "text-center",
                attrs: {
                  xs12: ""
                }
              }, [e._v("No Transaction Activity!")])]
            },
            proxy: !0
          }])
        }), e.pageCount > 1 ? a("div", {
          staticClass: "text-center pt-6"
        }, [a("v-pagination", {
          staticClass: "activity-pagination",
          attrs: {
            "prev-icon": "$vuetify.icons.page_prev",
            "next-icon": "$vuetify.icons.page_next",
            length: e.pageCount
          },
          model: {
            value: e.page,
            callback: function (t) {
              e.page = t
            },
            expression: "page"
          }
        })], 1) : e._e()], 1)
      }),
      ar = [],
      rr = a("b00c"),
      nr = rr.SUPPORTED_NETWORK_TYPES,
      sr = rr.ACTIVITY_ACTION_ALL,
      or = rr.ACTIVITY_ACTION_TOPUP,
      ir = rr.ACTIVITY_ACTION_RECEIVE,
      cr = rr.ACTIVITY_ACTION_SEND,
      lr = rr.ACTIVITY_PERIOD_ALL,
      dr = rr.ACTIVITY_PERIOD_MONTH_ONE,
      ur = rr.ACTIVITY_PERIOD_WEEK_ONE,
      pr = {
        props: ["transactions", "selectedAction", "selectedPeriod", "nonTopupTransactionCount"],
        data: function data() {
          return {
            mapper: nr
          }
        },
        computed: {
          filteredTransactions: function filteredTransactions() {
            var e = this,
              t = this.selectedAction === sr ? "" : this.selectedAction,
              a = new RegExp(t, "i");
            return this.transactions.map((function (t) {
              return t.actionIcon = e.getIcon(t.action), t.statusText = e.getStatusText(t.status), t.dateFormatted = e.formatDate(t.date), t.timeFormatted = e.formatTime(t.date), t
            })).filter((function (t) {
              var r = !1;
              if (e.selectedPeriod === lr) r = !0;
              else {
                var n = new Date,
                  s = new Date(t.date);
                e.selectedPeriod === ur ? n.setDate(n.getDate() - 7) : e.selectedPeriod === dr ? n.setMonth(n.getMonth() - 1) : n.setMonth(n.getMonth() - 6), r = n.getTime() <= s.getTime()
              }
              return t.action ? t.action.match(a) && r : r
            }))
          }
        },
        methods: {
          getStatusText: function getStatusText(e) {
            switch (e) {
              case "rejected":
              case "denied":
              case "unapproved":
                return "Unsuccessful";
              case "confirmed":
                return "Successful";
              case "pending":
              case "submitted":
                return "Pending";
              default:
                return ""
            }
          },
          getIcon: function getIcon(e) {
            return e === or ? "$vuetify.icons.coins_topup" : e === cr ? "$vuetify.icons.coins_send" : e === ir ? "$vuetify.icons.coins_receive" : void 0
          },
          formatDate: function formatDate(e) {
            return e.toString().substring(4).substring(0, 20)
          },
          formatTime: function formatTime(e) {
            return e.toTimeString().substring(0, 8)
          }
        }
      },
      gr = {
        mixins: [pr],
        data: function data() {
          return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 8,
            expanded: [],
            pagination: {},
            defaultSort: "date",
            headers: [{
              text: "Transaction",
              value: "action",
              align: "left",
              width: "120px"
            }, {
              text: "From",
              value: "from",
              align: "left",
              class: "address-col"
            }, {
              text: "To",
              value: "to",
              align: "left",
              class: "address-col"
            }, {
              text: "Amount",
              value: "amount",
              align: "right",
              width: "200px"
            }, {
              text: "Date",
              value: "date",
              align: "right",
              width: "80px"
            }, {
              text: "Status",
              value: "status",
              align: "center"
            }]
          }
        },
        computed: {
          showFooter: function showFooter() {
            return this.transactions && this.transactions.length > 5
          }
        },
        methods: {
          changeSort: function changeSort(e) {
            this.pagination.sortBy === e ? this.pagination.descending = !this.pagination.descending : (this.pagination.sortBy = e, this.pagination.descending = !1)
          },
          rowClicked: function rowClicked(e) {
            this.expanded.indexOf(e) >= 0 ? this.expanded = [] : this.expanded = [e]
          }
        }
      },
      fr = gr,
      vr = (a("e9da"), a("8fea")),
      hr = a("891e"),
      mr = Object(l["a"])(fr, tr, ar, !1, null, "701d052c", null),
      br = mr.exports;
    u()(mr, {
      VDataTable: vr["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VPagination: hr["a"]
    });
    var TxHistoryTableMobilevue_type_template_id_1fc03d60_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-container", {
          staticClass: "activity-table-mobile",
          attrs: {
            "data-count-transfer": e.nonTopupTransactionCount
          }
        }, [a("v-expansion-panels", {
          attrs: {
            multiple: ""
          }
        }, e._l(e.filteredTransactions, (function (t) {
          return a("v-expansion-panel", {
            key: "" + t.id
          }, [a("v-expansion-panel-header", {
            staticClass: "px-2"
          }, [a("div", [a("v-layout", [a("v-flex", {
            staticClass: "subtitle-2",
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [a("v-icon", {
            attrs: {
              small: ""
            }
          }, [e._v(e._s(t.actionIcon))]), a("span", {
            staticClass: "transaction-action"
          }, [e._v(e._s(t.action))])], 1), a("v-flex", {
            staticClass: "body-2 text-right text-capitalize",
            class: "text-" + t.status.toLowerCase(),
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [e._v(" " + e._s(t.statusText) + " ")])], 1), a("v-divider"), a("v-layout", [a("v-flex", {
            staticClass: "caption text_2--text",
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [e._v(" Date: ")]), a("v-flex", {
            staticClass: "caption text-right",
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [a("span", {
            staticClass: "transaction-date"
          }, [e._v(e._s(t.dateFormatted))])])], 1), a("v-divider"), a("v-layout", [a("v-flex", {
            staticClass: "caption text_2--text",
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [e._v(" Amount: ")]), a("v-flex", {
            staticClass: "caption text-right",
            attrs: {
              xs6: "",
              "my-2": ""
            }
          }, [e._v(" " + e._s(t.amount) + " ")])], 1), a("v-divider"), a("v-layout", [a("v-flex", {
            staticClass: "caption text_2--text",
            attrs: {
              xs2: "",
              "my-2": ""
            }
          }, [e._v(" To: ")]), a("v-flex", {
            staticClass: "caption text-right",
            attrs: {
              xs10: "",
              "my-2": ""
            }
          }, [e._v(" " + e._s(t.slicedTo) + " ")])], 1)], 1)]), a("v-expansion-panel-content", [a("v-card", {
            directives: [{
              name: "show",
              rawName: "v-show",
              value: "" !== t.etherscanLink,
              expression: "transaction.etherscanLink !== ''"
            }],
            key: t.id + "-details",
            staticClass: "pa-3",
            attrs: {
              color: "background lighten-2"
            }
          }, [a("v-layout", {
            attrs: {
              wrap: ""
            }
          }, [a("v-flex", {
            attrs: {
              xs4: "",
              sm1: "",
              "pr-2": ""
            }
          }, [e._v(" Rate "), a("span", {
            staticClass: "float-right"
          }, [e._v(":")])]), a("v-flex", {
            attrs: {
              xs8: "",
              sm11: ""
            }
          }, [e._v("1 ETH = " + e._s(t.ethRate) + " " + e._s(t.currencyUsed) + " @ " + e._s(t.timeFormatted))]), a("v-flex", {
            attrs: {
              xs4: "",
              sm1: "",
              "pr-2": ""
            }
          }, [e._v(" Network "), a("span", {
            staticClass: "float-right"
          }, [e._v(":")])]), a("v-flex", {
            attrs: {
              xs8: "",
              sm11: ""
            }
          }, [e._v(e._s(e.mapper[t.networkType] && e.mapper[t.networkType].networkName || ""))]), a("v-flex", {
            staticClass: "text-right",
            attrs: {
              xs12: ""
            }
          }, [a("a", {
            staticClass: "v-btn",
            attrs: {
              color: "primary",
              href: t.etherscanLink,
              target: "_blank"
            }
          }, [e._v("View On Etherscan")])])], 1)], 1)], 1)], 1)
        })), 1)], 1)
      },
      xr = [],
      yr = {
        mixins: [pr],
        data: function data() {
          return {
            expand: !1,
            pagination: {},
            defaultSort: "date",
            search: ""
          }
        },
        computed: {
          showFooter: function showFooter() {
            return this.transactions && this.transactions.length > 5
          }
        },
        methods: {
          changeSort: function changeSort(e) {
            this.pagination.sortBy === e ? this.pagination.descending = !this.pagination.descending : (this.pagination.sortBy = e, this.pagination.descending = !1)
          }
        }
      },
      wr = yr,
      kr = (a("c1cf"), Object(l["a"])(wr, TxHistoryTableMobilevue_type_template_id_1fc03d60_scoped_true_render, xr, !1, null, "1fc03d60", null)),
      Cr = kr.exports;
    u()(kr, {
      VCard: te["a"],
      VContainer: M["a"],
      VDivider: Ve["a"],
      VExpansionPanel: yt["a"],
      VExpansionPanelContent: wt["a"],
      VExpansionPanelHeader: kt["a"],
      VExpansionPanels: Ct["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"]
    });
    var Ar = function postQuote(e) {
        try {
          var t = {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          };
          return Object(tt["post"])("".concat(O["default"].simplexHost, "/quote"), e, t)
        } catch (a) {
          n.a.error(a)
        }
      },
      Tr = function postOrder(e) {
        try {
          var t = {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          };
          return Object(tt["post"])("".concat(O["default"].simplexHost, "/order"), e, t)
        } catch (a) {
          n.a.error(a)
        }
      },
      _r = function getPastOrders(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        try {
          var a = {
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              }
            },
            r = new URL("".concat(O["default"].simplexHost, "/pastorders"));
          return Object.keys(t).forEach((function (e) {
            return r.searchParams.append(e, t[e])
          })), Object(tt["get"])(r, e, a)
        } catch (s) {
          n.a.error(s)
        }
      },
      Sr = {
        name: "walletHistory",
        components: {
          TxHistoryTable: br,
          TxHistoryTableMobile: Cr
        },
        data: function data() {
          return {
            pageHeader: we["WALLET_HEADERS_TRANSFER"],
            supportedCurrencies: ["ETH"].concat(Object(Oe["a"])(O["default"].supportedCurrencies)),
            headers: [{
              text: "Date",
              align: "left",
              value: "date"
            }, {
              text: "From",
              value: "slicedFrom",
              align: "center"
            }, {
              text: "To",
              value: "slicedTo",
              align: "center"
            }, {
              text: "Amount",
              value: "totalAmountString",
              align: "center"
            }, {
              text: "Value",
              value: "currencyAmountString",
              align: "center"
            }, {
              text: "Status",
              value: "status",
              align: "center"
            }],
            pastOrders: [],
            actionTypes: [we["ACTIVITY_ACTION_ALL"], we["ACTIVITY_ACTION_SEND"], we["ACTIVITY_ACTION_RECEIVE"], we["ACTIVITY_ACTION_TOPUP"]],
            selectedAction: we["ACTIVITY_ACTION_ALL"],
            periods: [we["ACTIVITY_PERIOD_ALL"], we["ACTIVITY_PERIOD_WEEK_ONE"], we["ACTIVITY_PERIOD_MONTH_ONE"], we["ACTIVITY_PERIOD_MONTH_SIX"]],
            selectedPeriod: we["ACTIVITY_PERIOD_ALL"],
            paymentTx: [],
            pastTx: []
          }
        },
        computed: {
          totalPortfolioValue: function totalPortfolioValue() {
            return this.$store.getters.tokenBalances.totalPortfolioValue || "0"
          },
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          },
          wallets: function wallets() {
            var e = this;
            return Object.keys(this.$store.state.wallet).filter((function (t) {
              return t !== e.selectedAddress
            }))
          },
          pastTransactions: function pastTransactions() {
            return this.$store.state.pastTransactions
          }
        },
        watch: {
          pastTransactions: function pastTransactions() {
            this.calculatePastTransactions()
          }
        },
        methods: {
          onCurrencyChange: function onCurrencyChange(e) {
            this.$store.dispatch("setSelectedCurrency", {
              selectedCurrency: e,
              origin: "history"
            })
          },
          getNonTopupTransactionCount: function getNonTopupTransactionCount() {
            return this.calculateFinalTransactions().filter((function (e) {
              return e.action !== we["ACTIVITY_ACTION_TOPUP"]
            })).length
          },
          calculateFinalTransactions: function calculateFinalTransactions() {
            var e = this.paymentTx,
              t = this.pastTx,
              a = this.calculateTransactions();
            e = [].concat(Object(Oe["a"])(a), Object(Oe["a"])(e), Object(Oe["a"])(t)), e = e.reduce((function (e, t) {
              return -1 === e.findIndex((function (e) {
                return e.etherscanLink === t.etherscanLink
              })) && e.push(t), e
            }), []);
            var r = e.sort((function (e, t) {
              return t.date - e.date
            })) || [];
            return r
          },
          calculatePastTransactions: function calculatePastTransactions() {
            var e, t, a, r, n, s, o, i, c, l, d, u;
            return regeneratorRuntime.async((function calculatePastTransactions$(p) {
              while (1) switch (p.prev = p.next) {
                case 0:
                  e = this.$store.state, t = e.selectedAddress, a = e.pastTransactions, r = e.jwtToken, n = e.networkType, s = [], o = 0;
                case 3:
                  if (!(o < a.length)) {
                    p.next = 20;
                    break
                  }
                  if (i = a[o], i.network === n.host) {
                    p.next = 7;
                    break
                  }
                  return p.abrupt("continue", 17);
                case 7:
                  if (c = i.status, "confirmed" === i.status || "rejected" === i.status || t.toLowerCase() !== i.from.toLowerCase() && t.toLowerCase() !== i.to.toLowerCase()) {
                    p.next = 13;
                    break
                  }
                  return p.next = 11, regeneratorRuntime.awrap(Object(Z["getEthTxStatus"])(i.transaction_hash, et["a"].web3));
                case 11:
                  c = p.sent, t.toLowerCase() === i.from.toLowerCase() && this.patchTx(i, c, r);
                case 13:
                  l = "".concat(Object(Z["significantDigits"])(parseFloat(i.total_amount)), " ETH"), d = "".concat(Object(Z["significantDigits"])(parseFloat(i.currency_amount)), " ").concat(i.selected_currency), u = {
                    id: i.created_at.toString(),
                    date: new Date(i.created_at),
                    from: i.from,
                    slicedFrom: Object(Z["addressSlicer"])(i.from),
                    to: i.to,
                    slicedTo: Object(Z["addressSlicer"])(i.to),
                    action: this.wallets.indexOf(i.to) >= 0 ? we["ACTIVITY_ACTION_RECEIVE"] : we["ACTIVITY_ACTION_SEND"],
                    totalAmount: i.total_amount,
                    totalAmountString: l,
                    currencyAmount: i.currency_amount,
                    currencyAmountString: d,
                    amount: "".concat(l, " / ").concat(d),
                    status: c,
                    etherscanLink: Object(Z["getEtherScanHashLink"])(i.transaction_hash, i.network),
                    networkType: i.network,
                    ethRate: Object(Z["significantDigits"])(parseFloat(i.currency_amount) / parseFloat(i.total_amount)),
                    currencyUsed: i.selected_currency
                  }, s.push(u);
                case 17:
                  o++, p.next = 3;
                  break;
                case 20:
                  this.pastTx = s;
                case 21:
                case "end":
                  return p.stop()
              }
            }), null, this)
          },
          calculateTransactions: function calculateTransactions() {
            var e = this.$store.state || {},
              t = e.networkId,
              a = e.transactions,
              r = e.networkType,
              n = [];
            for (var s in a) {
              var o = a[s];
              if (o.metamaskNetworkId.toString() === t.toString()) {
                var i = {};
                i.id = o.time.toString(), i.action = this.wallets.indexOf(o.txParams.to) >= 0 ? we["ACTIVITY_ACTION_RECEIVE"] : we["ACTIVITY_ACTION_SEND"], i.date = new Date(o.time), i.from = Object(Me["toChecksumAddress"])(o.txParams.from), i.slicedFrom = Object(Z["addressSlicer"])(o.txParams.from), i.to = Object(Me["toChecksumAddress"])(o.txParams.to), i.slicedTo = Object(Z["addressSlicer"])(o.txParams.to), i.totalAmount = Object(Me["fromWei"])(Object(Me["toBN"])(o.txParams.value).add(Object(Me["toBN"])(o.txParams.gas).mul(Object(Me["toBN"])(o.txParams.gasPrice)))), i.totalAmountString = "".concat(Object(Z["significantDigits"])(i.totalAmount), " ETH"), i.currencyAmount = this.getCurrencyMultiplier * i.totalAmount, i.currencyAmountString = "".concat(Object(Z["significantDigits"])(i.currencyAmount), " ").concat(this.selectedCurrency), i.amount = "".concat(i.totalAmountString, " / ").concat(i.currencyAmountString), i.status = o.status, i.etherscanLink = Object(Z["getEtherScanHashLink"])(o.hash, r.host), i.networkType = r.host, i.ethRate = Object(Z["significantDigits"])(parseFloat(i.currencyAmount) / parseFloat(i.totalAmount)), i.currencyUsed = this.selectedCurrency, n.push(i)
              }
            }
            return n
          },
          patchTx: function patchTx(e, t, a) {
            Object(tt["patch"])("".concat(O["default"].api, "/transaction"), {
              id: e.id,
              status: t
            }, {
              headers: {
                Authorization: "Bearer ".concat(a),
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then((function (e) {
              return n.a.info("successfully patched", e)
            })).catch((function (e) {
              return n.a.error("unable to patch tx", e)
            }))
          }
        },
        mounted: function mounted() {
          var e = this,
            t = this.$store.state.selectedAddress;
          _r({}, {
            public_address: t
          }).then((function (a) {
            e.paymentTx = a.result.reduce((function (e, a) {
              if (!("SENT_TO_SIMPLEX" === a.status && new Date - new Date(a.createdAt) > 864e5)) {
                var r = "".concat(Object(Z["significantDigits"])(a.requested_digital_amount.amount), " ").concat(a.requested_digital_amount.currency),
                  n = "".concat(Object(Z["significantDigits"])(a.fiat_total_amount.amount), " ").concat(a.fiat_total_amount.currency);
                e.push({
                  id: a.createdAt,
                  date: new Date(a.createdAt),
                  from: "Simplex",
                  slicedFrom: "Simplex",
                  action: we["ACTIVITY_ACTION_TOPUP"],
                  to: t,
                  slicedTo: Object(Z["addressSlicer"])(t),
                  totalAmount: a.requested_digital_amount.amount,
                  totalAmountString: r,
                  currencyAmount: a.fiat_total_amount.amount,
                  currencyAmountString: n,
                  amount: "".concat(r, " / ").concat(n),
                  status: Object(Z["getStatus"])(a.status),
                  etherscanLink: ""
                })
              }
              return e
            }), [])
          })).catch((function (e) {
            return n.a.error(e)
          })), this.calculatePastTransactions()
        }
      },
      Or = Sr,
      Er = (a("dc0c"), Object(l["a"])(Or, WalletHistoryvue_type_template_id_6527f84c_scoped_true_render, er, !1, null, "6527f84c", null)),
      Ir = Er.exports;
    u()(Er, {
      VFlex: P["a"],
      VLayout: R["a"],
      VSelect: Rt["a"]
    });
    var WalletSettingsvue_type_template_id_45dfa3ea_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          staticClass: "wallet-settings",
          attrs: {
            "mt-1": "",
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm10: "",
            md8: "",
            "px-4": ""
          }
        }, [a("v-expansion-panels", {
          attrs: {
            accordion: "",
            multiple: ""
          }
        }, [a("v-expansion-panel", [a("v-expansion-panel-header", {
          class: e.$vuetify.breakpoint.xsOnly ? "pa-0" : "",
          attrs: {
            id: "privacy-panel-header",
            "expand-icon": "$vuetify.icons.select"
          }
        }, [a("v-icon", {
          staticClass: "d-inline-flex mr-4 text_2--text shrink",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.lock")
          }
        }), a("div", {
          staticClass: "grow text_1--text font-weight-bold",
          class: e.$vuetify.breakpoint.xsOnly ? "subtitle-1" : "title"
        }, [e._v(" Privacy and Security ")])], 1), a("v-expansion-panel-content", [a("privacy-security")], 1)], 1), a("v-expansion-panel", [a("v-expansion-panel-header", {
          class: e.$vuetify.breakpoint.xsOnly ? "pa-0" : "",
          attrs: {
            id: "contact-list-panel-header",
            "expand-icon": "$vuetify.icons.select"
          }
        }, [a("v-icon", {
          staticClass: "d-inline-flex mr-4 text_2--text shrink",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.list")
          }
        }), a("div", {
          staticClass: "grow text_1--text font-weight-bold",
          class: e.$vuetify.breakpoint.xsOnly ? "subtitle-1" : "title"
        }, [e._v(" Address Book ")])], 1), a("v-expansion-panel-content", [a("contact-list")], 1)], 1), a("v-expansion-panel", [a("v-expansion-panel-header", {
          class: e.$vuetify.breakpoint.xsOnly ? "pa-0" : "",
          attrs: {
            id: "network-panel-header",
            "expand-icon": "$vuetify.icons.select"
          }
        }, [a("v-icon", {
          staticClass: "d-inline-flex mr-4 text_2--text shrink",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.globe")
          }
        }), a("div", {
          staticClass: "grow text_1--text font-weight-bold",
          class: e.$vuetify.breakpoint.xsOnly ? "subtitle-1" : "title"
        }, [e._v(" Network ")])], 1), a("v-expansion-panel-content", [a("network")], 1)], 1), a("v-expansion-panel", [a("v-expansion-panel-header", {
          class: e.$vuetify.breakpoint.xsOnly ? "pa-0" : "",
          attrs: {
            id: "display-panel-header",
            "expand-icon": "$vuetify.icons.select"
          }
        }, [a("v-icon", {
          staticClass: "d-inline-flex mr-4 text_2--text shrink",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.server")
          }
        }), a("div", {
          staticClass: "grow text_1--text font-weight-bold",
          class: e.$vuetify.breakpoint.xsOnly ? "subtitle-1" : "title"
        }, [e._v(" Display ")])], 1), a("v-expansion-panel-content", [a("display")], 1)], 1)], 1)], 1)], 1)
      },
      Mr = [],
      PrivacySecurityvue_type_template_id_096a6986_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "privacy-security-container",
          class: e.$vuetify.breakpoint.xsOnly ? "" : "py-0 px-12"
        }, [a("v-list", [a("v-list-item", {
          attrs: {
            id: "private-key-btn"
          },
          on: {
            click: function (t) {
              e.privateKeyDialog = !0
            }
          }
        }, [a("v-list-item-action", {
          staticClass: "mr-4"
        }, [a("v-icon", {
          staticClass: "mr-4 text_2--text",
          attrs: {
            small: e.$vuetify.breakpoint.xsOnly
          },
          domProps: {
            textContent: e._s("$vuetify.icons.key")
          }
        })], 1), a("v-list-item-content", [a("v-list-item-title", {
          staticClass: "text_1--text"
        }, [e._v("Private Key")])], 1)], 1), a("v-list-item", {
          attrs: {
            id: "dapp-permisson-btn"
          },
          on: {
            click: function (t) {
              e.dappPermissionDialog = !0
            }
          }
        }, [a("v-list-item-action", {
          staticClass: "mr-4"
        }, [a("v-icon", {
          staticClass: "mr-4 text_2--text",
          attrs: {
            size: e.$vuetify.breakpoint.xsOnly ? 12 : 16
          },
          domProps: {
            textContent: e._s("$vuetify.icons.list")
          }
        })], 1), a("v-list-item-content", [a("v-list-item-title", {
          staticClass: "text_1--text"
        }, [e._v("DApp Permission")])], 1)], 1)], 1), a("v-dialog", {
          attrs: {
            "max-width": "1000",
            fullscreen: e.$vuetify.breakpoint.xsOnly
          },
          model: {
            value: e.privateKeyDialog,
            callback: function (t) {
              e.privateKeyDialog = t
            },
            expression: "privateKeyDialog"
          }
        }, [a("private-keys", {
          on: {
            onClose: function (t) {
              e.privateKeyDialog = !1
            }
          }
        })], 1), a("v-dialog", {
          attrs: {
            "max-width": "1000",
            fullscreen: e.$vuetify.breakpoint.xsOnly
          },
          model: {
            value: e.dappPermissionDialog,
            callback: function (t) {
              e.dappPermissionDialog = t
            },
            expression: "dappPermissionDialog"
          }
        }, [a("dapp-permissions", {
          on: {
            onClose: function (t) {
              e.dappPermissionDialog = !1
            }
          }
        })], 1)], 1)
      },
      Pr = [],
      PrivateKeysvue_type_template_id_e82d9fde_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-card", {
          staticClass: "private-key-container"
        }, [r("v-card-text", {
          staticClass: "text_1--text py-6"
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "px-4",
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "font-weight-bold headline"
        }, [e._v("Private Key")])]), r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "px-4",
          attrs: {
            xs12: "",
            "mt-4": ""
          }
        }, [r("v-list", [r("v-list-item", {
          class: e.$vuetify.breakpoint.xsOnly ? "px-0" : ""
        }, [r("v-list-item-icon", {
          class: e.$vuetify.breakpoint.xsOnly ? "mr-1" : ""
        }, [r("img", {
          attrs: {
            width: e.$vuetify.breakpoint.xsOnly ? "16" : "",
            src: a("23c2")
          }
        })]), r("v-list-item-content", [r("div", {
          staticClass: "subtitle-1 flex-grow-1 font-weight-bold"
        }, [e._v("Download soft copy (JSON)")]), r("v-expand-transition", [e.isShowGetPassword ? r("v-layout", {
          staticClass: "mt-2 download-form-container",
          attrs: {
            wrap: "",
            "align-center": "",
            "justify-space-between": ""
          }
        }, [r("v-flex", [r("v-form", {
          ref: "downloadForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (t) {
              return t.preventDefault(), e.downloadWallet(t)
            }
          },
          model: {
            value: e.downloadFormValid,
            callback: function (t) {
              e.downloadFormValid = t
            },
            expression: "downloadFormValid"
          }
        }, [r("v-text-field", {
          attrs: {
            id: "json-file-password",
            small: "",
            rules: [e.rules.required],
            type: e.showJsonPassword ? "text" : "password",
            "append-icon": e.showJsonPassword ? "$vuetify.icons.visibility_off" : "$vuetify.icons.visibility_on"
          },
          on: {
            "click:append": function (t) {
              e.showJsonPassword = !e.showJsonPassword
            }
          },
          scopedSlots: e._u([e.$vuetify.breakpoint.xsOnly ? null : {
            key: "append-outer",
            fn: function () {
              return [e.walletJson ? e._e() : r("v-btn", {
                attrs: {
                  id: "json-file-confirm-btn",
                  color: "primary",
                  depressed: "",
                  disabled: !e.downloadFormValid || e.isLoadingDownloadWallet,
                  loading: e.isLoadingDownloadWallet
                },
                on: {
                  click: e.downloadWallet
                }
              }, [e._v(" Confirm ")]), e.walletJson ? r("v-btn", {
                attrs: {
                  id: "json-file-download-btn",
                  depressed: "",
                  color: "primary",
                  href: e.walletJson,
                  download: e.name
                }
              }, [e._v(" Download wallet ")]) : e._e()]
            },
            proxy: !0
          }], null, !0),
          model: {
            value: e.keyStorePassword,
            callback: function (t) {
              e.keyStorePassword = t
            },
            expression: "keyStorePassword"
          }
        })], 1)], 1), e.$vuetify.breakpoint.xsOnly ? r("v-flex", {
          staticClass: "text-right"
        }, [e.walletJson ? e._e() : r("v-btn", {
          attrs: {
            id: "mobile-json-file-confirm-btn",
            color: "primary",
            disabled: !e.downloadFormValid || e.isLoadingDownloadWallet,
            loading: e.isLoadingDownloadWallet
          },
          on: {
            click: e.downloadWallet
          }
        }, [e._v(" Confirm ")]), e.walletJson ? r("v-btn", {
          attrs: {
            id: "mobile-json-file-download-btn",
            color: "primary",
            href: e.walletJson,
            download: e.name
          }
        }, [e._v(" Download wallet ")]) : e._e()], 1) : e._e()], 1) : e._e()], 1)], 1), r("v-list-item-icon", {
          class: e.$vuetify.breakpoint.xsOnly ? "ma-1" : ""
        }, [r("v-btn", {
          attrs: {
            id: "show-download-form-btn",
            icon: "",
            small: ""
          },
          on: {
            click: function (t) {
              e.isShowGetPassword = !0
            }
          }
        }, [r("img", {
          attrs: {
            width: e.$vuetify.breakpoint.xsOnly ? "16" : "",
            src: a("790f")
          }
        })])], 1)], 1), r("v-divider"), r("v-list-item", {
          class: e.$vuetify.breakpoint.xsOnly ? "px-0" : ""
        }, [r("v-list-item-icon", {
          class: e.$vuetify.breakpoint.xsOnly ? "mr-1" : ""
        }, [r("img", {
          attrs: {
            width: e.$vuetify.breakpoint.xsOnly ? "16" : "",
            src: a("bc13")
          }
        })]), r("v-list-item-content", [r("div", {
          staticClass: "subtitle-1 flex-grow-1 font-weight-bold"
        }, [e._v("Show Private Key")]), r("v-expand-transition", [e.isShowPrivateKey ? r("v-layout", {
          staticClass: "mt-2",
          attrs: {
            wrap: "",
            "align-center": "",
            "justify-space-between": ""
          }
        }, [r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "xs12" : ""
        }, [r("div", {
          staticClass: "text_2--text",
          class: e.$vuetify.breakpoint.xsOnly ? "caption" : "",
          staticStyle: {
            "word-break": "break-all"
          }
        }, [e._v(" " + e._s(e.selectedKey) + " ")])]), r("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "xs12 text-center" : ""
        }, [r("show-tool-tip", {
          attrs: {
            address: e.selectedKey
          }
        }, [r("v-btn", {
          staticClass: "primary--text",
          class: e.$vuetify.breakpoint.xsOnly ? "mt-2" : "caption",
          attrs: {
            id: "click-to-copy-btn",
            text: "",
            small: ""
          }
        }, [r("img", {
          staticClass: "mr-1",
          attrs: {
            src: a("eff6"),
            width: e.$vuetify.breakpoint.xsOnly ? "12" : "20"
          }
        }), e._v(" Click to copy ")])], 1)], 1)], 1) : e._e()], 1)], 1), r("v-list-item-icon", {
          class: e.$vuetify.breakpoint.xsOnly ? "ma-1" : ""
        }, [r("v-btn", {
          attrs: {
            id: "show-private-key-btn",
            icon: "",
            small: ""
          },
          on: {
            click: function (t) {
              e.isShowPrivateKey = !e.isShowPrivateKey
            }
          }
        }, [r("img", {
          attrs: {
            width: e.$vuetify.breakpoint.xsOnly ? "20" : "",
            src: a("b22d")("./eye" + (e.isShowPrivateKey ? "-off" : "") + "-primary.svg")
          }
        })])], 1)], 1)], 1)], 1)], 1), r("v-layout", {
          attrs: {
            "mt-4": "",
            "pr-4": ""
          }
        }, [r("v-spacer"), r("v-btn", {
          attrs: {
            id: "close-btn",
            large: "",
            text: ""
          },
          on: {
            click: e.onClose
          }
        }, [e._v("Close")])], 1)], 1)], 1)
      },
      Rr = [],
      Lr = a("cf3f"),
      jr = Lr["a"],
      Dr = Object(l["a"])(jr, PrivateKeysvue_type_template_id_e82d9fde_render, Rr, !1, null, null, null),
      Nr = Dr.exports;
    u()(Dr, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VDivider: Ve["a"],
      VExpandTransition: Za["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VSpacer: Ue["a"],
      VTextField: He["a"]
    });
    var DappPermissionsvue_type_template_id_3889ae7f_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-card", {
          staticClass: "dapp-permisson-container"
        }, [a("v-card-text", {
          staticClass: "text_1--text"
        }, [a("v-container", [a("v-layout", {
          staticClass: "wallet-dapp-permission",
          attrs: {
            "mt-4": "",
            wrap: ""
          }
        }, [a("v-flex", {
          staticClass: "title-container mb-4",
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [a("div", {
          staticClass: "title"
        }, [a("div", {
          staticClass: "d-inline font-weight-bold headline"
        }, [e._v("Dapp Permission")]), a("p", {
          staticClass: "text"
        }, [a("small", [e._v(" As a form of security, all transactions require your signature for validation. You may add and allow certain Dapps to transact under certain circumstances. ")])])]), a("v-btn", {
          attrs: {
            depressed: "",
            color: "primary"
          },
          on: {
            click: e.addPermission
          }
        }, [a("v-icon", {
          attrs: {
            left: ""
          }
        }, [e._v("$vuetify.icons.add")]), e._v(" Add a new List ")], 1)], 1), a("v-flex", {
          staticClass: "px-4",
          attrs: {
            xs12: ""
          }
        }, [e._l(e.permissions, (function (t, r) {
          return [a("v-slide-y-transition", {
            key: r
          }, [t.isEdit ? a("dapp-permission-edit", {
            on: {
              onCancel: function (e) {
                t.isEdit = !1
              }
            }
          }) : e._e()], 1), a("v-slide-y-transition", {
            key: r
          }, [t.isEdit ? e._e() : a("dapp-permission-view", {
            on: {
              onDelete: function (a) {
                return e.onDeletePermission(t)
              },
              onEdit: function (e) {
                t.isEdit = !0
              }
            }
          })], 1)]
        }))], 2)], 1), a("v-layout", {
          attrs: {
            "mt-4": "",
            "pr-4": ""
          }
        }, [a("v-spacer"), a("v-btn", {
          attrs: {
            id: "close-btn",
            large: "",
            text: ""
          },
          on: {
            click: e.onClose
          }
        }, [e._v("Close")])], 1)], 1)], 1)], 1)
      },
      Br = [],
      Vr = (a("a434"), function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-card", {
          staticClass: "px-4 py-1 mb-4"
        }, [r("v-list", {
          attrs: {
            dense: ""
          }
        }, [r("v-list-item", [r("v-list-item-icon", {
          staticClass: "mr-1"
        }, [r("img", {
          attrs: {
            width: "14",
            height: "14",
            src: a("e3e8")
          }
        })]), r("v-list-item-content", {
          staticClass: "subtitle-2 py-0"
        }, [e._v("Etheremon.com")]), r("v-spacer"), r("v-list-item-action", {
          staticClass: "text_2--text caption my-0"
        }, [e._v(" 15 April 2019 @ 13:45:49 ")])], 1), r("v-divider"), r("v-list-item", [r("v-list-item-content", {
          staticClass: "caption py-0"
        }, [e._v("Type:")]), r("v-spacer"), r("v-list-item-action", {
          staticClass: "text_1--text caption my-0"
        }, [e._v(" ERC 20 Transfer ")])], 1), r("v-divider"), r("v-list-item", [r("v-list-item-content", {
          staticClass: "caption py-0"
        }, [e._v("Amount:")]), r("v-spacer"), r("v-list-item-action", {
          staticClass: "text_1--text font-weight-bold caption my-0"
        }, [e._v(" 10.00 USD ")])], 1), r("v-divider"), r("v-list-item", [r("v-list-item-content", {
          staticClass: "caption py-0"
        }, [e._v("Period of Validity:")]), r("v-spacer"), r("v-list-item-action", {
          staticClass: "text_1--text caption my-0"
        }, [e._v(" 1 Month (15 April ~ May 2019) ")])], 1), r("v-card-actions", {
          staticClass: "mt-2"
        }, [r("v-spacer"), r("v-btn", {
          staticClass: "mr-2",
          attrs: {
            color: "error",
            text: ""
          },
          on: {
            click: e.onDelete
          }
        }, [e._v("Delete")]), r("v-btn", {
          attrs: {
            color: "primary",
            outlined: ""
          },
          on: {
            click: e.onEdit
          }
        }, [e._v("Edit")])], 1)], 1)], 1)
      }),
      Fr = [],
      Ur = {
        methods: {
          onEdit: function onEdit() {
            this.$emit("onEdit")
          },
          onDelete: function onDelete() {
            this.$emit("onDelete")
          }
        }
      },
      Hr = Ur,
      Gr = (a("bce6"), Object(l["a"])(Hr, Vr, Fr, !1, null, "5ad3ba69", null)),
      Kr = Gr.exports;
    u()(Gr, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardActions: ae["a"],
      VDivider: Ve["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemAction: Bt["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VSpacer: Ue["a"]
    });
    var DappPermissionEditvue_type_template_id_d7b5849c_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-card", {
          staticClass: "mb-4"
        }, [r("v-container", {
          attrs: {
            fluid: ""
          }
        }, [r("v-layout", [r("v-flex", {
          attrs: {
            xs2: ""
          }
        }, [r("img", {
          attrs: {
            width: "34",
            height: "34",
            src: a("e3e8")
          }
        })]), r("v-flex", {
          attrs: {
            xs9: ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs8: ""
          }
        }, [r("v-text-field", {
          staticClass: "custom-text-input",
          attrs: {
            placeholder: "Enter New Dapp Website Here E.g. www.etheremon.com",
            solo: ""
          },
          model: {
            value: e.dappWebsite,
            callback: function (t) {
              e.dappWebsite = t
            },
            expression: "dappWebsite"
          }
        })], 1)], 1)], 1), r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "section-note text-gray"
        }, [e._v("Now")])])], 1), r("hr", {
          staticClass: "mt-2 mb-6"
        }), r("v-layout", [r("v-flex", {
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "font-weight-bold text-gray"
        }, [e._v("Type:")])]), r("v-flex", {
          attrs: {
            xs9: ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.type.deployment,
            expression: "type.deployment"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.type.deployment) ? e._i(e.type.deployment, null) > -1 : e.type.deployment
          },
          on: {
            change: function (t) {
              var a = e.type.deployment,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.type, "deployment", a.concat([s])) : o > -1 && e.$set(e.type, "deployment", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.type, "deployment", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Contract Deployment")])])])]), r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.type.interaction,
            expression: "type.interaction"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.type.interaction) ? e._i(e.type.interaction, null) > -1 : e.type.interaction
          },
          on: {
            change: function (t) {
              var a = e.type.interaction,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.type, "interaction", a.concat([s])) : o > -1 && e.$set(e.type, "interaction", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.type, "interaction", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Contract Interaction")])])])])]), r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.type.ercTransaction,
            expression: "type.ercTransaction"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.type.ercTransaction) ? e._i(e.type.ercTransaction, null) > -1 : e.type.ercTransaction
          },
          on: {
            change: function (t) {
              var a = e.type.ercTransaction,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.type, "ercTransaction", a.concat([s])) : o > -1 && e.$set(e.type, "ercTransaction", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.type, "ercTransaction", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("ERC 20 Transactions")])])])]), r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.type.changeNetwork,
            expression: "type.changeNetwork"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.type.changeNetwork) ? e._i(e.type.changeNetwork, null) > -1 : e.type.changeNetwork
          },
          on: {
            change: function (t) {
              var a = e.type.changeNetwork,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.type, "changeNetwork", a.concat([s])) : o > -1 && e.$set(e.type, "changeNetwork", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.type, "changeNetwork", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Change of Network")])])])])]), r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.type.sendEth,
            expression: "type.sendEth"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.type.sendEth) ? e._i(e.type.sendEth, null) > -1 : e.type.sendEth
          },
          on: {
            change: function (t) {
              var a = e.type.sendEth,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.type, "sendEth", a.concat([s])) : o > -1 && e.$set(e.type, "sendEth", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.type, "sendEth", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Send ETH")])])])])])], 1)], 1), r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "section-note"
        }, [e._v("Please choose the type(s)")])])], 1), r("hr", {
          staticClass: "mt-2 mb-6"
        }), r("v-layout", [r("v-flex", {
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "font-weight-bold text-gray"
        }, [e._v("Amount:")])]), r("v-flex", {
          attrs: {
            xs9: ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-0"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.amount.maxTenUsd,
            expression: "amount.maxTenUsd"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.amount.maxTenUsd) ? e._i(e.amount.maxTenUsd, null) > -1 : e.amount.maxTenUsd
          },
          on: {
            change: function (t) {
              var a = e.amount.maxTenUsd,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.amount, "maxTenUsd", a.concat([s])) : o > -1 && e.$set(e.amount, "maxTenUsd", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.amount, "maxTenUsd", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Max 10.00 USD")])])])]), r("div", {
          staticClass: "mb-6"
        }, [r("div", {
          staticClass: "other-input"
        }, [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.amount.other,
            expression: "amount.other"
          }],
          attrs: {
            type: "checkbox",
            name: "contractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.amount.other) ? e._i(e.amount.other, null) > -1 : e.amount.other
          },
          on: {
            change: function (t) {
              var a = e.amount.other,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.amount, "other", a.concat([s])) : o > -1 && e.$set(e.amount, "other", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.amount, "other", n)
            }
          }
        }), r("label", {
          staticClass: "mx-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Others:")])]), r("v-text-field", {
          staticClass: "max-transaction-input",
          attrs: {
            disabled: !e.amount.other,
            "single-line": "",
            text: "",
            type: "text",
            name: "max-transaction",
            label: "Enter Max Transaction Limit"
          },
          model: {
            value: e.amount.customMaxTransaction,
            callback: function (t) {
              e.$set(e.amount, "customMaxTransaction", t)
            },
            expression: "amount.customMaxTransaction"
          }
        })], 1)])]), r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.amount.maxHundredThousandUsd,
            expression: "amount.maxHundredThousandUsd"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.amount.maxHundredThousandUsd) ? e._i(e.amount.maxHundredThousandUsd, null) > -1 : e.amount.maxHundredThousandUsd
          },
          on: {
            change: function (t) {
              var a = e.amount.maxHundredThousandUsd,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.amount, "maxHundredThousandUsd", a.concat([s])) : o > -1 && e.$set(e.amount, "maxHundredThousandUsd", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.amount, "maxHundredThousandUsd", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Max 100.00 USD")])])])])])], 1)], 1), r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "font-weight-bold"
        }, [e._v("10.00 USD")])])], 1), r("hr", {
          staticClass: "mt-2 mb-6"
        }), r("v-layout", [r("v-flex", {
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "font-weight-bold section-note text-gray"
        }, [e._v("Period of Validity:")])]), r("v-flex", {
          attrs: {
            xs9: ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.validity.oneHour,
            expression: "validity.oneHour"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.validity.oneHour) ? e._i(e.validity.oneHour, null) > -1 : e.validity.oneHour
          },
          on: {
            change: function (t) {
              var a = e.validity.oneHour,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.validity, "oneHour", a.concat([s])) : o > -1 && e.$set(e.validity, "oneHour", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.validity, "oneHour", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Within 1 Hour")])])])]), r("div", {
          staticClass: "mb-6"
        }, [r("div", {
          staticClass: "other-input"
        }, [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.validity.oneMonth,
            expression: "validity.oneMonth"
          }],
          attrs: {
            type: "checkbox",
            value: "",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.validity.oneMonth) ? e._i(e.validity.oneMonth, "") > -1 : e.validity.oneMonth
          },
          on: {
            change: function (t) {
              var a = e.validity.oneMonth,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = "",
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.validity, "oneMonth", a.concat([s])) : o > -1 && e.$set(e.validity, "oneMonth", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.validity, "oneMonth", n)
            }
          }
        }), r("label", {
          staticClass: "mx-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Within 1 Month")])])])])]), r("v-flex", {
          attrs: {
            xs4: ""
          }
        }, [r("div", {
          staticClass: "mb-6"
        }, [r("div", [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.validity.oneWeek,
            expression: "validity.oneWeek"
          }],
          attrs: {
            type: "checkbox",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.validity.oneWeek) ? e._i(e.validity.oneWeek, null) > -1 : e.validity.oneWeek
          },
          on: {
            change: function (t) {
              var a = e.validity.oneWeek,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = null,
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.validity, "oneWeek", a.concat([s])) : o > -1 && e.$set(e.validity, "oneWeek", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.validity, "oneWeek", n)
            }
          }
        }), r("label", {
          staticClass: "ml-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Within 1 Week")])])])]), r("div", {
          staticClass: "mb-6"
        }, [r("div", {
          staticClass: "other-input"
        }, [r("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.validity.oneYear,
            expression: "validity.oneYear"
          }],
          attrs: {
            type: "checkbox",
            value: "",
            name: "ontractDeployment",
            id: "test-simplex"
          },
          domProps: {
            checked: Array.isArray(e.validity.oneYear) ? e._i(e.validity.oneYear, "") > -1 : e.validity.oneYear
          },
          on: {
            change: function (t) {
              var a = e.validity.oneYear,
                r = t.target,
                n = !!r.checked;
              if (Array.isArray(a)) {
                var s = "",
                  o = e._i(a, s);
                r.checked ? o < 0 && e.$set(e.validity, "oneYear", a.concat([s])) : o > -1 && e.$set(e.validity, "oneYear", a.slice(0, o).concat(a.slice(o + 1)))
              } else e.$set(e.validity, "oneYear", n)
            }
          }
        }), r("label", {
          staticClass: "mx-2",
          attrs: {
            for: "contractDeployment"
          }
        }, [r("small", [e._v("Within 1 Year")])])])])])], 1)], 1), r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs2: ""
          }
        }, [r("small", {
          staticClass: "section-note"
        }, [e._v("Please select a period")])])], 1), r("hr", {
          staticClass: "mt-2 mb-6"
        }), r("v-flex", {
          staticClass: "save-container"
        }, [r("v-btn", {
          staticClass: "px-12 py-1 mt-4 mr-4 btn-cancel text-gray",
          attrs: {
            color: "white"
          },
          on: {
            click: e.onCancel
          }
        }, [e._v("Cancel")]), r("v-btn", {
          staticClass: "px-12 py-1 mt-4",
          attrs: {
            color: "primary"
          }
        }, [e._v("Save")])], 1)], 1)], 1)
      },
      Yr = [],
      qr = {
        data: function data() {
          return {
            checkbox: !1,
            customMaxTransaction: "",
            dappWebsite: "",
            type: {
              deployment: !1,
              interaction: !1,
              ercTransactions: !1,
              changeNetwork: !1,
              sendEth: !1
            },
            amount: {
              maxTenUsd: !1,
              maxHundredThousandUsd: !1,
              other: !1,
              customMaxValue: ""
            },
            validity: {
              oneHour: !1,
              oneWeek: !1,
              oneMonth: !1,
              oneYear: !1
            }
          }
        },
        methods: {
          onCancel: function onCancel() {
            this.$emit("onCancel")
          }
        }
      },
      zr = qr,
      Wr = Object(l["a"])(zr, DappPermissionEditvue_type_template_id_d7b5849c_render, Yr, !1, null, null, null),
      Qr = Wr.exports;
    u()(Wr, {
      VBtn: ee["a"],
      VCard: te["a"],
      VContainer: M["a"],
      VFlex: P["a"],
      VLayout: R["a"],
      VTextField: He["a"]
    });
    var Jr = {
        data: function data() {
          return {
            editMode: !1,
            permissions: []
          }
        },
        components: {
          DappPermissionView: Kr,
          DappPermissionEdit: Qr
        },
        methods: {
          onClose: function onClose() {
            this.$emit("onClose")
          },
          addPermission: function addPermission() {
            this.permissions.push({
              isEdit: !1
            })
          },
          onDeletePermission: function onDeletePermission(e) {
            var t = this.permissions.indexOf(e);
            this.permissions.splice(t, 1)
          }
        }
      },
      Zr = Jr,
      Xr = (a("8c34"), Object(l["a"])(Zr, DappPermissionsvue_type_template_id_3889ae7f_render, Br, !1, null, null, null)),
      $r = Xr.exports;
    u()(Xr, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VContainer: M["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VSlideYTransition: Za["e"],
      VSpacer: Ue["a"]
    });
    var en = {
        name: "privacySecuritySettings",
        components: {
          PrivateKeys: Nr,
          DappPermissions: $r
        },
        data: function data() {
          return {
            privateKeyDialog: !1,
            dappPermissionDialog: !1
          }
        }
      },
      tn = en,
      an = (a("08ef"), Object(l["a"])(tn, PrivacySecurityvue_type_template_id_096a6986_scoped_true_render, Pr, !1, null, "096a6986", null)),
      rn = an.exports;
    u()(an, {
      VDialog: Be["a"],
      VIcon: W["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemAction: Bt["a"],
      VListItemContent: se["a"],
      VListItemTitle: se["c"]
    });
    var ContactListvue_type_template_id_4b1c746e_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "contact-list-container",
          class: e.$vuetify.breakpoint.xsOnly ? "" : "py-0 px-12"
        }, [a("div", {
          staticClass: "body-2"
        }, [e._v("List of Contacts")]), a("v-card", {
          staticClass: "card-shadow mt-2"
        }, [a("v-list", {
          staticClass: "pa-0 contact-list",
          attrs: {
            dense: "",
            flat: ""
          }
        }, [e._l(e.contacts, (function (t) {
          return [a("v-list-item", {
            key: "contact-" + t.id,
            attrs: {
              "two-line": ""
            }
          }, [a("v-list-item-content", [a("v-list-item-title", {
            staticClass: "font-weight-regular caption"
          }, [a("span", [e._v(e._s(t.name))])]), a("v-list-item-subtitle", {
            staticClass: "font-weight-regular caption text_2--text text--lighten-2"
          }, [a("span", {
            staticClass: "text-capitalize"
          }, [e._v(e._s(t.verifier === e.ETH ? "" : t.verifier + ": "))]), a("span", [e._v(e._s(t.contact))])])], 1), a("v-list-item-action", [a("v-btn", {
            staticClass: "delete-btn",
            attrs: {
              color: "text_2",
              icon: "",
              small: ""
            },
            on: {
              click: function (a) {
                return e.deleteContact(t.id)
              }
            }
          }, [a("v-icon", {
            attrs: {
              size: "10"
            }
          }, [e._v("$vuetify.icons.close")])], 1)], 1)], 1)]
        }))], 2)], 1), a("div", {
          staticClass: "body-2 mt-4"
        }, [e._v("Add new contact")]), a("v-form", {
          ref: "addContactForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: e.addContact
          },
          model: {
            value: e.contactFormValid,
            callback: function (t) {
              e.contactFormValid = t
            },
            expression: "contactFormValid"
          }
        }, [a("v-layout", {
          staticClass: "mt-2",
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            sm6: ""
          }
        }, [a("v-select", {
          staticClass: "select-verifier-container",
          attrs: {
            id: "select-verifier",
            outlined: "",
            "append-icon": "$vuetify.icons.select",
            items: e.verifierOptions,
            "item-text": "name",
            "item-value": "value"
          },
          on: {
            change: function (t) {
              return e.$refs.addContactForm.validate()
            }
          },
          model: {
            value: e.selectedVerifier,
            callback: function (t) {
              e.selectedVerifier = t
            },
            expression: "selectedVerifier"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-text-field", {
          attrs: {
            id: "contact-name",
            placeholder: "Enter Contact Name",
            rules: [e.rules.required],
            outlined: ""
          },
          model: {
            value: e.newContactName,
            callback: function (t) {
              e.newContactName = t
            },
            expression: "newContactName"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-text-field", {
          attrs: {
            id: "contact-value",
            placeholder: e.verifierPlaceholder,
            rules: [e.toAddressRule, e.rules.required, e.checkDuplicates],
            outlined: ""
          },
          model: {
            value: e.newContact,
            callback: function (t) {
              e.newContact = t
            },
            expression: "newContact"
          }
        })], 1), a("v-flex", {
          staticClass: "pt-4 text-right",
          attrs: {
            xs12: ""
          }
        }, [a("v-btn", {
          staticClass: "px-12 py-1",
          attrs: {
            id: "contact-submit-btn",
            type: "submit",
            color: "primary",
            depressed: "",
            disabled: !e.contactFormValid
          }
        }, [e._v("Add Contact")])], 1)], 1)], 1)], 1)
      },
      nn = [],
      sn = a("b00c"),
      on = sn.ALLOWED_VERIFIERS,
      cn = sn.ETH,
      ln = a("fa7d"),
      dn = ln.validateVerifierId,
      un = {
        name: "networkSettings",
        data: function data() {
          return {
            contactFormValid: !0,
            selectedVerifier: cn,
            newContact: "",
            newContactName: "",
            rules: {
              required: function required(e) {
                return !!e || "Required"
              }
            },
            verifierOptions: on,
            ETH: cn
          }
        },
        computed: {
          verifierPlaceholder: function verifierPlaceholder() {
            var e = this;
            return "Enter ".concat(this.verifierOptions.find((function (t) {
              return t.value === e.selectedVerifier
            })).name)
          },
          contacts: function contacts() {
            return this.$store.state.contacts
          }
        },
        methods: {
          checkDuplicates: function checkDuplicates(e) {
            return this.contacts ? this.contacts.findIndex((function (t) {
              return t.contact.toLowerCase() === e.toLowerCase()
            })) < 0 || "Duplicate contact" : ""
          },
          addContact: function addContact(e) {
            var t = this;
            this.$refs.addContactForm.validate() && (e.preventDefault(), this.$store.dispatch("addContact", {
              contact: this.newContact,
              name: this.newContactName,
              verifier: this.selectedVerifier
            }).then((function (e) {
              t.newContact = "", t.newContactName = "", t.$refs.addContactForm.resetValidation()
            })))
          },
          deleteContact: function deleteContact(e) {
            this.$store.dispatch("deleteContact", e)
          },
          toAddressRule: function toAddressRule(e) {
            return dn(this.selectedVerifier, e)
          }
        }
      },
      pn = un,
      gn = (a("36d0"), Object(l["a"])(pn, ContactListvue_type_template_id_4b1c746e_render, nn, !1, null, null, null)),
      fn = gn.exports;
    u()(gn, {
      VBtn: ee["a"],
      VCard: te["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemAction: Bt["a"],
      VListItemContent: se["a"],
      VListItemSubtitle: se["b"],
      VListItemTitle: se["c"],
      VSelect: Rt["a"],
      VTextField: He["a"]
    });
    var Networkvue_type_template_id_e7ee456e_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "py-4 px-12"
        }, [a("v-form", {
          ref: "networkForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (e) {
              e.preventDefault()
            }
          },
          model: {
            value: e.formValid,
            callback: function (t) {
              e.formValid = t
            },
            expression: "formValid"
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Select Network")]), a("v-flex", [a("v-select", {
          staticClass: "select-network-container",
          attrs: {
            id: "select-network",
            outlined: "",
            items: e.networks,
            "item-text": "networkName",
            "item-value": "host",
            "return-object": "",
            "append-icon": "$vuetify.icons.select"
          },
          on: {
            change: e.changeNetwork
          },
          model: {
            value: e.selectedNetwork,
            callback: function (t) {
              e.selectedNetwork = t
            },
            expression: "selectedNetwork"
          }
        })], 1), e.isRPCSelected ? [a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-text-field", {
          attrs: {
            placeholder: "Enter Network Name",
            rules: [e.rules.required],
            outlined: ""
          },
          model: {
            value: e.rpc.networkName,
            callback: function (t) {
              e.$set(e.rpc, "networkName", t)
            },
            expression: "rpc.networkName"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-text-field", {
          attrs: {
            placeholder: "Enter RPC URL",
            rules: [e.rules.required],
            outlined: ""
          },
          model: {
            value: e.rpc.host,
            callback: function (t) {
              e.$set(e.rpc, "host", t)
            },
            expression: "rpc.host"
          }
        })], 1), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-text-field", {
          attrs: {
            placeholder: "Enter Chain id",
            outlined: ""
          },
          model: {
            value: e.rpc.chainId,
            callback: function (t) {
              e.$set(e.rpc, "chainId", t)
            },
            expression: "rpc.chainId"
          }
        })], 1), a("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: ""
          }
        }, [a("v-tooltip", {
          attrs: {
            bottom: "",
            disabled: e.formValid
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("span", e._g({}, r), [a("v-btn", {
                attrs: {
                  disabled: !e.formValid,
                  depressed: "",
                  color: "primary"
                },
                on: {
                  click: e.setRPC
                }
              }, [e._v("Save")])], 1)]
            }
          }], null, !1, 419439063)
        }, [a("span", [e._v("Resolve the errors")])])], 1)] : e._e()], 2)], 1)
      },
      vn = [],
      hn = a("b00c"),
      mn = hn.RPC,
      bn = hn.RPC_DISPLAY_NAME,
      xn = hn.SUPPORTED_NETWORK_TYPES,
      yn = {
        name: "networkSettings",
        data: function data() {
          return {
            selectedNetwork: {},
            networks: [].concat(Object(Oe["a"])(Object.values(xn)), [{
              networkName: bn,
              host: mn,
              chainId: ""
            }]),
            rpc: {
              chainId: "",
              networkName: "",
              host: ""
            },
            formValid: !0,
            rules: {
              required: function required(e) {
                return !!e || "Required"
              }
            }
          }
        },
        computed: {
          isRPCSelected: function isRPCSelected() {
            return this.selectedNetwork.host === mn
          }
        },
        methods: {
          changeNetwork: function changeNetwork(e) {
            e && e.host !== mn && this.$store.dispatch("setProviderType", {
              network: this.selectedNetwork
            })
          },
          setRPC: function setRPC() {
            this.$refs.networkForm.validate() && this.$store.dispatch("setProviderType", {
              network: this.rpc,
              type: mn
            })
          }
        },
        mounted: function mounted() {
          this.selectedNetwork = this.$store.state.networkType, this.rpc = this.$store.state.networkType
        }
      },
      wn = yn,
      kn = Object(l["a"])(wn, Networkvue_type_template_id_e7ee456e_render, vn, !1, null, null, null),
      Cn = kn.exports;
    u()(kn, {
      VBtn: ee["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VSelect: Rt["a"],
      VTextField: He["a"],
      VTooltip: Ka["a"]
    });
    var Displayvue_type_template_id_099470ad_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "select-theme-container",
          class: e.$vuetify.breakpoint.xsOnly ? "" : "py-4 px-12"
        }, [a("div", {
          staticClass: "body-2 text_1--text mb-1 px-1"
        }, [e._v("Select Theme")]), a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "px-1": "",
            "mb-1": ""
          }
        }, [a("v-menu", {
          attrs: {
            transition: "slide-y-transition",
            bottom: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("v-chip", e._g({
                staticClass: "select-theme",
                style: e.themeOptionStyle(e.selectedTheme),
                attrs: {
                  label: "",
                  outlined: "",
                  large: ""
                }
              }, r), [a("span", [e._v(e._s(e.selectedTheme ? e.selectedTheme.label : "Select a theme"))]), a("div", {
                staticClass: "flex-grow-1 text-right pr-2"
              }, [a("v-icon", {
                attrs: {
                  right: ""
                }
              }, [e._v("$vuetify.icons.select")])], 1)])]
            }
          }])
        }, [a("v-list", {
          staticClass: "select-theme-list pa-0"
        }, e._l(e.themes, (function (t) {
          return a("v-list-item", {
            key: "" + t.name,
            staticClass: "select-theme-item",
            style: e.themeOptionStyle(t),
            on: {
              click: function (a) {
                e.selectedTheme = t
              }
            }
          }, [e._v(" " + e._s(t.label) + " ")])
        })), 1)], 1)], 1)], 1), a("v-flex", {
          staticClass: "pt-4 text-right"
        }, [a("v-btn", {
          staticClass: "px-12 py-1 mt-4",
          attrs: {
            color: "primary",
            depressed: ""
          },
          on: {
            click: function (t) {
              return e.saveTheme()
            }
          }
        }, [e._v("Save")])], 1), a("v-snackbar", {
          attrs: {
            color: e.snackbarColor
          },
          model: {
            value: e.snackbar,
            callback: function (t) {
              e.snackbar = t
            },
            expression: "snackbar"
          }
        }, [e._v(" " + e._s(e.snackbarText) + " "), a("v-btn", {
          attrs: {
            dark: "",
            text: ""
          },
          on: {
            click: function (t) {
              e.snackbar = !1
            }
          }
        }, [e._v(" Close ")])], 1)], 1)
      },
      An = [],
      Tn = a("7134"),
      _n = {
        name: "displaySettings",
        data: function data() {
          return {
            themes: Tn["a"],
            selectedTheme: "",
            snackbar: !1,
            snackbarText: "",
            snackbarColor: "success"
          }
        },
        methods: {
          saveTheme: function saveTheme() {
            var e = this;
            this.$store.dispatch("setUserTheme", this.selectedTheme.name).then((function () {
              e.selectedTheme = "", e.snackbar = !0, e.snackbarColor = "success", e.snackbarText = "Successfully saved theme"
            })).catch((function (t) {
              e.selectedTheme = "", e.snackbar = !0, e.snackbarColor = "error", e.snackbarText = t
            }))
          },
          themeOptionStyle: function themeOptionStyle(e) {
            if (e) return {
              color: "".concat(e.theme.primary, " !important"),
              backgroundColor: "".concat(e.theme.background_body_1, " !important"),
              borderColor: e.theme.primary,
              borderWidth: "1px",
              borderStyle: "solid"
            }
          }
        }
      },
      Sn = _n,
      On = (a("a9d9"), a("2db4")),
      En = Object(l["a"])(Sn, Displayvue_type_template_id_099470ad_scoped_true_render, An, !1, null, "099470ad", null),
      In = En.exports;
    u()(En, {
      VBtn: ee["a"],
      VChip: z["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VMenu: Yt["a"],
      VSnackbar: On["a"]
    });
    var Mn = {
        name: "walletSettings",
        components: {
          PrivacySecurity: rn,
          ContactList: fn,
          Network: Cn,
          Display: In
        }
      },
      Pn = Mn,
      Rn = (a("bf4f"), Object(l["a"])(Pn, WalletSettingsvue_type_template_id_45dfa3ea_scoped_true_render, Mr, !1, null, "45dfa3ea", null)),
      Ln = Rn.exports;
    u()(Rn, {
      VExpansionPanel: yt["a"],
      VExpansionPanelContent: wt["a"],
      VExpansionPanelHeader: kt["a"],
      VExpansionPanels: Ct["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VLayout: R["a"]
    });
    var WalletTransfervue_type_template_id_7310d11d_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-layout", {
          staticClass: "wallet-transfer",
          class: e.$vuetify.breakpoint.xsOnly ? "mt-2" : "mt-3",
          attrs: {
            wrap: ""
          }
        }, [r("div", {
          staticClass: "text-black font-weight-bold headline px-4 mb-4"
        }, [e._v(e._s(e.pageHeader))]), r("v-flex", {
          attrs: {
            xs12: "",
            "mb-4": ""
          }
        }, [r("v-form", {
          ref: "form",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (t) {
              return t.preventDefault(), e.sendCoin(t)
            }
          },
          model: {
            value: e.formValid,
            callback: function (t) {
              e.formValid = t
            },
            expression: "formValid"
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": "",
            "mb-5": ""
          }
        }, [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("Select item")]), e.selectedItemDisplay ? r("div", [r("v-menu", {
          attrs: {
            transition: "slide-y-transition",
            bottom: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var n = t.on;
              return [r("v-chip", e._g({
                staticClass: "select-coin",
                attrs: {
                  label: "",
                  outlined: "",
                  large: ""
                }
              }, n), [r("img", {
                staticClass: "mr-2",
                attrs: {
                  src: e.contractType === e.CONTRACT_TYPE_ERC721 ? e.selectedItemDisplay.logo : a("5c2f")("./" + e.selectedItemDisplay.logo),
                  height: "20px",
                  onerror: "if (this.src !== 'eth.svg') this.src = 'images/logos/eth.svg';"
                }
              }), r("span", {
                staticClass: "select-coin-name"
              }, [e._v(e._s(e.selectedItemDisplay.name))]), r("div", {
                staticClass: "flex-grow-1 text-right pr-2"
              }, [r("v-icon", {
                attrs: {
                  right: ""
                }
              }, [e._v("$vuetify.icons.select")])], 1)])]
            }
          }], null, !1, 3801207099)
        }, [r("v-list", {
          staticClass: "select-item-list"
        }, [e._l(e.finalBalancesArrayEthOnly, (function (t) {
          return r("v-list-item", {
            key: t.id,
            staticClass: "select-coin-eth",
            on: {
              click: function (a) {
                return e.selectedItemChanged(t.tokenAddress)
              }
            }
          }, [r("v-list-item-icon", {
            staticClass: "mr-1"
          }, [r("img", {
            attrs: {
              src: a("5c2f")("./" + t.logo),
              height: "20px",
              onerror: "if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
            }
          })]), r("v-list-item-content", [r("v-list-item-title", {
            staticClass: "body-2"
          }, [e._v(e._s(t.name) + " (" + e._s(t.symbol) + ")")])], 1)], 1)
        })), r("v-divider", {
          staticClass: "mx-3"
        }), e.finalBalancesArrayTokens.length > 0 ? r("v-subheader", {
          staticClass: "body-2"
        }, [r("v-icon", {
          staticClass: "mr-2",
          attrs: {
            small: "",
            left: ""
          }
        }, [e._v("$vuetify.icons.token")]), e._v(" TOKENS ")], 1) : e._e(), e._l(e.finalBalancesArrayTokens, (function (t) {
          return r("v-list-item", {
            key: t.id,
            on: {
              click: function (a) {
                return e.selectedItemChanged(t.tokenAddress)
              }
            }
          }, [r("v-list-item-icon", {
            staticClass: "ml-8 mr-1"
          }, [r("img", {
            attrs: {
              src: a("5c2f")("./" + t.logo),
              height: "20px",
              onerror: "if (this.src !== 'eth.svg') this.src = 'images/logos/eth.svg';"
            }
          })]), r("v-list-item-content", [r("v-list-item-title", {
            staticClass: "body-2"
          }, [e._v(e._s(t.name) + " (" + e._s(t.symbol) + ")")])], 1)], 1)
        })), r("v-divider", {
          staticClass: "mx-3"
        }), e.collectibles.length > 0 ? r("v-subheader", {
          staticClass: "body-2"
        }, [r("v-icon", {
          staticClass: "mr-2",
          attrs: {
            small: "",
            left: ""
          }
        }, [e._v("$vuetify.icons.collectibles")]), e._v(" COLLECTIBLES ")], 1) : e._e(), e._l(e.collectibles, (function (t) {
          return r("v-list-item", {
            key: t.address,
            on: {
              click: function (a) {
                return e.selectedItemChanged(t.address)
              }
            }
          }, [r("v-list-item-icon", {
            staticClass: "ml-8 mr-1"
          }, [r("img", {
            attrs: {
              src: t.logo,
              height: "20px"
            }
          })]), r("v-list-item-content", [r("v-list-item-title", {
            staticClass: "body-2"
          }, [e._v(e._s(t.name))])], 1)], 1)
        }))], 2)], 1)], 1) : e._e()]), e.selectedItem ? r("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "mb-5": "",
            "px-4": ""
          }
        }, [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("Account Balance")]), r("div", [r("span", {
          staticClass: "headline mr-1",
          attrs: {
            id: "account-balance"
          }
        }, [e._v(e._s(e.selectedItem.formattedBalance))]), r("span", {
          staticClass: "caption text_2--text"
        }, [e._v(e._s(e.currencyBalanceDisplay))])]), r("div", {
          staticClass: "caption font-weight-regular text_2--text"
        }, [e._v(e._s(e.selectedItem.currencyRateText))])]) : e._e()], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            sm6: "",
            "px-4": ""
          }
        }, [r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("Transfer Mode")])]), r("v-flex", {
          staticClass: "recipient-verifier-container",
          class: e.$vuetify.breakpoint.xsOnly ? "" : "pr-1",
          attrs: {
            xs12: "",
            sm6: ""
          }
        }, [r("v-select", {
          attrs: {
            id: "recipient-verifier",
            outlined: "",
            "append-icon": "$vuetify.icons.select",
            items: e.verifierOptions,
            "item-text": "name",
            "item-value": "value"
          },
          on: {
            change: function (t) {
              return e.$refs.form.validate()
            }
          },
          model: {
            value: e.selectedVerifier,
            callback: function (t) {
              e.selectedVerifier = t
            },
            expression: "selectedVerifier"
          }
        })], 1), r("v-flex", {
          staticClass: "recipient-address-container",
          class: e.$vuetify.breakpoint.xsOnly ? "" : "pl-1",
          attrs: {
            xs12: "",
            sm6: ""
          }
        }, [r("v-combobox", {
          ref: "contactSelected",
          staticClass: "recipient-address",
          attrs: {
            id: "recipient-address",
            items: e.contactList,
            placeholder: e.verifierPlaceholder,
            required: "",
            rules: [e.contactRule, e.rules.required],
            outlined: "",
            "item-text": "name",
            "item-value": "value",
            "return-object": ""
          },
          on: {
            change: e.contactChanged
          },
          scopedSlots: e._u([{
            key: "append",
            fn: function () {
              return [r("v-btn", {
                attrs: {
                  icon: "",
                  small: "",
                  color: "primary"
                },
                on: {
                  click: function (t) {
                    return e.$refs.captureQr.$el.click()
                  }
                }
              }, [r("v-icon", {
                attrs: {
                  small: ""
                }
              }, [e._v("$vuetify.icons.scan")])], 1)]
            },
            proxy: !0
          }]),
          model: {
            value: e.contactSelected,
            callback: function (t) {
              e.contactSelected = t
            },
            expression: "contactSelected"
          }
        }), r("qrcode-capture", {
          ref: "captureQr",
          staticStyle: {
            display: "none"
          },
          on: {
            decode: e.onDecodeQr
          }
        }), "" !== e.qrErrorMsg ? r("div", {
          staticClass: "v-text-field__details torus-hint"
        }, [r("div", {
          staticClass: "v-messages"
        }, [r("div", {
          staticClass: "v-messages__wrapper"
        }, [r("div", {
          staticClass: "v-messages__message d-flex error--text px-3"
        }, [e._v(e._s(e.qrErrorMsg))])])])]) : e._e()], 1), e.newContact && e.$refs.contactSelected && e.$refs.contactSelected.valid ? r("v-flex", {
          attrs: {
            x12: "",
            "mb-2": ""
          }
        }, [r("add-contact", {
          attrs: {
            contact: e.contactSelected,
            verifier: e.selectedVerifier
          }
        })], 1) : e._e()], 1)], 1)], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          staticClass: "you-send-container",
          attrs: {
            xs12: "",
            "px-4": "",
            sm6: ""
          }
        }, [r("div", [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("You send")]), e.contractType === e.CONTRACT_TYPE_ERC721 || e.isSendAll ? e._e() : r("a", {
          staticClass: "float-right primary--text subtitle-2",
          attrs: {
            id: "send-all-btn"
          },
          on: {
            click: e.sendAll
          }
        }, [e._v(" Send All ")]), e.isSendAll ? r("a", {
          staticClass: "float-right primary--text subtitle-2",
          attrs: {
            id: "send-all-reset-btn"
          },
          on: {
            click: e.resetSendAll
          }
        }, [e._v("Reset")]) : e._e()]), e.contractType === e.CONTRACT_TYPE_ERC721 ? r("v-select", {
          attrs: {
            items: e.collectibleSelected.assets,
            outlined: "",
            "item-text": "name",
            "append-icon": "$vuetify.icons.select",
            "return-object": ""
          },
          scopedSlots: e._u([{
            key: "prepend-inner",
            fn: function () {
              return [r("img", {
                attrs: {
                  src: e.assetSelected.image,
                  height: "24px"
                }
              })]
            },
            proxy: !0
          }, {
            key: "item",
            fn: function (t) {
              var a = t.item;
              return [r("img", {
                staticClass: "mr-2",
                attrs: {
                  src: a.image,
                  height: "24px"
                }
              }), e._v(" " + e._s(a.name) + " ")]
            }
          }], null, !1, 379500305),
          model: {
            value: e.assetSelected,
            callback: function (t) {
              e.assetSelected = t
            },
            expression: "assetSelected"
          }
        }) : e._e(), e.contractType !== e.CONTRACT_TYPE_ERC721 ? r("v-text-field", {
          attrs: {
            id: "you-send",
            hint: e.convertedAmount ? "~ " + e.convertedAmount + " " + (e.toggle_exclusive ? e.selectedItem.symbol : e.selectedCurrency) : "",
            "persistent-hint": "",
            type: "number",
            outlined: "",
            required: "",
            readonly: e.isSendAll,
            rules: [e.rules.required, e.lesserThan, e.moreThanZero]
          },
          scopedSlots: e._u([{
            key: "append",
            fn: function () {
              return [r("v-btn", {
                attrs: {
                  small: "",
                  id: "coin-mode-btn",
                  outlined: !e.toggle_exclusive,
                  text: !!e.toggle_exclusive,
                  color: e.toggle_exclusive ? "text_2" : "primary"
                },
                on: {
                  click: function (t) {
                    return e.changeSelectedToCurrency(0)
                  }
                }
              }, [e._v(" " + e._s(e.selectedItem && e.selectedItem.symbol) + " ")]), r("v-btn", {
                attrs: {
                  small: "",
                  id: "currency-mode-btn",
                  outlined: !!e.toggle_exclusive,
                  text: !e.toggle_exclusive,
                  color: e.toggle_exclusive ? "primary" : "text_2"
                },
                on: {
                  click: function (t) {
                    return e.changeSelectedToCurrency(1)
                  }
                }
              }, [e._v(" " + e._s(e.selectedCurrency) + " ")])]
            },
            proxy: !0
          }], null, !1, 711895709),
          model: {
            value: e.displayAmount,
            callback: function (t) {
              e.displayAmount = t
            },
            expression: "displayAmount"
          }
        }) : e._e()], 1)], 1), r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("TransactionSpeedSelect", {
          attrs: {
            resetSpeed: e.resetSpeed,
            symbol: e.contractType !== e.CONTRACT_TYPE_ERC721 ? e.selectedItem.symbol : "ETH",
            gas: e.gas,
            displayAmount: e.displayAmount
          },
          on: {
            onSelectSpeed: e.onSelectSpeed
          }
        })], 1), e.contractType !== e.CONTRACT_TYPE_ERC721 ? r("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            "px-4": "",
            sm6: ""
          }
        }, [r("div", [r("span", {
          staticClass: "subtitle-2"
        }, [e._v("Total Cost")])]), r("v-text-field", {
          attrs: {
            id: "total-cost",
            suffix: e.totalCostSuffix,
            hint: e.convertedTotalCost ? e.convertedTotalCostDisplay : "",
            "persistent-hint": "",
            outlined: "",
            readonly: "",
            value: e.totalCost
          }
        })], 1)], 1) : e._e(), r("v-layout", {
          attrs: {
            "mt-4": "",
            wrap: ""
          }
        }, [r("v-flex", {
          staticClass: "text-right",
          attrs: {
            xs12: "",
            "px-4": "",
            sm6: ""
          }
        }, [r("v-btn", {
          staticClass: "px-6",
          attrs: {
            large: "",
            depressed: "",
            color: "primary",
            disabled: !e.formValid || "" === e.speedSelected,
            type: "submit",
            id: "wallet-transfer-submit"
          }
        }, [e._v(" Transfer ")])], 1)], 1), r("v-layout", {
          attrs: {
            "mt-4": "",
            "pr-2": "",
            wrap: ""
          }
        }, [r("v-spacer"), r("v-dialog", {
          attrs: {
            "max-width": "500",
            persistent: ""
          },
          model: {
            value: e.showModalMessage,
            callback: function (t) {
              e.showModalMessage = t
            },
            expression: "showModalMessage"
          }
        }, [r("message-modal", {
          attrs: {
            "modal-type": e.modalMessageSuccess,
            title: e.modalMessageSuccess ? "Your transfer is being processed" : "Your transfer cannot be processed",
            "detail-text": e.modalMessageSuccess ? "Your transaction will be completed in approximately " + e.timeTaken + " min" : "Please try again later"
          },
          on: {
            onClose: function (t) {
              e.showModalMessage = !1
            }
          }
        })], 1)], 1)], 1)], 1)], 1)
      },
      jn = [],
      Dn = a("9a3e"),
      MessageModalvue_type_template_id_62e00e2b_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-card", {
          staticClass: "advance-option message-modal"
        }, [r("v-card-text", {
          staticClass: "text_1--text pa-0"
        }, [r("v-layout", {
          staticClass: "image-container text-center",
          class: e.modalType ? "image-container-success" : "image-container-danger",
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            "px-4": ""
          }
        }, [r("img", {
          staticClass: "close-icon",
          attrs: {
            height: "6px",
            width: "6px",
            src: a("9e49")
          },
          on: {
            click: e.onCancel
          }
        }), e.modalType ? r("img", {
          attrs: {
            height: "87px",
            width: "87px",
            src: a("a49d")
          }
        }) : e._e(), e.modalType ? e._e() : r("img", {
          attrs: {
            height: "87px",
            width: "87px",
            src: a("8c92")
          }
        })])], 1), r("v-layout", {
          attrs: {
            wrap: "",
            "py-6": ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: "",
            md10: "",
            "mx-auto": "",
            "px-4": "",
            "text-center": ""
          }
        }, [r("div", {
          staticClass: "font-weight-bold headline mt-4 mb-2"
        }, [e._v(e._s(e.title))])]), r("v-flex", {
          attrs: {
            xs10: "",
            md6: "",
            "mx-auto": "",
            "px-4": "",
            "text-center": "",
            "mb-6": ""
          }
        }, [r("p", [e._v(e._s(e.detailText))])]), r("v-flex", {
          attrs: {
            xs12: "",
            "mx-auto": "",
            "px-4": "",
            "text-center": "",
            "pb-4": ""
          }
        }, [e.modalType ? r("v-btn", {
          staticClass: "px-12 py-4 mb-12 white--text modal-button",
          attrs: {
            id: "continue-link",
            color: "#2DCC70",
            to: "/wallet/history"
          }
        }, [e._v(" Continue ")]) : r("v-btn", {
          staticClass: "px-12 py-4 mb-12 white--text modal-button",
          attrs: {
            color: "#FEA29F"
          },
          on: {
            click: e.onCancel
          }
        }, [e._v("Try again")])], 1)], 1)], 1)], 1)
      },
      Nn = [],
      Bn = {
        props: ["modalType", "title", "detailText"],
        methods: {
          onCancel: function onCancel() {
            this.$emit("onClose")
          }
        }
      },
      Vn = Bn,
      Fn = (a("a2a3"), Object(l["a"])(Vn, MessageModalvue_type_template_id_62e00e2b_scoped_true_render, Nn, !1, null, "62e00e2b", null)),
      Un = Fn.exports;
    u()(Fn, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardText: ae["b"],
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var Hn, AddContactvue_type_template_id_e13cfea6_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-dialog", {
          attrs: {
            width: "400"
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("v-btn", e._g({
                staticClass: "caption primary lighten-5 primary--text add-contact-alert",
                attrs: {
                  depressed: "",
                  "x-small": "",
                  block: ""
                }
              }, r), [e._v(" Click here to add Contact to your Address Book ")])]
            }
          }]),
          model: {
            value: e.addContactDialoag,
            callback: function (t) {
              e.addContactDialoag = t
            },
            expression: "addContactDialoag"
          }
        }, [a("v-card", {
          staticClass: "add-contact-container"
        }, [a("v-form", {
          ref: "addContactForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: e.addContact
          },
          model: {
            value: e.contactFormValid,
            callback: function (t) {
              e.contactFormValid = t
            },
            expression: "contactFormValid"
          }
        }, [a("v-card-text", {
          staticClass: "text_1--text py-6"
        }, [a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "px-4",
          attrs: {
            xs12: ""
          }
        }, [a("div", {
          staticClass: "font-weight-bold headline"
        }, [e._v("Add Contact")]), a("v-chip", {
          staticClass: "caption",
          attrs: {
            small: "",
            light: "",
            color: "#CAF1FE"
          }
        }, [e._v(e._s(e.verifierLabels[e.verifier]))])], 1), a("v-flex", {
          class: e.$vuetify.breakpoint.xsOnly ? "" : "px-4",
          attrs: {
            xs12: "",
            "mt-6": ""
          }
        }, [a("span", {
          staticClass: "subtitle-2"
        }, [e._v("Contact Account Name")]), a("v-text-field", {
          attrs: {
            placeholder: "Enter the name here",
            rules: [e.rules.required],
            outlined: ""
          },
          model: {
            value: e.newContactName,
            callback: function (t) {
              e.newContactName = t
            },
            expression: "newContactName"
          }
        })], 1)], 1)], 1), a("v-card-actions", {
          staticClass: "pb-6"
        }, [a("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [a("v-btn", {
          attrs: {
            block: "",
            text: "",
            color: "text_2"
          },
          on: {
            click: function (t) {
              e.addContactDialoag = !1
            }
          }
        }, [e._v("Cancel")])], 1), a("v-divider", {
          attrs: {
            vertical: ""
          }
        }), a("v-flex", {
          attrs: {
            xs6: ""
          }
        }, [a("v-btn", {
          staticClass: "px-12 py-1",
          attrs: {
            type: "submit",
            color: "primary",
            depressed: "",
            disabled: !e.contactFormValid
          }
        }, [e._v("Confirm")])], 1)], 1)], 1)], 1)], 1)
      },
      Gn = [],
      Kn = (Hn = {}, Object(ye["a"])(Hn, we["ETH"], we["ETH_LABEL"]), Object(ye["a"])(Hn, we["GOOGLE"], we["GOOGLE_LABEL"]), Object(ye["a"])(Hn, we["REDDIT"], we["REDDIT_LABEL"]), Object(ye["a"])(Hn, we["DISCORD"], we["DISCORD_LABEL"]), Hn),
      Yn = {
        props: ["verifier", "contact"],
        data: function data() {
          return {
            addContactDialoag: !1,
            contactFormValid: !0,
            newContactName: "",
            rules: {
              required: function required(e) {
                return !!e || "Required"
              }
            },
            verifierLabels: Kn
          }
        },
        methods: {
          addContact: function addContact(e) {
            var t = this;
            this.$refs.addContactForm.validate() && (e.preventDefault(), this.$store.dispatch("addContact", {
              contact: this.contact,
              verifier: this.verifier,
              name: this.newContactName
            }).then((function (e) {
              t.newContactName = "", t.addContactDialoag = !1
            })))
          }
        }
      },
      qn = Yn,
      zn = Object(l["a"])(qn, AddContactvue_type_template_id_e13cfea6_render, Gn, !1, null, null, null),
      Wn = zn.exports;
    u()(zn, {
      VBtn: ee["a"],
      VCard: te["a"],
      VCardActions: ae["a"],
      VCardText: ae["b"],
      VChip: z["a"],
      VDialog: Be["a"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VLayout: R["a"],
      VTextField: He["a"]
    });
    var Qn = O["default"].torusNodeEndpoints,
      Jn = a("80fa"),
      Zn = a("231f"),
      Xn = {
        name: "walletTransfer",
        components: {
          TransactionSpeedSelect: We,
          MessageModal: Un,
          QrcodeCapture: Dn["QrcodeCapture"],
          AddContact: Wn
        },
        data: function data() {
          return {
            pageHeader: we["WALLET_HEADERS_TRANSFER"],
            contractType: we["CONTRACT_TYPE_ETH"],
            isContract: !1,
            collectibleSelected: {},
            assetSelected: {},
            tokenAddress: "0x",
            amount: 0,
            displayAmount: "",
            convertedAmount: "",
            contactSelected: "",
            toAddress: "",
            formValid: !0,
            toggle_exclusive: 0,
            gas: 21e3,
            activeGasPrice: "",
            isFastChecked: !1,
            speedSelected: "",
            totalCost: "",
            timeTaken: "",
            convertedTotalCost: "",
            resetSpeed: !1,
            qrErrorMsg: "",
            selectedVerifier: we["ETH"],
            verifierOptions: we["ALLOWED_VERIFIERS"],
            rules: {
              required: function required(e) {
                return !!e || "Required"
              }
            },
            showModalMessage: !1,
            modalMessageSuccess: null,
            isSendAll: !1,
            CONTRACT_TYPE_ETH: we["CONTRACT_TYPE_ETH"],
            CONTRACT_TYPE_ERC20: we["CONTRACT_TYPE_ERC20"],
            CONTRACT_TYPE_ERC721: we["CONTRACT_TYPE_ERC721"]
          }
        },
        computed: {
          selectedCurrency: function selectedCurrency() {
            return this.$store.state.selectedCurrency
          },
          currentEthBalance: function currentEthBalance() {
            return this.$store.state.weiBalance[this.$store.state.selectedAddress]
          },
          finalBalancesArray: function finalBalancesArray() {
            return this.$store.getters.tokenBalances.finalBalancesArray || []
          },
          finalBalancesArrayTokens: function finalBalancesArrayTokens() {
            return this.$store.getters.tokenBalances.finalBalancesArray.filter((function (e) {
              return "0x" !== e.tokenAddress
            })) || []
          },
          finalBalancesArrayEthOnly: function finalBalancesArrayEthOnly() {
            return this.$store.getters.tokenBalances.finalBalancesArray.filter((function (e) {
              return "0x" === e.tokenAddress
            })) || []
          },
          collectibles: function collectibles() {
            return this.$store.getters.collectibleBalances
          },
          selectedItem: function selectedItem() {
            var e = this,
              t = this.finalBalancesArray.find((function (t) {
                return t.tokenAddress === e.selectedTokenAddress
              }));
            return t
          },
          selectedItemDisplay: function selectedItemDisplay() {
            var e = this;
            if (this.contractType !== we["CONTRACT_TYPE_ERC721"]) return this.selectedItem;
            var t = this.collectibles.find((function (t) {
              return t.address === e.collectibleSelected.address
            }));
            return t
          },
          selectedTokenAddress: function selectedTokenAddress() {
            return "0x" !== this.tokenAddress && Object(Me["isAddress"])(this.tokenAddress) ? Object(Me["toChecksumAddress"])(this.tokenAddress) : "0x"
          },
          getCurrencyMultiplier: function getCurrencyMultiplier() {
            var e = this.$store.state || {},
              t = e.selectedCurrency,
              a = e.currencyData,
              r = 1;
            return "ETH" !== t && (r = a[t.toLowerCase()] || 1), r
          },
          getCurrencyTokenRate: function getCurrencyTokenRate() {
            var e = this.$store.state.tokenRates,
              t = this.getCurrencyMultiplier,
              a = 1;
            return this.contractType === we["CONTRACT_TYPE_ERC20"] && (a = e[this.selectedTokenAddress.toLowerCase()] || 0), t * a
          },
          gasDisplayString: function gasDisplayString() {
            var e = this.getCurrencyMultiplier,
              t = this.gas * this.fastGasPrice * Math.pow(10, -9),
              a = t * e;
            return "".concat(Object(Z["significantDigits"])(a), " ").concat(this.selectedCurrency, " / ").concat(Object(Z["significantDigits"])(t), " ETH")
          },
          fastGasDisplayString: function fastGasDisplayString() {
            var e = this.getCurrencyMultiplier,
              t = this.gas * this.fastestGasPrice * Math.pow(10, -9),
              a = t * e;
            return "Faster with ".concat(Object(Z["significantDigits"])(a), " ").concat(this.selectedCurrency, " / ").concat(Object(Z["significantDigits"])(t), " ETH")
          },
          remainingBalanceString: function remainingBalanceString() {
            return this.selectedItem ? "".concat(this.selectedItem.currencyBalance, " / ").concat(this.selectedItem.formattedBalance) : ""
          },
          convertedTotalCostDisplay: function convertedTotalCostDisplay() {
            return "~ ".concat(Object(Z["significantDigits"])(this.convertedTotalCost), " ").concat(this.selectedCurrency)
          },
          currencyBalanceDisplay: function currencyBalanceDisplay() {
            var e = this.selectedItem.currencyBalance.split(" ")[1].replace(",", "");
            return "= ".concat(e, " ").concat(this.selectedCurrency)
          },
          totalCostSuffix: function totalCostSuffix() {
            return this.contractType === we["CONTRACT_TYPE_ETH"] ? 0 === this.toggle_exclusive ? this.selectedItem.symbol : this.selectedCurrency : ""
          },
          verifierPlaceholder: function verifierPlaceholder() {
            var e = this;
            return "Enter ".concat(this.verifierOptions.find((function (t) {
              return t.value === e.selectedVerifier
            })).name)
          },
          contactList: function contactList() {
            var e = this;
            return this.$store.state.contacts.reduce((function (t, a) {
              return a.verifier === e.selectedVerifier && t.push({
                name: "".concat(a.name, " (").concat(a.contact, ")"),
                value: a.contact
              }), t
            }), [])
          },
          newContact: function newContact() {
            if (!this.contactSelected) return !1;
            var e = "string" === typeof this.contactSelected ? this.contactSelected : this.contactSelected.value,
              t = this.contactList.find((function (t) {
                return t.value.toLowerCase() === e.toLowerCase()
              }));
            return void 0 === t
          }
        },
        watch: {
          toAddress: function toAddress(e, t) {
            return regeneratorRuntime.async((function toAddress$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  if (e === t) {
                    a.next = 4;
                    break
                  }
                  return a.next = 3, regeneratorRuntime.awrap(this.calculateGas(e));
                case 3:
                  this.gas = a.sent;
                case 4:
                case "end":
                  return a.stop()
              }
            }), null, this)
          },
          displayAmount: function displayAmount(e, t) {
            0 === this.toggle_exclusive ? this.amount = this.displayAmount : this.amount = this.getCurrencyTokenRate > 0 ? this.displayAmount / this.getCurrencyTokenRate : this.displayAmount * this.getCurrencyTokenRate, this.convertedAmount = this.toggle_exclusive ? Object(Z["significantDigits"])(this.displayAmount / this.getCurrencyTokenRate) : Object(Z["significantDigits"])(this.displayAmount * this.getCurrencyTokenRate), this.updateTotalCost()
          }
        },
        methods: {
          updateFieldsBasedOnRoute: function updateFieldsBasedOnRoute() {
            Object.prototype.hasOwnProperty.call(this.$route.query, "contract") ? this.selectedItemChanged(this.$route.query.contract, Object.prototype.hasOwnProperty.call(this.$route.query, "asset") ? this.$route.query.asset : "") : this.toAddress = ""
          },
          sendEmail: function sendEmail(e, t) {
            if (/\S+@\S+\.\S+/.test(this.toAddress)) {
              var a = Object(Z["getEtherScanHashLink"])(t, this.$store.state.networkType.host),
                r = {
                  from_name: this.$store.state.userInfo.name,
                  to_email: this.toAddress,
                  total_amount: this.amount.toString(),
                  token: e.toString(),
                  etherscanLink: a
                };
              Object(tt["post"])(O["default"].api + "/transaction/sendemail", r, {
                headers: {
                  Authorization: "Bearer " + this.$store.state.jwtToken,
                  "Content-Type": "application/json; charset=utf-8"
                }
              }).then((function (e) {
                return n.a.info("email response", e)
              })).catch((function (e) {
                return n.a.error(e)
              }))
            }
          },
          moreThanZero: function moreThanZero(e) {
            return this.selectedItem ? parseFloat(e) > 0 || "Invalid amount" : ""
          },
          lesserThan: function lesserThan(e) {
            if (this.selectedItem) {
              var t = e;
              return 1 === this.toggle_exclusive && (t /= this.getCurrencyTokenRate), parseFloat(t) <= this.selectedItem.computedBalance || "Insufficient balance for transaction"
            }
            return ""
          },
          contactRule: function contactRule(e) {
            var t = null === e ? "" : "string" === typeof e ? e : e.value;
            return Object(Z["validateVerifierId"])(this.selectedVerifier, t)
          },
          contactChanged: function contactChanged(e) {
            e && (this.toAddress = "string" === typeof e ? e : e.value)
          },
          calculateGas: function calculateGas(e) {
            var t = this;
            return regeneratorRuntime.async((function calculateGas$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  if (!Object(Me["isAddress"])(e)) {
                    a.next = 4;
                    break
                  }
                  return a.abrupt("return", new Promise((function (a, r) {
                    if (t.contractType === we["CONTRACT_TYPE_ETH"]) et["a"].web3.eth.estimateGas({
                      to: e
                    }).then((function (e) {
                      a(e)
                    })).catch((function (e) {
                      n.a.error(e), a(0)
                    }));
                    else if (t.contractType === we["CONTRACT_TYPE_ERC20"]) {
                      var s = t.$store.state.selectedAddress,
                        o = Math.floor(parseFloat(t.amount) * Math.pow(10, parseFloat(t.selectedItem.decimals))).toString();
                      t.getTransferMethod(t.contractType, s, e, o).estimateGas({
                        from: s
                      }).then((function (e) {
                        a(e)
                      })).catch((function (e) {
                        n.a.error(e), a(0)
                      }))
                    } else if (t.contractType === we["CONTRACT_TYPE_ERC721"]) {
                      var i = t.$store.state.selectedAddress;
                      t.getTransferMethod(t.contractType, i, e, t.assetSelected.tokenId).estimateGas({
                        from: i
                      }).then((function (e) {
                        a(e)
                      })).catch((function (e) {
                        n.a.error(e), a(0)
                      }))
                    }
                  })));
                case 4:
                  return a.abrupt("return", 21e3);
                case 5:
                case "end":
                  return a.stop()
              }
            }))
          },
          getTransferMethod: function getTransferMethod(e, t, a, r) {
            if (we["OLD_ERC721_LIST"].includes(this.selectedTokenAddress.toLowerCase()) || e === we["CONTRACT_TYPE_ERC20"]) {
              var n = new et["a"].web3.eth.Contract(Jn, this.selectedTokenAddress);
              return n.methods.transfer(a, r)
            }
            if (e === we["CONTRACT_TYPE_ERC721"]) {
              var s = new et["a"].web3.eth.Contract(Zn, this.selectedTokenAddress);
              return s.methods.safeTransferFrom(t, a, r)
            }
          },
          selectedItemChanged: function selectedItemChanged(e, t) {
            var a, r;
            return regeneratorRuntime.async((function selectedItemChanged$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return a = this.finalBalancesArray.find((function (t) {
                    return t.tokenAddress.toLowerCase() === e.toLowerCase()
                  })), r = this.collectibles.find((function (t) {
                    return t.address.toLowerCase() === e.toLowerCase()
                  })), a ? (this.tokenAddress = a.tokenAddress, this.contractType = a.erc20 ? we["CONTRACT_TYPE_ERC20"] : we["CONTRACT_TYPE_ETH"], this.collectibleSelected = "", this.assetSelected = "") : r && (this.tokenAddress = r.address, this.contractType = we["CONTRACT_TYPE_ERC721"], this.collectibleSelected = r, r.assets && r.assets.length > 0 && (this.assetSelected = t && r.assets.find((function (e) {
                    return e.tokenId.toString() === t.toString()
                  })) || r.assets[0]), this.resetSendAll()), n.next = 5, regeneratorRuntime.awrap(this.calculateGas(this.toAddress));
                case 5:
                  this.gas = n.sent, this.updateTotalCost();
                case 7:
                case "end":
                  return n.stop()
              }
            }), null, this)
          },
          changeSelectedToCurrency: function changeSelectedToCurrency(e) {
            this.toggle_exclusive = e;
            var t = this.getCurrencyTokenRate;
            0 === e ? this.displayAmount = this.displayAmount / t : 1 === e && (this.displayAmount = this.displayAmount * t)
          },
          sendAll: function sendAll() {
            var e = this.selectedItem.computedBalance,
              t = e * this.getCurrencyTokenRate,
              a = this.getEthAmount(this.gas, this.activeGasPrice),
              r = a * this.getCurrencyTokenRate;
            this.isSendAll = !0, 0 === this.toggle_exclusive ? this.displayAmount = e - a : this.displayAmount = t - r
          },
          resetSendAll: function resetSendAll() {
            this.displayAmount = "", this.resetSpeed = !0, this.isSendAll = !1, this.changeSelectedToCurrency(0)
          },
          sendCoin: function sendCoin() {
            var e, t, a, r, s, o, i = this;
            return regeneratorRuntime.async((function sendCoin$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  if (!this.$refs.form.validate()) {
                    c.next = 27;
                    break
                  }
                  if (e = Object(Me["toBN"])((this.activeGasPrice * Math.pow(10, 9)).toString()), n.a.info(this.toAddress, this.selectedVerifier), !Object(Me["isAddress"])(this.toAddress)) {
                    c.next = 7;
                    break
                  }
                  t = Object(Me["toChecksumAddress"])(this.toAddress), c.next = 22;
                  break;
                case 7:
                  return a = Object(Z["getRandomNumber"])(Qn.length), c.prev = 8, c.next = 11, regeneratorRuntime.awrap(et["a"].getPubKeyAsync(Qn[a], {
                    verifier: this.selectedVerifier,
                    verifierId: this.toAddress
                  }));
                case 11:
                  t = c.sent, c.next = 22;
                  break;
                case 14:
                  c.prev = 14, c.t0 = c["catch"](8), n.a.error(c.t0), r = a;
                  while (r === a) r = Object(Z["getRandomNumber"])(Qn.length);
                  return c.next = 21, regeneratorRuntime.awrap(et["a"].getPubKeyAsync(Qn[r], {
                    verifier: this.selectedVerifier,
                    verifierId: this.toAddress
                  }));
                case 21:
                  t = c.sent;
                case 22:
                  return c.next = 24, regeneratorRuntime.awrap(this.calculateGas(t));
                case 24:
                  this.gas = c.sent, s = this.$store.state.selectedAddress, this.contractType === we["CONTRACT_TYPE_ETH"] ? (n.a.info("TX SENT: ", {
                    from: s,
                    to: t,
                    value: Object(Me["toWei"])(parseFloat(this.amount.toString()).toFixed(18)),
                    gas: 0 === this.gas ? void 0 : this.gas.toString(),
                    gasPrice: e
                  }), et["a"].web3.eth.sendTransaction({
                    from: s,
                    to: t,
                    value: Object(Me["toWei"])(parseFloat(this.amount.toString()).toFixed(18)),
                    gas: 0 === this.gas ? void 0 : this.gas.toString(),
                    gasPrice: e
                  }, (function (e, t) {
                    if (e) {
                      var a = new RegExp("User denied transaction signature", "i");
                      e.message.match(a) || (i.showModalMessage = !0, i.modalMessageSuccess = !1), n.a.error(e)
                    } else i.sendEmail(i.selectedItem.symbol, t), i.showModalMessage = !0, i.modalMessageSuccess = !0
                  }))) : this.contractType === we["CONTRACT_TYPE_ERC20"] ? (o = Math.floor(parseFloat(this.amount) * Math.pow(10, parseFloat(this.selectedItem.decimals))).toString(), this.getTransferMethod(this.contractType, s, t, o).send({
                    from: s,
                    gas: 0 === this.gas ? void 0 : this.gas.toString(),
                    gasPrice: e
                  }, (function (e, t) {
                    if (e) {
                      var a = new RegExp("User denied transaction signature", "i");
                      e.message.match(a) || (i.showModalMessage = !0, i.modalMessageSuccess = !1), n.a.error(e)
                    } else i.sendEmail(i.selectedItem.symbol, t), i.showModalMessage = !0, i.modalMessageSuccess = !0
                  }))) : this.contractType === we["CONTRACT_TYPE_ERC721"] && this.getTransferMethod(this.contractType, s, t, this.assetSelected.tokenId).send({
                    from: s,
                    gas: 0 === this.gas ? void 0 : this.gas.toString(),
                    gasPrice: e
                  }, (function (e, t) {
                    if (e) {
                      var a = new RegExp("User denied transaction signature", "i");
                      e.message.match(a) || (i.showModalMessage = !0, i.modalMessageSuccess = !1), n.a.error(e)
                    } else i.sendEmail(i.assetSelected.name, t), i.showModalMessage = !0, i.modalMessageSuccess = !0
                  }));
                case 27:
                case "end":
                  return c.stop()
              }
            }), null, this, [
              [8, 14]
            ])
          },
          getGasDisplayString: function getGasDisplayString(e) {
            var t = this.getGasAmount(e);
            return "".concat(Object(Z["significantDigits"])(t), " ").concat(this.selectedCurrency)
          },
          getGasAmount: function getGasAmount(e) {
            var t = this.getCurrencyMultiplier,
              a = this.getEthAmount(this.gas, e),
              r = a * t;
            return r
          },
          getEthAmount: function getEthAmount(e, t) {
            return e * t * Math.pow(10, -9)
          },
          goBack: function goBack() {
            this.$router.go(-1)
          },
          getGasSpeed: function getGasSpeed() {
            return "average" === this.speedSelected ? this.averageGasPriceSpeed : "fast" === this.speedSelected ? this.fastGasPriceSpeed : "fastest" === this.speedSelected ? this.fastestGasPriceSpeed : void 0
          },
          updateTotalCost: function updateTotalCost() {
            if (!this.displayAmount || "" === this.activeGasPrice) return this.totalCost = "", void(this.convertedTotalCost = "");
            this.totalCost = "", this.convertedTotalCost = "", this.isSendAll && this.sendAll();
            var e = this.getEthAmount(this.gas, this.activeGasPrice),
              t = e * this.getCurrencyTokenRate,
              a = parseFloat(this.amount),
              r = a * this.getCurrencyTokenRate;
            if (this.contractType === we["CONTRACT_TYPE_ETH"]) this.totalCost = 0 === this.toggle_exclusive ? a + e : r + t;
            else if (this.contractType === we["CONTRACT_TYPE_ERC20"]) {
              var n = 0 === this.toggle_exclusive ? this.selectedItem.symbol : this.selectedCurrency;
              this.totalCost = "".concat(this.displayAmount, " ").concat(n, " + ").concat(Object(Z["significantDigits"])(this.getEthAmount(this.gas, this.activeGasPrice), !1, 5), " ETH")
            }
            this.convertedTotalCost = t + r
          },
          onSelectSpeed: function onSelectSpeed(e) {
            n.a.info("SET DATA: ", e), this.speedSelected = e.speedSelected, this.activeGasPrice = e.activeGasPrice, this.timeTaken = e.speed, this.gas = e.gas, e.isReset && (this.activeGasPrice = "" === this.speedSelected ? "" : this.activeGasPrice, this.calculateGas()), this.updateTotalCost(), this.resetSpeed = !1
          },
          onDecodeQr: function onDecodeQr(e) {
            try {
              var t = new URL(e),
                a = new URLSearchParams(t.search);
              a.has("to") ? (this.selectedVerifier = we["ETH"], this.toAddress = a.get("to")) : (this.toAddress = "", this.qrErrorMsg = "Incorrect QR Code"), this.contactSelected = this.toAddress
            } catch (r) {
              Object(Me["isAddress"])(e) ? (this.selectedVerifier = we["ETH"], this.toAddress = e) : (this.toAddress = "", this.qrErrorMsg = "Incorrect QR Code"), this.contactSelected = this.toAddress
            }
          }
        },
        mounted: function mounted() {
          Object.prototype.hasOwnProperty.call(this.$route.query, "to") ? (this.selectedVerifier = we["ETH"], this.toAddress = this.$route.query.to) : this.toAddress = "", this.contactSelected = this.toAddress;
          this.$watch("collectibles", (function (e, t) {
            e !== t && this.updateFieldsBasedOnRoute()
          }));
          var e = this.$watch("finalBalancesArray", (function (t, a) {
            t !== a && (this.updateFieldsBasedOnRoute(), e())
          }));
          this.updateFieldsBasedOnRoute()
        }
      },
      $n = Xn,
      es = (a("930f"), a("2b5d")),
      ts = a("e0c7"),
      as = Object(l["a"])($n, WalletTransfervue_type_template_id_7310d11d_scoped_true_render, jn, !1, null, "7310d11d", null),
      rs = as.exports;
    u()(as, {
      VBtn: ee["a"],
      VChip: z["a"],
      VCombobox: es["a"],
      VDialog: Be["a"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VList: re["a"],
      VListItem: ne["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VListItemTitle: se["c"],
      VMenu: Yt["a"],
      VSelect: Rt["a"],
      VSpacer: Ue["a"],
      VSubheader: ts["a"],
      VTextField: He["a"]
    });
    var WalletTopupHomevue_type_template_id_469fffe8_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("div", {
          staticClass: "wallet-topup-view"
        }, [a("v-layout", {
          attrs: {
            "mt-3": "",
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: "",
            "mb-2": ""
          }
        }, [a("div", {
          staticClass: "text-black font-weight-bold headline px-4 mb-4"
        }, [e.selectedProvider && !e.$vuetify.breakpoint.xsOnly ? a("span", [e._v(" Purchase Cryptocurrency with your credit card via "), a("span", {
          staticClass: "text-capitalize"
        }, [e._v(e._s(e.selectedProvider))])]) : a("span", [e._v("Select a Provider")])])]), a("TopupProviders", {
          attrs: {
            selectedProvider: e.selectedProvider,
            providers: e.providers
          },
          on: {
            onSelectProvider: function (t) {
              e.selectedProvider = t
            }
          }
        }), e.selectedProvider && e.$vuetify.breakpoint.xsOnly ? a("v-flex", {
          attrs: {
            xs12: "",
            "mb-2": ""
          }
        }, [a("div", {
          staticClass: "text-black font-weight-bold headline px-4 mb-4"
        }, [a("span", [e._v(" Purchase Cryptocurrency with your credit card via "), a("span", {
          staticClass: "text-capitalize"
        }, [e._v(e._s(e.selectedProvider))])])])]) : e._e(), a("v-flex", {
          attrs: {
            xs12: "",
            sm7: "",
            "mb-4": "",
            "px-4": ""
          }
        }, [a("router-view")], 1)], 1)], 1)
      },
      ns = [],
      ss = (a("9911"), function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-flex", {
          staticClass: "topup-providers",
          attrs: {
            xs12: "",
            sm5: "",
            "mb-4": "",
            "px-4": ""
          }
        }, [e._l(e.activeProviders, (function (t) {
          return r("v-card", {
            key: t.name,
            staticClass: "mb-4 topup-provider",
            class: {
              active: e.innerProvider === t.name
            },
            attrs: {
              "data-provider": t.name
            },
            on: {
              click: function (a) {
                e.innerProvider = t.name
              }
            }
          }, [r("router-link", {
            attrs: {
              to: t.link
            }
          }, [r("v-list-item", {
            attrs: {
              "three-line": "",
              id: t.name + "-link"
            }
          }, [r("v-list-item-icon", {
            staticClass: "mr-2 align-self-center"
          }, [e.innerProvider === t.name ? r("v-icon", {
            staticClass: "primary--text"
          }, [e._v("$vuetify.icons.radio_checked")]) : r("v-icon", {
            staticClass: "text_2--text"
          }, [e._v("$vuetify.icons.radio_unchecked")])], 1), r("v-list-item-avatar", {
            staticClass: "align-self-center mr-2",
            attrs: {
              width: e.$vuetify.breakpoint.xsOnly ? 105 : 138,
              height: "100%",
              tile: ""
            }
          }, [r("img", {
            attrs: {
              src: a("17ac")("./" + t.logo)
            }
          })]), r("v-list-item-content", {
            staticClass: "align-self-center text-right caption"
          }, [r("div", [e._v(e._s(t.line1))]), r("div", {
            domProps: {
              innerHTML: e._s(t.line2)
            }
          }), r("div", [e._v(e._s(t.line3))])])], 1)], 1)], 1)
        })), [e._l(e.inactiveProviders, (function (t) {
          return r("v-tooltip", {
            key: t.name,
            attrs: {
              right: ""
            },
            scopedSlots: e._u([{
              key: "activator",
              fn: function (n) {
                var s = n.on;
                return [r("v-card", e._g({
                  staticClass: "topup-provider mb-4 coming-soon",
                  attrs: {
                    "data-provider": t.name
                  }
                }, s), [r("v-list-item", {
                  attrs: {
                    "three-line": ""
                  }
                }, [r("v-list-item-icon", {
                  staticClass: "mr-2 align-self-center"
                }, [r("v-icon", {
                  attrs: {
                    color: "grey"
                  }
                }, [e._v("$vuetify.icons.radio_unchecked")])], 1), r("v-list-item-avatar", {
                  staticClass: "align-self-center mr-2",
                  attrs: {
                    width: e.$vuetify.breakpoint.xsOnly ? 105 : 138,
                    height: "100%",
                    tile: ""
                  }
                }, [r("img", {
                  attrs: {
                    src: a("17ac")("./" + t.logo)
                  }
                })]), r("v-list-item-content", {
                  staticClass: "align-self-center text-right caption"
                }, [r("div", [e._v(e._s(t.line1))]), r("div", {
                  domProps: {
                    innerHTML: e._s(t.line2)
                  }
                }), r("div", [e._v(e._s(t.line3))])])], 1)], 1)]
              }
            }], null, !0)
          }, [r("span", [e._v("Coming Soon")])])
        })), r("div", {
          staticClass: "mt-4 py-4 px-1 text-gray caption"
        }, [r("div", [e._v("Prefer other mode of payment?")]), r("div", [r("a", {
          attrs: {
            href: "mailto:hello@tor.us?Subject=Add%20Payment%20Method",
            target: "_blank"
          }
        }, [e._v("Write to us")]), e._v(" and we would try our best to improve and serve you better ")])])]], 2)
      }),
      os = [],
      is = {
        props: ["selectedProvider", "providers"],
        data: function data() {
          return {
            innerProvider: ""
          }
        },
        computed: {
          activeProviders: function activeProviders() {
            return this.providers.filter((function (e) {
              return e.status === we["ACTIVE"]
            }))
          },
          inactiveProviders: function inactiveProviders() {
            return this.providers.filter((function (e) {
              return e.status === we["INACTIVE"]
            }))
          },
          providersFiltered: function providersFiltered() {
            var e = this;
            return this.providers.filter((function (t) {
              return "" === e.innerProvider || e.innerProvider && e.innerProvider === t.name
            }))
          }
        },
        watch: {
          innerProvider: function innerProvider(e, t) {
            t !== e && this.$emit("onSelectProvider", this.innerProvider)
          },
          selectedProvider: function selectedProvider(e, t) {
            t !== e && (this.innerProvider = e)
          }
        },
        mounted: function mounted() {
          this.innerProvider = this.selectedProvider
        }
      },
      cs = is,
      ls = (a("8cbf"), Object(l["a"])(cs, ss, os, !1, null, "a7c3e2c2", null)),
      ds = ls.exports;
    u()(ls, {
      VCard: te["a"],
      VFlex: P["a"],
      VIcon: W["a"],
      VListItem: ne["a"],
      VListItemAvatar: Vt["a"],
      VListItemContent: se["a"],
      VListItemIcon: oe["a"],
      VTooltip: Ka["a"]
    });
    var us = {
        components: {
          TopupProviders: ds
        },
        data: function data() {
          return {
            selectedProvider: "",
            providers: [{
              name: "simplex",
              logo: "simplex-logo.png",
              line1: "Pay with Credit Card",
              line2: '<span class="font-weight-medium">Simplex Service Fee</span> : 5% or 10 USD',
              line3: "(whichever is higher)",
              link: "/wallet/topup/simplex",
              status: we["ACTIVE"]
            }, {
              name: "moonpay",
              logo: this.$vuetify.theme.dark ? "moon-pay-logo-white.svg" : "moon-pay-logo.svg",
              line1: "Pay with Credit Card",
              line2: '<span class="font-weight-medium">Moonpay Service Fee</span> : 4.5% or 5 USD',
              line3: "(whichever is higher)",
              link: "/wallet/topup/moonpay",
              status: we["ACTIVE"]
            }, {
              name: "wyre",
              logo: this.$vuetify.theme.dark ? "wyre-logo-white.svg" : "wyre-logo.svg",
              line1: "Pay with Debit Card (USA only)",
              line2: '<span class="font-weight-medium">Wyre Service Fee</span> : 2.9% + 30¢',
              line3: "( $40 per day limit )",
              link: "/wallet/topup/wyre",
              status: we["INACTIVE"]
            }, {
              name: "crypto",
              logo: this.$vuetify.theme.dark ? "crypto-logo-white.png" : "crypto-logo.png",
              line1: "Pay with Credit Card",
              line2: '<span class="font-weight-medium">crypto.com Service Fee</span> : Varies',
              line3: "",
              link: "/wallet/topup/crypto",
              status: we["ACTIVE"]
            }]
          }
        },
        created: function created() {
          var e = this.$router.currentRoute.path,
            t = this.providers.find((function (t) {
              return t.link === e
            }));
          this.selectedProvider = t ? t.name : ""
        }
      },
      ps = us,
      gs = Object(l["a"])(ps, WalletTopupHomevue_type_template_id_469fffe8_render, ns, !1, null, null, null),
      fs = gs.exports;
    u()(gs, {
      VFlex: P["a"],
      VLayout: R["a"]
    });
    var WalletTopupMoonpayvue_type_template_id_70a49255_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          staticClass: "wallet-topup-moonpay",
          attrs: {
            wrap: ""
          }
        }, [a("span", [e._v(" Moonpay is a secure way to buy cryptocurrency with your credit card. Start by entering a amount below to get a quote before making a purchase ")]), a("div", {
          staticClass: "mt-4",
          staticStyle: {
            height: "500px",
            width: "100%"
          }
        }, [e.loaded ? a("iframe", {
          staticStyle: {
            border: "none"
          },
          attrs: {
            src: e.url,
            height: "100%",
            width: "100%"
          }
        }) : e._e()])])
      },
      vs = [],
      hs = O["default"].moonpayLiveAPIKEY,
      ms = O["default"].moonpayHost,
      bs = {
        data: function data() {
          return {
            url: "",
            loaded: !1,
            currencyCode: "eth",
            path: ms,
            apiKey: hs,
            redirectURL: ""
          }
        },
        methods: {
          runMoonPaySafariFix: function runMoonPaySafariFix() {
            var e = navigator.userAgent.indexOf("Safari") > -1;
            if (e) {
              var t = navigator.userAgent.indexOf("Chrome") > -1;
              t || document.cookie.match(/^(.*;)?\s*moonpay-fixed\s*=\s*[^;]+(.*)?$/) || (document.cookie = "moonpay-fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/", window.location.replace("https://buy.moonpay.io/safari_fix"))
            }
          }
        },
        mounted: function mounted() {
          this.runMoonPaySafariFix(), this.redirectURL = 'javascript:window.top.location.href="' + window.location.origin + '/wallet/history"';
          var e = "" !== this.$store.state.userInfo.email ? "&email=" + this.$store.state.userInfo.email : "";
          this.url = this.path + "apiKey=" + this.apiKey + "&currencyCode=" + this.currencyCode + "&walletAddress=" + this.$store.state.selectedAddress + e + "&redirectURL=" + this.redirectURL + "&colorCode=" + encodeURIComponent(this.$vuetify.theme.themes.light.primary) + "&externalCustomerId=" + this.$store.state.selectedAddress, this.loaded = !0
        }
      },
      xs = bs,
      ys = Object(l["a"])(xs, WalletTopupMoonpayvue_type_template_id_70a49255_render, vs, !1, null, null, null),
      ws = ys.exports;
    u()(ys, {
      VLayout: R["a"]
    });
    var WalletTopupCryptovue_type_template_id_66ee6dcb_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          staticClass: "wallet-topup-crypto",
          attrs: {
            wrap: ""
          }
        }, [a("span", [e._v(" Crypto.com is a secure way to buy cryptocurrency with your credit card. Start by installing their application ")]), a("div", {
          staticClass: "mt-3 text-right link-container"
        }, [a("a", {
          staticClass: "v-btn v-btn--depressed theme--light v-size--default primary",
          attrs: {
            href: "https://mco.onelink.me/PSQc/torus",
            target: "_blank"
          }
        }, [a("span", {
          staticClass: "v-btn__content"
        }, [e._v("Continue")])])])])
      },
      ks = [],
      Cs = {},
      As = Cs,
      Ts = (a("a2ab"), Object(l["a"])(As, WalletTopupCryptovue_type_template_id_66ee6dcb_scoped_true_render, ks, !1, null, "66ee6dcb", null)),
      _s = Ts.exports;
    u()(Ts, {
      VLayout: R["a"]
    });
    var WalletTopupSimplexvue_type_template_id_0d4c385a_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          r = e._self._c || t;
        return r("v-layout", {
          staticClass: "wallet-topup-simplex",
          attrs: {
            wrap: ""
          }
        }, [r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("p", {
          staticClass: "body-2"
        }, [e._v(" Simplex is a secure way to buy CryptoCurrency with your credit card. Start by entering an amount to get a quote before making your purchase ")])]), r("v-flex", {
          attrs: {
            xs9: ""
          }
        }, [r("v-form", {
          ref: "inputForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (e) {
              e.preventDefault()
            }
          },
          model: {
            value: e.formValid,
            callback: function (t) {
              e.formValid = t
            },
            expression: "formValid"
          }
        }, [r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "subtitle-2"
        }, [e._v("You send")]), r("v-text-field", {
          staticClass: "unique-hint",
          attrs: {
            id: "simplex-you-send",
            placeholder: "0.00 (Min 50.00)",
            outlined: "",
            value: e.fiatValue,
            rules: [e.rules.required, e.rules.validNumber, e.rules.maxValidation, e.rules.minValidation]
          },
          on: {
            input: e.watchFiatValue
          },
          scopedSlots: e._u([{
            key: "append",
            fn: function () {
              return [r("v-btn", {
                attrs: {
                  outlined: "",
                  small: "",
                  color: "primary"
                },
                on: {
                  click: function (t) {
                    return e.watchFiatValue(100)
                  }
                }
              }, [e._v("100")]), r("v-btn", {
                staticClass: "ml-2",
                attrs: {
                  outlined: "",
                  small: "",
                  color: "primary"
                },
                on: {
                  click: function (t) {
                    return e.watchFiatValue(200)
                  }
                }
              }, [e._v("200")]), r("div", {
                staticClass: "primary--text font-weight-medium subtitle-2 pt-1 ml-2"
              }, [e._v(e._s(e.selectedCurrency) + "*")])]
            },
            proxy: !0
          }])
        }), r("div", {
          staticClass: "v-text-field__details torus-hint mb-6"
        }, [r("div", {
          staticClass: "v-messages"
        }, [r("div", {
          staticClass: "v-messages__wrapper"
        }, [r("div", {
          staticClass: "v-messages__message d-flex text_2--text"
        }, [r("v-flex", {
          staticClass: "px-3"
        }, [e._v(" * Includes 5% Simplex Service Fees or 10 USD (whichever higher) "), r("HelpTooltip", {
          attrs: {
            title: "Simplex Service Fee",
            description: "This fee goes entirely to Simplex for their services in credit card processing, mitigation and fraud detection."
          }
        })], 1), r("v-flex", {
          attrs: {
            "grow-shrink-0": ""
          }
        }, [r("span", [e._v("min 50 USD*")])])], 1)])])])], 1), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "subtitle-2"
        }, [e._v("Receive")]), r("v-text-field", {
          attrs: {
            id: "simplex-receive",
            readonly: "",
            placeholder: "0.00",
            suffix: "ETH",
            hint: "Rate : 1 ETH = " + e.displayRateString + " " + e.selectedCurrency,
            "persistent-hint": "",
            outlined: ""
          },
          model: {
            value: e.ethValue,
            callback: function (t) {
              e.ethValue = t
            },
            expression: "ethValue"
          }
        })], 1)], 1)], 1), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "mt-12 mb-6 text_2--text"
        }, [r("div", [r("img", {
          staticClass: "help-icon",
          attrs: {
            src: a("eafa")
          }
        }), r("small", {
          staticClass: "d-inline ml-2"
        }, [e._v("The process would take approximately 10 - 15 mins.")])]), r("div", [r("img", {
          staticClass: "help-icon",
          attrs: {
            src: a("eafa")
          }
        }), r("small", {
          staticClass: "d-inline ml-2"
        }, [e._v("Please prepare your Identity Card/Passport to complete the purchase.")])])])]), r("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [r("div", {
          staticClass: "text-right"
        }, [r("v-tooltip", {
          attrs: {
            bottom: "",
            disabled: e.formValid
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var a = t.on;
              return [r("span", e._g({}, a), [r("v-btn", {
                attrs: {
                  disabled: !e.formValid,
                  depressed: "",
                  color: "primary",
                  type: "submit"
                },
                on: {
                  click: function (t) {
                    return t.preventDefault(), e.sendOrder(t)
                  }
                }
              }, [e._v(" Continue ")])], 1)]
            }
          }])
        }, [r("span", [e._v("Resolve the errors")])]), r("div", {
          staticClass: "caption text_2--text"
        }, [e._v("You will be redirected to Simplex Page")])], 1)])], 1)
      },
      Ss = [],
      Os = a("84a2"),
      Es = a.n(Os),
      Is = 50,
      Ms = 2e4,
      Ps = ["USD", "EUR"],
      Rs = {
        components: {
          HelpTooltip: je["a"]
        },
        data: function data() {
          return {
            fiatValue: 0,
            ethValue: 0,
            currencyRate: 0,
            currentOrder: {},
            formValid: !0,
            rules: {
              required: function required(e) {
                return !!e || "Required"
              },
              validNumber: function validNumber(e) {
                return !isNaN(parseFloat(e)) || "Enter a valid number"
              },
              maxValidation: function maxValidation(e) {
                return parseFloat(e) <= Ms || "Max topup amount is ".concat(Object(Z["formatCurrencyNumber"])(Ms, 0))
              },
              minValidation: function minValidation(e) {
                return parseFloat(e) >= Is || "Min topup amount is ".concat(Is)
              }
            }
          }
        },
        computed: {
          selectedCurrency: function selectedCurrency() {
            return Ps.includes(this.$store.state.selectedCurrency) ? this.$store.state.selectedCurrency : "USD"
          },
          displayRateString: function displayRateString() {
            return 0 !== parseFloat(this.currencyRate) ? Object(Z["significantDigits"])(1 / this.currencyRate) : 0
          }
        },
        methods: {
          significantDigits: Z["significantDigits"],
          watchFiatValue: function watchFiatValue(e) {
            this.fiatValue = e, parseFloat(e) <= 2e4 && parseFloat(e) >= 50 && this.fetchQuote()
          },
          fetchQuote: Es()((function _callee() {
            var e = this;
            return regeneratorRuntime.async((function _callee$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  Ar({
                    digital_currency: "ETH",
                    fiat_currency: this.selectedCurrency,
                    requested_currency: this.selectedCurrency,
                    requested_amount: +parseFloat(this.fiatValue)
                  }).then((function (t) {
                    e.ethValue = t.result.digital_money.amount, e.currencyRate = t.result.digital_money.amount / t.result.fiat_money.total_amount, e.currentOrder = t.result
                  })).catch((function (e) {
                    return n.a.error(e)
                  }));
                case 1:
                case "end":
                  return t.stop()
              }
            }), null, this)
          }), 0),
          post: function post(e, t) {
            var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post",
              r = document.createElement("form");
            for (var n in r.method = a, r.action = e, r.target = "_blank", t)
              if (t.hasOwnProperty(n)) {
                var s = document.createElement("input");
                s.type = "hidden", s.name = n, s.value = t[n], r.appendChild(s)
              } document.body.appendChild(r), r.submit()
          },
          sendOrder: function sendOrder() {
            var e = this;
            this.$refs.inputForm.validate() && Tr({
              "g-recaptcha-response": "",
              account_details: {
                app_end_user_id: this.currentOrder.user_id
              },
              transaction_details: {
                payment_details: {
                  fiat_total_amount: {
                    currency: this.currentOrder.fiat_money.currency,
                    amount: this.currentOrder.fiat_money.total_amount
                  },
                  requested_digital_amount: {
                    currency: this.currentOrder.digital_money.currency,
                    amount: this.currentOrder.digital_money.amount
                  },
                  destination_wallet: {
                    currency: this.currentOrder.digital_money.currency,
                    address: this.$store.state.selectedAddress
                  }
                }
              }
            }).then((function (t) {
              var a = t.result,
                r = a.version,
                n = a.partner,
                s = a.return_url,
                o = a.quote_id,
                i = a.payment_id,
                c = a.user_id,
                l = a.destination_wallet_address,
                d = a.destination_wallet_currency,
                u = a.fiat_total_amount_amount,
                p = a.fiat_total_amount_currency,
                g = a.digital_total_amount_amount,
                f = a.digital_total_amount_currency;
              e.post(t.result.payment_post_url, {
                payment_flow_type: "wallet",
                version: r,
                partner: n,
                return_url: s,
                quote_id: o,
                payment_id: i,
                user_id: c,
                "destination_wallet[address]": l,
                "destination_wallet[currency]": d,
                "fiat_total_amount[amount]": u,
                "fiat_total_amount[currency]": p,
                "digital_total_amount[amount]": g,
                "digital_total_amount[currency]": f
              })
            }))
          }
        },
        mounted: function mounted() {
          this.fiatValue = 50, this.currencyRate = this.$store.state.currencyData[this.selectedCurrency] || 0, this.fetchQuote()
        }
      },
      Ls = Rs,
      js = (a("03c9"), Object(l["a"])(Ls, WalletTopupSimplexvue_type_template_id_0d4c385a_scoped_true_render, Ss, !1, null, "0d4c385a", null)),
      Ds = js.exports;
    u()(js, {
      VBtn: ee["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VLayout: R["a"],
      VTextField: He["a"],
      VTooltip: Ka["a"]
    });
    var Ns, WalletTopupWyrevue_type_template_id_6ff9219d_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          staticClass: "wallet-topup-wyre",
          attrs: {
            wrap: ""
          }
        }, [a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("p", {
          staticClass: "body-2"
        }, [e._v(" Wyre is a secure way to buy cryptocurrency with your debit card. Start by entering an amount to make your purchase ")])]), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("v-form", {
          ref: "inputForm",
          attrs: {
            "lazy-validation": ""
          },
          on: {
            submit: function (e) {
              e.preventDefault()
            }
          },
          model: {
            value: e.formValid,
            callback: function (t) {
              e.formValid = t
            },
            expression: "formValid"
          }
        }, [a("div", {
          staticClass: "subtitle-2"
        }, [e._v("You send")]), a("v-text-field", {
          staticClass: "unique-hint",
          attrs: {
            placeholder: "0.00 (Min 5.00)",
            outlined: "",
            value: e.fiatValue,
            rules: [e.rules.required, e.rules.validNumber, e.rules.maxValidation, e.rules.minValidation]
          },
          on: {
            input: e.watchFiatValue
          },
          scopedSlots: e._u([{
            key: "append",
            fn: function () {
              return [a("v-btn", {
                attrs: {
                  outlined: "",
                  small: "",
                  color: "primary"
                },
                on: {
                  click: function (t) {
                    return e.watchFiatValue(20)
                  }
                }
              }, [e._v("20")]), a("v-btn", {
                staticClass: "ml-2",
                attrs: {
                  outlined: "",
                  small: "",
                  color: "primary"
                },
                on: {
                  click: function (t) {
                    return e.watchFiatValue(40)
                  }
                }
              }, [e._v("40")]), a("div", {
                staticClass: "primary--text font-weight-medium subtitle-2 pt-1 ml-2"
              }, [e._v("USD*")])]
            },
            proxy: !0
          }])
        }), a("div", {
          staticClass: "v-text-field__details torus-hint mb-6"
        }, [a("div", {
          staticClass: "v-messages"
        }, [a("div", {
          staticClass: "v-messages__wrapper"
        }, [a("div", {
          staticClass: "v-messages__message d-flex text_2--text"
        }, [a("v-flex", {
          staticClass: "px-3"
        }, [e._v(" * Includes 2.9% + 30¢ Wyre Service Fees ($40 Limit) "), a("v-tooltip", {
          staticClass: "torus-tooltip",
          attrs: {
            bottom: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("v-icon", e._g({
                attrs: {
                  small: ""
                },
                domProps: {
                  textContent: e._s("$vuetify.icons.question")
                }
              }, r))]
            }
          }])
        }, [a("span", [a("div", {
          staticClass: "primary--text subtitle-2"
        }, [e._v("Wyre Service Fee")]), a("v-divider", {
          staticClass: "my-2"
        }), a("div", {
          staticClass: "body-2"
        }, [e._v(" This fee goes entirely to Wyre for their services in debit card processing, mitigation and fraud detection. ")])], 1)])], 1), a("v-flex", {
          attrs: {
            "grow-shrink-0": ""
          }
        }, [a("span", [e._v("max 40 USD*")])])], 1)])])])], 1)], 1), a("v-flex", {
          attrs: {
            xs12: ""
          }
        }, [a("div", {
          staticClass: "text-right"
        }, [a("v-tooltip", {
          attrs: {
            bottom: "",
            disabled: e.formValid
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("span", e._g({}, r), [a("v-btn", {
                attrs: {
                  disabled: !e.formValid,
                  depressed: "",
                  color: "primary",
                  type: "submit"
                },
                on: {
                  click: function (t) {
                    return t.preventDefault(), e.startWyre(t)
                  }
                }
              }, [e._v(" Continue ")])], 1)]
            }
          }])
        }, [a("span", [e._v("Resolve the errors")])]), a("div", {
          staticClass: "caption text_2--text"
        }, [e._v("You will be shown a widget")])], 1)])], 1)
      },
      Bs = [],
      Vs = (a("ace4"), a("5cc6"), a("9a8c"), a("a975"), a("735e"), a("c1ac"), a("d139"), a("3a7b"), a("d5d6"), a("82f8"), a("e91f"), a("60bd"), a("5f96"), a("3280"), a("3fcc"), a("ca91"), a("25a1"), a("cd26"), a("3c5d"), a("2954"), a("649e"), a("219c"), a("170b"), a("b39a9"), a("72f7"), a("5118")),
      Fs = 40,
      Us = 5,
      Hs = {
        data: function data() {
          return {
            isWyreLoaded: !1,
            fiatValue: 0,
            formValid: !0,
            rules: {
              required: function required(e) {
                return !!e || "Required"
              },
              validNumber: function validNumber(e) {
                return !isNaN(parseFloat(e)) || "Enter a valid number"
              },
              maxValidation: function maxValidation(e) {
                return parseFloat(e) <= Fs || "Max topup amount is ".concat(Object(Z["formatCurrencyNumber"])(Fs, 0))
              },
              minValidation: function minValidation(e) {
                return parseFloat(e) >= Us || "Min topup amount is ".concat(Us)
              }
            }
          }
        },
        methods: {
          watchFiatValue: function watchFiatValue(e) {
            this.fiatValue = e
          },
          startWyre: function startWyre() {
            if (this.$refs.inputForm.validate()) {
              var e;
              if (Object(Z["storageAvailable"])("localStorage") && (e = localStorage.getItem("DEVICE_TOKEN")), !e) {
                var t = new Uint8Array(25);
                window.crypto.getRandomValues(t), e = Array.prototype.map.call(t, (function (e) {
                  return ("00" + e.toString(16)).slice(-2)
                })).join(""), Object(Z["storageAvailable"])("localStorage") && localStorage.setItem("DEVICE_TOKEN", e)
              }
              Ns = new Wyre.Widget({
                env: "test",
                accountId: "AC_L7FFXAJEV4Q",
                auth: {
                  type: "secretKey",
                  secretKey: e
                },
                operation: {
                  type: "debitcard",
                  destCurrency: "ETH",
                  destAmount: this.fiatValue,
                  dest: this.$store.state.selectedAddress
                }
              }), Ns.on("close", (function (e) {
                e.error ? n.a.error("there was a problem: ", e.error) : n.a.error("the customer closed the widget")
              })), Ns.on("complete", (function (e) {
                n.a.info(e, "completed")
              })), Ns.open()
            }
          }
        },
        mounted: function mounted() {
          var e = this,
            t = document.createElement("script");
          t.src = "https://verify.sendwyre.com/js/widget-loader.js", t.type = "text/javascript", t.charset = "utf-8", document.getElementsByTagName("body")[0].appendChild(t);
          var a = Object(Vs["setInterval"])((function () {
            window.Wyre && (e.isWyreLoaded = !0, Object(Vs["clearInterval"])(a))
          }), 1e3)
        }
      },
      Gs = Hs,
      Ks = (a("6e1c"), Object(l["a"])(Gs, WalletTopupWyrevue_type_template_id_6ff9219d_scoped_true_render, Bs, !1, null, "6ff9219d", null)),
      Ys = Ks.exports;
    u()(Ks, {
      VBtn: ee["a"],
      VDivider: Ve["a"],
      VFlex: P["a"],
      VForm: Fe["a"],
      VIcon: W["a"],
      VLayout: R["a"],
      VTextField: He["a"],
      VTooltip: Ka["a"]
    });
    var WalletTopupCoinDirectvue_type_template_id_45a5dbea_scoped_true_render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-layout", {
          attrs: {
            wrap: ""
          }
        }, [a("span", [e._v("Coindirect is the easiest and most trusted place to buy, sell, and convert your cryptocurrency in Singapore.")]), a("div", {
          staticStyle: {
            height: "500px",
            width: "100%"
          }
        }, [e.loaded ? a("iframe", {
          staticStyle: {
            border: "none"
          },
          attrs: {
            src: e.url,
            height: "100%",
            width: "100%"
          }
        }) : e._e()])])
      },
      qs = [],
      zs = O["default"].coindirectTestHost,
      Ws = (O["default"].coindirectLiveHost, O["default"].coindirectTestMerchantID),
      Qs = (O["default"].coindirectLiveMerchantID, {
        data: function data() {
          return {
            url: "",
            loaded: !1,
            currencyCode: "eth",
            path: zs,
            merchantId: Ws,
            redirectURL: ""
          }
        },
        mounted: function mounted() {
          var e = "http://coindirect-api.tor.us/transaction";
          this.url = this.path + "&email=" + this.$store.state.userInfo.email + "&merchantId=" + this.merchantId + "&to=" + this.currencyCode + "&address=" + this.$store.state.selectedAddress + "&url=" + encodeURIComponent(e) + "&colorCode=" + encodeURIComponent(this.$vuetify.theme.themes.light.primary), this.loaded = !0
        }
      }),
      Js = Qs,
      Zs = (a("16a8d"), Object(l["a"])(Js, WalletTopupCoinDirectvue_type_template_id_45a5dbea_scoped_true_render, qs, !1, null, "45a5dbea", null)),
      Xs = Zs.exports;
    u()(Zs, {
      VLayout: R["a"]
    }), s["a"].use(A["a"]);
    var $s = new A["a"]({
      mode: "history",
      base: "/",
      routes: [{
        path: "/",
        name: "login",
        component: Te,
        meta: {
          requiresAuth: !1
        }
      }, {
        path: "/logout",
        name: "logout",
        component: Te,
        meta: {
          requiresAuth: !1
        }
      }, {
        path: "/popup",
        name: "popup",
        component: j,
        meta: {
          requiresAuth: !1
        }
      }, {
        path: "/redirect",
        name: "redirect",
        component: be,
        meta: {
          requiresAuth: !1
        }
      }, {
        path: "/confirm",
        name: "confirm",
        component: Tt
      }, {
        path: "/providerchange",
        name: "providerchange",
        component: ce
      }, {
        path: "/userinforequest",
        name: "userInfoRequest",
        component: ge
      }, {
        path: "/wallet",
        component: ta,
        children: [{
          path: "/",
          name: "walletDefault",
          component: sa,
          redirect: {
            name: "walletHomeMain"
          }
        }, {
          path: "home",
          name: "walletHome",
          component: sa,
          redirect: {
            name: "walletHomeMain"
          },
          children: [{
            path: "",
            name: "walletHomeMain",
            component: qa
          }, {
            path: "collectibles/:address",
            name: "walletHomeCollectible",
            component: $a
          }]
        }, {
          path: "history",
          name: "walletHistory",
          component: Ir
        }, {
          path: "settings",
          name: "walletSettings",
          component: Ln
        }, {
          path: "transfer",
          name: "walletTransfer",
          component: rs
        }, {
          path: "topup",
          name: "walletTopup",
          component: fs,
          children: [{
            path: "simplex",
            name: "walletTopupSimplex",
            component: Ds
          }, {
            path: "moonpay",
            name: "walletTopupMoonpay",
            component: ws
          }, {
            path: "wyre",
            name: "walletTopupWyre",
            component: Ys
          }, {
            path: "crypto",
            name: "walletTopupCrypto",
            component: _s
          }, {
            path: "coindirect",
            name: "walletTopupCoindirect",
            component: Xs
          }]
        }]
      }, {
        path: "*",
        component: Te
      }]
    });

    function hasQueryParams(e) {
      return Object.prototype.hasOwnProperty.call(e.query, "instanceId")
    }
    $s.beforeResolve((function (e, t, a) {
      e.hasOwnProperty("meta") && e.meta.hasOwnProperty("requiresAuth") && !1 === e.meta.requiresAuth ? "logout" === e.name ? a() : !hasQueryParams(e) && hasQueryParams(t) ? a({
        name: e.name,
        query: t.query,
        hash: e.hash,
        params: e.params
      }) : a() : "" === T["a"].state.selectedAddress ? a({
        name: "login",
        query: {
          redirect: e.fullPath
        }
      }) : !hasQueryParams(e) && hasQueryParams(t) ? ("walletTransfer" !== e.name && Object.keys(t.query).forEach((function (e) {
        return "instanceId" === e || delete t.query[e]
      })), a({
        name: e.name,
        query: t.query,
        hash: e.hash,
        params: e.params
      })) : a()
    }));
    var eo = $s;
    n.a.enableAll(), s["a"].config.productionTip = !1;
    var to, ao = "testing";
    switch (ao) {
      case "staging":
        to = "info", n.a.setDefaultLevel(to);
        break;
      case "testing":
        to = "debug", n.a.setDefaultLevel(to);
        break;
      case "development":
        to = "debug", n.a.setDefaultLevel(to);
        break;
      case "production":
        to = "error", n.a.setDefaultLevel(to), n.a.disableAll();
        break;
      default:
        to = "error", n.a.setDefaultLevel(to)
    }
    n.a.info("VUE_APP_TORUS_BUILD_ENV", "testing"), new s["a"]({
      router: eo,
      store: T["a"],
      render: function render(e) {
        return e(f)
      },
      vuetify: m["a"]
    }).$mount("#app")
  },
  "56db": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".activity-table .text-confirmed[data-v-701d052c],.activity-table .text-successful[data-v-701d052c]{color:#2dcc70}.activity-table .text-denied[data-v-701d052c],.activity-table .text-rejected[data-v-701d052c],.activity-table .text-unapproved[data-v-701d052c]{color:#e20d0d}.activity-table .text-pending[data-v-701d052c],.activity-table .text-submitted[data-v-701d052c]{color:#b3c0ce}.activity-table .text-gray[data-v-701d052c]{color:#5c6c7f}.activity-table .v-data-table[data-v-701d052c]  tr>td{cursor:pointer}.activity-table .v-data-table[data-v-701d052c]  tr.v-data-table__expanded__content{box-shadow:none}.activity-table .v-data-table[data-v-701d052c]  .address-col{min-width:150px}.activity-table[data-v-701d052c]  .v-pagination__item,.activity-table[data-v-701d052c]  .v-pagination__navigation{border:0;background:none;color:var(--v-text_1-base);font-weight:500;box-shadow:none;opacity:.7}.activity-table[data-v-701d052c]  .v-pagination__item.primary,.activity-table[data-v-701d052c]  .v-pagination__navigation.primary{background:none;background-color:transparent!important;color:var(--v-primary-base);opacity:1}", ""])
  },
  "56e7": function (e, t, a) {
    var r = a("3355");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("274ba8c8", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "570a": function (e, t, a) {
    "use strict";
    var r = a("9dd1"),
      n = a.n(r);
    n.a
  },
  "58e9": function (e, t, a) {
    e.exports = a.p + "img/BAT_icon.de8f26e7.svg"
  },
  "5ad6": function (e, t, a) {
    "use strict";
    var r = a("5eed"),
      n = a.n(r);
    n.a
  },
  "5b32": function (e, t, a) {
    "use strict";
    var render = function () {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("v-tooltip", {
          attrs: {
            top: ""
          },
          scopedSlots: e._u([{
            key: "activator",
            fn: function (t) {
              var r = t.on;
              return [a("v-icon", e._g({
                attrs: {
                  small: ""
                },
                domProps: {
                  textContent: e._s("$vuetify.icons.question")
                }
              }, r))]
            }
          }])
        }, [a("span", [a("div", {
          staticClass: "primary--text subtitle-2"
        }, [e._v(e._s(e.title))]), a("v-divider", {
          staticClass: "my-2"
        }), e._t("description", [a("div", {
          staticClass: "body-2 text-justify"
        }, [e._v(" " + e._s(e.description) + " ")])])], 2)])
      },
      r = [],
      n = {
        props: ["title", "description"]
      },
      s = n,
      o = (a("5ad6"), a("2877")),
      i = a("6544"),
      c = a.n(i),
      l = a("ce7e"),
      d = a("132d"),
      u = a("3a2f"),
      p = Object(o["a"])(s, render, r, !1, null, "689daab4", null),
      g = p.exports;
    c()(p, {
      VDivider: l["a"],
      VIcon: d["a"],
      VTooltip: u["a"]
    }), a.d(t, "a", (function () {
      return g
    }))
  },
  "5b7d": function (e, t, a) {
    e.exports = a.p + "img/mstile-150x150.809da2c5.png"
  },
  "5c27": function (e, t, a) {
    e.exports = a.p + "img/J8T.f2ee123f.svg"
  },
  "5c2f": function (e, t, a) {
    var r = {
      "./0x.svg": "3f16",
      "./0xbitcoin.svg": "9752",
      "./1st.svg": "adb0",
      "./AST.png": "e0c5",
      "./Aion.png": "d0a0",
      "./BAT_icon.svg": "58e9",
      "./Brickblock.svg": "2864",
      "./CanYa.svg": "170f",
      "./Cpollo.svg": "e996",
      "./CryptoKitties-Kitty-13733.svg": "2328",
      "./DAOstack.png": "e69c",
      "./DAY.png": "dd69",
      "./DGD.png": "6b4c",
      "./Dentacoin.png": "e817",
      "./ENTRP.png": "9e74",
      "./FEATURED.POP_.png": "afe3",
      "./IMP.svg": "2939",
      "./J8T.svg": "5c27",
      "./JETCOIN28.png": "8c98",
      "./JOY.png": "8d97",
      "./MLNSymbol.png": "25b9",
      "./Maecenas.jpg": "f32a",
      "./POA20.png": "7048",
      "./ParetoLogo.png": "88ba",
      "./RChain_logo.svg": "b815",
      "./Rmesh.png": "af19",
      "./SPANK.png": "6a36",
      "./SpendCoin.png": "97b1",
      "./StandardBounties.png": "7771",
      "./XSC_Logo.svg": "a442",
      "./aeternity.svg": "b5aa",
      "./appcoins.png": "ce75",
      "./aragon_isotype.svg": "60a2",
      "./augur_logo.png": "bf32",
      "./bancor.png": "664b",
      "./bcap.svg": "a1a6",
      "./bcpt.svg": "f282",
      "./bee_token.svg": "876a",
      "./bitclave.svg": "46c1",
      "./bitmart.png": "1cbb",
      "./bnb.png": "67fd",
      "./bobsrepair.png": "f43e",
      "./box_token.png": "cea9",
      "./bytom-2-logo-png-transparent.png": "7b9b",
      "./c20.svg": "f1b4",
      "./change.png": "4c4c",
      "./chronobank.png": "e881",
      "./cln.png": "ff81",
      "./coindirect-dark.svg": "f61a",
      "./coindirect.svg": "3290",
      "./crypto-logo.png": "50e1",
      "./dai.svg": "b241",
      "./decentraland.png": "507e",
      "./dether.svg": "d90f",
      "./disciplina.svg": "e358",
      "./divi.svg": "4af8",
      "./dragonglass.svg": "c8b1",
      "./dutyof.care-square.png": "b1b4",
      "./edgeless.jpg": "036a",
      "./edu.svg": "b7a6",
      "./ego_badge.png": "a07b",
      "./ely.png": "855f",
      "./ens.svg": "d67d",
      "./eos-logo.jpeg": "94a0",
      "./eth.svg": "0306",
      "./fun.svg": "ea58",
      "./gee-icon.svg": "cdf2",
      "./gladius.svg": "a3ab",
      "./gnosis.svg": "21ca",
      "./goldx.png": "72f8",
      "./golem.svg": "a6c8",
      "./groo.png": "274e",
      "./guppy.png": "401e",
      "./havven.png": "12f0",
      "./havven_nusd.png": "4c22",
      "./herocoin_logo.png": "06f1",
      "./hg_gbt.png": "6907",
      "./hgt.png": "0e70",
      "./hydro.png": "3735",
      "./icon-icx-logo.png": "acf3",
      "./iconomi.png": "98b6",
      "./indorseLogo.jpg": "982a",
      "./ink_protocol.svg": "6f95",
      "./iost.png": "714b",
      "./iqeon.svg": "1805",
      "./knownorigin.svg": "f93b",
      "./kucoin.svg": "b676",
      "./kyber.svg": "4e44",
      "./lend.svg": "1a3e",
      "./like.svg": "a345",
      "./logo-maker-4.svg": "af1f",
      "./loom.svg": "ac9c",
      "./lun.png": "cb13",
      "./metamark.svg": "7c92",
      "./mithril-featured.png": "8191",
      "./modum.svg": "ed34",
      "./nanjcoin.svg": "ebed",
      "./ndc.png": "765c",
      "./neeo.png": "b3d3",
      "./nfticon.png": "0960",
      "./omg.jpg": "92fb",
      "./onlive.svg": "2e86",
      "./pax.svg": "b2f7",
      "./pinakion.svg": "7825",
      "./plat.png": "fd72",
      "./playkey.svg": "c004",
      "./plutus-god.svg": "cdb3",
      "./polyswarm_nectar.svg": "4111",
      "./qtum_28.png": "9777",
      "./quant-network.svg": "bc0f",
      "./rchain.png": "c27b",
      "./redcab.png": "440d",
      "./ren.svg": "922d",
      "./request-network.png": "c7e3",
      "./rfr.svg": "11a2",
      "./rivetz.png": "a3ed",
      "./rlc.svg": "9ea8",
      "./rock2.png": "146f",
      "./santiment.svg": "be5c",
      "./singulardtv.svg": "fd99",
      "./snt.svg": "e239",
      "./spectiv.svg": "21af",
      "./spn.svg": "8136",
      "./starbase.png": "dc3d",
      "./stasis-eurs.svg": "2d00",
      "./storj.jpg": "eb38",
      "./streamr.svg": "e125",
      "./swarm.svg": "6866",
      "./swt.jpg": "ffad",
      "./synthetix.svg": "233c",
      "./synthetix_susd.svg": "3844",
      "./taas-ico.png": "1982",
      "./tkn.svg": "bc4d",
      "./too-real.jpg": "6d04",
      "./tpt.png": "f3c2",
      "./trustcoin.jpg": "cb40",
      "./tusd.png": "13b2",
      "./vechain.png": "cd1b",
      "./viewly.svg": "2cb2",
      "./vslice.png": "787f",
      "./waltonchain.png": "e922",
      "./weth.png": "974a",
      "./wings_logo.svg": "7283",
      "./wyvern-logo.svg": "66de",
      "./xaurum_logo.svg": "698c",
      "./yggdrash.svg": "3d15",
      "./zilliqa.svg": "fb36"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "5c2f"
  },
  "5c3a": function (e, t, a) {
    e.exports = a.p + "img/import-grey.fbe0067e.svg"
  },
  "5c64": function (e, t, a) {
    "use strict";
    var r = a("a63e"),
      n = a.n(r);
    n.a
  },
  "5dc1": function (e, t, a) {
    var r = a("ffcc");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("a64b4626", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "5e5c": function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "get", (function () {
      return get
    })), a.d(t, "post", (function () {
      return post
    })), a.d(t, "patch", (function () {
      return patch
    })), a.d(t, "remove", (function () {
      return remove
    })), a.d(t, "generateJsonRPCObject", (function () {
      return generateJsonRPCObject
    })), a.d(t, "promiseRace", (function () {
      return promiseRace
    }));
    a("a4d3"), a("4de4"), a("4160"), a("e439"), a("dbb4"), a("b64b"), a("d3b7"), a("3ca3"), a("159b"), a("ddb0");
    var r = a("2fa7");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }

    function post() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = {
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(t)
        },
        n = _objectSpread({}, r, {}, a, {}, {
          method: "POST"
        });
      return fetch(e, n).then((function (e) {
        if (e.ok) return e.json();
        throw new Error("Could not connect", e)
      }))
    }

    function remove() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = (arguments.length > 1 && void 0 !== arguments[1] && arguments[1], arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}),
        a = {
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        },
        r = _objectSpread({}, a, {}, t, {}, {
          method: "DELETE"
        });
      return fetch(e, r).then((function (e) {
        if (e.ok) return e.json();
        throw new Error("Could not connect", e)
      }))
    }

    function get() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        a = {
          mode: "cors",
          cache: "no-cache"
        },
        r = _objectSpread({}, a, {}, t, {}, {
          method: "GET"
        });
      return fetch(e, r).then((function (e) {
        if (e.ok) return e.json();
        throw new Error("Could not connect", e)
      }))
    }

    function patch() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = {
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(t)
        },
        n = _objectSpread({}, r, {}, a, {}, {
          method: "PATCH"
        });
      return fetch(e, n).then((function (e) {
        if (e.ok) return e.json();
        throw new Error("Could not connect", e)
      }))
    }

    function generateJsonRPCObject(e, t) {
      return {
        jsonrpc: "2.0",
        method: e,
        id: 10,
        params: t
      }
    }

    function promiseRace(e, t, a, r) {
      return Promise.race([get(e, t), new Promise((function (e, t) {
        setTimeout((function () {
          t(new Error("timeout"))
        }), a)
      }))])
    }
  },
  "5e6f": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".holder{position:relative}.holder .circle{box-sizing:content-box;border-radius:100% 100% 0 0;position:absolute;bottom:0;left:50%;transform:translateX(-50%);transform-origin:bottom center}.holder .circle:first-child{background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000000;animation:circle-1 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-1{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-1turn)}}.holder .circle:nth-child(2){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000001;animation:circle-2 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-2{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-2turn)}}.holder .circle:nth-child(3){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000002;animation:circle-3 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-3{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-3turn)}}.holder .circle:nth-child(4){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000003;animation:circle-4 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-4{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-4turn)}}.holder .circle:nth-child(5){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000004;animation:circle-5 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-5{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-5turn)}}.holder .circle:nth-child(6){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000005;animation:circle-6 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-6{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-6turn)}}.holder .circle:nth-child(7){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000006;animation:circle-7 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-7{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-7turn)}}.holder .circle:nth-child(8){background:#eff6ff;border-bottom:none;border-radius:25px 25px 0 0;width:25px;height:12.5px;z-index:-1000007;animation:circle-8 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-8{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-8turn)}}.holder .circle:nth-child(9){border:17px solid #dfeafe;border-bottom:none;border-radius:329px 329px 0 0;width:329px;height:164.5px;z-index:-1000008;animation:circle-9 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-9{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-9turn)}}.holder .circle:nth-child(10){border:17px solid #dfeafe;border-bottom:none;border-radius:376px 376px 0 0;width:376px;height:188px;z-index:-1000009;animation:circle-10 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-10{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-10turn)}}.holder .circle:nth-child(11){border:17px solid #dfeafe;border-bottom:none;border-radius:423px 423px 0 0;width:423px;height:211.5px;z-index:-1000010;animation:circle-11 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-11{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-11turn)}}.holder .circle:nth-child(12){border:17px solid #dfeafe;border-bottom:none;border-radius:470px 470px 0 0;width:470px;height:235px;z-index:-1000011;animation:circle-12 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-12{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-12turn)}}.holder .circle:nth-child(13){border:17px solid #dfeafe;border-bottom:none;border-radius:517px 517px 0 0;width:517px;height:258.5px;z-index:-1000012;animation:circle-13 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-13{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-13turn)}}.holder .circle:nth-child(14){border:17px solid #dfeafe;border-bottom:none;border-radius:564px 564px 0 0;width:564px;height:282px;z-index:-1000013;animation:circle-14 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-14{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-14turn)}}.holder .circle:nth-child(15){border:17px solid #dfeafe;border-bottom:none;border-radius:611px 611px 0 0;width:611px;height:305.5px;z-index:-1000014;animation:circle-15 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-15{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-15turn)}}.holder .circle:nth-child(16){border:17px solid #dfeafe;border-bottom:none;border-radius:658px 658px 0 0;width:658px;height:329px;z-index:-1000015;animation:circle-16 100s ease-in-out infinite;animation-delay:-20s}@keyframes circle-16{0%{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(-16turn)}}", ""])
  },
  "5eed": function (e, t, a) {
    var r = a("fbdc");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("1611cb66", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "5f1f": function (e, t, a) {
    "use strict";
    a.r(t);
    a("a4d3"), a("4de4"), a("c740"), a("4160"), a("caad"), a("d81d"), a("e439"), a("dbb4"), a("b64b"), a("d3b7"), a("acd8"), a("2532"), a("159b");
    var r = a("2fa7"),
      n = (a("96cf"), a("9f12")),
      s = a("53fe");

    function ownKeys(e, t) {
      var a = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter((function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable
        }))), a.push.apply(a, r)
      }
      return a
    }

    function _objectSpread(e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = null != arguments[t] ? arguments[t] : {};
        t % 2 ? ownKeys(a, !0).forEach((function (t) {
          Object(r["a"])(e, t, a[t])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
        }))
      }
      return e
    }
    var o = a("4879"),
      i = a("0172"),
      c = a("5c7d"),
      l = c.warn,
      d = a("c897"),
      u = a("b00c"),
      p = u.MAINNET,
      g = a("1131"),
      f = g.toHex,
      v = 18e4,
      h = a("5f81"),
      m = "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
      b = function () {
        function DetectTokensController() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = e.interval,
            a = void 0 === t ? v : t,
            r = e.network,
            s = e.provider;
          Object(n["a"])(this, DetectTokensController), this.interval = a, this.network = r, this.detectedTokensStore = new d({
            tokens: []
          }), this._provider = s, this.web3 = new o(this._provider), this.selectedAddress = ""
        }
        return Object(s["a"])(DetectTokensController, [{
          key: "detectNewTokens",
          value: function detectNewTokens() {
            var e, t, a, r, n, s = this;
            return regeneratorRuntime.async((function detectNewTokens$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  if (this.network.store.getState().provider.type === p && "" !== this.selectedAddress) {
                    o.next = 2;
                    break
                  }
                  return o.abrupt("return");
                case 2:
                  for (a in e = this.detectedTokensStore.getState().tokens.map((function (e) {
                      return e.tokenAddress.toLowerCase()
                    })), t = [], i) i[a].erc20 && !e.includes(a.toLowerCase()) && t.push(a);
                  t.length > 0 && (r = this.web3, n = new r.eth.Contract(h, m), n.methods.balances([this.selectedAddress], t).call({
                    from: this.selectedAddress
                  }, (function (e, a) {
                    if (e) l("MetaMask - DetectTokensController single call balance fetch failed", e);
                    else {
                      var r = [];
                      t.forEach((function (e, t) {
                        var n = f(a[t]);
                        n && "0x0" !== n && r.push(_objectSpread({}, i[e], {
                          tokenAddress: e,
                          balance: n
                        }))
                      })), r.length > 0 && s.detectedTokensStore.putState({
                        tokens: r
                      })
                    }
                  })));
                case 6:
                case "end":
                  return o.stop()
              }
            }), null, this)
          }
        }, {
          key: "detectEtherscanTokenBalance",
          value: function detectEtherscanTokenBalance(e) {
            var t, a, r, n = arguments;
            return regeneratorRuntime.async((function detectEtherscanTokenBalance$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  t = n.length > 1 && void 0 !== n[1] ? n[1] : {}, a = this.detectedTokensStore.getState().tokens, r = a.findIndex((function (t) {
                    return t.tokenAddress.toLowerCase() === e.toLowerCase()
                  })), -1 === r && (a.push(_objectSpread({}, t, {
                    tokenAddress: e,
                    balance: f(parseFloat(t.balance) * Math.pow(10, t.decimals))
                  })), this.detectedTokensStore.putState({
                    tokens: a
                  }));
                case 4:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "refreshTokenBalances",
          value: function refreshTokenBalances() {
            var e, t, a, r, n = this;
            return regeneratorRuntime.async((function refreshTokenBalances$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  if (this.network.store.getState().provider.type === p && "" !== this.selectedAddress) {
                    s.next = 2;
                    break
                  }
                  return s.abrupt("return");
                case 2:
                  e = this.detectedTokensStore.getState().tokens, t = e.map((function (e) {
                    return e.tokenAddress
                  })), t.length > 0 && (a = this.web3, r = new a.eth.Contract(h, m), r.methods.balances([this.selectedAddress], t).call({
                    from: this.selectedAddress
                  }, (function (a, r) {
                    if (a) l("MetaMask - DetectTokensController single call balance fetch failed", a);
                    else {
                      var s = [];
                      t.forEach((function (t, a) {
                        var n = f(r[a]);
                        n && "0x0" !== n && s.push(_objectSpread({}, e[a], {
                          balance: n
                        }))
                      })), s.length > 0 && n.detectedTokensStore.putState({
                        tokens: s
                      })
                    }
                  })));
                case 5:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "restartTokenDetection",
          value: function restartTokenDetection() {
            this.selectedAddress && (this.detectNewTokens(), this.interval = v)
          }
        }, {
          key: "startTokenDetection",
          value: function startTokenDetection(e) {
            this.selectedAddress = e, this.restartTokenDetection()
          }
        }, {
          key: "interval",
          set: function set(e) {
            var t = this;
            this._handle && clearInterval(this._handle), e && (this._handle = setInterval((function () {
              t.detectNewTokens(), t.refreshTokenBalances()
            }), e))
          }
        }]), DetectTokensController
      }();
    t["default"] = b
  },
  "5ffc": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, "[data-v-0058507e] .button-speed.v-btn{height:inherit;border:1px solid var(--v-text_2-lighten3);color:var(--v-text_2-base)}[data-v-0058507e] .button-speed.v-btn.selected{border:1px solid var(--v-primary-base);color:var(--v-primary-base)}[data-v-0058507e] .button-speed .v-btn__content{flex-direction:column;padding:12px 0;line-height:1em}[data-v-0058507e] .theme--dark.button-speed.v-btn{border:1px solid var(--v-text_2-base);color:var(--v-text_2-base)}[data-v-0058507e] .theme--dark.button-speed.v-btn.selected{border:1px solid var(--v-text_1-base);color:var(--v-text_1-base)}.advance-option[data-v-0058507e]{cursor:pointer}", ""])
  },
  6: function (e, t) {},
  "60a2": function (e, t, a) {
    e.exports = a.p + "img/aragon_isotype.d7aa48aa.svg"
  },
  "643f": function (e, t, a) {
    var r = {
      "./account-balance.svg": "3eb7",
      "./activities.svg": "d338",
      "./android-chrome-192x192.png": "43b0",
      "./android-chrome-512x512.png": "ba42",
      "./apple-touch-icon-120x120.png": "a4e8f",
      "./apple-touch-icon-152x152.png": "69eb",
      "./apple-touch-icon-180x180.png": "d5be",
      "./apple-touch-icon-60x60.png": "85fc",
      "./apple-touch-icon-76x76.png": "1086",
      "./apple-touch-icon.png": "1ccc",
      "./check-circle-primary.svg": "75ea",
      "./check-circle-white.svg": "a49d",
      "./close.svg": "9e49",
      "./copy-primary.svg": "eff6",
      "./discord.svg": "4c95",
      "./download-primary.svg": "790f",
      "./error-circle.svg": "8c92",
      "./eye-grey.svg": "815b",
      "./eye-off-primary.svg": "1a30",
      "./eye-primary.svg": "7777",
      "./facebook.svg": "4ef4",
      "./favicon-16x16.png": "058f",
      "./favicon-32x32.png": "730b",
      "./file-text-grey.svg": "23c2",
      "./globe.svg": "a885",
      "./google.svg": "8d7b",
      "./home.svg": "e80f",
      "./import-grey.svg": "5c3a",
      "./indent-increase.svg": "7d8f",
      "./info-circle.svg": "eafa",
      "./info-grey.svg": "8b0a",
      "./key-large.svg": "9d6e",
      "./key.svg": "bc13",
      "./list.svg": "ffb1",
      "./lock.svg": "e439a",
      "./menu-primary.svg": "3ecf",
      "./money.svg": "7c3b",
      "./msapplication-icon-144x144.png": "647c",
      "./mstile-150x150.png": "5b7d",
      "./network.svg": "3488",
      "./open-in-new-grey.svg": "94ce",
      "./password.svg": "3da9",
      "./reddit.svg": "0676",
      "./safari-pinned-tab.svg": "7dc5",
      "./server.svg": "2798",
      "./settings.svg": "b0dc",
      "./t-fill.svg": "af40",
      "./t.svg": "ca5f",
      "./tag.svg": "e3e8",
      "./topup.svg": "0341",
      "./torus-icon-dark.svg": "2068",
      "./torus-icon-light.svg": "4ea4",
      "./transaction.svg": "d324",
      "./twitch.svg": "43e5",
      "./wallet.svg": "2291"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "643f"
  },
  6477: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-chip.network-chip[data-v-1cef0512]{height:20px;background:#ffe9b3}.v-chip.network-chip.network-chip--mainnet[data-v-1cef0512]{background:#cde0ff}.v-chip.network-chip.network-chip--rinkeby[data-v-1cef0512]{background:#caf1fe}.v-chip.network-chip.network-chip--kovan[data-v-1cef0512]{background:#b7f7e9}.v-chip.network-chip.network-chip--ropsten[data-v-1cef0512]{background:#ffd9f8}.v-chip.network-chip.network-chip--goerli[data-v-1cef0512]{background:#ffe1d4}.v-chip.network-chip.network-chip--rpc[data-v-1cef0512]{background:#c8f8c1}.v-chip.network-chip.network-chip--matic[data-v-1cef0512]{background:#efe2ff}", ""])
  },
  "647c": function (e, t, a) {
    e.exports = a.p + "img/msapplication-icon-144x144.619804bc.png"
  },
  "65fc": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-dapp-permission .btn-cancel{box-shadow:none}.wallet-dapp-permission .title-container{display:flex;align-items:center;justify-content:space-between}.wallet-dapp-permission .title-container .title{max-width:70%}.wallet-dapp-permission .text{font-size:1rem;line-height:20px;font-weight:400}.wallet-dapp-permission .chevron-icon{transition:.2s ease}.wallet-dapp-permission .icon-button{background-color:transparent;box-shadow:none!important;height:auto!important}.wallet-dapp-permission .custom-text-input{font-size:.7rem}.wallet-dapp-permission .custom-text-input .v-input__slot{background:transparent!important;box-shadow:none!important;border:1px solid #d3d5e2!important}.wallet-dapp-permission .other-input{display:flex;align-items:center}.wallet-dapp-permission .other-input .max-transaction-input,.wallet-dapp-permission .other-input .max-transaction-input label,.wallet-dapp-permission .section-note{font-size:.7rem}.wallet-dapp-permission .text-gray{color:#5c6c7f}.wallet-dapp-permission .save-container{display:flex;align-items:center;justify-content:flex-end}", ""])
  },
  "664b": function (e, t, a) {
    e.exports = a.p + "img/bancor.d3917c5e.png"
  },
  6696: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".advance-option .form-selector[data-v-32b8e0da]{display:inline-flex;display:flex}.advance-option .form-selector .v-select__selection[data-v-32b8e0da]{margin:0}.advance-option .form-selector .v-input__slot[data-v-32b8e0da]:before{border:0}.advance-option .form-selector.v-text-field .v-input__append-inner[data-v-32b8e0da]{margin-top:3px}.advance-option[data-v-32b8e0da]  .v-messages{text-align:right}", ""])
  },
  "66de": function (e, t, a) {
    e.exports = a.p + "img/wyvern-logo.7616cc12.svg"
  },
  "67fd": function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  6866: function (e, t, a) {
    e.exports = a.p + "img/swarm.16691a5f.svg"
  },
  6907: function (e, t, a) {
    e.exports = a.p + "img/hg_gbt.935f38d7.png"
  },
  "698c": function (e, t, a) {
    e.exports = a.p + "img/xaurum_logo.16749625.svg"
  },
  "69eb": function (e, t, a) {
    e.exports = a.p + "img/apple-touch-icon-152x152.6b73f62c.png"
  },
  "6a36": function (e, t, a) {
    e.exports = a.p + "img/SPANK.d37b4e90.png"
  },
  "6b4c": function (e, t, a) {
    e.exports = a.p + "img/DGD.a0919881.png"
  },
  "6c44": function (e, t, a) {
    var r = a("5e6f");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("2fb261f9", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "6d04": function (e, t, a) {
    e.exports = a.p + "img/too-real.845d44e2.jpg"
  },
  "6d70": function (e, t, a) {
    var r = a("6d9b");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("38cbc3ea", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "6d9b": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-card__text[data-v-2b6c7bcd]{padding:12px}.card-upper-icon[data-v-2b6c7bcd]{position:absolute;top:8px;right:8px;width:12px;height:12px}.v-divider[data-v-2b6c7bcd]{margin:0 0 12px}.key-item[data-v-2b6c7bcd]{max-width:200px;word-break:break-all;line-height:1em;margin-top:2px}.dialog-launcher[data-v-2b6c7bcd]{cursor:pointer}.note-list .v-list-item[data-v-2b6c7bcd]{min-height:inherit}.theme--dark.v-sheet[data-v-2b6c7bcd],.theme--light.v-sheet[data-v-2b6c7bcd]{background:transparent}", ""])
  },
  "6e1c": function (e, t, a) {
    "use strict";
    var r = a("8f6d"),
      n = a.n(r);
    n.a
  },
  "6e56": function (e, t, a) {
    var r = a("6477");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("0539ae14", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "6ec5": function (e, t, a) {
    "use strict";
    a.r(t),
      function (e) {
        a.d(t, "default", (function () {
          return p
        }));
        a("99af"), a("4de4"), a("7db0"), a("c740"), a("13d5"), a("fb6a"), a("0d03"), a("b64b"), a("d3b7");
        var r = a("9f12"),
          n = a("53fe"),
          s = a("8b83"),
          o = a("c65a"),
          i = a("c03e"),
          c = a("faa1"),
          l = a("c897"),
          d = a("b671"),
          u = a("d177").default,
          p = function (e) {
            function MessageManager(e) {
              var t;
              return Object(r["a"])(this, MessageManager), t = Object(s["a"])(this, Object(o["a"])(MessageManager).call(this)), t.store = new l({
                unapprovedMsgs: {},
                unapprovedMsgCount: 0
              }), t.messages = [], t
            }
            return Object(i["a"])(MessageManager, e), Object(n["a"])(MessageManager, [{
              key: "getUnapprovedMsgs",
              value: function getUnapprovedMsgs() {
                return this.messages.filter((function (e) {
                  return "unapproved" === e.status
                })).reduce((function (e, t) {
                  return e[t.id] = t, e
                }), {})
              }
            }, {
              key: "addUnapprovedMessageAsync",
              value: function addUnapprovedMessageAsync(e, t) {
                var a = this;
                return new Promise((function (r, n) {
                  var s = a.addUnapprovedMessage(e, t);
                  a.once("".concat(s, ":finished"), (function (t) {
                    switch (t.status) {
                      case "signed":
                        return r(t.rawSig);
                      case "rejected":
                        return n(new Error("MetaMask Message Signature: User denied message signature."));
                      default:
                        return n(new Error("MetaMask Message Signature: Unknown problem: ".concat(JSON.stringify(e))))
                    }
                  }))
                }))
              }
            }, {
              key: "addUnapprovedMessage",
              value: function addUnapprovedMessage(e, t) {
                t && (e.origin = t.origin), e.data = normalizeMsgData(e.data);
                var a = (new Date).getTime(),
                  r = u(),
                  n = {
                    id: r,
                    msgParams: e,
                    time: a,
                    status: "unapproved",
                    type: "eth_sign"
                  };
                return this.addMsg(n), this.emit("update"), r
              }
            }, {
              key: "addMsg",
              value: function addMsg(e) {
                this.messages.push(e), this._saveMsgList()
              }
            }, {
              key: "getMsg",
              value: function getMsg(e) {
                return this.messages.find((function (t) {
                  return t.id === e
                }))
              }
            }, {
              key: "approveMessage",
              value: function approveMessage(e) {
                return this.setMsgStatusApproved(e.metamaskId), this.prepMsgForSigning(e)
              }
            }, {
              key: "setMsgStatusApproved",
              value: function setMsgStatusApproved(e) {
                this._setMsgStatus(e, "approved")
              }
            }, {
              key: "setMsgStatusSigned",
              value: function setMsgStatusSigned(e, t) {
                var a = this.getMsg(e);
                a.rawSig = t, this._updateMsg(a), this._setMsgStatus(e, "signed")
              }
            }, {
              key: "prepMsgForSigning",
              value: function prepMsgForSigning(e) {
                return delete e.metamaskId, Promise.resolve(e)
              }
            }, {
              key: "rejectMsg",
              value: function rejectMsg(e) {
                this._setMsgStatus(e, "rejected")
              }
            }, {
              key: "_setMsgStatus",
              value: function _setMsgStatus(e, t) {
                var a = this.getMsg(e);
                if (!a) throw new Error('MessageManager - Message not found for id: "'.concat(e, '".'));
                a.status = t, this._updateMsg(a), this.emit("".concat(e, ":").concat(t), a), "rejected" !== t && "signed" !== t || this.emit("".concat(e, ":finished"), a)
              }
            }, {
              key: "_updateMsg",
              value: function _updateMsg(e) {
                var t = this.messages.findIndex((function (t) {
                  return t.id === e.id
                })); - 1 !== t && (this.messages[t] = e), this._saveMsgList()
              }
            }, {
              key: "_saveMsgList",
              value: function _saveMsgList() {
                var e = this.getUnapprovedMsgs(),
                  t = Object.keys(e).length;
                this.store.updateState({
                  unapprovedMsgs: e,
                  unapprovedMsgCount: t
                }), this.emit("updateBadge")
              }
            }, {
              key: "unapprovedMsgCount",
              get: function get() {
                return Object.keys(this.getUnapprovedMsgs()).length
              }
            }]), MessageManager
          }(c);

        function normalizeMsgData(t) {
          return "0x" === t.slice(0, 2) ? t : d.bufferToHex(e.from(t, "utf8"))
        }
      }.call(this, a("1c35").Buffer)
  },
  "6f95": function (e, t, a) {
    e.exports = a.p + "img/ink_protocol.69aae2d3.svg"
  },
  "6f9e": function (e, t, a) {
    e.exports = a.p + "img/crypto-logo.01b907a2.png"
  },
  7: function (e, t) {},
  7048: function (e, t, a) {
    e.exports = a.p + "img/POA20.acf03fbb.png"
  },
  7134: function (e, t, a) {
    "use strict";
    var r, n = a("2fa7"),
      s = {
        background_body_1: "#ffffff",
        background_body_2: "#ffffff",
        background: "#9E9E9E",
        text_1: "#0F1222",
        text_2: "#5C6C7F",
        primary: "#0364FF",
        success: "#2dcc70",
        error: "#e20d0d",
        disabled: "#eef2f4"
      },
      o = {
        background_body_1: "#242529",
        background_body_2: "#242529",
        background: "#2F3136",
        text_1: "#D3D3D4",
        text_2: "#7F8186",
        primary: "#0364FF",
        success: "#2dcc70",
        error: "#e20d0d",
        disabled: "#403F43"
      },
      i = a("b00c");
    t["a"] = (r = {}, Object(n["a"])(r, i["THEME_LIGHT_BLUE_NAME"], {
      label: "Light",
      name: i["THEME_LIGHT_BLUE_NAME"],
      theme: s,
      isDark: !1
    }), Object(n["a"])(r, i["THEME_DARK_BLACK_NAME"], {
      label: "Dark",
      name: i["THEME_DARK_BLACK_NAME"],
      theme: o,
      isDark: !0
    }), r)
  },
  "714b": function (e, t, a) {
    e.exports = a.p + "img/iost.e8a0f0ed.png"
  },
  7283: function (e, t, a) {
    e.exports = a.p + "img/wings_logo.1792566b.svg"
  },
  "72f8": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABB1JREFUeNrMV1tPE1EQnoXSguiCVVGurXiBolF4siaKaLwlxkiCiYIa4BcAP8BLou/SPyCiSfFBYr0jqEE0EZ9oiBY1UkqBAioFKlQFtM7sdpdtu213UaMnOd3TPbvzfTNnzndmGVDRBm3GMroGAvTDXwMBZnEM/P2NJwY6ldpklDzkvmM0ouEmBFFEAMedEGBqN1U6XfFsJ8R7YOiuoRxN9uCwTEWw6Nme99b88iVHYPieIR0v59Gbegh6ynmuLAL4wwTn4Sr+ayg45ZxSTGDkvqEY321CY8WLYEsmQM2O19rC00573CUYeWCoR1oU8uLwueTVZkjQsNHXM4mFlDVmuSmy1fP2en59TAKeh4ZbDAOXowHokEDGrhYOKMKQloXsMiukZOyIteSX+67l35Il4GnLI5Zxk0abVgRrkQQjIUHgWXusoE0vUpKg5X3NG4ojCOBKVitNcSKxbjcfCeqZpYrBIZgmIpZGykyNKHEkSls4a2rAJVgNYgRGH3HhN6qxMOO+Cd7eizDRewlmBlvVEjA6rvLLoJHzXqc3gxa7sK34uDGQxJpg+q2FA1+YHRa34beP3eB9Y4EVhgouGvotdeLCClvXP9YN/vFX4VGwCwSOSWfmfQ5gTecQMDS00+8s2BtFo9JGhLwOC+iL6kC/tS5k7vtkH3j7msJfIcwLzFh7nhENDghiIwgNk8jCavONEBKejt2w4Oc916TkQErmQW7s93TA/MwwFyzNshwwHOkKAR96XAU/5nyR4gWwPiFa8v1c8MHn7pNcNKjNDt3kwCEIkrnvPui3nYVV289C9v57oEnNESPxZaBVBB9+UgU/531Rk5EIRN1+9OKnlzyJ2aHFRFuGnkvFiMapWQfE/z5XK3yfQvCnQc+j78fqBPjHjQg0x9L2NTv5PEjNrRDv+0fbQ8JK41nMA6GxxgrQpZsgZ58VErVsrLO4+d8n4bqDbqpaQo5JOvHCwaml5h1f3HZIxPfhCvYmLvGk3odoykoT5O63yh1g9i01/S5BB25Lj18C/jbeDl+xS4VIi0KUVlAvCpG00S4QhMj72hIhRMlIJEyIbosFCSfFAeiRLoG06BCWh0XwtII6UYpJguk+AS838J5PoiJOEIHQgkSuiCkpqunnlTDzkNs+2pbnUnMeLMfloANpiYeRi8DDCxKbGgtz0w4Y66qE0a4qmJtyqCVgi6gHAjG2oyz480pu+1FXS4KRYIkEsg677UqiQODjLyohINUB3GKeZ4pJ2EzV/faoVTFXlGLtJpeEulVmDuTHvE+2KqYyTYd54cfjOUoSNhSecTb+32U5tewjg3Y0tBeHjX9A7snGXjlwRd+G9GmG7DEaTLrKCEyR15urnLbf+jbMPTqIBpgSHHaq8JqeLYkHrvjr+G9+nv8SYADJKodF/IIN0gAAAABJRU5ErkJggg=="
  },
  "730b": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAAGVn0euAAAAAXNSR0IArs4c6QAABKNJREFUeAHtnL+LVEkQx7vf7Dqjh5hooIIKhl5gooKZBnJcqDujgYFcNO5wXnZg4o9UEASZWQxkWe5A3RVDAwUDAxU18f4AvQuOC0Q8VJw3izNtPbWh35vqnpne3Vp1vgvL667q6qr+VE/P+9HzlPr6/6aabWP/s2inmmnqRp24Fb5syrzckboeHPGn4hAe8iYrb5D3hxpPQLviLMNu/WZjrf71tilf/ll3rHzCFrhj1sF/Lz7NvVzHfW0xl/qQQLDcBIJTsDjXXefZvHf1Wd3V2/LIi5g1zI5a6bZb58qsV66hG22m90VctF3SCIqdcfVv3wE3KshAAASWmUBwsSsucNa3XeimWu0/aEXdujBdOWh1xWP0WlRtpYvKqOPGmAO+QDJn0Q6o48litFw92oHFlHWqN1W8J3HBHLgRuRjczt02XDl6BFxnnAwOOCo5GRDlcKACAiAAAiAAAt8jgaHP6YqDd8/xijpf3Z4Lnpg1lXfv0747HCVV2nujseaJz56Tr/j5CueUCz5r11Xdx1z7kGxVBqC1fsYFRVdJPU4eknmvF0JGmY6C+J1rQxc8Fzi5K6NLud1Z/dhVs6W32JlKdPLgen3NU7fNsOXoz4DPQeizYT8DPtsY+apMoZhAfTYYgI+MlBwZkCLt84MM+MhADgIgAAIgAAIgAAIgAAIgAAIg8L0TiLozF7r75gemn99sVHZafa3ZPkA3QmcpgHVG6XOka1ndKEfBi3qzwQZGAB5R8Peovp227G5SyjSrzfS91Y9yFBzA57COXzGbqbSvGKRRZm1tJj1VlA+qiw9gsds57Quq1zNnfDqfXHwARPq1Lxi6Zf+/T+eTiw9g18nKeV8wE0of9ul8cvEBnNO6V1LJkb6AtJq7Nl3+q08+QBD1hMb3dIb2up2lKfID71P/a+U3GuVbVNa1mU7NqN66+XpljvrM/YbAth10jPoe8HVabbVfGqM2cnp6/nV3oVE5xOmWIhOfQksJlrPFADgqkjJkQJI25wsZ4KhIypABSdqcL2SAoyIpQwYkaXO+kAGOCmQgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAAIgAALLS2BZ98kNCi1un/WgXln9K3prQt9+vV+umvVvO51Zel1E/07JL93QhsO/S0lSjX01BBtNQPjNPxoOjC2nqs6kl96k6ZsQ/MyA9Ds+dLtPaNPlP9lrX3KdrEBlLBJQa6V10zO/jcKPdrxue9dO74xiE9N2LBLQM3pPDBzaXhxlN4qvsUhAUkrmRoFi29L28yg7az/McSwSMF+fvK9LE/vpC3ZxGChZm0Tpi/ONSn3Y9rHton7uEOtsNe0W6pMPyX/56Eznx+7nl2b9RN+4ubNAWnJeUJLOzE+X/5SKNReAlNNh/YR+/hHqY6V+GhLyGasbiyUoFo6EHRIgQTngAwkIwJFQIQESlAM+kIAAHAkVEiBBOeADCQjAkVAhARKUAz6QgAAcCRUSIEE54AMJCMCRUCEBEpQDPpCAABwJFRIgQTngAwkIwJFQIQESlOEDBEAABEAABEAABEAABEAABEAABEAABEAABIjARwK9BhDQRfZqAAAAAElFTkSuQmCC"
  },
  "73bb": function (e, t, a) {
    var r = a("ebf3");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("0bf7ea78", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  7467: function (e, t, a) {
    e.exports = a.p + "img/logo2x.e1144525.png"
  },
  "74a2": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".contact-list-container .v-list-item{border-bottom:1px solid #f5f5f5}.contact-list-container .v-list-item:last-child{border-bottom:0}", ""])
  },
  7525: function (e, t, a) {
    "use strict";
    var r = a("6d70"),
      n = a.n(r);
    n.a
  },
  "75ea": function (e, t, a) {
    e.exports = a.p + "img/check-circle-primary.6135d62f.svg"
  },
  "75f3": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, "", ""])
  },
  7642: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-list-item__content[data-v-762f83a4]{line-height:1.2em}", ""])
  },
  7648: function (e, t, a) {
    "use strict";
    (function (e) {
      a("a4d3"), a("4de4"), a("4160"), a("fb6a"), a("0d03"), a("e439"), a("dbb4"), a("b64b"), a("d3b7"), a("25f0"), a("3ca3"), a("4c53"), a("159b"), a("ddb0");
      var r = a("2fa7"),
        n = a("9f12"),
        s = a("53fe"),
        o = a("bced"),
        i = a.n(o),
        c = a("1131"),
        l = a("db49"),
        d = a("9d50"),
        u = a("5e5c");

      function ownKeys(e, t) {
        var a = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t && (r = r.filter((function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
          }))), a.push.apply(a, r)
        }
        return a
      }

      function _objectSpread(e) {
        for (var t = 1; t < arguments.length; t++) {
          var a = null != arguments[t] ? arguments[t] : {};
          t % 2 ? ownKeys(a, !0).forEach((function (t) {
            Object(r["a"])(e, t, a[t])
          })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : ownKeys(a).forEach((function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
          }))
        }
        return e
      }
      var p = a("3337").ec,
        g = a("5c7d"),
        f = a("36ba"),
        v = a("f234").default,
        h = a("e306").default,
        m = a("b671"),
        b = function () {
          function Torus() {
            Object(n["a"])(this, Torus), this.instanceId = i()(), this.ec = p("secp256k1"), this.setupMultiplex = v
          }
          return Object(s["a"])(Torus, [{
            key: "continueEnable",
            value: function continueEnable(e) {
              g.info("ENABLE WITH: ", e);
              var t = this.communicationMux.getStream("oauth");
              t.write({
                selectedAddress: e
              })
            }
          }, {
            key: "updateStaticData",
            value: function updateStaticData(e) {
              g.info("STATIC DATA:", e);
              var t = this.metamaskMux.getStream("publicConfig");
              e.selectedAddress ? t.write(JSON.stringify({
                selectedAddress: e.selectedAddress
              })) : e.networkId && t.write(JSON.stringify({
                networkVersion: e.networkId
              }))
            }
          }, {
            key: "retrieveShares",
            value: function retrieveShares(e, t, a, r, n) {
              var s = this;
              return new Promise((function (o, i) {
                var l = [];
                g.info(n);
                var d = s.ec.genKeyPair(),
                  p = d.getPublic(),
                  v = Object(c["keccak256"])(n);
                g.info(v);
                for (var h = 0; h < e.length; h++) {
                  var m = Object(u["post"])(e[h], Object(u["generateJsonRPCObject"])("CommitmentRequest", {
                    messageprefix: "mug00",
                    tokencommitment: v.slice(2),
                    temppubx: p.getX().toString("hex"),
                    temppuby: p.getY().toString("hex"),
                    timestamp: (Date.now() - 2e3).toString().slice(0, 10),
                    verifieridentifier: a
                  })).catch((function (e) {
                    g.error(e)
                  }));
                  l.push(m)
                }
                Promise.all(l).then((function (t) {
                  for (var s = [], o = [], i = 0; i < t.length; i++) t[i] && o.push(t[i].result);
                  for (i = 0; i < e.length; i++) {
                    var c = Object(u["post"])(e[i], Object(u["generateJsonRPCObject"])("ShareRequest", {
                      item: [_objectSpread({}, r, {
                        idtoken: n,
                        nodesignatures: o,
                        verifieridentifier: a
                      })]
                    })).catch((function (e) {
                      g.error(e)
                    }));
                    s.push(c)
                  }
                  return Promise.all(s)
                })).then((function (e) {
                  g.info("completed");
                  var a = [],
                    r = [];
                  g.info(e);
                  for (var n = 0; n < e.length; n++) e[n] && e[n].result && e[n].result.keys && e[n].result.keys.length > 0 && (a.push(new f(e[n].result.keys[0].Share, 16)), r.push(new f(t[n], 16)));
                  g.info(a, r);
                  var i = s.lagrangeInterpolation(a.slice(0, 3), r.slice(0, 3)),
                    c = s.generateAddressFromPrivKey(i);
                  o({
                    ethAddress: c,
                    privKey: i.toString("hex", 64)
                  })
                })).catch((function (e) {
                  g.error(e), i(e)
                }))
              }))
            }
          }, {
            key: "lagrangeInterpolation",
            value: function lagrangeInterpolation(e, t) {
              if (e.length !== t.length) return g.error("Shares do not match up"), null;
              for (var a = new f(0), r = 0; r < e.length; r++) {
                for (var n = new f(1), s = new f(1), o = 0; o < e.length; o++)
                  if (r !== o) {
                    n = n.mul(t[o].neg()), n = n.umod(this.ec.curve.n);
                    var i = t[r].sub(t[o]);
                    i = i.umod(this.ec.curve.n), s = s.mul(i).umod(this.ec.curve.n)
                  } var c = n.mul(s.invm(this.ec.curve.n)).umod(this.ec.curve.n);
                c = c.mul(e[r]).umod(this.ec.curve.n), a = a.add(c)
              }
              return a.umod(this.ec.curve.n)
            }
          }, {
            key: "generateAddressFromPrivKey",
            value: function generateAddressFromPrivKey(t) {
              var a = this.ec.keyFromPrivate(t.toString("hex", 64), "hex"),
                r = a.getPublic().encode("hex").slice(2),
                n = "0x" + Object(c["keccak256"])(e.from(r, "hex")).slice(26),
                s = h(n);
              return s
            }
          }, {
            key: "getPubKeyAsync",
            value: function getPubKeyAsync(e, t) {
              var a = this,
                r = t.verifier,
                n = t.verifierId;
              return new Promise((function (t, s) {
                Object(u["post"])(e, Object(u["generateJsonRPCObject"])("VerifierLookupRequest", {
                  verifier: r,
                  verifier_id: n.toString().toLowerCase()
                })).catch((function (e) {
                  return g.error(e)
                })).then((function (t) {
                  return t.error ? Object(u["post"])(e, Object(u["generateJsonRPCObject"])("KeyAssign", {
                    verifier: r,
                    verifier_id: n.toString().toLowerCase()
                  })) : t.result ? a.getLookupPromise(t) : void 0
                })).catch((function (e) {
                  return g.error(e)
                })).then((function (e) {
                  g.info("completed"), g.info(e);
                  var a = e.result.keys[0].address;
                  g.info(a), t(a)
                })).catch((function (e) {
                  g.error(e), s(e)
                }))
              }))
            }
          }, {
            key: "getLookupPromise",
            value: function getLookupPromise(e) {
              return new Promise((function (t, a) {
                return t(e)
              }))
            }
          }, {
            key: "getMessageForSigning",
            value: function getMessageForSigning(e) {
              return new Promise((function (t, a) {
                Object(u["post"])("".concat(l["default"].api, "/auth/message"), {
                  public_address: e
                }).then((function (e) {
                  var a = e || {},
                    r = a.message;
                  t(r)
                })).catch((function (e) {
                  g.error(e), a(e)
                }))
              }))
            }
          }, {
            key: "hashMessage",
            value: function hashMessage(e) {
              var t = m.toBuffer(e);
              return m.hashPersonalMessage(t)
            }
          }]), Torus
        }(),
        x = Object(d["a"])(new b);
      t["a"] = x
    }).call(this, a("1c35").Buffer)
  },
  "765c": function (e, t, a) {
    e.exports = a.p + "img/ndc.17809fbc.png"
  },
  7771: function (e, t, a) {
    e.exports = a.p + "img/StandardBounties.2b52aacd.png"
  },
  7777: function (e, t, a) {
    e.exports = a.p + "img/eye-primary.1e943e69.svg"
  },
  7825: function (e, t, a) {
    e.exports = a.p + "img/pinakion.fd8ddd0c.svg"
  },
  "787f": function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  "790f": function (e, t, a) {
    e.exports = a.p + "img/download-primary.ccd3613b.svg"
  },
  "7b9b": function (e, t, a) {
    e.exports = a.p + "img/bytom-2-logo-png-transparent.4bd1f508.png"
  },
  "7c3b": function (e, t, a) {
    e.exports = a.p + "img/money.7f10af36.svg"
  },
  "7c92": function (e, t, a) {
    e.exports = a.p + "img/metamark.2c64f2fb.svg"
  },
  "7d8f": function (e, t, a) {
    e.exports = a.p + "img/indent-increase.bdc1474e.svg"
  },
  "7db6": function (e, t, a) {
    e.exports = a.p + "img/footer_waves.d5865fa4.png"
  },
  "7dc5": function (e, t, a) {
    e.exports = a.p + "img/safari-pinned-tab.3f71b307.svg"
  },
  "7fc8": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-card__text[data-v-2c6f1cf0]{padding:12px}.card-upper-icon[data-v-2c6f1cf0]{position:absolute;top:8px;right:8px;width:12px;height:12px}.v-divider[data-v-2c6f1cf0]{margin:0 0 12px}.key-item[data-v-2c6f1cf0]{max-width:200px;word-break:break-all;line-height:1em;margin-top:2px}.dialog-launcher[data-v-2c6f1cf0]{cursor:pointer}.note-list .v-list-item[data-v-2c6f1cf0]{min-height:inherit}.theme--dark.v-sheet[data-v-2c6f1cf0],.theme--light.v-sheet[data-v-2c6f1cf0]{background:transparent}", ""])
  },
  8: function (e, t) {},
  "80f6": function (e, t, a) {
    "use strict";
    a.r(t);
    a("99af"), a("4160"), a("a15b"), a("d81d"), a("4e827"), a("0d03"), a("d3b7"), a("25f0"), a("159b"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("c897"),
      o = a("5c7d"),
      i = a("1ed9").normalize,
      c = 18e4,
      l = function () {
        function TokenRatesController() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = e.interval,
            a = void 0 === t ? c : t,
            n = e.currency,
            o = e.tokensStore;
          Object(r["a"])(this, TokenRatesController), this.store = new s, this.currency = n, this.interval = a, this.tokensStore = o
        }
        return Object(n["a"])(TokenRatesController, [{
          key: "updateExchangeRates",
          value: function updateExchangeRates() {
            var e, t, a, r, n, s;
            return regeneratorRuntime.async((function updateExchangeRates$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  if (e = {}, t = this.currency ? this.currency.getState().nativeCurrency.toLowerCase() : "eth", a = this._tokens.map((function (e) {
                      return e.tokenAddress
                    })).join(","), r = "contract_addresses=".concat(a, "&vs_currencies=").concat(t), !(this._tokens.length > 0)) {
                    c.next = 19;
                    break
                  }
                  return c.prev = 5, c.next = 8, regeneratorRuntime.awrap(fetch("https://api.coingecko.com/api/v3/simple/token_price/ethereum?".concat(r)));
                case 8:
                  return n = c.sent, c.next = 11, regeneratorRuntime.awrap(n.json());
                case 11:
                  s = c.sent, this._tokens.forEach((function (a) {
                    var r = s[a.tokenAddress.toLowerCase()];
                    e[i(a.tokenAddress)] = r ? r[t] : 0
                  })), this.store.putState({
                    contractExchangeRates: e
                  }), c.next = 19;
                  break;
                case 16:
                  c.prev = 16, c.t0 = c["catch"](5), o.warn("MetaMask - TokenRatesController exchange rate fetch failed.", c.t0);
                case 19:
                case "end":
                  return c.stop()
              }
            }), null, this, [
              [5, 16]
            ])
          }
        }, {
          key: "interval",
          set: function set(e) {
            var t = this;
            this._handle && clearInterval(this._handle), e && (this._handle = setInterval((function () {
              t.updateExchangeRates()
            }), e))
          }
        }, {
          key: "tokensStore",
          set: function set(e) {
            var t = this;
            this._tokensStore && this._tokensStore.unsubscribe(), e && (this._tokensStore = e, this.tokens = e.getState().tokens, e.subscribe((function (e) {
              var a = e.tokens,
                r = void 0 === a ? [] : a,
                n = r.map((function (e) {
                  return e.tokenAddress
                })),
                s = t._tokens && t._tokens.map((function (e) {
                  return e.tokenAddress
                })) || [];
              n.sort().toString() !== s.sort().toString() && (t.tokens = r)
            })))
          }
        }, {
          key: "tokens",
          set: function set(e) {
            this._tokens = e, this.updateExchangeRates()
          }
        }]), TokenRatesController
      }();
    t["default"] = l
  },
  8136: function (e, t, a) {
    e.exports = a.p + "img/spn.10b96131.svg"
  },
  "815b": function (e, t, a) {
    e.exports = a.p + "img/eye-grey.cd87c911.svg"
  },
  8191: function (e, t, a) {
    e.exports = a.p + "img/mithril-featured.3fb6b04e.png"
  },
  "81b6": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, '.wallet-home[data-v-7a3aba5a]  .currency-selector{display:inline-flex;max-width:75px}.wallet-home[data-v-7a3aba5a]  .currency-selector .v-select__selection{margin:0}.wallet-home[data-v-7a3aba5a]  .currency-selector .v-input__slot:before{border:0}.wallet-home[data-v-7a3aba5a]  .currency-selector.v-text-field .v-input__append-inner{margin-top:3px}.wallet-home[data-v-7a3aba5a]  .currency-selector .v-select__selection{color:var(--v-primary-base);width:30px;max-width:30px}.wallet-home[data-v-7a3aba5a]  .currency-selector .v-icon{color:var(--v-text_2-base);width:20px;height:20px}.wallet-home[data-v-7a3aba5a]  .currency-selector input#currency-selector{display:none}.wallet-home[data-v-7a3aba5a]  .currency-selector .v-input__append-inner{padding:0;margin:0;width:16px}.wallet-home[data-v-7a3aba5a]  .search-field .v-input__slot{min-height:40px}.wallet-home[data-v-7a3aba5a]  .search-field .v-input__append-inner{margin-top:8px}.wallet-home .refresh-button .v-icon[data-v-7a3aba5a],.wallet-home[data-v-7a3aba5a]  .search-field .v-icon.v-icon{width:12px}.wallet-home .home-cards .v-card[data-v-7a3aba5a]{height:140px}.wallet-home .token-tab-content[data-v-7a3aba5a]{background:transparent}.v-tooltip__content[data-v-7a3aba5a]{background:none;border:0;z-index:0;padding:0}.v-tooltip__content[data-v-7a3aba5a]  .outline-tooltip{background-color:#fff;border:1px solid var(--v-primary-base);color:var(--v-primary-base);position:relative;padding:5px 16px;border-radius:4px}.v-tooltip__content[data-v-7a3aba5a]  .outline-tooltip:after{content:" ";position:absolute;border-style:solid;border-color:var(--v-primary-base) transparent transparent transparent;top:100%;left:50%;margin-left:-5px;border-width:5px}', ""])
  },
  "847f": function (e, t, a) {
    var r = a("3668");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("b0bfedda", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "852c": function (e, t, a) {
    var r = a("3458");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("308978cf", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "855f": function (e, t, a) {
    e.exports = a.p + "img/ely.32398149.png"
  },
  8575: function (e, t, a) {
    e.exports = a.p + "img/loginWhite.5a714e15.png"
  },
  "85bf": function (e, t, a) {
    "use strict";
    a.r(t),
      function (e) {
        a.d(t, "default", (function () {
          return f
        }));
        a("99af"), a("4de4"), a("7db0"), a("caad"), a("d81d"), a("0d03"), a("d3b7"), a("25f0"), a("2532"), a("96cf");
        var r = a("9f12"),
          n = a("53fe"),
          s = a("8b83"),
          o = a("c65a"),
          i = a("c03e"),
          c = a("faa1").EventEmitter,
          l = a("decd"),
          d = a("b671"),
          u = a("1ed9"),
          p = a("5c7d"),
          g = "Torus Keyring",
          f = function (t) {
            function TorusKeyring(e) {
              var t;
              return Object(r["a"])(this, TorusKeyring), t = Object(s["a"])(this, Object(o["a"])(TorusKeyring).call(this)), t.type = g, t.wallets = [], t.deserialize(e).then((function () {
                p.info("wallet initialised")
              })).catch((function (e) {
                return p.error("unable to deserialize", e)
              })), t
            }
            return Object(i["a"])(TorusKeyring, t), Object(n["a"])(TorusKeyring, [{
              key: "serialize",
              value: function serialize() {
                var e = this;
                return new Promise((function (t, a) {
                  try {
                    var r = e.wallets.map(e.generatePrivKey);
                    t(r)
                  } catch (n) {
                    a(n)
                  }
                }))
              }
            }, {
              key: "generatePrivKey",
              value: function generatePrivKey(e) {
                return e.getPrivateKey().toString("hex")
              }
            }, {
              key: "generateWallet",
              value: function generateWallet(t) {
                var a = d.stripHexPrefix(t),
                  r = e.from(a, "hex"),
                  n = l.fromPrivateKey(r);
                return n
              }
            }, {
              key: "deserialize",
              value: function deserialize() {
                var e = this,
                  t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                return new Promise((function (a, r) {
                  try {
                    e.wallets = t.map(e.generateWallet), a()
                  } catch (n) {
                    r(n)
                  }
                }))
              }
            }, {
              key: "addAccount",
              value: function addAccount(e) {
                var t = this;
                return new Promise((function _callee(a, r) {
                  var n, s;
                  return regeneratorRuntime.async((function _callee$(o) {
                    while (1) switch (o.prev = o.next) {
                      case 0:
                        try {
                          for (n = 0; n < t.wallets.length; n++) s = t.generatePrivKey(t.wallets[n]), s === e && r(new Error("Already added"));
                          t.wallets.push(t.generateWallet(e)), a()
                        } catch (i) {
                          r(i)
                        }
                        case 1:
                        case "end":
                          return o.stop()
                    }
                  }))
                }))
              }
            }, {
              key: "addRandomAccounts",
              value: function addRandomAccounts() {
                for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, t = [], a = 0; a < e; a++) t.push(l.generate());
                this.wallets = this.wallets.concat(t);
                var r = t.map((function (e) {
                  return d.bufferToHex(e.getAddress())
                }));
                return Promise.resolve(r)
              }
            }, {
              key: "getAccounts",
              value: function getAccounts() {
                return Promise.resolve(this.wallets.map((function (e) {
                  return d.bufferToHex(e.getAddress())
                })))
              }
            }, {
              key: "signTransaction",
              value: function signTransaction(e, t) {
                var a = this;
                return new Promise((function (r, n) {
                  try {
                    var s = a._getWalletForAccount(t),
                      o = s.getPrivateKey();
                    e.sign(o), r(e)
                  } catch (i) {
                    n(i)
                  }
                }))
              }
            }, {
              key: "signMessage",
              value: function signMessage(t, a) {
                var r = this;
                return new Promise((function (n, s) {
                  try {
                    var o = r._getWalletForAccount(t),
                      i = d.stripHexPrefix(a),
                      c = o.getPrivateKey(),
                      l = d.ecsign(e.from(i, "hex"), c),
                      p = d.bufferToHex(u.concatSig(l.v, l.r, l.s));
                    n(p)
                  } catch (g) {
                    s(g)
                  }
                }))
              }
            }, {
              key: "signPersonalMessage",
              value: function signPersonalMessage(t, a) {
                var r = this;
                return new Promise((function (n, s) {
                  try {
                    var o = r._getWalletForAccount(t),
                      i = d.stripHexPrefix(o.getPrivateKey()),
                      c = e.from(i, "hex"),
                      l = u.personalSign(c, {
                        data: a
                      });
                    n(l)
                  } catch (p) {
                    s(p)
                  }
                }))
              }
            }, {
              key: "signTypedData",
              value: function signTypedData(e, t, a) {
                var r = this;
                return new Promise((function (n, s) {
                  try {
                    var o, i = r._getWalletForAccount(e),
                      c = d.toBuffer(i.getPrivateKey()),
                      l = t;
                    if ("string" === typeof l && (l = JSON.parse(l)), a) switch (a) {
                      case "V1":
                        o = u.signTypedDataLegacy(c, {
                          data: t
                        });
                        break;
                      case "V4":
                        o = u.signTypedData_v4(c, {
                          data: l
                        });
                        break;
                      case "V3":
                      default:
                        o = u.signTypedData(c, {
                          data: l
                        });
                        break
                    } else o = u.signTypedData(c, {
                      data: l
                    });
                    n(o)
                  } catch (p) {
                    s(p)
                  }
                }))
              }
            }, {
              key: "exportAccount",
              value: function exportAccount(e) {
                var t = this._getWalletForAccount(e);
                return Promise.resolve(t.getPrivateKey().toString("hex"))
              }
            }, {
              key: "removeAccount",
              value: function removeAccount(e) {
                if (!this.wallets.map((function (e) {
                    return d.bufferToHex(e.getAddress()).toLowerCase()
                  })).includes(e.toLowerCase())) throw new Error("Address ".concat(e, " not found in this keyring"));
                this.wallets = this.wallets.filter((function (t) {
                  return d.bufferToHex(t.getAddress()).toLowerCase() !== e.toLowerCase()
                }))
              }
            }, {
              key: "_getWalletForAccount",
              value: function _getWalletForAccount(e) {
                var t = u.normalize(e),
                  a = this.wallets.find((function (e) {
                    return d.bufferToHex(e.getAddress()) === t
                  }));
                if (!a) throw new Error("Torus Keyring - Unable to find matching address.");
                return a
              }
            }]), TorusKeyring
          }(c);
        f.type = g
      }.call(this, a("1c35").Buffer)
  },
  "85fc": function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  "876a": function (e, t, a) {
    e.exports = a.p + "img/bee_token.4b7b6cc2.svg"
  },
  "87db": function (e, t, a) {
    e.exports = a.p + "img/login-bg.c522b4d5.png"
  },
  "88ba": function (e, t, a) {
    e.exports = a.p + "img/ParetoLogo.001a9082.png"
  },
  "890f": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAC4jAAAuIwF4pT92AAAKs2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDUtMTdUMjE6NDQ6MTktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDUtMjNUMTY6MjI6NDYrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA1LTIzVDE2OjIyOjQ2KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYmRlMmM0OC0zYjYyLTQ2YzktODlkMi1jZjE4NWQ0OWUxZjAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MzMyZjc4YS1mZDAzLTIzNDctYTNhYi05YzhiZTQ3M2FmMTciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOWMzOTdmMS05MWY0LTQ1MjEtYjY4Yy01ZTc0N2M0ZGE4ZmYiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iMzAwMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iMzAwMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iNTEyIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNTEyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOWMzOTdmMS05MWY0LTQ1MjEtYjY4Yy01ZTc0N2M0ZGE4ZmYiIHN0RXZ0OndoZW49IjIwMTktMDUtMTdUMjE6NDQ6MTktMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTZmNmJkMi1kYTMwLTQwZDctOTUzMy1iOTg5ZDVkY2U4ZWIiIHN0RXZ0OndoZW49IjIwMTktMDUtMTdUMjE6NDk6MzEtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMDQxMGZlZS1kMTYyLTQ0YjItODdiNC1mNTI0ZTJlODQ1ZTgiIHN0RXZ0OndoZW49IjIwMTktMDUtMjNUMTY6MjI6NDYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYmRlMmM0OC0zYjYyLTQ2YzktODlkMi1jZjE4NWQ0OWUxZjAiIHN0RXZ0OndoZW49IjIwMTktMDUtMjNUMTY6MjI6NDYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphMDQxMGZlZS1kMTYyLTQ0YjItODdiNC1mNTI0ZTJlODQ1ZTgiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkOGQ4ZDAxNi1jNmY3LTljNDctOTE0NC03M2JhY2JkOTk0MjAiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOWMzOTdmMS05MWY0LTQ1MjEtYjY4Yy01ZTc0N2M0ZGE4ZmYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YJIToAAAEwUlEQVRogeXbW4hVVRzH8Y9HGytHZwpv5aUsjMIkLLO08R5o4IOXLNDHCEEtTPKxsKCXMIIExV56kQJFjchbF29ZktgNHcqgpBLNW3mZxMuM9bDOjMfxXPY+5+xzxuYL++Gs/d9r/36cs89ea/3/q8voFf9KiDqMxkgMwxAMQD1q0zFNOI0j+BWN2Ic9OJOEqG5l7m8gnsVMPIauBeJr08dAjMpob8HXWI+1+L1cAruU6RsehyV4SmGTcWnBZizDzlI7S5V4/QTsSguZpvxmpfuchh3pe00opbNiDd+B1diOsaUIiMnY9D1XpzXEphjDs/Ej5hZzwzIxN61hdtwL4xiuwXKsEf6Bq02doGU5uke9KKrhntiEhfF1Jc5CfILbowRHMdxHeG4mlyAqacZhm6A1L4UM12ELHimDqKR5CFsVeNzyGa4RXvwPl1FU0owQNNfkCshn+G1MKreiCjBJ0J6VXEPL2Zif66JFTzC0d+E79+lB/c2F41ppPM5LH1/f3jXF+CGMHkzfWs5dpPEYmw9y+kLWruYLg6E17U9kMzwA7+YTNrQ3I+6M4CAmA7M8fXfV88YU7mn3HzzpXp57lGW72PJz1u5W4SsczmzM9pNeLsxoqk7/nqyYfr3ZVm69iVcnM+W+rKfr8U77xvaGJ2JGKSLLyeIGbrulcNzLY3M+OjO0e522N/x6kdrKTr9aGu6OFtujJue3DEszP2QaHoeG2MoS4sF+8eKH9895qkHwhmsNL4mpKVFqI4+OA73yx7d5azXcF1NjakqUk//Eiz+RP36q4LHN8BzlX+4piR+OcvlK9Pi9f+Q93U3w2GZ4VpG6EqPpEuv2R4s9fIZtvxQMm0Uw3Lq62OFYtTeMqPJx/jKvfBrp1zAadSmMkcxaVMlcbOaFj1jfyJUsa40HjvH8eg6eiNRdV4zppojZ0KaDfHukcNzjgxgW4/Vy7Nz1bReaw/DxvX2MGhTez2fTY+mIRjMZ2Q3D41618adocT1r4hn+syn3uVPnw2ShRIalhIxAZ2FICgnMezosA1I6yMyoQvRKuZrY6gz0LDXVcqNxKSWkLDsLTSkhP9tZOJcSktGdhWMpHKq2igpyKIUD1VZRQRpT+KbaKirIvpSwdttSbSUVoAV7UkK1zJ4qi6kEe3C6deCxrppKKsQ6ri7xvI/m6mlJnGbBY5vh40Ju9f/KVsHjNevSb1ZHS0Vo85ZpeBd2V15L4uwWvOH63NLSikqpDK9lfmhv+HNsqJyWxNmAzzIbss2HX/T/mEGdFrxcQzbDhzEvaTUVYJ522X9yF7WswcpE5STLSlnqO8hfxbNIqGC90dglaM9KPsOX8DQiprQ6BPuF4vRLuQIKLeKdwpP4vnyaEmO/oPVUvqAoOeHjGI8PhaKXyBw+w3cxFpB++ztO79fwBabjr0KBcbYAdMdbWFC0rGRYgcW4GCU4zrr0RaFU9xkJ7TiJyVlBywIRzVJcRfxaPCA93aoSH+D+tJZYFJt5OCqU4U9U2QnHl0Lx6Jy0htiUmmrZIWy8mICNiFGGEpkr6b4nCDVX20vprFyVOzvTx2DhuZopbLwqtpSiBXuF2uc1OuBGrWxkbsUbLiTee8u+Fe+kkBDYL+GteP8BRcf0qkYlq2kAAAAASUVORK5CYII="
  },
  "891f": function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".torus-app.theme--dark input::placeholder,.torus-app.theme--light input::placeholder{color:var(--v-text_2-base)!important;font-size:14px;opacity:.7}.torus-app.theme--dark input:-webkit-autofill,.torus-app.theme--dark input:-webkit-autofill:focus,.torus-app.theme--dark input:-webkit-autofill:hover,.torus-app.theme--dark select:-webkit-autofill,.torus-app.theme--dark select:-webkit-autofill:focus,.torus-app.theme--dark select:-webkit-autofill:hover,.torus-app.theme--dark textarea:-webkit-autofill,.torus-app.theme--dark textarea:-webkit-autofill:focus,.torus-app.theme--dark textarea:-webkit-autofill:hover,.torus-app.theme--light input:-webkit-autofill,.torus-app.theme--light input:-webkit-autofill:focus,.torus-app.theme--light input:-webkit-autofill:hover,.torus-app.theme--light select:-webkit-autofill,.torus-app.theme--light select:-webkit-autofill:focus,.torus-app.theme--light select:-webkit-autofill:hover,.torus-app.theme--light textarea:-webkit-autofill,.torus-app.theme--light textarea:-webkit-autofill:focus,.torus-app.theme--light textarea:-webkit-autofill:hover{border:0;-webkit-text-fill-color:var(--v-text_1-base);-webkit-box-shadow:0 0 0 1000px var(--v-background_body_1-base) inset;transition:background-color 5000s ease-in-out 0s}.torus-app.theme--dark .v-input,.torus-app.theme--light .v-input{font-size:14px}.torus-app.theme--dark .v-input__slot,.torus-app.theme--light .v-input__slot{margin-bottom:2px}.torus-app.theme--dark .v-text-field.v-text-field--enclosed .v-text-field__details,.torus-app.theme--light .v-text-field.v-text-field--enclosed .v-text-field__details{margin-bottom:0}.torus-app.theme--dark .theme--dark.v-messages,.torus-app.theme--dark .theme--light.v-messages,.torus-app.theme--light .theme--dark.v-messages,.torus-app.theme--light .theme--light.v-messages{color:var(--v-text_2-base)}.torus-app.theme--dark .v-btn,.torus-app.theme--light .v-btn{text-transform:inherit}.torus-app.theme--dark.v-application,.torus-app.theme--light.v-application{color:var(--v-text_1-base);background:var(--v-background_body_1-base);background:linear-gradient(135deg,var(--v-background_body_1-base),var(--v-background_body_2-base))}.torus-app.theme--dark .v-card,.torus-app.theme--dark .v-card>.v-card__text,.torus-app.theme--dark .v-data-table,.torus-app.theme--dark .v-expansion-panels .v-expansion-panel,.torus-app.theme--dark .v-input:not(.v-input--is-disabled) input,.torus-app.theme--dark .v-input:not(.v-input--is-disabled) textarea,.torus-app.theme--dark .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) .v-list-item__content,.torus-app.theme--dark .v-select .v-select__selections,.torus-app.theme--light .v-card,.torus-app.theme--light .v-card>.v-card__text,.torus-app.theme--light .v-data-table,.torus-app.theme--light .v-expansion-panels .v-expansion-panel,.torus-app.theme--light .v-input:not(.v-input--is-disabled) input,.torus-app.theme--light .v-input:not(.v-input--is-disabled) textarea,.torus-app.theme--light .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) .v-list-item__content,.torus-app.theme--light .v-select .v-select__selections{color:var(--v-text_1-base)}.torus-app.theme--dark .v-text-field--outlined:not(.error--text) fieldset,.torus-app.theme--light .v-text-field--outlined:not(.error--text) fieldset{border-color:var(--v-text_2-lighten3)}@media(min-width:1904px){.torus-app.theme--dark .container,.torus-app.theme--light .container{max-width:1264px}}.torus-app.theme--light.v-data-table,.torus-app.theme--light.v-sheet,.torus-app.theme--light.v-stepper,.torus-app.theme--light.v-tabs .v-tabs-bar{background:var(--v-background-base)}.torus-app.theme--light .card-shadow{box-shadow:0 14px 28px 0 rgba(0,0,0,.06);border:1px solid #f5f5f5;border-radius:3px}.torus-app.theme--light ::-webkit-scrollbar{width:.8em}.torus-app.theme--light ::-webkit-scrollbar-track{background:#e2e2e2;box-shadow:inset 0 0 1px #e2e2e2}.torus-app.theme--light ::-webkit-scrollbar-thumb{background:#7d7d7d;border:2px solid #e2e2e2;border-radius:8px}.torus-app.theme--light .v-tab.v-tab--active{color:var(--v-secondary-darken3)}.torus-app.theme--dark .v-data-table,.torus-app.theme--dark .v-sheet,.torus-app.theme--dark .v-tabs>.v-tabs-bar{background:var(--v-background-base)}.torus-app.theme--dark .card-shadow{box-shadow:none;border:0;border-radius:3px}.torus-app.theme--dark ::-webkit-scrollbar{width:.8em}.torus-app.theme--dark ::-webkit-scrollbar-track{background:#626262;box-shadow:inset 0 0 5px #626262}.torus-app.theme--dark ::-webkit-scrollbar-thumb{background:#242529;border:2px solid #626262;border-radius:8px}.torus-app.theme--dark .v-tab.v-tab--active{color:#fff}", ""])
  },
  "8aa9": function (e, t, a) {
    "use strict";
    a.r(t);
    a("4de4"), a("4160"), a("caad"), a("d81d"), a("b0c0"), a("a9e3"), a("25eb"), a("d3b7"), a("e25e"), a("2532"), a("3ca3"), a("159b"), a("ddb0"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("8b83"),
      o = a("c65a"),
      i = a("c03e"),
      c = a("cb69"),
      l = a("5c7d"),
      d = a("58f5"),
      u = function (e) {
        function PendingTransactionTracker(e) {
          var t;
          return Object(r["a"])(this, PendingTransactionTracker), t = Object(s["a"])(this, Object(o["a"])(PendingTransactionTracker).call(this)), t.droppedBuffer = {}, t.query = new d(e.provider), t.nonceTracker = e.nonceTracker, t.getPendingTransactions = e.getPendingTransactions, t.getCompletedTransactions = e.getCompletedTransactions, t.publishTransaction = e.publishTransaction, t.approveTransaction = e.approveTransaction, t.confirmTransaction = e.confirmTransaction, t
        }
        return Object(i["a"])(PendingTransactionTracker, e), Object(n["a"])(PendingTransactionTracker, [{
          key: "updatePendingTxs",
          value: function updatePendingTxs() {
            var e, t, a = this;
            return regeneratorRuntime.async((function updatePendingTxs$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return r.next = 2, regeneratorRuntime.awrap(this.nonceTracker.getGlobalLock());
                case 2:
                  return e = r.sent, r.prev = 3, t = this.getPendingTransactions(), r.next = 7, regeneratorRuntime.awrap(Promise.all(t.map((function (e) {
                    return a._checkPendingTx(e)
                  }))));
                case 7:
                  r.next = 13;
                  break;
                case 9:
                  r.prev = 9, r.t0 = r["catch"](3), l.error("PendingTransactionTracker - Error updating pending transactions"), l.error(r.t0);
                case 13:
                  e.releaseLock();
                case 14:
                case "end":
                  return r.stop()
              }
            }), null, this, [
              [3, 9]
            ])
          }
        }, {
          key: "resubmitPendingTxs",
          value: function resubmitPendingTxs(e) {
            var t = this,
              a = this.getPendingTransactions();
            a.length && a.forEach((function (a) {
              return t._resubmitTx(a, e).catch((function (e) {
                var r = e.message.toLowerCase(),
                  n = r.includes("replacement transaction underpriced") || r.includes("known transaction") || r.includes("gas price too low to replace") || r.includes("transaction with the same hash was already imported") || r.includes("gateway timeout") || r.includes("nonce too low");
                n || (a.warning = {
                  error: r,
                  message: "There was an error when resubmitting this transaction."
                }, t.emit("tx:warning", a, e))
              }))
            }))
          }
        }, {
          key: "_resubmitTx",
          value: function _resubmitTx(e, t) {
            var a, r, n, s, o;
            return regeneratorRuntime.async((function _resubmitTx$(i) {
              while (1) switch (i.prev = i.next) {
                case 0:
                  if (e.firstRetryBlockNumber || this.emit("tx:block-update", e, t), a = e.firstRetryBlockNumber || t, r = Number.parseInt(t, 16) - Number.parseInt(a, 16), n = e.retryCount || 0, !(r <= Math.pow(2, n) - 1)) {
                    i.next = 6;
                    break
                  }
                  return i.abrupt("return");
                case 6:
                  if ("rawTx" in e) {
                    i.next = 8;
                    break
                  }
                  return i.abrupt("return", this.approveTransaction(e.id));
                case 8:
                  return s = e.rawTx, i.next = 11, regeneratorRuntime.awrap(this.publishTransaction(s));
                case 11:
                  return o = i.sent, this.emit("tx:retry", e), i.abrupt("return", o);
                case 14:
                case "end":
                  return i.stop()
              }
            }), null, this)
          }
        }, {
          key: "_checkPendingTx",
          value: function _checkPendingTx(e) {
            var t, a, r, n, s, o, i;
            return regeneratorRuntime.async((function _checkPendingTx$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  if (t = e.hash, a = e.id, "submitted" === e.status) {
                    c.next = 4;
                    break
                  }
                  return c.abrupt("return");
                case 4:
                  if (t) {
                    c.next = 9;
                    break
                  }
                  return r = new Error("We had an error while submitting this transaction, please try again."), r.name = "NoTxHashError", this.emit("tx:failed", a, r), c.abrupt("return");
                case 9:
                  return c.next = 11, regeneratorRuntime.awrap(this._checkIfNonceIsTaken(e));
                case 11:
                  return n = c.sent, c.prev = 12, c.next = 15, regeneratorRuntime.awrap(this._checkIftxWasDropped(e));
                case 15:
                  s = c.sent, s && !this.droppedBuffer[t] ? (this.droppedBuffer[t] = !0, s = !1) : s && this.droppedBuffer[t] && delete this.droppedBuffer[t], c.next = 22;
                  break;
                case 19:
                  c.prev = 19, c.t0 = c["catch"](12), l.error(c.t0);
                case 22:
                  if (!n && !s) {
                    c.next = 24;
                    break
                  }
                  return c.abrupt("return", this.emit("tx:dropped", a));
                case 24:
                  return c.prev = 24, c.next = 27, regeneratorRuntime.awrap(this.query.getTransactionByHash(t));
                case 27:
                  if (c.t1 = c.sent, c.t1) {
                    c.next = 30;
                    break
                  }
                  c.t1 = {};
                case 30:
                  o = c.t1, i = o.blockNumber, i && this.emit("tx:confirmed", a), c.next = 39;
                  break;
                case 35:
                  c.prev = 35, c.t2 = c["catch"](24), e.warning = {
                    error: c.t2.message,
                    message: "There was a problem loading this transaction."
                  }, this.emit("tx:warning", e, c.t2);
                case 39:
                case "end":
                  return c.stop()
              }
            }), null, this, [
              [12, 19],
              [24, 35]
            ])
          }
        }, {
          key: "_checkIftxWasDropped",
          value: function _checkIftxWasDropped(e) {
            var t, a, r, n, s, o, i;
            return regeneratorRuntime.async((function _checkIftxWasDropped$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  return t = e.txParams, a = t.nonce, r = t.from, n = e.hash, c.next = 3, regeneratorRuntime.awrap(this.query.getTransactionCount(r));
                case 3:
                  return s = c.sent, c.next = 6, regeneratorRuntime.awrap(this.query.getTransactionByHash(n));
                case 6:
                  if (c.t0 = c.sent, c.t0) {
                    c.next = 9;
                    break
                  }
                  c.t0 = {};
                case 9:
                  if (o = c.t0, i = o.blockNumber, i || !(parseInt(s) > parseInt(a))) {
                    c.next = 13;
                    break
                  }
                  return c.abrupt("return", !0);
                case 13:
                  return c.abrupt("return", !1);
                case 14:
                case "end":
                  return c.stop()
              }
            }), null, this)
          }
        }, {
          key: "_checkIfNonceIsTaken",
          value: function _checkIfNonceIsTaken(e) {
            var t, a, r;
            return regeneratorRuntime.async((function _checkIfNonceIsTaken$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return t = e.txParams.from, a = this.getCompletedTransactions(t), r = a.filter((function (t) {
                    return t.txParams.nonce === e.txParams.nonce
                  })), n.abrupt("return", r.length > 0);
                case 4:
                case "end":
                  return n.stop()
              }
            }), null, this)
          }
        }]), PendingTransactionTracker
      }(c);
    t["default"] = u
  },
  "8b0a": function (e, t, a) {
    e.exports = a.p + "img/info-grey.546f3b7a.svg"
  },
  "8bc6": function (e, t, a) {
    e.exports = a.p + "img/wallet_blue_line.62bb6515.svg"
  },
  "8c34": function (e, t, a) {
    "use strict";
    var r = a("eba9"),
      n = a.n(r);
    n.a
  },
  "8c84": function (e, t, a) {
    e.exports = a.p + "img/sync-blue.5c2eb961.svg"
  },
  "8c92": function (e, t, a) {
    e.exports = a.p + "img/error-circle.fb14c847.svg"
  },
  "8c98": function (e, t, a) {
    e.exports = a.p + "img/JETCOIN28.bd62956d.png"
  },
  "8cbf": function (e, t, a) {
    "use strict";
    var r = a("518f"),
      n = a.n(r);
    n.a
  },
  "8ce95": function (e, t, a) {
    e.exports = a.p + "img/torus-circle.fd31d1c2.png"
  },
  "8d5f": function (e, t, a) {
    var r = a("4aec2");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("79e211e2", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "8d7b": function (e, t, a) {
    e.exports = a.p + "img/google.61a383d0.svg"
  },
  "8d97": function (e, t, a) {
    e.exports = a.p + "img/JOY.3d4f57b2.png"
  },
  "8e49": function (e, t, a) {
    "use strict";
    var r = a("6e56"),
      n = a.n(r);
    n.a
  },
  "8f16": function (e, t, a) {
    e.exports = a.p + "img/coins.97ab7f97.svg"
  },
  "8f4f": function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return A
    }));
    a("4160"), a("caad"), a("d81d"), a("b64b"), a("d3b7"), a("e25e"), a("2532"), a("3ca3"), a("159b"), a("ddb0"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("417a"),
      o = a("c897"),
      i = a("5c7d"),
      c = a("364d"),
      l = a("4879"),
      d = a("1131"),
      u = d.toHex,
      p = a("5f81"),
      g = a("b00c"),
      f = g.MAINNET_CODE,
      v = g.RINKEBY_CODE,
      h = g.ROPSTEN_CODE,
      m = g.KOVAN_CODE,
      b = g.ZERO_ADDRESS,
      x = a("9bb4"),
      y = x.SINGLE_CALL_BALANCES_ADDRESS,
      w = x.SINGLE_CALL_BALANCES_ADDRESS_RINKEBY,
      k = x.SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN,
      C = x.SINGLE_CALL_BALANCES_ADDRESS_KOVAN,
      A = function () {
        function AccountTracker() {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          Object(r["a"])(this, AccountTracker);
          var a = {
            accounts: {},
            currentBlockGasLimit: ""
          };
          this.store = new o(a), this._provider = t.provider, this._query = c(new s(this._provider)), this._blockTracker = t.blockTracker, this._currentBlockNumber = this._blockTracker.getCurrentBlock(), this._blockTracker.once("latest", (function (t) {
            e._currentBlockNumber = t
          })), this._updateForBlock = this._updateForBlock.bind(this), this.network = t.network, this.web3 = new l(this._provider)
        }
        return Object(n["a"])(AccountTracker, [{
          key: "start",
          value: function start() {
            this._blockTracker.removeListener("latest", this._updateForBlock), this._blockTracker.addListener("latest", this._updateForBlock), this._updateAccounts()
          }
        }, {
          key: "stop",
          value: function stop() {
            this._blockTracker.removeListener("latest", this._updateForBlock)
          }
        }, {
          key: "syncWithAddresses",
          value: function syncWithAddresses(e) {
            var t = this.store.getState().accounts,
              a = Object.keys(t),
              r = [];
            e.forEach((function (e) {
              a.includes(e) || r.push(e)
            }));
            var n = [];
            a.forEach((function (t) {
              e.includes(t) || n.push(t)
            })), this.addAccounts(r), this.removeAccount(n)
          }
        }, {
          key: "addAccounts",
          value: function addAccounts(e) {
            var t = this.store.getState().accounts;
            e.forEach((function (e) {
              t[e] = {}
            })), this.store.updateState({
              accounts: t
            }), this._currentBlockNumber && this._updateAccounts()
          }
        }, {
          key: "removeAccount",
          value: function removeAccount(e) {
            var t = this.store.getState().accounts;
            e.forEach((function (e) {
              delete t[e]
            })), this.store.updateState({
              accounts: t
            })
          }
        }, {
          key: "_updateForBlock",
          value: function _updateForBlock(e) {
            var t, a;
            return regeneratorRuntime.async((function _updateForBlock$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return this._currentBlockNumber = e, r.next = 3, regeneratorRuntime.awrap(this._query.getBlockByNumber(e, !1));
                case 3:
                  if (t = r.sent, t) {
                    r.next = 6;
                    break
                  }
                  return r.abrupt("return");
                case 6:
                  return a = t.gasLimit, this.store.updateState({
                    currentBlockGasLimit: a
                  }), r.prev = 8, r.next = 11, regeneratorRuntime.awrap(this._updateAccounts());
                case 11:
                  r.next = 16;
                  break;
                case 13:
                  r.prev = 13, r.t0 = r["catch"](8), i.error(r.t0);
                case 16:
                case "end":
                  return r.stop()
              }
            }), null, this, [
              [8, 13]
            ])
          }
        }, {
          key: "_updateAccounts",
          value: function _updateAccounts() {
            var e, t, a;
            return regeneratorRuntime.async((function _updateAccounts$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  if (e = this.store.getState().accounts, t = Object.keys(e), a = parseInt(this.network.getNetworkState()), !(t.length > 0)) {
                    r.next = 21;
                    break
                  }
                  r.t0 = a, r.next = r.t0 === f ? 7 : r.t0 === v ? 10 : r.t0 === h ? 13 : r.t0 === m ? 16 : 19;
                  break;
                case 7:
                  return r.next = 9, regeneratorRuntime.awrap(this._updateAccountsViaBalanceChecker(t, y));
                case 9:
                  return r.abrupt("break", 21);
                case 10:
                  return r.next = 12, regeneratorRuntime.awrap(this._updateAccountsViaBalanceChecker(t, w));
                case 12:
                  return r.abrupt("break", 21);
                case 13:
                  return r.next = 15, regeneratorRuntime.awrap(this._updateAccountsViaBalanceChecker(t, k));
                case 15:
                  return r.abrupt("break", 21);
                case 16:
                  return r.next = 18, regeneratorRuntime.awrap(this._updateAccountsViaBalanceChecker(t, C));
                case 18:
                  return r.abrupt("break", 21);
                case 19:
                  return r.next = 21, regeneratorRuntime.awrap(Promise.all(t.map(this._updateAccount.bind(this))));
                case 21:
                case "end":
                  return r.stop()
              }
            }), null, this)
          }
        }, {
          key: "_updateAccount",
          value: function _updateAccount(e) {
            var t, a, r, n;
            return regeneratorRuntime.async((function _updateAccount$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  return s.next = 2, regeneratorRuntime.awrap(this._query.getBalance(e));
                case 2:
                  if (t = s.sent, a = {
                      address: e,
                      balance: t
                    }, r = this.store.getState(), n = r.accounts, n[e]) {
                    s.next = 7;
                    break
                  }
                  return s.abrupt("return");
                case 7:
                  n[e] = a, this.store.updateState({
                    accounts: n
                  });
                case 9:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "_updateAccountsViaBalanceChecker",
          value: function _updateAccountsViaBalanceChecker(e, t) {
            var a, r, n, s, o;
            return regeneratorRuntime.async((function _updateAccountsViaBalanceChecker$(c) {
              while (1) switch (c.prev = c.next) {
                case 0:
                  return a = this.store.getState().accounts, r = this.web3, n = new r.eth.Contract(p, t), s = [b], c.prev = 4, c.next = 7, regeneratorRuntime.awrap(n.methods.balances(e, s).call());
                case 7:
                  o = c.sent, e.forEach((function (e, t) {
                    var r = u(o[t]);
                    a[e] = {
                      address: e,
                      balance: r
                    }
                  })), this.store.updateState({
                    accounts: a
                  }), c.next = 16;
                  break;
                case 12:
                  return c.prev = 12, c.t0 = c["catch"](4), i.warn("Torus - Account Tracker single call balance fetch failed", c.t0), c.abrupt("return", Promise.all(e.map(this._updateAccount.bind(this))));
                case 16:
                case "end":
                  return c.stop()
              }
            }), null, this, [
              [4, 12]
            ])
          }
        }]), AccountTracker
      }()
  },
  "8f6d": function (e, t, a) {
    var r = a("ec4e");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("31bda12c", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  9: function (e, t) {},
  "903c": function (e, t, a) {
    "use strict";
    var r = a("852c"),
      n = a.n(r);
    n.a
  },
  9101: function (e, t, a) {
    e.exports = a.p + "img/equal.e1b1069a.svg"
  },
  9182: function (e, t, a) {
    "use strict";
    a.r(t);
    a("99af"), a("4de4"), a("c740"), a("4160"), a("caad"), a("13d5"), a("a434"), a("0d03"), a("b64b"), a("d3b7"), a("25f0"), a("2532"), a("159b");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("8b83"),
      o = a("c65a"),
      i = a("c03e"),
      c = a("53a8"),
      l = a("cb69"),
      d = a("c897"),
      u = a("5c7d"),
      p = a("1351").default,
      g = a("d177").default,
      f = a("1f40"),
      v = f.getFinalStates,
      h = f.normalizeTxParams,
      m = function (e) {
        function TransactionStateManager(e) {
          var t, a = e.initState,
            n = e.txHistoryLimit,
            i = e.getNetwork;
          return Object(r["a"])(this, TransactionStateManager), t = Object(s["a"])(this, Object(o["a"])(TransactionStateManager).call(this)), t.store = new d(c({
            transactions: []
          }, a)), t.txHistoryLimit = n, t.getNetwork = i, t
        }
        return Object(i["a"])(TransactionStateManager, e), Object(n["a"])(TransactionStateManager, [{
          key: "generateTxMeta",
          value: function generateTxMeta(e) {
            var t = this.getNetwork();
            if ("loading" === t) throw new Error("MetaMask is having trouble connecting to the network");
            return c({
              id: g(),
              time: (new Date).getTime(),
              status: "unapproved",
              metamaskNetworkId: t,
              loadingDefaults: !0
            }, e)
          }
        }, {
          key: "getTxList",
          value: function getTxList() {
            var e = this.getNetwork(),
              t = this.getFullTxList();
            return t.filter((function (t) {
              return t.metamaskNetworkId === e
            }))
          }
        }, {
          key: "getFullTxList",
          value: function getFullTxList() {
            return this.store.getState().transactions
          }
        }, {
          key: "getUnapprovedTxList",
          value: function getUnapprovedTxList() {
            var e = this.getTxsByMetaData("status", "unapproved");
            return e.reduce((function (e, t) {
              return e[t.id] = t, e
            }), {})
          }
        }, {
          key: "getApprovedTransactions",
          value: function getApprovedTransactions(e) {
            var t = {
              status: "approved"
            };
            return e && (t.from = e), this.getFilteredTxList(t)
          }
        }, {
          key: "getPendingTransactions",
          value: function getPendingTransactions(e) {
            var t = {
              status: "submitted"
            };
            return e && (t.from = e), this.getFilteredTxList(t)
          }
        }, {
          key: "getConfirmedTransactions",
          value: function getConfirmedTransactions(e) {
            var t = {
              status: "confirmed"
            };
            return e && (t.from = e), this.getFilteredTxList(t)
          }
        }, {
          key: "addTx",
          value: function addTx(e) {
            e.txParams && this.normalizeAndValidateTxParams(e.txParams), this.once("".concat(e.id, ":signed"), (function () {
              this.removeAllListeners("".concat(e.id, ":rejected"))
            })), this.once("".concat(e.id, ":rejected"), (function () {
              this.removeAllListeners("".concat(e.id, ":signed"))
            })), e.history = [];
            var t = p.snapshotFromTxMeta(e);
            e.history.push(t);
            var a = this.getFullTxList(),
              r = a.length,
              n = this.txHistoryLimit;
            if (r > n - 1) {
              var s = a.findIndex((function (e) {
                return v().includes(e.status)
              })); - 1 !== s && a.splice(s, 1)
            }
            return a.push(e), this._saveTxList(a), e
          }
        }, {
          key: "getTx",
          value: function getTx(e) {
            var t = this.getTxsByMetaData("id", e)[0];
            return t
          }
        }, {
          key: "updateTx",
          value: function updateTx(e, t) {
            e.txParams && this.normalizeAndValidateTxParams(e.txParams);
            var a = p.snapshotFromTxMeta(e),
              r = p.replayHistory(e.history),
              n = p.generateHistoryEntry(r, a, t);
            e.history.push(n);
            var s = e.id,
              o = this.getFullTxList(),
              i = o.findIndex((function (e) {
                return e.id === s
              }));
            o[i] = e, this._saveTxList(o)
          }
        }, {
          key: "normalizeAndValidateTxParams",
          value: function normalizeAndValidateTxParams(e) {
            "undefined" === typeof e.data && delete e.data;
            var t = h(e, !1);
            this.validateTxParams(t)
          }
        }, {
          key: "updateTxParams",
          value: function updateTxParams(e, t) {
            var a = this.getTx(e);
            a.txParams = c(a.txParams, t), this.updateTx(a, "txStateManager#updateTxParams")
          }
        }, {
          key: "validateTxParams",
          value: function validateTxParams(e) {
            Object.keys(e).forEach((function (t) {
              var a = e[t];
              switch (t) {
                case "chainId":
                  if ("number" !== typeof a && "string" !== typeof a) throw new Error("".concat(t, " in txParams is not a Number or hex string. got: (").concat(a, ")"));
                  break;
                default:
                  if ("string" !== typeof a) throw new Error("".concat(t, " in txParams is not a string. got: (").concat(a, ")"));
                  break
              }
            }))
          }
        }, {
          key: "getFilteredTxList",
          value: function getFilteredTxList(e, t) {
            var a = this,
              r = t;
            return Object.keys(e).forEach((function (t) {
              r = a.getTxsByMetaData(t, e[t], r)
            })), r
          }
        }, {
          key: "getTxsByMetaData",
          value: function getTxsByMetaData(e, t) {
            var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.getTxList();
            return a.filter((function (a) {
              return e in a.txParams ? a.txParams[e] === t : a[e] === t
            }))
          }
        }, {
          key: "getTxStatus",
          value: function getTxStatus(e) {
            var t = this.getTx(e);
            return t.status
          }
        }, {
          key: "setTxStatusRejected",
          value: function setTxStatusRejected(e) {
            this._setTxStatus(e, "rejected"), this._removeTx(e)
          }
        }, {
          key: "setTxStatusUnapproved",
          value: function setTxStatusUnapproved(e) {
            this._setTxStatus(e, "unapproved")
          }
        }, {
          key: "setTxStatusApproved",
          value: function setTxStatusApproved(e) {
            this._setTxStatus(e, "approved")
          }
        }, {
          key: "setTxStatusSigned",
          value: function setTxStatusSigned(e) {
            this._setTxStatus(e, "signed")
          }
        }, {
          key: "setTxStatusSubmitted",
          value: function setTxStatusSubmitted(e) {
            var t = this.getTx(e);
            t.submittedTime = (new Date).getTime(), this.updateTx(t, "txStateManager - add submitted time stamp"), this._setTxStatus(e, "submitted")
          }
        }, {
          key: "setTxStatusConfirmed",
          value: function setTxStatusConfirmed(e) {
            this._setTxStatus(e, "confirmed")
          }
        }, {
          key: "setTxStatusDropped",
          value: function setTxStatusDropped(e) {
            this._setTxStatus(e, "dropped")
          }
        }, {
          key: "setTxStatusFailed",
          value: function setTxStatusFailed(e, t) {
            var a = t || new Error("Internal metamask failure"),
              r = this.getTx(e);
            r.err = {
              message: a.toString(),
              rpc: a.value,
              stack: a.stack
            }, this.updateTx(r, "transactions:tx-state-manager#fail - add error"), this._setTxStatus(e, "failed")
          }
        }, {
          key: "wipeTransactions",
          value: function wipeTransactions(e) {
            var t = this.getFullTxList(),
              a = this.getNetwork(),
              r = t.filter((function (t) {
                return !(t.txParams.from === e && t.metamaskNetworkId === a)
              }));
            this._saveTxList(r)
          }
        }, {
          key: "_setTxStatus",
          value: function _setTxStatus(e, t) {
            var a = this,
              r = this.getTx(e);
            r && (r.status = t, setTimeout((function () {
              try {
                a.updateTx(r, "txStateManager: setting status to ".concat(t)), a.emit("".concat(r.id, ":").concat(t), e), a.emit("tx:status-update", e, t), ["submitted", "rejected", "failed"].includes(t) && a.emit("".concat(r.id, ":finished"), r), a.emit("update:badge")
              } catch (n) {
                u.error(n)
              }
            })))
          }
        }, {
          key: "_saveTxList",
          value: function _saveTxList(e) {
            this.store.updateState({
              transactions: e
            })
          }
        }, {
          key: "_removeTx",
          value: function _removeTx(e) {
            var t = this.getFullTxList();
            this._saveTxList(t.filter((function (t) {
              return t.id !== e
            })))
          }
        }]), TransactionStateManager
      }(l);
    t["default"] = m
  },
  "922d": function (e, t, a) {
    e.exports = a.p + "img/ren.17793fd4.svg"
  },
  9291: function (e, t, a) {
    e.exports = a.p + "img/lavender-mask.6bd3f8c2.svg"
  },
  "92fb": function (e, t, a) {
    e.exports = a.p + "img/omg.b99f4a14.jpg"
  },
  "930f": function (e, t, a) {
    "use strict";
    var r = a("cf49"),
      n = a.n(r);
    n.a
  },
  "94a0": function (e, t, a) {
    e.exports = a.p + "img/eos-logo.1502ae94.jpeg"
  },
  "94ce": function (e, t, a) {
    e.exports = a.p + "img/open-in-new-grey.73447eb5.svg"
  },
  9673: function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAsCAMAAACJzFexAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAqNQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////h3p+VgAAAOF0Uk5TAEC/YJ8g/4DlJEnfEluVxsSLXQ1ShEwXfzIYSkZ3r+/Zp0OKuPHWcUVVjkiSueiH7dMEnqLRnaSttuHeCXw3OsmJKKEl8nNQ7CLzD3qm9VHwzCYRx8/2u2/IOZNjKlOW6z0nduIQNllnq1wd5HDuDo+sFrEUBlrnG+PXOEKXDDNtg80ckNwLPrB0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"
  },
  9718: function (e, t, a) {
    e.exports = a.p + "img/plus.854a9aa7.svg"
  },
  "974a": function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  "974e": function (e, t, a) {
    var r = a("a0c3");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("382b4190", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  9752: function (e, t, a) {
    e.exports = a.p + "img/0xbitcoin.b3bf5330.svg"
  },
  9777: function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  "97b1": function (e, t, a) {
    e.exports = a.p + "img/SpendCoin.4ebeda12.png"
  },
  "97ed": function (e, t, a) {
    "use strict";
    var r = a("1970"),
      n = a.n(r);
    n.a
  },
  "982a": function (e, t, a) {
    e.exports = a.p + "img/indorseLogo.68bcdb62.jpg"
  },
  "98b6": function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURf/////++//+////+4GZsfv//4GasP7//////f7+/oGaroCasYCbsIOZsP/+/P//+vz///n//0lvk0RxkkhvjHaLnkxtjkRwk+/8/1FrgkxuiU9sjE9qhUdvkkpskUlwmUxwkktujk9th7TCzU5tikNtlfn9/3uMnH+QoNHe54ecr4mesaq4w4Kasvr//4SbrYGXrICZr+r1/v/++oKXqISds5ams4ecrdHl84SZrICTpH+ar4KZq//+/X+btISZrn+bsf/++fP8///9//f//5Gjsfr+//7//YKarP3//oCQoPz//f//+IKbr8/d6f7+//f8/4ibqoCas4qbq7G9xv79/f/9/v7/9HyctoKcsYabsfb///7/+///9n2atH6ct4WWp36asvz/+/X///37+fv9/oOSoISWqe3////++IOZsfv7/NTc5bC9yEJyjYyZpPT6/5Ceq+bx+YabruLr81Frj4KTo46etN3k6oGetPX+/7C6womar4CNmImds4SbtE9tlExsh/H////793+broWZqkVunK+8y0Nxj624wYearIiesH2Nndrj7EdgfoGQnH6Yq05uhExvgkVxlYuerYaVoY2frpaouJ6ps1FriUhsltjh6ZGcpk5vk2N8i1hrivf5+X2TpIWYp/79//j/+Km4xu30+4ybqICXsHqQpEdvkICWq5ajrev7/9zn8EhqhK7E0kltmIOdsd7r9ktwhn6Up0xvi3qJmOfz/E1sk9Xp+kRyilhne0drf0lynbPG2UdojfT4/IKatNTd6qi1ws7a5IqVnoKWrrbBxoWgt09ufdHW3Pr/+/X+/HKLnkdccFJxj0lzjkdfg93j901xl//8/87l9dHk+HmXrHyYr4iap3yWr+Xq7k1rgVNwiU1qju3w8+Lt/VRwlmN5l1FneGR4kUZuiXSEksbk9UpvicrS2XqToXaXs7vDyIKYr0dxh5Kgrllziz9mhVBoirnM1E50ksDIz05kgWWClE1khk1wjmV3g09xik5oi0BqkqOxvf+0pugAAAwYSURBVHja7Nx5VFNXHgfwl+XlPrK+Jwii1TqtAmJlC7glJAHeQAQ0EKSSWAQGRGMcqQscpawC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"
  },
  "9bb4": function (e, t) {
    var a = "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
      r = "0x9f510b19f1ad66f0dcf6e45559fab0d6752c1db7",
      n = "0xb8e671734ce5c8d7dfbbea5574fa4cf39f7a54a4",
      s = "0xb1d3fbb2f83aecd196f474c16ca5d9cffa0d0ffc";
    e.exports = {
      SINGLE_CALL_BALANCES_ADDRESS: a,
      SINGLE_CALL_BALANCES_ADDRESS_RINKEBY: r,
      SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN: n,
      SINGLE_CALL_BALANCES_ADDRESS_KOVAN: s
    }
  },
  "9d50": function (e, t, a) {
    "use strict";
    var r = a("1a00"),
      n = a("4360"),
      s = a("b00c"),
      o = a("fa7d"),
      i = a("5c7d"),
      c = a("4879"),
      l = a("9e52"),
      d = a("d485"),
      u = a("f234").default;

    function onloadTorus(e) {
      function triggerUi(e) {
        i.info("TRIGGERUI:" + e), n["a"].dispatch("showPopup")
      }
      var t;
      Object(o["storageAvailable"])("sessionStorage") && (t = sessionStorage.getItem("torus-app"));
      var a = t && JSON.parse(t).networkType || {
          host: s["MAINNET"],
          chainId: s["MAINNET_CODE"],
          networkName: s["MAINNET_DISPLAY_NAME"]
        },
        p = new r["a"]({
          sessionCachedNetwork: a,
          showUnconfirmedMessage: triggerUi.bind(window, "showUnconfirmedMessage"),
          unlockAccountMessage: triggerUi.bind(window, "unlockAccountMessage"),
          showUnapprovedTx: triggerUi.bind(window, "showUnapprovedTx"),
          openPopup: triggerUi.bind(window, "bindopenPopup"),
          storeProps: function storeProps() {
            var e = n["a"] || {},
              t = e.state,
              a = t || {},
              r = a.selectedAddress,
              s = a.wallet;
            return {
              selectedAddress: r,
              wallet: s
            }
          },
          rehydrate: function rehydrate() {
            n["a"].dispatch("rehydrate")
          }
        }),
        g = new l({
          name: "iframe_metamask",
          target: "embed_metamask",
          targetWindow: window.parent
        }),
        f = new l({
          name: "iframe_comm",
          target: "embed_comm",
          targetWindow: window.parent
        });
      e.torusController = p, e.metamaskMux = u(g), e.communicationMux = u(f), e.communicationMux.setMaxListeners(50), p.provider.setMaxListeners(100), e.web3 = new c(p.provider), e.setProviderType = function (e, t) {
        return n["a"].dispatch("setProviderType", {
          network: e,
          type: t
        })
      };
      var v = new d.PassThrough({
        objectMode: !0
      });
      v.on("data", (function () {
        i.info("receivePassThroughStream", arguments)
      }));
      var h = new d.PassThrough({
        objectMode: !0
      });
      h.on("data", (function () {
        i.info("sendPassThroughStream", arguments)
      }));
      var m = e.metamaskMux.getStream("provider");
      return p.setupTrustedCommunication(m, "metamask"), e
    }
    t["a"] = onloadTorus
  },
  "9d6e": function (e, t, a) {
    e.exports = a.p + "img/key-large.686efa12.svg"
  },
  "9dd1": function (e, t, a) {
    var r = a("5ffc");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("6aac57d6", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  "9e49": function (e, t, a) {
    e.exports = a.p + "img/close.2d31cf2a.svg"
  },
  "9e62": function (e, t, a) {
    "use strict";
    var r = a("6c44"),
      n = a.n(r);
    n.a
  },
  "9e74": function (e, t, a) {
    e.exports = a.p + "img/ENTRP.0b0f7533.png"
  },
  "9ea8": function (e, t, a) {
    e.exports = a.p + "img/rlc.d350f897.svg"
  },
  "9fc7": function (e, t, a) {
    "use strict";
    var r = a("3717"),
      n = a.n(r);
    n.a
  },
  a07b: function (e, t, a) {
    e.exports = a.p + "img/ego_badge.eab00419.png"
  },
  a0c3: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-topup-crypto .link-container[data-v-66ee6dcb]{width:100%}", ""])
  },
  a1a6: function (e, t, a) {
    e.exports = a.p + "img/bcap.6ea7f776.svg"
  },
  a22e: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, '.topup-providers .coming-soon[data-v-a7c3e2c2]{opacity:.4}.v-tooltip__content[data-v-a7c3e2c2]{background:#fff;border:1px solid var(--v-primary-base);color:var(--v-primary-base)}.v-tooltip__content[data-v-a7c3e2c2]:after{content:" ";position:absolute;transform:rotate(90deg);top:50%;left:0;margin-left:-10px;margin-top:-5px;border-width:5px;border-style:solid;border-color:var(--v-primary-base) transparent transparent transparent}.v-card.theme--dark.active[data-v-a7c3e2c2]{background:var(--v-background_4-base)}.v-card a[data-v-a7c3e2c2]{text-decoration:none}', ""])
  },
  a299: function (e, t, a) {
    e.exports = a.p + "img/moon-pay-logo.90c07828.svg"
  },
  a2a3: function (e, t, a) {
    "use strict";
    var r = a("73bb"),
      n = a.n(r);
    n.a
  },
  a2ab: function (e, t, a) {
    "use strict";
    var r = a("974e"),
      n = a.n(r);
    n.a
  },
  a345: function (e, t, a) {
    e.exports = a.p + "img/like.a68392c6.svg"
  },
  a3ab: function (e, t, a) {
    e.exports = a.p + "img/gladius.9901f9d7.svg"
  },
  a3ed: function (e, t, a) {
    e.exports = a.p + "img/rivetz.dc2ef8c7.png"
  },
  a442: function (e, t, a) {
    e.exports = a.p + "img/XSC_Logo.cb528376.svg"
  },
  a49d: function (e, t, a) {
    e.exports = a.p + "img/check-circle-white.08237967.svg"
  },
  a4e8f: function (e, t, a) {
    e.exports = a.p + "img/apple-touch-icon-120x120.44603a79.png"
  },
  a5f5: function (e, t, a) {
    "use strict";
    a.r(t);
    var r = a("bf2d"),
      n = a("9f12"),
      s = a("53fe"),
      o = a("8b83"),
      i = a("c65a"),
      c = a("c03e"),
      l = a("faa1"),
      d = function (e) {
        function ObservableStore() {
          var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return Object(n["a"])(this, ObservableStore), e = Object(o["a"])(this, Object(i["a"])(ObservableStore).call(this)), e._state = t, e
        }
        return Object(c["a"])(ObservableStore, e), Object(s["a"])(ObservableStore, [{
          key: "getState",
          value: function getState() {
            return this._getState()
          }
        }, {
          key: "putState",
          value: function putState(e) {
            this._putState(e), this.emit("update", e)
          }
        }, {
          key: "updateState",
          value: function updateState(e) {
            if (e && "object" === Object(r["a"])(e)) {
              var t = this.getState(),
                a = Object.assign({}, t, e);
              this.putState(a)
            } else this.putState(e)
          }
        }, {
          key: "subscribe",
          value: function subscribe(e) {
            this.on("update", e)
          }
        }, {
          key: "unsubscribe",
          value: function unsubscribe(e) {
            this.removeListener("update", e)
          }
        }, {
          key: "_getState",
          value: function _getState() {
            return this._state
          }
        }, {
          key: "_putState",
          value: function _putState(e) {
            this._state = e
          }
        }]), ObservableStore
      }(l);
    t["default"] = d
  },
  a63e: function (e, t, a) {
    var r = a("891f");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("0d6600f4", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  a6c8: function (e, t, a) {
    e.exports = a.p + "img/golem.535403df.svg"
  },
  a7a4: function (e, t, a) {
    "use strict";
    var r = a("d627"),
      n = a.n(r);
    n.a
  },
  a87c: function (e, t, a) {
    e.exports = a.p + "img/wallet-blue.2406dff7.svg"
  },
  a885: function (e, t, a) {
    e.exports = a.p + "img/globe.49420ff2.svg"
  },
  a9d9: function (e, t, a) {
    "use strict";
    var r = a("3e90"),
      n = a.n(r);
    n.a
  },
  ab61: function (e, t, a) {
    e.exports = a.p + "img/torus-circle.12d37b37.svg"
  },
  ab72: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".learn-more[data-v-6a318ad9]{background-image:url(/images/footer_waves.png);background-repeat:no-repeat;background-position:bottom;background-size:100%;border-radius:15px}.learn-more .v-stepper__content[data-v-6a318ad9]{padding:0;height:550px;transition:none}.learn-more .next-btn[data-v-6a318ad9]{position:absolute;bottom:48px;right:48px}", ""])
  },
  ac9c: function (e, t, a) {
    e.exports = a.p + "img/loom.6b3f22f5.svg"
  },
  acf3: function (e, t, a) {
    e.exports = a.p + "img/icon-icx-logo.82f6eb6d.png"
  },
  adb0: function (e, t, a) {
    e.exports = a.p + "img/1st.9d0a7b5b.svg"
  },
  af19: function (e, t, a) {
    e.exports = a.p + "img/Rmesh.b5382478.png"
  },
  af1f: function (e, t, a) {
    e.exports = a.p + "img/logo-maker-4.36ae0d81.svg"
  },
  af40: function (e, t, a) {
    e.exports = a.p + "img/t-fill.8c603134.svg"
  },
  afe3: function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  b00c: function (e, t, a) {
    var r, n = a("d382"),
      s = "eth",
      o = "ropsten",
      i = "rinkeby",
      c = "kovan",
      l = "mainnet",
      d = "localhost",
      u = "goerli",
      p = "rpc",
      g = "matic",
      f = 1,
      v = 3,
      h = 4,
      m = 42,
      b = 5,
      x = 4626,
      y = 5777,
      w = "Ropsten Test Network",
      k = "Rinkeby Test Network",
      C = "Kovan Test Network",
      A = "Main Ethereum Network",
      T = "Goerli Test Network",
      _ = "RPC",
      S = "https://localhost:8545",
      O = "Matic Alpha-Mainnet",
      E = "https://alpha.ethereum.matic.network",
      I = "cancel",
      M = "retry",
      P = "standard",
      R = "approved",
      L = "confirmed",
      j = "transfer",
      D = "approve",
      N = "transferFrom",
      B = "safeTransferFrom",
      V = "sentEther",
      F = "contractDeployment",
      U = "contractInteraction",
      H = "0x0000000000000000000000000000000000000000",
      G = "0x5b5e139f",
      K = "0x780e9d63",
      Y = "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
      q = "active",
      z = "inactive",
      W = "user_info_request_approved",
      Q = "user_info_request_rejected",
      J = "user_info_request_new",
      Z = "eth",
      X = "erc20",
      $ = "erc721",
      ee = function createNetwork(e, t, a) {
        return {
          host: e,
          networkName: t,
          chainId: a
        }
      },
      te = (r = {}, n(r, l, ee(l, A, f)), n(r, i, ee(i, k, h)), n(r, c, ee(c, C, m)), n(r, o, ee(o, w, v)), n(r, u, ee(u, T, b)), n(r, d, ee(d, S, y)), n(r, g, ee(g, O, x)), r),
      ae = "My Wallet",
      re = "Transfer Details",
      ne = "Transaction Activities",
      se = "Confirm your Transfer",
      oe = "All Transactions",
      ie = "Send",
      ce = "Receive",
      le = "Top up",
      de = "All",
      ue = "Last 1 Week",
      pe = "Last 1 Month",
      ge = "Last 6 Months",
      fe = "google",
      ve = "facebook",
      he = "reddit",
      me = "discord",
      be = "twitch",
      xe = "ETH Address",
      ye = "Google Email",
      we = "Facebook ID",
      ke = "Reddit Username",
      Ce = "Discord ID",
      Ae = "Twitch ID",
      Te = "dark-black",
      _e = "light-blue",
      Se = ["0x06012c8cf97bead5deae237070f9587f8e7a266d"],
      Oe = [{
        name: xe,
        value: s
      }, {
        name: ye,
        value: fe
      }, {
        name: ke,
        value: he
      }, {
        name: Ce,
        value: me
      }];
    e.exports = {
      ETH: s,
      ROPSTEN: o,
      RINKEBY: i,
      KOVAN: c,
      MAINNET: l,
      LOCALHOST: d,
      GOERLI: u,
      RPC: p,
      MAINNET_CODE: f,
      ROPSTEN_CODE: v,
      RINKEBY_CODE: h,
      GOERLI_CODE: b,
      KOVAN_CODE: m,
      ROPSTEN_DISPLAY_NAME: w,
      RINKEBY_DISPLAY_NAME: k,
      KOVAN_DISPLAY_NAME: C,
      MAINNET_DISPLAY_NAME: A,
      GOERLI_DISPLAY_NAME: T,
      RPC_DISPLAY_NAME: _,
      LOCALHOST_DISPLAY_NAME: S,
      TRANSACTION_TYPE_CANCEL: I,
      TRANSACTION_TYPE_RETRY: M,
      TRANSACTION_TYPE_STANDARD: P,
      TRANSACTION_STATUS_APPROVED: R,
      TRANSACTION_STATUS_CONFIRMED: L,
      ZERO_ADDRESS: H,
      TOKEN_METHOD_APPROVE: D,
      TOKEN_METHOD_TRANSFER: j,
      TOKEN_METHOD_TRANSFER_FROM: N,
      SEND_ETHER_ACTION_KEY: V,
      DEPLOY_CONTRACT_ACTION_KEY: F,
      CONTRACT_INTERACTION_KEY: U,
      MATIC_URL: E,
      MATIC_DISPLAY_NAME: O,
      MATIC: g,
      MATIC_CODE: x,
      ACTIVE: q,
      INACTIVE: z,
      USER_INFO_REQUEST_APPROVED: W,
      USER_INFO_REQUEST_REJECTED: Q,
      USER_INFO_REQUEST_NEW: J,
      SUPPORTED_NETWORK_TYPES: te,
      WALLET_HEADERS_HOME: ae,
      WALLET_HEADERS_TRANSFER: re,
      WALLET_HEADERS_ACTIVITY: ne,
      WALLET_HEADERS_CONFIRM: se,
      ACTIVITY_ACTION_ALL: oe,
      ACTIVITY_ACTION_SEND: ie,
      ACTIVITY_ACTION_RECEIVE: ce,
      ACTIVITY_ACTION_TOPUP: le,
      ACTIVITY_PERIOD_ALL: de,
      ACTIVITY_PERIOD_WEEK_ONE: ue,
      ACTIVITY_PERIOD_MONTH_ONE: pe,
      ACTIVITY_PERIOD_MONTH_SIX: ge,
      GOOGLE: fe,
      FACEBOOK: ve,
      TWITCH: be,
      REDDIT: he,
      DISCORD: me,
      ETH_LABEL: xe,
      GOOGLE_LABEL: ye,
      FACEBOOK_LABEL: we,
      REDDIT_LABEL: ke,
      DISCORD_LABEL: Ce,
      TWITCH_LABEL: Ae,
      THEME_DARK_BLACK_NAME: Te,
      THEME_LIGHT_BLUE_NAME: _e,
      ERC721METADATA_INTERFACE_ID: G,
      ERC721ENUMERABLE_INTERFACE_ID: K,
      SINGLE_CALL_BALANCES_ADDRESS: Y,
      CONTRACT_TYPE_ETH: Z,
      CONTRACT_TYPE_ERC20: X,
      CONTRACT_TYPE_ERC721: $,
      COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM: B,
      OLD_ERC721_LIST: Se,
      ALLOWED_VERIFIERS: Oe
    }
  },
  b022: function (e, t, a) {
    e.exports = a.p + "img/blublu-cross-arms.ea699e58.png"
  },
  b0b5: function (e, t, a) {
    e.exports = a.p + "img/wyre-logo-white.73ac53d9.svg"
  },
  b0dc: function (e, t, a) {
    e.exports = a.p + "img/settings.00759a97.svg"
  },
  b126: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".upload-button.v-btn[data-v-e4baa33c]{border-style:dashed}", ""])
  },
  b1b4: function (e, t, a) {
    e.exports = a.p + "img/dutyof.care-square.68ba762c.png"
  },
  b1c2: function (e, t, a) {
    e.exports = a.p + "img/file-signature.e4c95b71.svg"
  },
  b22d: function (e, t, a) {
    var r = {
      "./eye-off-primary.svg": "1a30",
      "./eye-primary.svg": "7777"
    };

    function webpackContext(e) {
      var t = webpackContextResolve(e);
      return a(t)
    }

    function webpackContextResolve(e) {
      if (!a.o(r, e)) {
        var t = new Error("Cannot find module '" + e + "'");
        throw t.code = "MODULE_NOT_FOUND", t
      }
      return r[e]
    }
    webpackContext.keys = function webpackContextKeys() {
      return Object.keys(r)
    }, webpackContext.resolve = webpackContextResolve, e.exports = webpackContext, webpackContext.id = "b22d"
  },
  b241: function (e, t, a) {
    e.exports = a.p + "img/dai.a4f58176.svg"
  },
  b291: function (e, t, a) {
    var r = a("eb54");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("005fa289", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  b2da: function (e, t, a) {
    e.exports = a.p + "img/torus-people-colored.6b003090.svg"
  },
  b2e1: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return createMetamaskMiddleware
    }));
    a("d3b7"), a("96cf");
    var r = a("09b1"),
      n = a("d5a1"),
      s = a("c3dd"),
      o = a("e8fa");

    function createMetamaskMiddleware(e) {
      var t = e.version,
        a = e.getAccounts,
        s = e.processTransaction,
        i = e.processEthSignMessage,
        c = e.processTypedMessage,
        l = e.processTypedMessageV3,
        d = e.processTypedMessageV4,
        u = e.processPersonalMessage,
        p = e.getPendingNonce,
        g = r([n({
          eth_syncing: !1,
          web3_clientVersion: "MetaMask/v".concat(t)
        }), o({
          getAccounts: a,
          processTransaction: s,
          processEthSignMessage: i,
          processTypedMessage: c,
          processTypedMessageV3: l,
          processTypedMessageV4: d,
          processPersonalMessage: u
        }), createPendingNonceMiddleware({
          getPendingNonce: p
        })]);
      return g
    }

    function createPendingNonceMiddleware(e) {
      var t = e.getPendingNonce;
      return s((function _callee(e, a, r) {
        var n, s;
        return regeneratorRuntime.async((function _callee$(o) {
          while (1) switch (o.prev = o.next) {
            case 0:
              if ("eth_getTransactionCount" === e.method) {
                o.next = 2;
                break
              }
              return o.abrupt("return", r());
            case 2:
              if (n = e.params[0], s = e.params[1], "pending" === s) {
                o.next = 6;
                break
              }
              return o.abrupt("return", r());
            case 6:
              return o.next = 8, regeneratorRuntime.awrap(t(n));
            case 8:
              a.result = o.sent;
            case 9:
            case "end":
              return o.stop()
          }
        }))
      }))
    }
  },
  b2f7: function (e, t, a) {
    e.exports = a.p + "img/pax.d3151b7e.svg"
  },
  b3d3: function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  b5aa: function (e, t, a) {
    e.exports = a.p + "img/aeternity.88f116c9.svg"
  },
  b676: function (e, t, a) {
    e.exports = a.p + "img/kucoin.9b43d371.svg"
  },
  b7a6: function (e, t, a) {
    e.exports = a.p + "img/edu.e949e5eb.svg"
  },
  b815: function (e, t, a) {
    e.exports = a.p + "img/RChain_logo.3be475d0.svg"
  },
  ba42: function (e, t, a) {
    e.exports = a.p + "img/android-chrome-512x512.2ccd252f.png"
  },
  bab5: function (e, t, a) {
    e.exports = a.p + "img/crypto-logo-white.ad96ad1c.png"
  },
  bba3: function (e, t, a) {
    e.exports = a.p + "img/ethereum-rainbow.ca7a8547.svg"
  },
  bc0f: function (e, t, a) {
    e.exports = a.p + "img/quant-network.257b4fdc.svg"
  },
  bc13: function (e, t, a) {
    e.exports = a.p + "img/key.2e33094e.svg"
  },
  bc4d: function (e, t, a) {
    e.exports = a.p + "img/tkn.76e58dff.svg"
  },
  bc5e: function (e, t, a) {
    var r = a("5c7d");

    function createLoggerMiddleware(e) {
      return function loggerMiddleware(t, a, n) {
        n((function (n) {
          a.error && r.error("Error in RPC response:\n", a), t.isMetamaskInternal || (r.info("RPC (".concat(e.origin, "):"), t, "->", a), n())
        }))
      }
    }
    e.exports = createLoggerMiddleware
  },
  bce6: function (e, t, a) {
    "use strict";
    var r = a("d553"),
      n = a.n(r);
    n.a
  },
  bd8d: function (e, t, a) {
    "use strict";
    a.r(t);
    a("99af"), a("caad"), a("d81d"), a("a9e3"), a("8ba4"), a("d3b7"), a("e25e"), a("2532");
    var r = a("bf2d"),
      n = (a("96cf"), a("9f12")),
      s = a("53fe"),
      o = a("58f5"),
      i = a("eeb9"),
      c = a("add0").Mutex,
      l = function () {
        function NonceTracker(e) {
          var t = e.provider,
            a = e.blockTracker,
            r = e.getPendingTransactions,
            s = e.getConfirmedTransactions;
          Object(n["a"])(this, NonceTracker), this.provider = t, this.blockTracker = a, this.ethQuery = new o(t), this.getPendingTransactions = r, this.getConfirmedTransactions = s, this.lockMap = {}
        }
        return Object(s["a"])(NonceTracker, [{
          key: "getGlobalLock",
          value: function getGlobalLock() {
            var e, t;
            return regeneratorRuntime.async((function getGlobalLock$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  return e = this._lookupMutex("global"), a.next = 3, regeneratorRuntime.awrap(e.acquire());
                case 3:
                  return t = a.sent, a.abrupt("return", {
                    releaseLock: t
                  });
                case 5:
                case "end":
                  return a.stop()
              }
            }), null, this)
          }
        }, {
          key: "getNonceLock",
          value: function getNonceLock(e) {
            var t, a, n, s, o, c, l, d, u;
            return regeneratorRuntime.async((function getNonceLock$(p) {
              while (1) switch (p.prev = p.next) {
                case 0:
                  return p.next = 2, regeneratorRuntime.awrap(this._globalMutexFree());
                case 2:
                  return p.next = 4, regeneratorRuntime.awrap(this._takeMutex(e));
                case 4:
                  return t = p.sent, p.prev = 5, a = {}, p.next = 9, regeneratorRuntime.awrap(this._getNetworkNextNonce(e));
                case 9:
                  return n = p.sent, s = this._getHighestLocallyConfirmed(e), o = n.nonce, c = Math.max(o, s), l = this.getPendingTransactions(e), d = this._getHighestContinuousFrom(l, c) || 0, a.params = {
                    highestLocallyConfirmed: s,
                    highestSuggested: c,
                    nextNetworkNonce: o
                  }, a.local = d, a.network = n, u = Math.max(n.nonce, d.nonce), i(Number.isInteger(u), "nonce-tracker - nextNonce is not an integer - got: (".concat(Object(r["a"])(u), ') "').concat(u, '"')), p.abrupt("return", {
                    nextNonce: u,
                    nonceDetails: a,
                    releaseLock: t
                  });
                case 23:
                  throw p.prev = 23, p.t0 = p["catch"](5), t(), p.t0;
                case 27:
                case "end":
                  return p.stop()
              }
            }), null, this, [
              [5, 23]
            ])
          }
        }, {
          key: "_globalMutexFree",
          value: function _globalMutexFree() {
            var e, t;
            return regeneratorRuntime.async((function _globalMutexFree$(a) {
              while (1) switch (a.prev = a.next) {
                case 0:
                  return e = this._lookupMutex("global"), a.next = 3, regeneratorRuntime.awrap(e.acquire());
                case 3:
                  t = a.sent, t();
                case 5:
                case "end":
                  return a.stop()
              }
            }), null, this)
          }
        }, {
          key: "_takeMutex",
          value: function _takeMutex(e) {
            var t, a;
            return regeneratorRuntime.async((function _takeMutex$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return t = this._lookupMutex(e), r.next = 3, regeneratorRuntime.awrap(t.acquire());
                case 3:
                  return a = r.sent, r.abrupt("return", a);
                case 5:
                case "end":
                  return r.stop()
              }
            }), null, this)
          }
        }, {
          key: "_lookupMutex",
          value: function _lookupMutex(e) {
            var t = this.lockMap[e];
            return t || (t = new c, this.lockMap[e] = t), t
          }
        }, {
          key: "_getNetworkNextNonce",
          value: function _getNetworkNextNonce(e) {
            var t, a, n, s;
            return regeneratorRuntime.async((function _getNetworkNextNonce$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  return o.next = 2, regeneratorRuntime.awrap(this.blockTracker.getLatestBlock());
                case 2:
                  return t = o.sent, o.next = 5, regeneratorRuntime.awrap(this.ethQuery.getTransactionCount(e, t));
                case 5:
                  return a = o.sent, n = a.toNumber(), i(Number.isInteger(n), "nonce-tracker - baseCount is not an integer - got: (".concat(Object(r["a"])(n), ') "').concat(n, '"')), s = {
                    blockNumber: t,
                    baseCount: n
                  }, o.abrupt("return", {
                    name: "network",
                    nonce: n,
                    details: s
                  });
                case 10:
                case "end":
                  return o.stop()
              }
            }), null, this)
          }
        }, {
          key: "_getHighestLocallyConfirmed",
          value: function _getHighestLocallyConfirmed(e) {
            var t = this.getConfirmedTransactions(e),
              a = this._getHighestNonce(t);
            return Number.isInteger(a) ? a + 1 : 0
          }
        }, {
          key: "_getHighestNonce",
          value: function _getHighestNonce(e) {
            var t = e.map((function (e) {
                var t = e.txParams.nonce;
                return i(Object(r["a"])(t), "string", "nonces should be hex strings"), parseInt(t, 16)
              })),
              a = Math.max.apply(null, t);
            return a
          }
        }, {
          key: "_getHighestContinuousFrom",
          value: function _getHighestContinuousFrom(e, t) {
            var a = e.map((function (e) {
                var t = e.txParams.nonce;
                return i(Object(r["a"])(t), "string", "nonces should be hex strings"), parseInt(t, 16)
              })),
              n = t;
            while (a.includes(n)) n++;
            return {
              name: "local",
              nonce: n,
              details: {
                startPoint: t,
                highest: n
              }
            }
          }
        }]), NonceTracker
      }();
    t["default"] = l
  },
  be5c: function (e, t, a) {
    e.exports = a.p + "img/santiment.cdc647b4.svg"
  },
  beea: function (e, t, a) {
    e.exports = a.p + "img/simplex-logo.32c80ffe.png"
  },
  bf2c: function (e, t, a) {
    e.exports = a.p + "img/etheremon.4616f372.png"
  },
  bf32: function (e, t, a) {
    e.exports = a.p + "img/augur_logo.9b6ab62c.png"
  },
  bf4f: function (e, t, a) {
    "use strict";
    var r = a("e7a3"),
      n = a.n(r);
    n.a
  },
  c004: function (e, t, a) {
    e.exports = a.p + "img/playkey.979dfc82.svg"
  },
  c059: function (e, t, a) {
    a("d3b7");
    var r = a("decd"),
      n = a("4697"),
      s = a("b671"),
      o = a("5c7d"),
      i = {
        importAccount: function importAccount(e, t) {
          try {
            var a = this.strategies[e],
              r = a.apply(null, t);
            return Promise.resolve(r)
          } catch (n) {
            return Promise.reject(n)
          }
        },
        strategies: {
          "Private Key": function PrivateKey(e) {
            if (!e) throw new Error("Cannot import an empty key.");
            var t = s.addHexPrefix(e),
              a = s.toBuffer(t);
            if (!s.isValidPrivate(a)) throw new Error("Cannot import invalid private key.");
            var r = s.stripHexPrefix(t);
            return r
          },
          "JSON File": function JSONFile(e, t) {
            var a;
            try {
              a = n.fromEtherWallet(e, t)
            } catch (s) {
              o.info("Attempt to import as EtherWallet format failed, trying V3...")
            }
            return a || (a = r.fromV3(e, t, !0)), walletToPrivateKey(a)
          }
        }
      };

    function walletToPrivateKey(e) {
      var t = e.getPrivateKey();
      return s.stripHexPrefix(s.bufferToHex(t))
    }
    e.exports = i
  },
  c0b7: function (e, t, a) {
    var r = a("b126");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("ae376e54", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  c1cf: function (e, t, a) {
    "use strict";
    var r = a("c28c"),
      n = a.n(r);
    n.a
  },
  c1e8: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return h
    }));
    a("99af"), a("4de4"), a("7db0"), a("c740"), a("13d5"), a("0d03"), a("b64b"), a("d3b7"), a("e25e");
    var r = a("bf2d"),
      n = a("9f12"),
      s = a("53fe"),
      o = a("8b83"),
      i = a("c65a"),
      c = a("c03e"),
      l = a("faa1"),
      d = a("c897"),
      u = a("d177").default,
      p = a("eeb9"),
      g = a("1ed9"),
      f = a("5c7d"),
      v = a("a41b"),
      h = function (e) {
        function TypedMessageManager(e) {
          var t, a = e.networkController;
          return Object(n["a"])(this, TypedMessageManager), t = Object(o["a"])(this, Object(i["a"])(TypedMessageManager).call(this)), t.networkController = a, t.store = new d({
            unapprovedTypedMessages: {},
            unapprovedTypedMessagesCount: 0
          }), t.messages = [], t
        }
        return Object(c["a"])(TypedMessageManager, e), Object(s["a"])(TypedMessageManager, [{
          key: "getUnapprovedMsgs",
          value: function getUnapprovedMsgs() {
            return this.messages.filter((function (e) {
              return "unapproved" === e.status
            })).reduce((function (e, t) {
              return e[t.id] = t, e
            }), {})
          }
        }, {
          key: "addUnapprovedMessageAsync",
          value: function addUnapprovedMessageAsync(e, t, a) {
            var r = this;
            return new Promise((function (n, s) {
              var o = r.addUnapprovedMessage(e, t, a);
              r.once("".concat(o, ":finished"), (function (t) {
                switch (t.status) {
                  case "signed":
                    return n(t.rawSig);
                  case "rejected":
                    return s(new Error("MetaMask Message Signature: User denied message signature."));
                  case "errored":
                    return s(new Error("MetaMask Message Signature: ".concat(t.error)));
                  default:
                    return s(new Error("MetaMask Message Signature: Unknown problem: ".concat(JSON.stringify(e))))
                }
              }))
            }))
          }
        }, {
          key: "addUnapprovedMessage",
          value: function addUnapprovedMessage(e, t, a) {
            e.version = a, this.validateParams(e), t && (e.origin = t.origin), f.debug("TypedMessageManager addUnapprovedMessage: ".concat(JSON.stringify(e)));
            var r = (new Date).getTime(),
              n = u(),
              s = {
                id: n,
                msgParams: e,
                time: r,
                status: "unapproved",
                type: "eth_signTypedData"
              };
            return this.addMsg(s), this.emit("update"), n
          }
        }, {
          key: "validateParams",
          value: function validateParams(e) {
            switch (e.version) {
              case "V1":
                p.strictEqual(Object(r["a"])(e), "object", "Params should ben an object."), p.ok("data" in e, "Params must include a data field."), p.ok("from" in e, "Params must include a from field."), p.ok(Array.isArray(e.data), "Data should be an array."), p.strictEqual(Object(r["a"])(e.from), "string", "From field must be a string."), p.doesNotThrow((function () {
                  g.typedSignatureHash(e.data)
                }), "Expected EIP712 typed data");
                break;
              case "V3":
              case "V4":
                var t;
                p.strictEqual(Object(r["a"])(e), "object", "Params should be an object."), p.ok("data" in e, "Params must include a data field."), p.ok("from" in e, "Params must include a from field."), p.strictEqual(Object(r["a"])(e.from), "string", "From field must be a string."), p.strictEqual(Object(r["a"])(e.data), "string", "Data must be passed as a valid JSON string."), p.doesNotThrow((function () {
                  t = JSON.parse(e.data)
                }), "Data must be passed as a valid JSON string.");
                var a = v.validate(t, g.TYPED_MESSAGE_SCHEMA);
                p.ok(t.primaryType in t.types, 'Primary type of "'.concat(t.primaryType, '" has no type definition.')), p.strictEqual(a.errors.length, 0, "Data must conform to EIP-712 schema. See https://git.io/fNtcx.");
                var n = t.domain.chainId,
                  s = parseInt(this.networkController.getNetworkState());
                n && p.strictEqual(n, s, "Provided chainId (".concat(n, ") must match the active chainId (").concat(s, ")"));
                break
            }
          }
        }, {
          key: "addMsg",
          value: function addMsg(e) {
            this.messages.push(e), this._saveMsgList()
          }
        }, {
          key: "getMsg",
          value: function getMsg(e) {
            return this.messages.find((function (t) {
              return t.id === e
            }))
          }
        }, {
          key: "approveMessage",
          value: function approveMessage(e) {
            return this.setMsgStatusApproved(e.metamaskId), this.prepMsgForSigning(e)
          }
        }, {
          key: "setMsgStatusApproved",
          value: function setMsgStatusApproved(e) {
            this._setMsgStatus(e, "approved")
          }
        }, {
          key: "setMsgStatusSigned",
          value: function setMsgStatusSigned(e, t) {
            var a = this.getMsg(e);
            a.rawSig = t, this._updateMsg(a), this._setMsgStatus(e, "signed")
          }
        }, {
          key: "prepMsgForSigning",
          value: function prepMsgForSigning(e) {
            return delete e.metamaskId, delete e.version, Promise.resolve(e)
          }
        }, {
          key: "rejectMsg",
          value: function rejectMsg(e) {
            this._setMsgStatus(e, "rejected")
          }
        }, {
          key: "errorMessage",
          value: function errorMessage(e, t) {
            var a = this.getMsg(e);
            a.error = t, this._updateMsg(a), this._setMsgStatus(e, "errored")
          }
        }, {
          key: "_setMsgStatus",
          value: function _setMsgStatus(e, t) {
            var a = this.getMsg(e);
            if (!a) throw new Error('TypedMessageManager - Message not found for id: "'.concat(e, '".'));
            a.status = t, this._updateMsg(a), this.emit("".concat(e, ":").concat(t), a), "rejected" !== t && "signed" !== t && "errored" !== t || this.emit("".concat(e, ":finished"), a)
          }
        }, {
          key: "_updateMsg",
          value: function _updateMsg(e) {
            var t = this.messages.findIndex((function (t) {
              return t.id === e.id
            })); - 1 !== t && (this.messages[t] = e), this._saveMsgList()
          }
        }, {
          key: "_saveMsgList",
          value: function _saveMsgList() {
            var e = this.getUnapprovedMsgs(),
              t = Object.keys(e).length;
            this.store.updateState({
              unapprovedTypedMessages: e,
              unapprovedTypedMessagesCount: t
            }), this.emit("updateBadge")
          }
        }, {
          key: "unapprovedTypedMessagesCount",
          get: function get() {
            return Object.keys(this.getUnapprovedMsgs()).length
          }
        }]), TypedMessageManager
      }(l)
  },
  c22f: function (e, t, a) {
    e.exports = a.p + "img/address-card-regular.49819879.svg"
  },
  c27b: function (e, t) {
    e.exports = "data:image/png;base64,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"
  },
  c28c: function (e, t, a) {
    var r = a("c34a");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("6acb4572", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  c34a: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".activity-table-mobile .text-confirmed[data-v-1fc03d60],.activity-table-mobile .text-successful[data-v-1fc03d60]{color:#2dcc70}.activity-table-mobile .text-denied[data-v-1fc03d60],.activity-table-mobile .text-rejected[data-v-1fc03d60],.activity-table-mobile .text-unapproved[data-v-1fc03d60]{color:#e20d0d}.activity-table-mobile .text-pending[data-v-1fc03d60],.activity-table-mobile .text-submitted[data-v-1fc03d60]{color:#b3c0ce}.activity-table-mobile .text-gray[data-v-1fc03d60]{color:#5c6c7f}.activity-table-mobile[data-v-1fc03d60]  .v-expansion-panel-content__wrap{padding:0 8px 8px}", ""])
  },
  c3c5: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-transfer[data-v-7310d11d]  .v-messages{text-align:right}.wallet-transfer[data-v-7310d11d]  .v-messages.error--text{text-align:left}.wallet-transfer .select-coin[data-v-7310d11d]{border-color:var(--v-text_2-base);color:var(--v-text_1-base);font-size:14px;display:flex}.wallet-transfer .select-coin[data-v-7310d11d]  .v-chip__content{width:100%}.wallet-transfer .recipient-address[data-v-7310d11d]  .v-input__icon.v-input__icon--clear .v-icon.v-icon.v-icon--link{height:16px}", ""])
  },
  c54e: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, "body,html{height:inherit;overflow-y:auto!important;max-width:100%;overflow-x:hidden}.clearfix{clear:both}", ""])
  },
  c6eb: function (e, t, a) {
    "use strict";
    var r = a("56e7"),
      n = a.n(r);
    n.a
  },
  c7e3: function (e, t, a) {
    e.exports = a.p + "img/request-network.078daced.png"
  },
  c8b1: function (e, t, a) {
    e.exports = a.p + "img/dragonglass.0ab78e59.svg"
  },
  ca1f: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return u
    }));
    a("a4d3"), a("e01a"), a("99af"), a("b0c0"), a("a9e3"), a("d3b7"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("5c7d"),
      o = a("5e5c"),
      i = a("db49").default,
      c = a("b00c"),
      l = c.MAINNET,
      d = 6e4,
      u = function () {
        function AssetsDetectionController(e) {
          Object(r["a"])(this, AssetsDetectionController), this.interval = d, this.selectedAddress = "", this.network = e.network, this._provider = e.provider, this.assetController = e.assetController, this.assetContractController = e.assetContractController, this.jwtToken = ""
        }
        return Object(n["a"])(AssetsDetectionController, [{
          key: "setJwtToken",
          value: function setJwtToken(e) {
            this.jwtToken = e
          }
        }, {
          key: "restartAssetDetection",
          value: function restartAssetDetection() {
            this.selectedAddress && (this.detectAssets(), this.interval = d)
          }
        }, {
          key: "startAssetDetection",
          value: function startAssetDetection(e) {
            this.selectedAddress = e, this.restartAssetDetection()
          }
        }, {
          key: "getOwnerCollectiblesApi",
          value: function getOwnerCollectiblesApi(e) {
            return "https://api.opensea.io/api/v1/assets?owner=".concat(e, "&limit=300")
          }
        }, {
          key: "getOwnerCollectibles",
          value: function getOwnerCollectibles() {
            var e, t, a, r;
            return regeneratorRuntime.async((function getOwnerCollectibles$(n) {
              while (1) switch (n.prev = n.next) {
                case 0:
                  return e = this.selectedAddress, t = this.getOwnerCollectiblesApi(e), n.prev = 2, n.next = 5, regeneratorRuntime.awrap(o.get("".concat(i.api, "/opensea?url=").concat(t), {
                    headers: {
                      Authorization: "Bearer ".concat(this.jwtToken)
                    }
                  }));
                case 5:
                  return a = n.sent, r = a.data.assets, n.abrupt("return", r);
                case 10:
                  return n.prev = 10, n.t0 = n["catch"](2), s.error(n.t0), n.abrupt("return", []);
                case 14:
                case "end":
                  return n.stop()
              }
            }), null, this, [
              [2, 10]
            ])
          }
        }, {
          key: "isMainnet",
          value: function isMainnet() {
            return this.network.store.getState().provider.type === l
          }
        }, {
          key: "detectAssets",
          value: function detectAssets() {
            return regeneratorRuntime.async((function detectAssets$(e) {
              while (1) switch (e.prev = e.next) {
                case 0:
                  if (this.isMainnet()) {
                    e.next = 2;
                    break
                  }
                  return e.abrupt("return");
                case 2:
                  this.detectCollectibles();
                case 3:
                case "end":
                  return e.stop()
              }
            }), null, this)
          }
        }, {
          key: "detectCollectibles",
          value: function detectCollectibles() {
            var e, t, a, r, n, o, i, c, l, d, u, p, g, f, v;
            return regeneratorRuntime.async((function detectCollectibles$(h) {
              while (1) switch (h.prev = h.next) {
                case 0:
                  if (this.isMainnet()) {
                    h.next = 2;
                    break
                  }
                  return h.abrupt("return");
                case 2:
                  if (e = this.selectedAddress, e) {
                    h.next = 5;
                    break
                  }
                  return h.abrupt("return");
                case 5:
                  return s.info("starting asset detection"), this.assetController.setSelectedAddress(e), h.next = 9, regeneratorRuntime.awrap(this.getOwnerCollectibles());
                case 9:
                  t = h.sent, a = 0;
                case 11:
                  if (!(a < t.length)) {
                    h.next = 18;
                    break
                  }
                  return r = t[a], n = r.token_id, o = r.image_original_url, i = r.name, c = r.description, l = r.asset_contract, d = l.address, u = l.name, p = l.symbol, g = l.image_url, f = l.total_supply, v = l.description, h.next = 15, regeneratorRuntime.awrap(this.assetController.addCollectible(d, Number(n), {
                    description: c,
                    image: o,
                    name: i,
                    contractAddress: d,
                    contractName: u,
                    contractSymbol: p,
                    contractImage: g,
                    contractSupply: f,
                    contractDescription: v
                  }, !0));
                case 15:
                  a++, h.next = 11;
                  break;
                case 18:
                case "end":
                  return h.stop()
              }
            }), null, this)
          }
        }, {
          key: "interval",
          set: function set(e) {
            var t = this;
            this._handle && clearInterval(this._handle), e && (this._handle = setInterval((function () {
              t.detectAssets()
            }), e))
          }
        }]), AssetsDetectionController
      }()
  },
  ca5f: function (e, t, a) {
    e.exports = a.p + "img/t.d7a67693.svg"
  },
  cb13: function (e, t, a) {
    e.exports = a.p + "img/lun.fa01f3c8.png"
  },
  cb40: function (e, t, a) {
    e.exports = a.p + "img/trustcoin.c7cb5d85.jpg"
  },
  cd1b: function (e, t, a) {
    e.exports = a.p + "img/vechain.2d25df10.png"
  },
  cdb3: function (e, t, a) {
    e.exports = a.p + "img/plutus-god.c7a8f725.svg"
  },
  cdf2: function (e, t, a) {
    e.exports = a.p + "img/gee-icon.443d6f57.svg"
  },
  ce20: function (e, t, a) {
    e.exports = a.p + "img/wyre-logo.41ddc839.svg"
  },
  ce75: function (e, t, a) {
    e.exports = a.p + "img/appcoins.921c287d.png"
  },
  cea9: function (e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsSAAALEgHS3X78AAABxklEQVRIx8VW3W2DMBD+sPKevASFN7xBNiidIGwQRkgmKJ2gbFBngpAJSjdIJzBvlvxSMkH6ciDLAgwhSU9CAmPfd/fdj8+7Xq/oEz/gCwAJgIieubXlAuAMIAeQayXLPn1eFyABZQC2GCcHAGkXcCugH/AYgGjxZqhcAOy0ksL+wVrAUgDHCWCgs59+wPsBCewN95OtDdpQSjQe8RjZayWzBpASpJxIoyuma61kOaOFbATYN4CC3iMALwNjmgJIvOUqXAD4HXDoRJlXWnEPyeDNAB2cUVE7a0srGbfVllay1ErGAPYD9OwY0dLrmVbSaRQlxcmxLfKWq7ByxI+bnhGFtQGi5Z/sbW3LVdjXTH+0kmtL4dkwsMk+Y88OwKJL4cxBQWV9JxYbc1pLLWo7hY2sp2pqQbo8tKnJyRuTUmGVSU2p0EqWVszxyKR51UoWfsAjAF+mh4WjaDMAsVl3Zsxa9trsrM0kZEab6pKNH/DMFRu6aUzDBa19GGvF01tbfVuIEaPELc27bo/J068nRolQDWzit0ozVDEj+3IA7w8AO5jdh1kdP70z6MG+af5/TDToDWmoHe0VJYgYNXlbE3hMz+RR/w+ZOOf0Zt3gdAAAAABJRU5ErkJggg=="
  },
  cf3f: function (e, t, a) {
    "use strict";
    (function (e) {
      a("0d03"), a("b0c0"), a("d3b7"), a("25f0"), a("3ca3"), a("ddb0"), a("2b3d");
      var r = a("bf2d"),
        n = a("082e"),
        s = a("decd"),
        o = a("b671"),
        i = a("d7bc");
      t["a"] = {
        components: {
          ShowToolTip: n["a"]
        },
        data: function data() {
          return {
            isShowPrivateKey: !1,
            isShowGetPassword: !1,
            showJsonPassword: !1,
            keyStorePassword: "",
            walletJson: "",
            name: "",
            isLoadingDownloadWallet: !1,
            downloadFormValid: !0,
            rules: {
              required: function required(e) {
                return !!e || "Required."
              }
            }
          }
        },
        computed: {
          selectedAddress: function selectedAddress() {
            return this.$store.state.selectedAddress
          },
          selectedKey: function selectedKey() {
            return this.$store.state.wallet[this.selectedAddress]
          }
        },
        methods: {
          onClose: function onClose() {
            this.isShowPrivateKey = !1, this.isShowGetPassword = !1, this.showJsonPassword = !1, this.keyStorePassword = "", this.walletJson = "", this.name = "", this.$emit("onClose")
          },
          downloadWallet: function downloadWallet() {
            var e = this;
            if (this.$refs.downloadForm.validate())
              if (this.isLoadingDownloadWallet = !0, window.Worker) {
                var t = new i;
                t.postMessage({
                  type: "createWallet",
                  data: [this.keyStorePassword, this.selectedKey]
                }), t.onmessage = function (t) {
                  var a = t.data;
                  e.exportKeyStoreFile(a), e.isLoadingDownloadWallet = !1
                }
              } else {
                var a = this.createWallet(this.keyStorePassword);
                this.exportKeyStoreFile(a), this.isLoadingDownloadWallet = !1
              }
          },
          exportKeyStoreFile: function exportKeyStoreFile(e) {
            this.walletJson = this.createBlob("mime", e.walletJson), this.name = e.name.toString()
          },
          createWallet: function createWallet(e) {
            var t = {},
              a = this.generateWallet(this.selectedKey);
            return t.walletJson = a.toV3(e), t.name = a.getV3Filename(), t
          },
          generateWallet: function generateWallet(t) {
            var a = o.stripHexPrefix(t),
              r = e.from(a, "hex"),
              n = s.fromPrivateKey(r);
            return n
          },
          createBlob: function createBlob(e, t) {
            var a = "object" === Object(r["a"])(t) ? JSON.stringify(t) : t;
            if (null === a) return "";
            var n = new Blob([a], {
              type: e
            });
            return window.URL.createObjectURL(n)
          }
        }
      }
    }).call(this, a("1c35").Buffer)
  },
  cf49: function (e, t, a) {
    var r = a("c3c5");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("c15c5916", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  cfe0: function (e, t, a) {
    "use strict";
    var r = a("1646"),
      n = a.n(r);
    n.a
  },
  cfe5: function (e, t, a) {
    e.exports = a.p + "img/logo.c4a8ad76.png"
  },
  d0a0: function (e, t, a) {
    e.exports = a.p + "img/Aion.51879606.png"
  },
  d177: function (e, t, a) {
    "use strict";
    a.r(t);
    a("a9e3"), a("aff5");
    var r = Number.MAX_SAFE_INTEGER,
      n = Math.round(Math.random() * r);

    function createRandomId() {
      return n %= r, n++
    }
    t["default"] = createRandomId
  },
  d324: function (e, t, a) {
    e.exports = a.p + "img/transaction.0ed65f05.svg"
  },
  d338: function (e, t, a) {
    e.exports = a.p + "img/activities.700412c1.svg"
  },
  d465: function (e, t, a) {
    "use strict";
    a.r(t);
    a("99af"), a("0d03"), a("a9e3"), a("d3b7"), a("e25e"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("c897"),
      o = a("53a8"),
      i = a("5c7d"),
      c = 6e5,
      l = function () {
        function CurrencyController() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          Object(r["a"])(this, CurrencyController);
          var t = o({
            currentCurrency: "usd",
            conversionRate: 0,
            conversionDate: "N/A",
            nativeCurrency: "ETH"
          }, e.initState);
          this.store = new s(t)
        }
        return Object(n["a"])(CurrencyController, [{
          key: "getNativeCurrency",
          value: function getNativeCurrency() {
            return this.store.getState().nativeCurrency
          }
        }, {
          key: "setNativeCurrency",
          value: function setNativeCurrency(e) {
            this.store.updateState({
              nativeCurrency: e,
              ticker: e
            })
          }
        }, {
          key: "getCurrentCurrency",
          value: function getCurrentCurrency() {
            return this.store.getState().currentCurrency
          }
        }, {
          key: "setCurrentCurrency",
          value: function setCurrentCurrency(e) {
            this.store.updateState({
              currentCurrency: e
            })
          }
        }, {
          key: "getConversionRate",
          value: function getConversionRate() {
            return this.store.getState().conversionRate
          }
        }, {
          key: "setConversionRate",
          value: function setConversionRate(e) {
            this.store.updateState({
              conversionRate: e
            })
          }
        }, {
          key: "getConversionDate",
          value: function getConversionDate() {
            return this.store.getState().conversionDate
          }
        }, {
          key: "setConversionDate",
          value: function setConversionDate(e) {
            this.store.updateState({
              conversionDate: e
            })
          }
        }, {
          key: "updateConversionRate",
          value: function updateConversionRate() {
            var e, t, a, r, n, s;
            return regeneratorRuntime.async((function updateConversionRate$(o) {
              while (1) switch (o.prev = o.next) {
                case 0:
                  return o.prev = 0, e = this.getCurrentCurrency(), t = this.getNativeCurrency(), a = "ETH" === t ? "https://api.infura.io/v1/ticker/eth".concat(e.toLowerCase()) : "https://min-api.cryptocompare.com/data/price?fsym=".concat(t.toUpperCase(), "&tsyms=").concat(e.toUpperCase()), o.prev = 4, o.next = 7, regeneratorRuntime.awrap(fetch(a));
                case 7:
                  r = o.sent, o.next = 14;
                  break;
                case 10:
                  return o.prev = 10, o.t0 = o["catch"](4), i.error(new Error("CurrencyController - Failed to request currency from Infura:\n".concat(o.t0.stack))), o.abrupt("return");
                case 14:
                  return o.prev = 14, o.next = 17, regeneratorRuntime.awrap(r.text());
                case 17:
                  n = o.sent, s = JSON.parse(n), o.next = 25;
                  break;
                case 21:
                  return o.prev = 21, o.t1 = o["catch"](14), i.error(new Error('CurrencyController - Failed to parse response "'.concat(n, '"'))), o.abrupt("return");
                case 25:
                  "ETH" === t ? (this.setConversionRate(Number(s.bid)), this.setConversionDate(Number(s.timestamp))) : s[e.toUpperCase()] ? (this.setConversionRate(Number(s[e.toUpperCase()])), this.setConversionDate(parseInt((new Date).getTime() / 1e3))) : (this.setConversionRate(0), this.setConversionDate("N/A")), o.next = 34;
                  break;
                case 28:
                  o.prev = 28, o.t2 = o["catch"](0), i.warn("MetaMask - Failed to query currency conversion:", t, e, o.t2), this.setConversionRate(0), this.setConversionDate("N/A"), i.error(new Error('CurrencyController - Failed to query rate for currency "'.concat(e, '":\n').concat(o.t2.stack)));
                case 34:
                case "end":
                  return o.stop()
              }
            }), null, this, [
              [0, 28],
              [4, 10],
              [14, 21]
            ])
          }
        }, {
          key: "scheduleConversionInterval",
          value: function scheduleConversionInterval() {
            var e = this;
            this.conversionInterval && clearInterval(this.conversionInterval), this.conversionInterval = setInterval((function () {
              e.updateConversionRate()
            }), c)
          }
        }]), CurrencyController
      }();
    t["default"] = l
  },
  d553: function (e, t, a) {
    var r = a("3fc1");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("6f55e076", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  d575: function (e, t, a) {
    "use strict";
    var r = a("3ff5"),
      n = a.n(r);
    n.a
  },
  d5be: function (e, t, a) {
    e.exports = a.p + "img/apple-touch-icon-180x180.38cbd75d.png"
  },
  d5d8: function (e, t, a) {
    "use strict";
    var r = a("ea9b"),
      n = a.n(r);
    n.a
  },
  d627: function (e, t, a) {
    var r = a("e7d5");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("185e49bb", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  d64d: function (e, t, a) {
    var r = a("75f3");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("20ef2cda", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  d67d: function (e, t, a) {
    e.exports = a.p + "img/ens.c195e97f.svg"
  },
  d7bc: function (e, t, a) {
    e.exports = function () {
      return new Worker(a.p + "5030711f1155646e1df9.worker.js")
    }
  },
  d8d9: function (e, t, a) {
    e.exports = a.p + "img/login.2a8acc89.png"
  },
  d90f: function (e, t, a) {
    e.exports = a.p + "img/dether.4d0c5512.svg"
  },
  d94f: function (e, t, a) {
    e.exports = a.p + "img/blue_arrow_down.332db86a.svg"
  },
  d9fb: function (e, t, a) {
    "use strict";
    var r = a("4f44"),
      n = a.n(r);
    n.a
  },
  db49: function (e, t, a) {
    "use strict";
    a.r(t);
    var r = "https://testing.tor.us";
    r += "/";
    var n = "".concat(r, "redirect");
    t["default"] = {
      torusNodeEndpoints: ["https://binance-main-3.torusnode.com/jrpc", "https://waseda-main-3.torusnode.com/jrpc", "https://vgr-main-3.torusnode.com/jrpc", "https://torus-main-3.torusnode.com/jrpc", "https://etc-main-3.torusnode.com/jrpc"],
      baseRoute: r,
      torusIndexes: [1, 2, 3, 4, 5],
      supportedCurrencies: ["USD", "AUD", "CAD", "EUR", "GBP", "HKD", "IDR", "JPY", "KRW", "RUB", "SGD", "UAH"],
      simplexHost: "https://simplex-api.tor.us",
      moonpayHost: "https://buy.moonpay.io?",
      moonpayLiveAPIKEY: "pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK",
      moonpayTestHost: "https://buy-staging.moonpay.io?",
      moonpayTestAPIKEY: "pk_test_j6AnwGJD0XTJDg3bTO37OczjFsddYpS",
      coindirectTestHost: "https://business.sandbox.coindirect.com/buy?",
      coindirectTestMerchantID: "150e5ef3-0c72-4d96-a411-8933eed66612",
      coindirectLiveHost: "https://business.coindirect.com/buy?",
      coindirectLiveMerchantID: "b08d7b18-da82-4dfc-990f-313ea26ac66b",
      GOOGLE_CLIENT_ID: "876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com",
      FACEBOOK_APP_ID: "2554219104599979",
      TWITCH_CLIENT_ID: "tfppratfiloo53g1x133ofa4rc29px",
      REDDIT_CLIENT_ID: "dcQJYPaG481XyQ",
      DISCORD_CLIENT_ID: "630308572013527060",
      redirect_uri: n,
      api: "https://api.tor.us"
    }
  },
  dc0c: function (e, t, a) {
    "use strict";
    var r = a("8d5f"),
      n = a.n(r);
    n.a
  },
  dc3d: function (e, t, a) {
    e.exports = a.p + "img/starbase.2e5d3b6e.png"
  },
  dd69: function (e, t, a) {
    e.exports = a.p + "img/DAY.2c6e43f4.png"
  },
  e0c5: function (e, t, a) {
    e.exports = a.p + "img/AST.63248140.png"
  },
  e0ee: function (e, t, a) {
    "use strict";
    var r = a("4df4"),
      n = a.n(r);
    n.a
  },
  e125: function (e, t, a) {
    e.exports = a.p + "img/streamr.a67c7f90.svg"
  },
  e163: function (e, t, a) {
    var r = a("1b25");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("01542c42", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  e239: function (e, t, a) {
    e.exports = a.p + "img/snt.fc26c015.svg"
  },
  e2c1: function (e, t, a) {
    "use strict";
    a.r(t), a.d(t, "default", (function () {
      return nodeify
    }));
    a("fb6a");
    var r = a("2ef0"),
      n = function noop() {};

    function nodeify(e, t) {
      return function () {
        var a, s = [].slice.call(arguments),
          o = s[s.length - 1],
          i = "function" === typeof o;
        i ? (a = o, s.pop()) : a = n, r(e.apply(t, s))(a)
      }
    }
  },
  e306: function (e, t, a) {
    "use strict";
    a.r(t);
    a("e25e"), a("ac1f"), a("5319");
    var r = a("6983");

    function toChecksumAddress(e) {
      if (null == e) return "";
      e = e.toLowerCase().replace("0x", "");
      for (var t = r("keccak256").update(e).digest("hex"), a = "0x", n = 0; n < e.length; n++) parseInt(t[n], 16) >= 8 ? a += e[n].toUpperCase() : a += e[n];
      return a
    }
    t["default"] = toChecksumAddress
  },
  e358: function (e, t, a) {
    e.exports = a.p + "img/disciplina.6c36205b.svg"
  },
  e3e8: function (e, t, a) {
    e.exports = a.p + "img/tag.35ea7b03.svg"
  },
  e439a: function (e, t, a) {
    e.exports = a.p + "img/lock.3a4e0d51.svg"
  },
  e452: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".select-theme-container .select-theme[data-v-099470ad]{display:flex}.select-theme-container .select-theme[data-v-099470ad]  .v-chip__content{width:100%}.v-menu__content[data-v-099470ad]{border-radius:0}", ""])
  },
  e69c: function (e, t, a) {
    e.exports = a.p + "img/DAOstack.ca4c3a79.png"
  },
  e7a3: function (e, t, a) {
    var r = a("3db1");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("7a489233", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  e7d5: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".inline-small[data-v-33694992]{width:20px;height:25px;display:inline-block;vertical-align:middle}.home-cards .v-card[data-v-33694992]{height:140px}", ""])
  },
  e80f: function (e, t, a) {
    e.exports = a.p + "img/home.2ae8d47b.svg"
  },
  e817: function (e, t, a) {
    e.exports = a.p + "img/Dentacoin.c7f14451.png"
  },
  e881: function (e, t, a) {
    e.exports = a.p + "img/chronobank.a79f6b89.png"
  },
  e922: function (e, t, a) {
    e.exports = a.p + "img/waltonchain.b82c705f.png"
  },
  e996: function (e, t, a) {
    e.exports = a.p + "img/Cpollo.4031aaaf.svg"
  },
  e9d9: function (e, t, a) {
    e.exports = a.p + "img/torus_logo.8589e528.png"
  },
  e9da: function (e, t, a) {
    "use strict";
    var r = a("4cf0"),
      n = a.n(r);
    n.a
  },
  ea58: function (e, t, a) {
    e.exports = a.p + "img/fun.5f3ec32b.svg"
  },
  ea9b: function (e, t, a) {
    var r = a("3034");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("3b40d1fc", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  eafa: function (e, t, a) {
    e.exports = a.p + "img/info-circle.884e3d17.svg"
  },
  eb38: function (e, t, a) {
    e.exports = a.p + "img/storj.c8960aa0.jpg"
  },
  eb54: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".text-bluish[data-v-24d02ade]{color:var(--v-torus_blue-base)}.selected-account[data-v-24d02ade]{cursor:pointer}.selected-account.active[data-v-24d02ade]{background-color:var(--v-torus_active-base)}", ""])
  },
  eba9: function (e, t, a) {
    var r = a("65fc");
    "string" === typeof r && (r = [
      [e.i, r, ""]
    ]), r.locals && (e.exports = r.locals);
    var n = a("499e").default;
    n("2374fb54", r, !0, {
      sourceMap: !1,
      shadowMode: !1
    })
  },
  ebbe: function (e, t, a) {
    "use strict";
    (function (e) {
      a("b0c0"), a("d3b7"), a("ac1f"), a("3ca3"), a("841c"), a("ddb0"), a("2b3d");
      var r = a("236e"),
        n = a("5b32"),
        s = a("fa7d"),
        o = a("d7bc"),
        i = a("b671"),
        c = a("5c7d");
      t["a"] = {
        components: {
          HelpTooltip: n["a"]
        },
        data: function data() {
          return {
            selectedType: "private",
            options: [{
              name: "Private Key",
              value: "private"
            }, {
              name: "Keystore",
              value: "keystore"
            }],
            privateKey: "",
            jsonPassword: "",
            privateKeyFormValid: !0,
            jsonFileFormValid: !0,
            keyStoreFileContents: "",
            error: "",
            canShowError: !1,
            selectedFileName: "",
            showPrivateKey: !1,
            showJsonPassword: !1,
            isLoadingPrivate: !1,
            isLoadingKeystore: !1,
            rules: {
              required: function required(e) {
                return !!e || "Required."
              }
            }
          }
        },
        methods: {
          importViaPrivateKey: function importViaPrivateKey() {
            var e = this;
            this.$refs.privateKeyForm.validate() && (this.isLoadingPrivate = !0, this.$store.dispatch("importAccount", {
              keyData: [this.privateKey],
              strategy: "Private Key"
            }).then((function (t) {
              e.onClose(), e.isLoadingPrivate = !1, e.informClients(t), e.$refs.privateKeyForm.resetValidation()
            })).catch((function (t) {
              e.setErrorState(t)
            })))
          },
          informClients: function informClients(e) {
            var t = new URLSearchParams(window.location.search).get("instanceId");
            if (t && "" !== t) {
              var a = new r["a"]("account_import_channel_".concat(t), s["broadcastChannelOptions"]);
              a.postMessage({
                data: {
                  name: "imported_account",
                  payload: {
                    privKey: e
                  }
                }
              })
            }
          },
          importViaKeyStoreFile: function importViaKeyStoreFile() {
            var t = this;
            if (this.$refs.jsonFileForm.validate()) {
              var a;
              this.isLoadingKeystore = !0;
              try {
                a = JSON.parse(this.keyStoreFileContents)
              } catch (n) {
                return c.error(n), void this.setErrorState(new Error("Unable to parse keystore file"))
              }
              if (window.Worker) {
                var r = new o;
                r.postMessage({
                  type: "unlockWallet",
                  data: [a, this.jsonPassword]
                }), r.onmessage = function (a) {
                  var r = i.stripHexPrefix(i.bufferToHex(e.from(a.data._privKey)));
                  t.$store.dispatch("finishImportAccount", {
                    privKey: r
                  }).then((function (e) {
                    t.onClose(), t.isLoadingKeystore = !1, t.informClients(e), t.$refs.jsonFileForm.resetValidation()
                  })).catch((function (e) {
                    t.setErrorState(e)
                  }))
                }, r.onerror = function (e) {
                  t.setErrorState(e)
                }
              } else this.$store.dispatch("importAccount", {
                keyData: [a, this.jsonPassword],
                strategy: "JSON File"
              }).then((function (e) {
                t.onClose(), t.isLoadingKeystore = !1, t.informClients(e), t.$refs.jsonFileForm.resetValidation()
              })).catch((function (e) {
                t.setErrorState(e)
              }))
            }
          },
          setErrorState: function setErrorState(e) {
            this.error = e, this.canShowError = !0, c.error(e), this.isLoadingKeystore = !1, this.isLoadingPrivate = !1
          },
          processFile: function processFile(e) {
            try {
              var t = e.target.files[0];
              this.selectedFileName = t.name;
              var a = new FileReader;
              a.onload = function (e) {
                return function (e) {
                  this.keyStoreFileContents = e.target.result
                }.bind(this)
              }.bind(this)(this.$refs.keyStoreUpload), a.readAsText(t, "utf-8")
            } catch (r) {
              c.error(r), this.setErrorState(r)
            }
          },
          togglePrivShow: function togglePrivShow(e) {
            e.preventDefault(), this.showPrivateKey = !this.showPrivateKey
          },
          toggleJsonPasswordShow: function toggleJsonPasswordShow(e) {
            e.preventDefault(), this.showJsonPassword = !this.showJsonPassword
          },
          onClose: function onClose() {
            this.$emit("onClose")
          }
        }
      }
    }).call(this, a("1c35").Buffer)
  },
  ebed: function (e, t, a) {
    e.exports = a.p + "img/nanjcoin.a0148981.svg"
  },
  ebf3: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".message-modal .close-icon[data-v-62e00e2b]{position:absolute;right:20px;top:20px}.message-modal .image-container[data-v-62e00e2b]{background-color:#2dcc70;display:flex;align-items:center;justify-content:center;height:180px;position:relative}.message-modal .image-container-success[data-v-62e00e2b]{background-color:#2dcc70}.message-modal .image-container-danger[data-v-62e00e2b]{background-color:#e20d0d}.message-modal .modal-button[data-v-62e00e2b]{height:auto;text-transform:none}", ""])
  },
  ec4e: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".wallet-topup-wyre .help-icon[data-v-6ff9219d]{height:13px;vertical-align:middle}.wallet-topup-wyre .unique-hint[data-v-6ff9219d]  .v-text-field__details{display:none}.wallet-topup-wyre .unique-hint[data-v-6ff9219d]  .error--text .v-text-field__details{display:inherit}.wallet-topup-wyre .unique-hint .v-btn[data-v-6ff9219d]{border-style:dashed}", ""])
  },
  ed34: function (e, t, a) {
    e.exports = a.p + "img/modum.027a718f.svg"
  },
  edaf: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".theme--dark .header-container[data-v-3ed19977]{background:var(--v-background-base)}.header-container .v-toolbar[data-v-3ed19977]{box-shadow:none;padding:0}.header-container .v-tabs-bar.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows)>.v-slide-group__wrapper>.v-tabs-bar__content>.v-tab[data-v-3ed19977]{text-transform:inherit;font-size:14px;min-width:50px}.header-container .v-tabs-bar.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows)>.v-slide-group__wrapper>.v-tabs-bar__content>.v-tab[data-v-3ed19977]:first-of-type{margin-left:auto}.header-container .v-tab[data-v-3ed19977]{text-transform:inherit}.header-container .beta-text[data-v-3ed19977]{line-height:1em;margin-bottom:-10px;margin-left:5px}.header-container .beta-text-mobile[data-v-3ed19977]{line-height:1em;margin-top:-5px}.header-container .theme--light .v-tab.v-tab--active[data-v-3ed19977]{color:var(--v-text_2-darken3)}.header-container .home-link[data-v-3ed19977]{cursor:pointer}", ""])
  },
  eff6: function (e, t, a) {
    e.exports = a.p + "img/copy-primary.3ea17440.svg"
  },
  f1b4: function (e, t, a) {
    e.exports = a.p + "img/c20.d0953f59.svg"
  },
  f234: function (e, t, a) {
    "use strict";
    a.r(t);
    var r = a("5c7d"),
      n = a.n(r),
      s = a("76fe"),
      o = a("6f59");

    function setupMultiplex(e) {
      var t = new s;
      return o(e, t, e, (function (e) {
        e && n.a.error(e)
      })), t.getStream = function (e) {
        return this._substreams[e] ? this._substreams[e] : this.createStream(e)
      }, t
    }
    t["default"] = setupMultiplex
  },
  f282: function (e, t, a) {
    e.exports = a.p + "img/bcpt.401856dd.svg"
  },
  f32a: function (e, t, a) {
    e.exports = a.p + "img/Maecenas.1d1bde85.jpg"
  },
  f3c2: function (e, t, a) {
    e.exports = a.p + "img/tpt.2e12e268.png"
  },
  f421: function (e, t, a) {
    "use strict";
    a.r(t);
    a("cb29"), a("caad"), a("d81d"), a("0d03"), a("a9e3"), a("25eb"), a("d3b7"), a("25f0"), a("2532"), a("3ca3"), a("ddb0"), a("96cf");
    var r = a("9f12"),
      n = a("53fe"),
      s = a("c897"),
      o = a("53a8"),
      i = a("417a"),
      c = a("5c7d"),
      l = a("364d"),
      d = a("b00c"),
      u = d.ROPSTEN,
      p = d.RINKEBY,
      g = d.KOVAN,
      f = d.MAINNET,
      v = [u, p, g, f],
      h = function () {
        function RecentBlocksController() {
          var e = this,
            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          Object(r["a"])(this, RecentBlocksController);
          var a = t.blockTracker,
            n = t.provider,
            l = t.networkController;
          this.blockTracker = a, this.ethQuery = new i(n), this.historyLength = t.historyLength || 40;
          var d = o({
            recentBlocks: []
          }, t.initState);
          this.store = new s(d);
          var u = function blockListner(t) {
              return regeneratorRuntime.async((function blockListner$(a) {
                while (1) switch (a.prev = a.next) {
                  case 0:
                    return a.prev = 0, a.next = 3, regeneratorRuntime.awrap(e.processBlock(t));
                  case 3:
                    a.next = 8;
                    break;
                  case 5:
                    a.prev = 5, a.t0 = a["catch"](0), c.error(a.t0);
                  case 8:
                  case "end":
                    return a.stop()
                }
              }), null, null, [
                [0, 5]
              ])
            },
            p = !1,
            g = l.getProviderConfig(),
            f = g.type;
          v.includes(f) || "loading" === f || (this.blockTracker.on("latest", u), p = !0), l.on("networkDidChange", (function (t) {
            v.includes(t) && p ? e.blockTracker.removeListener("latest", u) : v.includes(f) || "loading" === f || p || e.blockTracker.on("latest", u)
          })), this.backfill()
        }
        return Object(n["a"])(RecentBlocksController, [{
          key: "resetState",
          value: function resetState() {
            this.store.updateState({
              recentBlocks: []
            })
          }
        }, {
          key: "processBlock",
          value: function processBlock(e) {
            var t, a, r, n;
            return regeneratorRuntime.async((function processBlock$(s) {
              while (1) switch (s.prev = s.next) {
                case 0:
                  return t = Number.parseInt(e, 16), s.next = 3, regeneratorRuntime.awrap(this.getBlockByNumber(t, !0));
                case 3:
                  if (a = s.sent, a) {
                    s.next = 6;
                    break
                  }
                  return s.abrupt("return");
                case 6:
                  r = this.mapTransactionsToPrices(a), n = this.store.getState(), n.recentBlocks.push(r);
                  while (n.recentBlocks.length > this.historyLength) n.recentBlocks.shift();
                  this.store.updateState(n);
                case 11:
                case "end":
                  return s.stop()
              }
            }), null, this)
          }
        }, {
          key: "backfillBlock",
          value: function backfillBlock(e) {
            var t = this.mapTransactionsToPrices(e),
              a = this.store.getState();
            a.recentBlocks.length < this.historyLength && a.recentBlocks.unshift(t), this.store.updateState(a)
          }
        }, {
          key: "mapTransactionsToPrices",
          value: function mapTransactionsToPrices(e) {
            var t = o(e, {
              gasPrices: e.transactions.map((function (e) {
                return e.gasPrice
              }))
            });
            return delete t.transactions, t
          }
        }, {
          key: "backfill",
          value: function backfill() {
            var e = this;
            return regeneratorRuntime.async((function backfill$(t) {
              while (1) switch (t.prev = t.next) {
                case 0:
                  this.blockTracker.once("latest", (function _callee2(t) {
                    var a, r, n, s;
                    return regeneratorRuntime.async((function _callee2$(o) {
                      while (1) switch (o.prev = o.next) {
                        case 0:
                          return a = Number.parseInt(t, 16), r = Math.min(a, e.historyLength), n = a - 1, s = Array(r).fill().map((function (e, t) {
                            return n - t
                          })), o.next = 6, regeneratorRuntime.awrap(Promise.all(s.map((function _callee(t) {
                            var a;
                            return regeneratorRuntime.async((function _callee$(r) {
                              while (1) switch (r.prev = r.next) {
                                case 0:
                                  return r.prev = 0, r.next = 3, regeneratorRuntime.awrap(e.getBlockByNumber(t, !0));
                                case 3:
                                  if (a = r.sent, a) {
                                    r.next = 6;
                                    break
                                  }
                                  return r.abrupt("return");
                                case 6:
                                  e.backfillBlock(a), r.next = 12;
                                  break;
                                case 9:
                                  r.prev = 9, r.t0 = r["catch"](0), c.error(r.t0);
                                case 12:
                                case "end":
                                  return r.stop()
                              }
                            }), null, null, [
                              [0, 9]
                            ])
                          }))));
                        case 6:
                        case "end":
                          return o.stop()
                      }
                    }))
                  }));
                case 1:
                case "end":
                  return t.stop()
              }
            }), null, this)
          }
        }, {
          key: "getBlockByNumber",
          value: function getBlockByNumber(e) {
            var t, a;
            return regeneratorRuntime.async((function getBlockByNumber$(r) {
              while (1) switch (r.prev = r.next) {
                case 0:
                  return t = "0x" + e.toString(16), r.next = 3, regeneratorRuntime.awrap(l(this.ethQuery.getBlockByNumber).call(this.ethQuery, t, !0));
                case 3:
                  return a = r.sent, r.abrupt("return", a);
                case 5:
                case "end":
                  return r.stop()
              }
            }), null, this)
          }
        }]), RecentBlocksController
      }();
    t["default"] = h
  },
  f43e: function (e, t, a) {
    e.exports = a.p + "img/bobsrepair.92aac46c.png"
  },
  f61a: function (e, t, a) {
    e.exports = a.p + "img/coindirect-dark.cd3518cf.svg"
  },
  f93b: function (e, t, a) {
    e.exports = a.p + "img/knownorigin.a9b5e089.svg"
  },
  fa7d: function (e, t, a) {
    (function (t) {
      a("99af"), a("4160"), a("c975"), a("fb6a"), a("0d03"), a("b0c0"), a("6b93"), a("a9e3"), a("b680"), a("b64b"), a("d3b7"), a("e25e"), a("ac1f"), a("25f0"), a("466d"), a("5319"), a("841c"), a("1276"), a("159b"), a("96cf");
      var r = a("9e19"),
        n = a("b671"),
        s = a("eeb9"),
        o = a("36ba"),
        i = a("b00c"),
        c = i.ENVIRONMENT_TYPE_POPUP,
        l = i.ENVIRONMENT_TYPE_NOTIFICATION,
        d = i.ENVIRONMENT_TYPE_FULLSCREEN,
        u = i.PLATFORM_FIREFOX,
        p = i.PLATFORM_OPERA,
        g = i.PLATFORM_CHROME,
        f = i.PLATFORM_EDGE,
        v = i.PLATFORM_BRAVE,
        h = i.ETH,
        m = i.GOOGLE,
        b = i.REDDIT,
        x = i.DISCORD,
        y = a("5c7d"),
        w = a("1131"),
        k = w.isAddress;

      function storageAvailable(e) {
        var t;
        try {
          t = window[e];
          var a = "__storage_test__";
          return t.setItem(a, a), t.removeItem(a), !0
        } catch (r) {
          return r && (22 === r.code || 1014 === r.code || "QuotaExceededError" === r.name || "NS_ERROR_DOM_QUOTA_REACHED" === r.name) && t && 0 !== t.length
        }
      }

      function getStack() {
        var e = new Error("Stack trace generator - not an error").stack;
        return e
      }
      var C = function getEnvironmentType() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location.href;
          return e.match(/popup.html(?:#.*)*$/) ? c : e.match(/home.html(?:\?.+)*$/) || e.match(/home.html(?:#.*)*$/) ? d : l
        },
        A = function getPlatform(e) {
          var t = navigator.userAgent;
          return -1 !== t.search("Firefox") ? u : window && window.chrome && window.chrome.ipcRenderer ? v : -1 !== t.search("Edge") ? f : -1 !== t.search("OPR") ? p : g
        };

      function sufficientBalance(e, t) {
        s.strictEqual(r(t), "string", "sufficientBalance - hexBalance is not a hex string"), s.strictEqual(t.slice(0, 2), "0x", "sufficientBalance - hexBalance is not a hex string");
        var a = hexToBn(t),
          n = hexToBn(e.value),
          o = hexToBn(e.gas),
          i = hexToBn(e.gasPrice),
          c = n.add(o.mul(i));
        return a.gte(c)
      }

      function bnToHex(e) {
        return n.addHexPrefix(e.toString(16))
      }

      function hexToBn(e) {
        return new o(n.stripHexPrefix(e), 16)
      }

      function BnMultiplyByFraction(e, t, a) {
        var r = new o(t),
          n = new o(a);
        return e.mul(r).div(n)
      }

      function applyListeners(e, t) {
        Object.keys(e).forEach((function (a) {
          t.on(a, e[a])
        }))
      }

      function removeListeners(e, t) {
        Object.keys(e).forEach((function (a) {
          t.removeListener(a, e[a])
        }))
      }

      function hexToText(e) {
        try {
          var a = n.stripHexPrefix(e),
            r = t.from(a, "hex");
          return r.toString("utf8")
        } catch (s) {
          return e
        }
      }

      function addressSlicer() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        return e.length < 11 ? e : "".concat(e.slice(0, 5), "...").concat(e.slice(-5))
      }

      function significantDigits(e) {
        var t, a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2,
          n = e;
        if (0 === n) return n;
        a && (n *= 100), t = n >= 1 ? 2 : r - 1 + Math.ceil(Math.log10(1 / n));
        var s = Math.pow(10, t),
          o = Math.round(s * n) / s;
        return o
      }

      function formatCurrencyNumber(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ".",
          r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : ",";
        try {
          var n = e,
            s = t;
          s = Math.abs(s), s = isNaN(s) ? 2 : s;
          var o = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(Number(e) || 0).toFixed(s), 10).toString(),
            c = i.length > 3 ? i.length % 3 : 0;
          return "".concat(o + (c ? i.substr(0, c) + r : "") + i.substr(c).replace(/(\d{3})(?=\d)/g, "$1".concat(r)) + (s ? a + Math.abs(e - i).toFixed(s).slice(2) : ""))
        } catch (l) {
          y.error(l)
        }
        return null
      }

      function calculateGasKnob(e) {
        return e < 20 ? 100 * e : 25 * (e + 60)
      }

      function calculateGasPrice(e) {
        return e < 2e3 ? e / 100 : Math.round(e / 25) - 60
      }

      function isSmartContractAddress(e, t) {
        var a, r;
        return regeneratorRuntime.async((function isSmartContractAddress$(n) {
          while (1) switch (n.prev = n.next) {
            case 0:
              return n.next = 2, regeneratorRuntime.awrap(t.eth.getCode(e));
            case 2:
              return a = n.sent, r = !a || "0x" === a || "0x0" === a, n.abrupt("return", !r);
            case 5:
            case "end":
              return n.stop()
          }
        }))
      }

      function getEtherScanHashLink(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
          a = null === t ? "mainnet" : t;
        return "mainnet" === t ? "https://etherscan.io/tx/".concat(e) : "https://".concat(a, ".etherscan.io/tx/").concat(e)
      }
      var T = {
        SENT_TO_SIMPLEX: "pending",
        DENIED_SIMPLEX: "rejected",
        payment_request_submitted: "processing",
        pending_simplexcc_approval: "processing",
        PROCESSING_SIMPPLEX: "processing",
        SUCCESS_SIMPLEX: "success",
        payment_simplexcc_approved: "success",
        pending_simplexcc_payment_to_partner: "success"
      };

      function getStatus(e) {
        return T[e] || "pending"
      }

      function getEthTxStatus(e, t) {
        var a;
        return regeneratorRuntime.async((function getEthTxStatus$(r) {
          while (1) switch (r.prev = r.next) {
            case 0:
              return r.next = 2, regeneratorRuntime.awrap(t.eth.getTransactionReceipt(e));
            case 2:
              if (a = r.sent, null !== a) {
                r.next = 7;
                break
              }
              return r.abrupt("return", "pending");
            case 7:
              if (!a || !a.status) {
                r.next = 11;
                break
              }
              return r.abrupt("return", "confirmed");
            case 11:
              if (!a || a.status) {
                r.next = 13;
                break
              }
              return r.abrupt("return", "rejected");
            case 13:
            case "end":
              return r.stop()
          }
        }))
      }

      function extractHostname(e) {
        var t;
        return e ? (t = e.indexOf("//") > -1 ? e.split("/")[2] : e.split("/")[0], t = t.split(":")[0], t = t.split("?")[0], t) : ""
      }

      function getRandomNumber(e) {
        return Math.floor(Math.random() * e)
      }
      var _ = {
        webWorkerSupport: !1
      };

      function validateVerifierId(e, t) {
        return e === h ? k(t) || "Invalid ETH Address" : e === m ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t) || "Invalid Email Address" : e === b ? /[\w-]+/.test(t) && !/\s/.test(t) && t.length >= 3 && t.length <= 20 || "Invalid reddit username" : e !== x || (/^[0-9]*$/.test(t) && 18 === t.length || "Invalid Discord ID")
      }
      e.exports = {
        removeListeners: removeListeners,
        applyListeners: applyListeners,
        getPlatform: A,
        getStack: getStack,
        getEnvironmentType: C,
        sufficientBalance: sufficientBalance,
        hexToBn: hexToBn,
        bnToHex: bnToHex,
        BnMultiplyByFraction: BnMultiplyByFraction,
        hexToText: hexToText,
        addressSlicer: addressSlicer,
        significantDigits: significantDigits,
        calculateGasKnob: calculateGasKnob,
        calculateGasPrice: calculateGasPrice,
        isSmartContractAddress: isSmartContractAddress,
        extractHostname: extractHostname,
        formatCurrencyNumber: formatCurrencyNumber,
        getEtherScanHashLink: getEtherScanHashLink,
        getRandomNumber: getRandomNumber,
        getStatus: getStatus,
        getEthTxStatus: getEthTxStatus,
        broadcastChannelOptions: _,
        storageAvailable: storageAvailable,
        validateVerifierId: validateVerifierId
      }
    }).call(this, a("1c35").Buffer)
  },
  fb36: function (e, t, a) {
    e.exports = a.p + "img/zilliqa.76e289ab.svg"
  },
  fbdc: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".v-tooltip__content[data-v-689daab4]{background:var(--v-background-lighten4);box-shadow:0 14px 28px 0 rgba(0,0,0,.5);border-radius:3px;padding:10px 30px;max-width:300px;opacity:1!important}.v-icon[data-v-689daab4],.v-tooltip__content[data-v-689daab4]{color:var(--v-text_1-base)}", ""])
  },
  fd72: function (e, t, a) {
    e.exports = a.p + "img/plat.80f82c9e.png"
  },
  fd99: function (e, t, a) {
    e.exports = a.p + "img/singulardtv.04914ceb.svg"
  },
  ff81: function (e, t, a) {
    e.exports = a.p + "img/cln.6736fb1c.png"
  },
  ffad: function (e, t, a) {
    e.exports = a.p + "img/swt.2689b7a9.jpg"
  },
  ffb1: function (e, t, a) {
    e.exports = a.p + "img/list.308c6d2d.svg"
  },
  ffcc: function (e, t, a) {
    t = e.exports = a("24fb")(!1), t.push([e.i, ".asset[data-v-13c9c868]{cursor:pointer;height:200px}.asset.v-card--link[data-v-13c9c868]:focus:before{opacity:0}.asset img[data-v-13c9c868]{max-width:100%}.asset .v-card__title[data-v-13c9c868]{word-break:break-word;text-align:center}.asset .asset-details[data-v-13c9c868]{font-size:10px;line-height:1.2em}.asset .asset-name[data-v-13c9c868]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asset .asset-more[data-v-13c9c868]{display:none;font-size:10px;line-height:1.8em}.asset .more-info-show[data-v-13c9c868]{display:block}.asset .more-info-hide[data-v-13c9c868]{display:none}.asset .v-divider--vertical.v-divider--inset[data-v-13c9c868]{margin-top:0}.asset.asset--new[data-v-13c9c868]{position:relative}.asset.asset--new .v-card__actions[data-v-13c9c868],.asset.asset--new[data-v-13c9c868]  .v-image__image{opacity:.3}.asset.asset--new .add-container[data-v-13c9c868]{border:1px solid var(--v-primary-base);border-radius:50%;width:45px;height:45px;line-height:36px;margin:auto}.asset.asset--new .add-container .v-icon[data-v-13c9c868]{margin-top:1px;margin-left:-1px}.asset.asset--new .asset-text[data-v-13c9c868]{opacity:.2}.asset.asset--new .asset__new-overlay[data-v-13c9c868]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%}.asset.asset--active[data-v-13c9c868],.asset.asset--mobile[data-v-13c9c868]{height:inherit}.asset.asset--active .asset-more[data-v-13c9c868]{display:block}.asset.asset--active .more-info-show[data-v-13c9c868]{display:none}.asset.asset--active .more-info-hide[data-v-13c9c868]{display:block}[data-v-13c9c868] .v-breadcrumbs a{color:var(--v-text_2-base)}[data-v-13c9c868] .v-breadcrumbs a.v-breadcrumbs__item.v-breadcrumbs__item--disabled{color:var(--v-text_1-base)}[data-v-13c9c868] .v-breadcrumbs .v-breadcrumbs__divider{padding-left:4px;padding-right:4px}", ""])
  }
});
} catch (err) { alert('ERROR HAPPENED:' + err) }