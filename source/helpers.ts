export async function postJson(url: string, json: any, method = "POST") {
  return window.fetch(url, { method, body: JSON.stringify(json) }).then((res) => res.json())
}

export function tag<K extends keyof HTMLElementTagNameMap>(
  name: K,
  parent: HTMLElement,
  opts: string | Record<string, any> = {}
): HTMLElementTagNameMap[K] {
  if (typeof opts == "string") opts = { content: opts }

  const elm = document.createElement(name)
  parent.appendChild(elm)

  if (opts.content) elm.innerHTML = opts.content
  if (opts.class) elm.className = opts.class

  if (opts.click) elm.addEventListener("click", opts.click)
  if (opts.change) elm.addEventListener("change", opts.change)

  const inputElm = elm as HTMLInputElement
  if (opts.type) inputElm.type = opts.type
  if (opts.name) inputElm.name = opts.name
  if (opts.value) inputElm.value = opts.value
  if (opts.required) inputElm.required = true

  const imgElm = elm as HTMLImageElement
  if (opts.src) imgElm.src = opts.src

  return elm
}
