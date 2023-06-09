build:
	rm -f inhuman-time-{firefox,chrome}.zip
	sed '/manifest_version/ s/.,/2,/' src/manifest.json > manifest.json.tmp
	mv manifest.json.tmp src/manifest.json
	cd src && zip -r ../inhuman-time-firefox.zip *
	sed '/manifest_version/ s/.,/3,/' src/manifest.json > manifest.json.tmp
	mv manifest.json.tmp src/manifest.json
	cd src && zip -r ../inhuman-time-chrome.zip *
