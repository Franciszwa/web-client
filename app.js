const VALID = "RT-HR5TA7Q5";
const CONFIG_URL = "tunl.js";

/* elements */
const loginBox = document.getElementById("loginBox");
const userCode = document.getElementById("userCode");
const loginBtn = document.getElementById("loginBtn");

const panel = document.querySelector(".panel");

const statusEl = document.getElementById("status");
const volumeEl = document.getElementById("volume");
const usersEl = document.getElementById("users");
const downEl = document.getElementById("down");
const upEl = document.getElementById("up");
const daysEl = document.getElementById("daysLeft");

const cfgEl = document.getElementById("cfg");
const copyBtn = document.getElementById("copyBtn");

/* USER */
const userShow = document.getElementById("userShow");
const copyUserBtn = document.getElementById("copyUserBtn");

/* IP */
const ipBox = document.getElementById("ipBox");
const flag = document.getElementById("flag");
const ipValue = document.getElementById("ipValue");

/* toast */
function toast(text = "موفق") {
    const t = document.getElementById("toast");
    if (!t) return;

    t.textContent = text;
    t.style.display = "block";

    setTimeout(() => {
        t.style.display = "none";
    }, 2000);
}

/* copy */
async function copyText(text) {
    try {
        if (!text || text.trim() === "") return false;

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);

        return ok;
    } catch {
        return false;
    }
}

/* config */
async function loadConfig() {
    try {
        const res = await fetch(CONFIG_URL + "?t=" + Date.now());
        const text = await res.text();
        cfgEl.textContent = text;
    } catch {
        cfgEl.textContent = "خطا در دریافت کانفیگ";
    }
}

/* speed */
function randomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* LIVE SUBSCRIPTION TIMER */
function updateSubscriptionDays() {
    let startDate = localStorage.getItem("subscription_start");

    if (!startDate) {
        startDate = Date.now();
        localStorage.setItem("subscription_start", startDate);
    }

    const totalSecondsPassed = Math.floor((Date.now() - Number(startDate)) / 1000);
    const totalSecondsLeft = Math.max((30 * 24 * 60 * 60) - totalSecondsPassed, 0);

    const days = Math.floor(totalSecondsLeft / 86400);
    const hours = Math.floor((totalSecondsLeft % 86400) / 3600);
    const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
    const seconds = totalSecondsLeft % 60;

    if (daysEl) {
        daysEl.textContent = `${days} روز ${hours}:${minutes}:${seconds}`;
    }

    if (totalSecondsLeft <= 0) {
        if (statusEl) statusEl.textContent = "منقضی شده";
        if (volumeEl) volumeEl.textContent = "0";
        if (usersEl) usersEl.textContent = "0";

        if (daysEl) daysEl.textContent = "⛔ پایان اشتراک";
    }
}

/* user */
function setUserUI(user) {
    if (userShow) userShow.textContent = "User: " + user;
}

/* lock */
function lockUI() {
    if (panel) panel.style.display = "none";
    if (ipBox) ipBox.style.display = "none";
}

/* unlock */
function unlock() {
    if (loginBox) loginBox.style.display = "none";
    if (panel) panel.style.display = "block";

    const user = localStorage.getItem("rocket_user");
    if (user) setUserUI(user);

    statusEl.textContent = "فعال";
    volumeEl.textContent = "نامحدود";
    usersEl.textContent = "1";

    downEl.textContent = randomSpeed(150, 500) + " Mbps";
    upEl.textContent = randomSpeed(80, 300) + " Mbps";

    loadConfig();
    updateSubscriptionDays();

    /* LIVE TIMER START */
    setInterval(updateSubscriptionDays, 1000);

    /* IP BOX */
    if (ipBox) ipBox.style.display = "block";

    const ip = "163.5.254.239";
    const port = 22;

    if (ipValue) {
        ipValue.innerHTML = `${ip}<br><small>Port : ${port}</small>`;
    }

    /* FLAG */
    if (flag) {
        flag.src = "https://flagcdn.com/w40/fr.png";
        flag.onerror = () => {
            flag.style.display = "none";
        };
    }
}

/* login */
loginBtn?.addEventListener("click", () => {
    const val = userCode.value.trim();

    if (val !== VALID) {
        toast("کد اشتباه است");
        return;
    }

    localStorage.setItem("rocket_user", val);
    localStorage.setItem("subscription_start", Date.now());

    toast("ورود موفق");
    unlock();
});

/* copy config */
copyBtn?.addEventListener("click", async () => {
    const ok = await copyText(cfgEl?.textContent);
    toast(ok ? "کپی شد" : "خطا");
});

/* copy user */
copyUserBtn?.addEventListener("click", async () => {
    const user = localStorage.getItem("rocket_user");
    if (!user) return toast("نداری");

    const ok = await copyText(user);
    toast(ok ? "کپی شد" : "خطا");
});

/* auto login */
if (localStorage.getItem("rocket_user") === VALID) {
    unlock();
} else {
    lockUI();
}