// Data structure that we're going to use to hold someones registration info
type Registration = {}

function run() {
  window.fetch("https://spiralganglion-weaving.web.val.run", {
    method: "POST",
    body: JSON.stringify({
      hello: "me"
    })
  })
}
