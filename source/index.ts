const form = document.querySelector("form")!
const input = document.querySelector("input")!
const loading: HTMLElement = document.querySelector(".loading")!
const success: HTMLElement = document.querySelector(".success")!
const failure: HTMLElement = document.querySelector(".failure")!

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
