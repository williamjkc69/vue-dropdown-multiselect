import vue from "rollup-plugin-vue"; // Handle .vue SFC files
import buble from "rollup-plugin-buble"; // Transpile/polyfill with reasonable browser support
import css from "rollup-plugin-import-css";

export default {
  input: "src/index.js", // Path relative to package.json
  output: {
    name: "VueDropdownMultiselect",
    exports: "named",
    extractCSS: false,
  },
  plugins: [
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    //   template: {
    //     isProduction: true
    //   }
    }),
    css(),
    buble() // Transpile to ES5
  ]
};
