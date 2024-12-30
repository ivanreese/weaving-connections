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

  const email = input.value
  if (email.length < 3) return

  form.classList.add("hidden")
  loading.classList.remove("hidden")

  const res = await window.fetch("https://spiralganglion-weaving.web.val.run/auth", {
    method: "POST",
    body: JSON.stringify({ email })
  })

  const val = await res.json()
  const message = val?.ok ? success : failure
  message.classList.remove("hidden")
  loading.classList.add("hidden")
})

export {}
