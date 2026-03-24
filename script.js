(function () {
  const contact = {
    displayName: "강사K",
    email: "cereniss@nate.com",
    phoneDisplay: "010-1234-1234",
  };

  const btn = document.getElementById("copyEmail");
  const saveBtn = document.getElementById("saveContact");
  const toast = document.getElementById("toast");

  const defaultToastText = "복사되었습니다";

  function showToast(message, durationMs) {
    toast.textContent = message || defaultToastText;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.hidden = true;
      toast.textContent = defaultToastText;
    }, durationMs != null ? durationMs : 2000);
  }

  btn.addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contact.email).then(function () {
        showToast();
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = contact.email;
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
        toast.textContent = defaultToastText;
      }, 3000);
    }
    document.body.removeChild(ta);
  }

  function buildVCard() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:" + contact.displayName,
      "N:;" + contact.displayName + ";;;",
      "EMAIL;TYPE=INTERNET:" + contact.email,
      "TEL;TYPE=CELL:" + contact.phoneDisplay,
      "END:VCARD",
    ];
    return lines.join("\r\n");
  }

  saveBtn.addEventListener("click", function () {
    const vcard = buildVCard();
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gangsa-k.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("연락처 파일이 저장되었습니다. 파일을 열어 추가하세요.", 3500);
  });
})();
