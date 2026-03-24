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
    const filename = "gangsa-k.vcf";
    const file = new File([blob], filename, { type: "text/vcard;charset=utf-8" });

    function downloadViaAnchor(objectUrl) {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function tryOpenContactUi(objectUrl) {
      var w = window.open(objectUrl, "_blank", "noopener,noreferrer");
      return !!(w && !w.closed);
    }

    var canShareFile = false;
    try {
      canShareFile =
        typeof File !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] });
    } catch (_) {
      canShareFile = false;
    }

    if (canShareFile) {
      navigator.share({ files: [file], title: contact.displayName }).then(function () {
        showToast("공유에서 연락처 또는 파일 앱을 선택해 추가할 수 있습니다.", 3500);
      }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        var url = URL.createObjectURL(blob);
        downloadViaAnchor(url);
        tryOpenContactUi(url);
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 60000);
        showToast("파일을 받았습니다. 열어서 연락처에 추가하거나, 새 탭에서 열기를 확인하세요.", 4000);
      });
      return;
    }

    var url = URL.createObjectURL(blob);
    downloadViaAnchor(url);
    if (!tryOpenContactUi(url)) {
      showToast("연락처 파일이 저장되었습니다. 다운로드 폴더에서 파일을 열어 추가하세요.", 4000);
    } else {
      showToast("파일이 저장되었습니다. 새 탭이 열리면 연락처 추가를 진행하세요.", 4000);
    }
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 60000);
  });
})();
