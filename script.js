(function () {
  const email = "cereniss@nate.com";
  const btn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");

  function showToast() {
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.hidden = true;
    }, 2000);
  }

  btn.addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showToast).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast();
    } catch (_) {
      toast.textContent = "복사에 실패했습니다. 주소를 직접 선택해 주세요.";
      toast.hidden = false;
      clearTimeout(fallbackCopy._t);
      fallbackCopy._t = setTimeout(function () {
        toast.hidden = true;
        toast.textContent = "복사되었습니다";
      }, 3000);
    }
    document.body.removeChild(ta);
  }
})();
