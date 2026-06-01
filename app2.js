// app2.js - unlimited user fix

(function () {

    function applyUnlimitedUI() {
        if (statusEl) statusEl.textContent = "فعال";
        if (volumeEl) volumeEl.textContent = "♾ نامحدود";
        if (usersEl) usersEl.textContent = "∞";
        if (daysEl) daysEl.textContent = "♾ نامحدود";

        // 🔥 اضافه شده: نمایش محدودیت کاربر
        const limitBox = document.getElementById("userLimit");
        if (limitBox) {
            limitBox.textContent = "محدودیت کاربر: نامحدود";
        }
    }

    // اضافه کردن یوزر ادمین
    if (typeof USERS !== "undefined") {
        USERS["ADMIN-UNLIMITED"] = "users/unlimitedcode777.js";
    }

    // patch unlock
    if (typeof unlock === "function") {
        const oldUnlock = unlock;

        unlock = function () {
            oldUnlock();

            if (CURRENT_USER === "ADMIN-UNLIMITED") {
                applyUnlimitedUI();
            }
        };
    }

    // patch subscription
    if (typeof updateSubscriptionDays === "function") {
        const oldUpdate = updateSubscriptionDays;

        updateSubscriptionDays = function () {

            if (CURRENT_USER === "ADMIN-UNLIMITED") {
                applyUnlimitedUI();
                return;
            }

            return oldUpdate();
        };
    }

})();
