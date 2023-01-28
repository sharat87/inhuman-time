if (window.chrome) {
	window.browser = chrome
}

const form = document.forms[0]
main().catch((error) => console.log(error))

async function main() {
	await load()
	form.addEventListener("change", save)
}

async function load() {
	const data = await browser.storage.sync.get(["deco", "fmt"])
	form.deco.value = data.deco || "d"
	form.fmt.value = data.fmt || "YYYY-MM-DD HH:mm"
}

async function save() {
	await browser.storage.sync.set({
		deco: form.deco.value,
		fmt: form.fmt.value,
	})
}
