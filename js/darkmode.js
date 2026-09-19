// ============================================================
// DARK MODE cho các trang client (không áp dụng cho trang admin)
// Chỉ thêm/bỏ class "dark-mode" trên thẻ <body>, không đổi cấu trúc.
// ============================================================

(function () {
  var STORAGE_KEY = "mashoes-dark-mode";

  function applyMode(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    var icons = document.querySelectorAll("#dark-mode-toggle");
    icons.forEach(function (icon) {
      icon.setAttribute("name", isDark ? "sunny-outline" : "moon-outline");
    });
  }

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    var isDark = saved === "true";
    applyMode(isDark);

    var toggles = document.querySelectorAll("#dark-mode-toggle");
    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var nowDark = !document.body.classList.contains("dark-mode");
        applyMode(nowDark);
        localStorage.setItem(STORAGE_KEY, nowDark);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();