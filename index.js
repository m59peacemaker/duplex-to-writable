const writable = require('to2')

const duplexToWritable = (duplexStream, writableStream, options) => {
  return writable(options, (chunk, enc, cb) => {
    duplexStream.write(chunk)
    cb()
  }, (cb) => {
    writableStream.on('finish', cb)
    duplexStream.end()
  })
}

duplexToWritable.obj = (duplexStream, writableStream, options = {}) => {
  options.objectMode = true
  return duplexToWritable(duplexStream, writableStream, options)
}

module.exports = duplexToWritable
