#/bin/sh
echo "Adding the following templates to ./template-store/manifest.json:"
ls template/*/custom-template.json
jq -s '[.[]]' template/*/custom-template.json > template-store/manifest.json