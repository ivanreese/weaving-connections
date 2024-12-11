document.querySelectorAll(".dialog").forEach((container) => {
  const dialoger = container.querySelector(".dialoger")
  const dialog = container.querySelector("dialog")
  if (!dialoger || !dialog) return
  dialoger.addEventListener("click", () => dialog.showModal())
  dialog.addEventListener("click", () => dialog.close())
})

const form = document.querySelector("#register form")!
const input = form.querySelector("input")!
const loading: HTMLElement = document.querySelector("#register .loading")!
const success: HTMLElement = document.querySelector("#register .success")!
const failure: HTMLElement = document.querySelector("#register .failure")!

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  // form.classList.toggle("hidden", true)
  // loading.classList.toggle("hidden", false)

  const email = input.value
  const res = await window.fetch("https://spiralganglion-weaving.web.val.run/auth", {
    method: "POST",
    body: JSON.stringify({ email })
  })

  // loading.classList.toggle("hidden", true)
  // success.classList.toggle("hidden", false)

  const val = await res.json()
  console.log(val)
})

export {}
