// unlimited-user.js

if (typeof USERS !== "undefined") {
    USERS["ADMIN-UNLIMITED"] = "users/unlimited.js";
}

const originalUpdateSubscriptionDays = updateSubscriptionDays;

updateSubscriptionDays = function () {

    if (CURRENT_USER === "ADMIN-UNLIMITED") {

        if (statusEl) statusEl.textContent = "فعال";
        if (volumeEl) volumeEl.textContent = "♾ نامحدود";
        if (usersEl) usersEl.textContent = "∞";
        if (daysEl) daysEl.textContent = "♾ نامحدود";

        return;
    }

    return originalUpdateSubscriptionDays();
};

const originalUnlock = unlock;

unlock = function () {

    originalUnlock();

    if (CURRENT_USER === "ADMIN-UNLIMITED") {

        if (statusEl) statusEl.textContent = "فعال";
        if (volumeEl) volumeEl.textContent = "♾ نامحدود";
        if (usersEl) usersEl.textContent = "∞";
        if (daysEl) daysEl.textContent = "♾ نامحدود";
    }
};
