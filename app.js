const USERS = {
    "RT-HR5TA7Q5": "user1.js",
    "ADSTG6QA": "user2.js",
    "A7K9ZT1M": "user3.js",
    "Q4N8CW2R": "user4.js",
    "Y7M5LK9P": "user5.js",

    "B2D6FH8X": "user6.js",
    "NL-U1J4RS7K": "users/user7.js",
    "RT-E9T3ZA5N": "users/user8.js",
    "RT-G6P2VX4M": "users/user9.js",
    "RT-W8Q1BN3L": "users/user10.js",

    "RT-C7H5KD2A": "users/user11.js",
    "RT-F4L9RP6Y": "users/user12.js",
    "RT-N2X8TV1Q": "users/user13.js",
    "RT-Z6M3JB7S": "users/user14.js",
    "X8P2LM4QAmm": "user15.js",

    "RT-R8Y2FC5U": "users/user16.js",
    "RT-L3Q7GH1T": "users/user17.js",
    "RT-V9N5MK2D": "users/user18.js",
    "RT-T4A8XE6P": "users/user19.js",
    "RT-J7W1BZ3R": "users/user20.js"
};

let CURRENT_USER = null;
let CONFIG_URL = null;
let timerStarted = false;
const COUNTRIES = [
    "fr",
    "de",
    "us",
    "gb",
    "ca",
    "nl",
    "tr",
    "jp",
    "sg",
    "ae",
    "it",
    "es",
    "se",
    "ch",
    "no"
];

function hashCode(str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }

    return Math.abs(hash);
}

function generateUserData(user) {

    const hash = hashCode(user);

    const ip =
        (hash % 223 + 1) + "." +
        ((hash * 3) % 255) + "." +
        ((hash * 7) % 255) + "." +
        ((hash * 11) % 255);

    const country =
        COUNTRIES[hash % COUNTRIES.length];

    return {
        ip,
        port: 22,
        country
    };
}
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

const userShow = document.getElementById("userShow");
const copyUserBtn = document.getElementById("copyUserBtn");

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
        if (!text || !text.trim()) return false;

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
        if (!CONFIG_URL) {
            cfgEl.textContent = "کانفیگ یافت نشد";
            return;
        }

        const res = await fetch(CONFIG_URL + "?t=" + Date.now());

        if (!res.ok) {
            throw new Error();
        }

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

/* subscription */
function updateSubscriptionDays() {
    if (!CURRENT_USER) return;

    const key = "subscription_start_" + CURRENT_USER;

    let startDate = localStorage.getItem(key);

    if (!startDate) {
        startDate = Date.now();
        localStorage.setItem(key, startDate);
    }

    const totalSecondsPassed =
        Math.floor((Date.now() - Number(startDate)) / 1000);

    const totalSecondsLeft =
        Math.max((30 * 24 * 60 * 60) - totalSecondsPassed, 0);

    const days = Math.floor(totalSecondsLeft / 86400);
    const hours = Math.floor((totalSecondsLeft % 86400) / 3600);
    const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
    const seconds = totalSecondsLeft % 60;

    if (daysEl) {
        daysEl.textContent =
            `${days} روز ${hours}:${minutes}:${seconds}`;
    }

    if (totalSecondsLeft <= 0) {
        if (statusEl) statusEl.textContent = "منقضی شده";
        if (volumeEl) volumeEl.textContent = "0";
        if (usersEl) usersEl.textContent = "0";
        if (daysEl) daysEl.textContent = "⛔ پایان اشتراک";
    }
}

/* user ui */
function setUserUI(user) {
    if (userShow) {
        userShow.textContent = "User: " + user;
    }
}

/* lock */
function lockUI() {
    if (panel) panel.style.display = "none";
    if (ipBox) ipBox.style.display = "none";
}

/* unlock */
function unlock() {

    const user = localStorage.getItem("rocket_user");

    if (!user || !USERS[user]) {
        lockUI();
        return;
    }

    CURRENT_USER = user;
    CONFIG_URL = USERS[user];

    if (loginBox) loginBox.style.display = "none";
    if (panel) panel.style.display = "block";

    setUserUI(user);

    if (statusEl) statusEl.textContent = "فعال";
    if (volumeEl) volumeEl.textContent = "نامحدود";
    if (usersEl) usersEl.textContent = "1";

    if (downEl)
        downEl.textContent = randomSpeed(150, 500) + " Mbps";

    if (upEl)
        upEl.textContent = randomSpeed(80, 300) + " Mbps";

    loadConfig();
    updateSubscriptionDays();

    if (!timerStarted) {
        timerStarted = true;
        setInterval(updateSubscriptionDays, 1000);
    }

    if (ipBox) ipBox.style.display = "block";

    const userInfo = generateUserData(user);

if (ipValue) {
    ipValue.innerHTML =
        `${userInfo.ip}<br><small>Port : ${userInfo.port}</small>`;
}

if (flag) {

    flag.src =
        `https://flagcdn.com/w40/${userInfo.country}.png`;

    flag.onerror = () => {
        flag.style.display = "none";
    };
}
}

/* login */
loginBtn?.addEventListener("click", () => {

    const val = userCode.value.trim();

    if (!USERS[val]) {
        toast("کد اشتباه است");
        return;
    }

    CURRENT_USER = val;
    CONFIG_URL = USERS[val];

    localStorage.setItem("rocket_user", val);

    const subKey = "subscription_start_" + val;

    if (!localStorage.getItem(subKey)) {
        localStorage.setItem(subKey, Date.now());
    }

    toast("ورود موفق");
    unlock();
});

/* copy config */
copyBtn?.addEventListener("click", async () => {

    const ok = await copyText(cfgEl?.textContent || "");

    toast(ok ? "کپی شد" : "خطا");
});

/* copy user */
copyUserBtn?.addEventListener("click", async () => {

    const user = localStorage.getItem("rocket_user");

    if (!user) {
        toast("کاربری یافت نشد");
        return;
    }

    const ok = await copyText(user);

    toast(ok ? "کپی شد" : "خطا");
});

/* auto login */
const savedUser = localStorage.getItem("rocket_user");

if (savedUser && USERS[savedUser]) {

    CURRENT_USER = savedUser;
    CONFIG_URL = USERS[savedUser];

    unlock();

} else {

    lockUI();

}
