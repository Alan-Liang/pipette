const ctx = (function() {
  if(typeof window !== 'undefined') return window
  if(typeof global !== 'undefined') return global
  return this
})()

const Panic = function(value) {
  this.value = value
}

let currentPanic = null

const mapping = {
  _pt_channel: function(initial) {
    let value, hasValue = false
    let getstack = [], setstack = []
    const chan = function(value1) {
      if(arguments.length == 0) { // read
        return new Promise(function(resolve, reject) {
          if(hasValue) {
            if(setstack.length > 0) {
              const v = setstack.shift()
              value = v.value
              v.resolve()
            } else {
              hasValue = false
            }
            resolve(value)
          } else {
            getstack.push(resolve)
          }
        })
      } else {
        return new Promise(function(resolve, reject) {
          if(hasValue) {
            setstack.push({
              value: value1,
              resolve: resolve
            })
          } else {
            if(getstack.length > 0) {
              getstack.shift()(value1)
            } else {
              value = value1
              hasValue = true
            }
            resolve()
          }
        })
      }
    }
    if(arguments.length > 0) {
      chan(initial)
    }
    return chan
  },
  _pt_panic: function(err) {
    const panic = new Panic(err)
    currentPanic = panic
    throw panic
  },
  _pt_handlePanic: function(err) {
    if(err instanceof Panic) {
      throw err
    }
  },
  _pt_recover: function() {
    if(currentPanic) {
      const panic = currentPanic
      currentPanic = null
      return panic.value
    }
    return null
  },
  print: console.log,
  range: function(to) { // TODO
    const r = {}
    for(let i = 1; i < r; i++) {
      r[i] = i
    }
    return r
  },
}

for(let k in mapping) {
  ctx[k] = mapping[k]
}
