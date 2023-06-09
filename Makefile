build:
	rm -f inhuman-time-{firefox,chrome}.zip
	sed '/manifest_version/ s/3,.*/3, "browser_specific_settings": {"gecko": {"id": "{30d5a66b-2ad7-4360-be9f-357007c3cc1b}"}},/' src/manifest.json > manifest.json.tmp
	mv manifest.json.tmp src/manifest.json
	cd src && zip -r ../inhuman-time-firefox.zip *
	sed '/manifest_version/ s/3,.*/3,/' src/manifest.json > manifest.json.tmp
	mv manifest.json.tmp src/manifest.json
	cd src && zip -r ../inhuman-time-chrome.zip *
