"use strict";
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const CUSTOM_TEMPLATE_MANIFEST = "manifest.json";
const DEFAULT_TEMPLATE_STORE =
  "https://raw.githubusercontent.com/openfaas/store/master/templates.json";

module.exports = async (context, callback) => {
  const defaultTemplates = await fetch(DEFAULT_TEMPLATE_STORE).then(res =>
    res.json()
  );

  const customTemplates = getCustomManifest();
  const defaultTemplateNames = defaultTemplates.map(entry => entry.template);
  const customTemplateNames = customTemplates.map(entry => entry.template);
  const hasConflictingTemplateName = defaultTemplateNames.some(item =>
    customTemplateNames.includes(item)
  );

  if (hasConflictingTemplateName) {
    throw new Error(
      "Your custom template manifest contains a template name that conflicts with a template in the default template store."
    );
  }

  return [...defaultTemplates, ...customTemplates];
};

function getCustomManifest() {
  try {
    if (fs.existsSync(path.resolve(__dirname, CUSTOM_TEMPLATE_MANIFEST))) {
      const rawData = fs.readFileSync(
        path.resolve(__dirname, CUSTOM_TEMPLATE_MANIFEST)
      );

      return JSON.parse(rawData);
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
}
