'use strict'
require('..')

;(async function() {

const _throw = async function() { // fun _throw() {
    throw 'error' // err <'error'
    return // return
} // }

const a = async function() { // fun a() {
    try { await print(await _throw()) } catch(_pt_in1) { _pt_handlePanic(_pt_in1); // _throw |print err|if {
        await print(_pt_in1) // print <in
    } // }
    await _throw() // throw
    await print(1) // print <1 // not called
} // }

const b = async function() { // fun b() {
    try { await a() } catch(_pt_in2) { _pt_handlePanic(_pt_in2); _pt_panic(_pt_in2) }// a err|panic
} // }

const c = async function() { // fun c() {
    try {
        await b() // b
    } catch(_pt_in3) {} finally {
        const _pt_in4 = _pt_recover(); if(_pt_in4) {// defer recover |if {
            await print(_pt_in4) // print <in
        } // }
    }
} // }

await c() // c

})()
