const path = require("path"),
  defaultExtensions = [ ".css", ".scss", ".sass", ".less", ".styl" ];

function hmrCode(filenames) {
  return `
  ;(() => {
    let filenames = ["${filenames.join('","')}"];

    window.__inject_hot_css_reload = () => {
      if(window.__inject_hot_css_link_timeout) {
        cancelAnimationFrame(window.__inject_hot_css_link_timeout);
      }

      window.__inject_hot_css_link_timeout = requestAnimationFrame(() => {
        for (let filename of filenames) {
          const selector = 'link[href*="'+filename+'"]',
          link = document.querySelector(selector);

          if (link) {
            const href =
              link.getAttribute('href').split("?")[0] + "?" + Date.now(),
              nextLink = document.createElement("link");

            nextLink.setAttribute('rel', 'stylesheet');
            nextLink.setAttribute('type', 'text/css');
            nextLink.setAttribute('href', href);
            nextLink.onload = () => link.remove();
            document.head.appendChild(nextLink);
          }
        }
      });
    }
  })();
  `;
}

module.exports = function injectHotCSS(options = {}) {
  const extensions = options.extensions || defaultExtensions;

  return {
    name: "injectHotCSS",

    transform: async function transform(_, id) {
      if (!extensions.includes(path.extname(id))) return

      return `
        if(module && module.hot) {
          window.__inject_hot_css_reload();
          module.hot.accept(window.__inject_hot_css_reload);
          module.hot.dispose(window.__inject_hot_css_reload);
        }
      `;
    },

    generateBundle(_, bundle) {
      let entryFile,
        cssFilenames = [];

      for (const [filename, file] of Object.entries(bundle)) {
        if (file.isEntry) {
          entryFile = file;
        }

        if (filename.includes(".css") && !filename.includes(".map")) {
          if (!cssFilenames.includes(filename)) {
            cssFilenames.push(filename)
          }
        }
      }

      if (entryFile) {
        entryFile.code = hmrCode(cssFilenames) + entryFile.code;
      }
    }
  };
};
