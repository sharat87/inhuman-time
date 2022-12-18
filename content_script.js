const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
	localeMatcher: "best fit",
	numeric: "auto",
})

const mutationObserver = new MutationObserver(applyWrapped)
const timeSpans = []

applyWrapped()
setInterval(updateRelativeTimes, 60_000)

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
		const span = document.createElement("span")
		span.setAttribute("datetime", el.getAttribute("datetime"))
		span.innerText = displayTime(timeFromElement(el))
		span.style.textDecoration = "underline #888 dashed"
		el.replaceWith(span)
		if (span.parentElement?.matches(".css-truncate-target")) {
			// Times of events in an issue or PR.
			span.parentElement.style.maxWidth = "none"
		} else if (span.parentElement?.matches(".text-right[role=gridcell]")) {
			// In the commit time column in file listing page.
			span.parentElement.style.width = ""
		}
		timeSpans.push(span)
	}

	updateRelativeTimes()

	mutationObserver.takeRecords()
	mutationObserver.observe(document.body, {
		childList: true,
		subtree: true,
	})
}

function timeFromElement(el) {
	return new Date(el.getAttribute("datetime"))
}

function displayTime(t /*: Date */) {
	return t.toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	})
}

function updateRelativeTimes() {
	for (let i = 0; i < timeSpans.length; i++) {
		const span = timeSpans[i]
		if (!document.body.contains(span)) {
			timeSpans.splice(i--, 1)
			continue
		}
		span.title = getRelativeTime(timeFromElement(span))
	}
}

function getRelativeTime(t) {
	let count = (Date.now() - t) / 1000

	if (count < 40) {
		return "a few seconds ago"
	}
	count /= 60

	if (count < 60) {
		return relativeTimeFormat.format(-Math.round(count), "minute")
	}
	count /= 60

	if (count < 24) {
		return relativeTimeFormat.format(-Math.round(count), "hour")
	}
	count /= 24

	if (count < 7) {
		return relativeTimeFormat.format(-Math.round(count), "day")
	}
	count /= 7

	if (count < 4) {
		return relativeTimeFormat.format(-Math.round(count), "week")
	}
	count /= 4

	if (count < 12) {
		return relativeTimeFormat.format(-Math.round(count), "month")
	}
	count /= 12

	return relativeTimeFormat.format(-Math.round(count), "year")
}

