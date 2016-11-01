const test = require('tape')
const through = require('through2')
const writable = require('to2')
const duplexToWritable = require('../')

const lb = () => through(function (chunk, enc, cb) {
  cb(null, chunk + '\n')
})

const w = () => {
  let results = ''
  const s = writable((chunk, enc, cb) => {
    setTimeout(() => {
      results += String(chunk)
      cb()
    }, 100)
  }, (cb) => {
    setTimeout(() => {
      results += 'end'
      cb()
    })
  })
  s.getResults = () => results
  return s
}

test('returns stream that is writeable only', t => {
  t.plan(1)
  const transformStream = lb()
  const writableStream = w()
  const s = duplexToWritable(transformStream, writableStream)
  try {
    s.pipe(through((chunk, enc, cb) => cb()))
    t.fail('stream is readable')
  } catch (err) {
    t.pass('stream is not readable: ' + err.stack.split('\n')[0])
  }
})

test('duplex stream and writable stream appears as a writable stream', t => {
  t.plan(1)
  const transformStream = lb()
  const writableStream = w()
  transformStream.pipe(writableStream)
  const s = duplexToWritable(transformStream, writableStream)
  s.getResults = writableStream.getResults
  s.on('finish', () => {
    t.equal(s.getResults(), 'hey\nend')
  })
  s.write('hey')
  s.end()
})
