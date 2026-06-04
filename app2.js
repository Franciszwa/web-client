(function () {

    function setUnlimitedUI() {

        if (statusEl) statusEl.textContent = "غیرفعال";
        if (volumeEl) volumeEl.textContent = " نامحدود";
        if (usersEl) usersEl.textContent = "∞";
        if (daysEl) daysEl.textContent = " نامحدود";

        // 🔥 ساخت خودکار اگر وجود نداشت
        let el = document.getElementById("userLimit");

        if (!el) {
            el = document.createElement("div");
            el.id = "userLimit";
            el.style.marginTop = "10px";
            el.style.color = "#00ffcc";
            el.style.fontWeight = "bold";

            const panel = document.querySelector(".panel");
            if (panel) panel.prepend(el);
        }

        el.textContent = "محدودیت کاربر: نامحدود";
    }

    if (typeof USERS !== "undefined") {
        USERS["ADMIN-UNLIMITED"] = "users/unlimitedcode777.js";
    }

    function checkAdmin() {
        if (CURRENT_USER === "ADMIN-UNLIMITED") {
            setUnlimitedUI();
        }
    }

    // hook unlock
    if (typeof unlock === "function") {
        const old = unlock;

        unlock = function () {
            old();
            checkAdmin();
        };
    }

    // hook subscription
    if (typeof updateSubscriptionDays === "function") {
        const old = updateSubscriptionDays;

        updateSubscriptionDays = function () {
            if (CURRENT_USER === "ADMIN-UNLIMITED") {
                setUnlimitedUI();
                return;
            }
            return old();
        };
    }

    // extra safety (fallback)
    setTimeout(checkAdmin, 500);

})();
