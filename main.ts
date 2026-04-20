if (import.meta.env.DEV) {
  void import("./_build/js/debug/build/gaato-net.js");
} else {
  void import("./_build/js/release/build/gaato-net.js");
}
