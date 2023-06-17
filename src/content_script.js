const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
	localeMatcher: "best fit",
	numeric: "auto",
})

const mutationObserver = new MutationObserver(applyWrapped)
const timeSpans = []

applyWrapped()
setInterval(applyWrapped, 5000)

function applyWrapped() {
	(chrome || browser).storage.sync.get(["deco", "fmt"])
		.then(apply)
}

function apply({deco, fmt}) {
	mutationObserver.disconnect()

	for (const el of document.querySelectorAll("relative-time")) {
		const span = document.createElement("span")
		span.setAttribute("datetime", el.getAttribute("datetime"))
		span.innerText = displayTime(timeFromElement(el), fmt)
		span.classList.add("deco-" + deco)
		span.dataset.rghHeat = el.dataset.rghHeat
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

function displayTime(t /*: Date */, fmt) {
	if (!fmt || fmt === "local") {
		return t.toLocaleString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		})
	}

	return fmt.replaceAll(/Y+|M+|D+|H+|h+|m+|S+/g, (match) => {
		switch(match) {
			case "YYYY": return t.getFullYear()
			case "YY": return t.getFullYear() % 100
			case "MMMM": return t.toLocaleString(undefined, {month: "long"})
			case "MMM": return t.toLocaleString(undefined, {month: "short"})
			case "MM": return pad2(t.getMonth() + 1)
			case "M": return t.getMonth() + 1
			case "DDDD": return t.toLocaleString(undefined, {weekday: "long"})
			case "DDD": return t.toLocaleString(undefined, {weekday: "short"})
			case "DD": return pad2(t.getDate())
			case "D": return t.getDate()
			case "HH": return pad2(t.getHours())
			case "H": return t.getHours()
			case "hh": return pad2(t.getHours() % 12 || 12)
			case "h": return t.getHours() % 12 || 12
			case "mm": return pad2(t.getMinutes())
			case "m": return t.getMinutes()
			case "SS": return pad2(t.getSeconds())
			case "S": return t.getSeconds()
			default: return match
		}
	})
}

function pad2(n) {
	return n < 10 ? "0" + n : n
}

function updateRelativeTimes() {
	const secondsInADay = 24 * 60 * 60

	for (let i = 0; i < timeSpans.length; i++) {
		const span = timeSpans[i]
		if (!document.body.contains(span)) {
			timeSpans.splice(i--, 1)
			continue
		}

		const seconds = (Date.now() - timeFromElement(span)) / 1000
		span.title = getRelativeTime(seconds)

		if (seconds < 2 * secondsInADay) {
			span.dataset.rghHeat = "1"
		} else if (seconds < 5 * secondsInADay) {
			span.dataset.rghHeat = "2"
		} else if (seconds < 10 * secondsInADay) {
			span.dataset.rghHeat = "3"
		} else {
			delete span.dataset.rghHeat
		}
	}
}

function getRelativeTime(count) {
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

