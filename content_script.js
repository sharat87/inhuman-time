const timeFormat = new Intl.RelativeTimeFormat("en", {
	localeMatcher: "best fit",
	numeric: "auto",
})

const mutationObserver = new MutationObserver(applyWrapped);

applyWrapped()

function applyWrapped() {
	try {
		apply()
	} catch (e) {
		console.error("Error loading inhuman-time", e)
	}
}

function apply() {
	mutationObserver.disconnect()

	for (const el of document.querySelectorAll("relative-time")) {
		const actualTime = new Date(el.getAttribute("datetime"))
		const span = document.createElement("span")
		span.innerText = el.getAttribute("title") || actualTime.toLocaleString()
		span.title = getRelativeTime(actualTime)
		span.style.textDecoration = "underline #888 dashed"
		el.replaceWith(span)
	}

	mutationObserver.takeRecords()
	mutationObserver.observe(document.body, {
		childList: true,
		subtree: true,
	})
}

function getRelativeTime(t) {
	let count = (Date.now() - t) / 1000

	if (count < 60) {
		return timeFormat.format(-Math.round(count), "second")
	}
	count /= 60

	if (count < 60) {
		return timeFormat.format(-Math.round(count), "minute")
	}
	count /= 60

	if (count < 24) {
		return timeFormat.format(-Math.round(count), "hour")
	}
	count /= 24

	if (count < 7) {
		return timeFormat.format(-Math.round(count), "day")
	}
	count /= 7

	if (count < 4) {
		return timeFormat.format(-Math.round(count), "week")
	}
	count /= 4

	if (count < 12) {
		return timeFormat.format(-Math.round(count), "month")
	}
	count /= 12

	return timeFormat.format(-Math.round(count), "year")
}

