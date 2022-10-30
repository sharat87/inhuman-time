build:
	rm -f inhuman-time-{firefox,chrome}.zip
	sed '/manifest_version/ s/.,/2,/' manifest.json > manifest.json.tmp
	mv manifest.json.tmp manifest.json
	zip -r inhuman-time-firefox.zip content_script.js manifest.json icons/*.png
	sed '/manifest_version/ s/.,/3,/' manifest.json > manifest.json.tmp
	mv manifest.json.tmp manifest.json
	zip -r inhuman-time-chrome.zip content_script.js manifest.json icons/*.png
