export default function ajax(options) {
    const action = options.action
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    fd.append(options.filename, options.file)

    xhr.onerror = err => {
        options.onError(err)
    }
    xhr.onload = () => {
        const res = xhr.responseText || xhr.response
        options.onSuccess(JSON.parse(res))
    }
    xhr.upload.onprogress = e => {
        if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
        }
        options.onProgress(e)
    }
    xhr.open('post', action, true)
    xhr.send(fd)

    return xhr;
}  