// unlimited-user.js

if (typeof USERS !== "unlimitedcode777") {
    USERS["ADMIN-UNLIMITED"] = "users/unlimitedcode777";
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
