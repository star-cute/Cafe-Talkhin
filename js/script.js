/* ==============================
   SAFE LOCAL STORAGE READER
============================== */

function getLocalStorageArray(key) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        const parsedData = JSON.parse(data);

        if (!Array.isArray(parsedData)) {
            console.error("ساختار اطلاعات معتبر نیست:", key);
            return [];
        }

        return parsedData;

    } catch (error) {

        console.error("خطا در خواندن اطلاعات:", key, error);
        return [];

    }

}

// ======================================
// DEFAULT COFFEE TABLES
// ======================================

const TABLES_KEY = "coffeeTables";

const defaultTables = [
    { id: "default-1", number: 1, capacity: 2, area: "indoor", active: true },
    { id: "default-2", number: 2, capacity: 4, area: "indoor", active: true },
    { id: "default-3", number: 3, capacity: 2, area: "indoor", active: true },
    { id: "default-4", number: 4, capacity: 4, area: "indoor", active: true },

    { id: "default-5", number: 5, capacity: 2, area: "window", active: true },
    { id: "default-6", number: 6, capacity: 2, area: "window", active: true },
    { id: "default-7", number: 7, capacity: 2, area: "window", active: true },

    { id: "default-8", number: 8, capacity: 2, area: "outdoor", active: true },
    { id: "default-9", number: 9, capacity: 4, area: "outdoor", active: true },
    { id: "default-10", number: 10, capacity: 2, area: "outdoor", active: true }
];

if (localStorage.getItem(TABLES_KEY) === null) {
    localStorage.setItem(TABLES_KEY, JSON.stringify(defaultTables));
}



// ======================================
// 1. LOGIN PAGE - ANIMATED CIRCLE
// ======================================

const circleContainer = document.getElementById("circleContainer");

if (circleContainer) {

    const numBars = 60;

    for (let i = 0; i < numBars; i++) {

        const bar = document.createElement("div");

        bar.className = "bar";

        bar.style.transform =
            `rotate(${(360 / numBars) * i}deg) translateY(-280px)`;

        bar.style.animationDelay = `${i * 0.025}s`;

        circleContainer.appendChild(bar);
    }
}


// ======================================
// 2. SHOW / HIDE PASSWORD
// ======================================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {

    togglePassword.addEventListener("click", () => {

        const show = password.type === "password";

        password.type = show ? "text" : "password";

        togglePassword.classList.toggle("fa-eye", !show);
        togglePassword.classList.toggle("fa-eye-slash", show);

    });
}


// ======================================
// 3. LOGIN FORM
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const passwordValue = password.value;

        if (!email || !passwordValue) {
            alert("لطفاً ایمیل و رمز عبور را وارد کنید.");
            return;
        }

        // ذخیره شناسه مشتری برای نسخه آزمایشی
localStorage.setItem("coffeeCurrentUser", email.toLowerCase());

// ورود آزمایشی
alert("به کافه تلخین خوش آمدید!");

window.location.href = "reservation.html";
    });
}


// ======================================
// 4. RESERVATION FORM
// ======================================

const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {

    reservationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = document.getElementById("guests").value;
        const area = document.getElementById("area").value;
        const notes = document.getElementById("notes").value.trim();


        // بررسی تکمیل اطلاعات رزرو
if (!fullName || !mobile || !date || !time || !guests || !area) {
    alert("لطفاً تمام اطلاعات ضروری رزرو را تکمیل کنید.");
    return;
}

// بررسی محدوده انتخاب‌شده
if (!["inside", "window", "outside"].includes(area)) {
    alert("محدوده انتخاب‌شده معتبر نیست.");
    return;
}

// بررسی تعداد نفرات
const guestCount = Number(guests);

if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    alert("تعداد نفرات باید عددی صحیح بین ۱ تا ۲۰ باشد.");
    return;
}

// بررسی قالب ساعت
if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    alert("ساعت رزرو معتبر نیست.");
    return;
}

        // اعتبارسنجی شماره موبایل
        const mobilePattern = /^09\d{9}$/;

        if (!mobilePattern.test(mobile)) {
            alert("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
            return;
        }

        // بررسی تاریخ رزرو
        const selectedDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("تاریخ رزرو نمی‌تواند در گذشته باشد.");
            return;
        }

        // دریافت امن رزروهای قبلی
        const reservations = getLocalStorageArray("coffeeReservations");

        // ایجاد اطلاعات رزرو جدید
        // دریافت شناسه مشتری واردشده
        const currentUser = localStorage.getItem("coffeeCurrentUser");

// بررسی ورود مشتری
if (!currentUser) {
    alert("ابتدا باید وارد حساب کاربری خود شوید.");
    window.location.href = "index.html";
    return;
}

// ایجاد اطلاعات رزرو جدید
const newReservation = {

    id: Date.now(),

    userId: currentUser,

    fullName: fullName,
    mobile: mobile,
    date: date,
    time: time,
    guests: guests,
    area: area,
    notes: notes,

    status: "در انتظار تأیید"

};

        // ذخیره رزرو
        reservations.push(newReservation);

        localStorage.setItem(
            "coffeeReservations",
            JSON.stringify(reservations)
        );

        alert(
            "درخواست رزرو شما با موفقیت ثبت شد.\n" +
            "کافه تلخین منتظر دیدار شماست!"
        );

        reservationForm.reset();

    });

}

/* ==============================
   MY RESERVATIONS
============================== */

const reservationsList = document.getElementById("reservationsList");

if (reservationsList) {

    const emptyReservations = document.getElementById("emptyReservations");
    const totalReservations = document.getElementById("totalReservations");
    const pendingReservations = document.getElementById("pendingReservations");

    function displayReservations() {

        // دریافت شناسه مشتری واردشده
const currentUser = localStorage.getItem("coffeeCurrentUser");

// بررسی ورود مشتری
if (!currentUser) {
    alert("لطفاً ابتدا وارد حساب کاربری خود شوید.");
    window.location.href = "index.html";
    return;
}


// دریافت امن تمام رزروها
const allReservations = getLocalStorageArray("coffeeReservations");

// نمایش فقط رزروهای مشتری فعلی
const reservations = allReservations.filter(
    item =>
        String(item.userId || "").toLowerCase() ===
        currentUser.toLowerCase()
);

        reservationsList.innerHTML = "";

        totalReservations.textContent = reservations.length;

        pendingReservations.textContent = reservations.filter(
            item => item.status === "در انتظار تأیید"
        ).length;

        if (reservations.length === 0) {
            emptyReservations.style.display = "block";
            return;
        }

        emptyReservations.style.display = "none";

        reservations.forEach((reservation, index) => {

            const card = document.createElement("div");
            card.className = "reservation-card-item";

            const details = [
    ["fa-calendar", "تاریخ", reservation.date],
    ["fa-clock", "ساعت", reservation.time],
    ["fa-users", "تعداد نفرات", `${reservation.guests} نفر`],
    ["fa-chair", "محل نشستن", reservation.area],
    ["fa-user", "نام رزروکننده", reservation.fullName],
    [
        "fa-chair",
        "شماره میز",
        reservation.tableNumber
            ? `میز ${reservation.tableNumber}`
            : "در انتظار تخصیص میز"
    ]
];

            card.innerHTML = `
                <div class="reservation-card-top">
                    <h3>رزرو شماره ${index + 1}</h3>
                    <span class="reservation-status">
                        ${escapeReservationText(reservation.status || "در انتظار تأیید")}
                    </span>
                </div>

                <div class="reservation-details">
                    ${details.map(detail => `
                        <div class="reservation-detail">
                            <i class="fas ${detail[0]}"></i>
                            <span>
                                ${detail[1]}:
                                ${escapeReservationText(detail[2] ?? "")}
                            </span>
                        </div>
                    `).join("")}
                </div>

                ${reservation.notes ? `
                    <p class="reservation-notes">
                        توضیحات: ${escapeReservationText(reservation.notes)}
                    </p>
                ` : ""}

                <button class="delete-reservation-btn"
                    data-id="${escapeReservationText(reservation.id)}">
                    <i class="fas fa-trash"></i>
                    حذف رزرو
                </button>
            `;

            reservationsList.appendChild(card);
        });
    }

    function escapeReservationText(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    reservationsList.addEventListener("click", function(event) {

        const deleteButton = event.target.closest(".delete-reservation-btn");

        if (!deleteButton) return;

        const reservationId = deleteButton.dataset.id;

        if (!confirm("آیا از حذف این رزرو مطمئن هستید؟")) {
            return;
        }

        const reservations = getLocalStorageArray("coffeeReservations");
        const updatedReservations = reservations.filter(
            item => String(item.id) !== reservationId
        );

        localStorage.setItem(
            "coffeeReservations",
            JSON.stringify(updatedReservations)
        );

        displayReservations();
    });

    displayReservations();

    // به‌روزرسانی رزروها هنگام تغییر اطلاعات در تب دیگر
window.addEventListener("storage", function (event) {

    if (event.key === "coffeeReservations") {
        displayReservations();
    }

});
}

/* ==============================
   CAFE MENU & SHOPPING CART
============================== */

const menuProducts = document.getElementById("menuProducts");

if (menuProducts) {

    const categoryButtons = document.querySelectorAll(".category-btn");
    const cartToggle = document.getElementById("cartToggle");
    const cartPanel = document.getElementById("cartPanel");
    const closeCart = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let cart = [];

    // فیلتر دسته‌بندی محصولات
    categoryButtons.forEach(button => {

        button.addEventListener("click", function () {

            categoryButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const category = this.dataset.category;

            document.querySelectorAll(".menu-product").forEach(product => {

                product.style.display =
                    category === "all" || product.dataset.category === category
                    ? ""
                    : "none";

            });
        });
    });

    // باز کردن سبد خرید
    cartToggle.addEventListener("click", function () {
        cartPanel.classList.add("open");
    });

    // بستن سبد خرید
    closeCart.addEventListener("click", function () {
        cartPanel.classList.remove("open");
    });

    // افزودن محصول به سبد خرید
    menuProducts.addEventListener("click", function (event) {

        const button = event.target.closest(".add-to-cart");

        if (!button) return;

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        cartPanel.classList.add("open");
    });

    // نمایش سبد خرید
    function updateCart() {

        cartItems.innerHTML = "";

        let total = 0;
        let count = 0;

        if (cart.length === 0) {

            cartItems.innerHTML =
                '<p class="cart-empty">هنوز محصولی انتخاب نکرده‌ای.</p>';

        }

        cart.forEach((item, index) => {

            total += item.price * item.quantity;
            count += item.quantity;

            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";

            const info = document.createElement("div");

            const name = document.createElement("h4");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent =
                (item.price * item.quantity).toLocaleString("fa-IR") + " تومان";

            info.append(name, price);

            const actions = document.createElement("div");
            actions.className = "cart-item-actions";

            const decrease = document.createElement("button");
            decrease.textContent = "−";
            decrease.dataset.action = "decrease";
            decrease.dataset.index = index;
            decrease.setAttribute("aria-label", "کاهش تعداد");

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity.toLocaleString("fa-IR");

            const increase = document.createElement("button");
            increase.textContent = "+";
            increase.dataset.action = "increase";
            increase.dataset.index = index;
            increase.setAttribute("aria-label", "افزایش تعداد");

            actions.append(decrease, quantity, increase);
            itemElement.append(info, actions);

            cartItems.appendChild(itemElement);
        });

        cartCount.textContent = count.toLocaleString("fa-IR");

        cartTotal.textContent =
            total.toLocaleString("fa-IR") + " تومان";
    }

    // تغییر تعداد محصولات
    cartItems.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);

        if (button.dataset.action === "increase") {
            cart[index].quantity++;
        }

        if (button.dataset.action === "decrease") {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        updateCart();
    });

    updateCart();
}

// ==========================================
// ADMIN PANEL - RESERVATION MANAGEMENT
// ==========================================

if (document.querySelector(".admin-page")) {

    const reservationsList = document.getElementById("adminReservationsList");

    const totalReservations = document.getElementById("totalReservations");
    const pendingReservations = document.getElementById("pendingReservations");
    const approvedReservations = document.getElementById("approvedReservations");
    const totalCustomers = document.getElementById("totalCustomers");

    // دریافت رزروها از Local Storage
    function getAdminReservations() {
    return getLocalStorageArray("coffeeReservations");
}

    // ذخیره رزروها در Local Storage
    function saveAdminReservations(reservations) {
        localStorage.setItem("coffeeReservations", JSON.stringify(reservations));
    }

    // به‌روزرسانی آمار داشبورد

function updateAdminStats(reservations) {

    const pending = reservations.filter(
        item => item.status === "در انتظار تأیید"
    ).length;

    const approved = reservations.filter(
        item => item.status === "تأیید شده"
    ).length;

    const customers = new Set(
        reservations.map(item => item.mobile)
    ).size;

    if (totalReservations) {
        totalReservations.textContent = reservations.length;
    }

    if (pendingReservations) {
        pendingReservations.textContent = pending;
    }

    if (approvedReservations) {
        approvedReservations.textContent = approved;
    }

    if (totalCustomers) {
        totalCustomers.textContent = customers;
    }
}


    
// نمایش رزروها در جدول
function renderAdminReservations() {

    const reservations = getAdminReservations();

    updateAdminStats(reservations);

    if (!reservationsList) return;

    if (reservations.length === 0) {
        reservationsList.innerHTML = `
            <tr>
                <td colspan="9" class="empty-table">
                    هنوز هیچ رزروی ثبت نشده است.
                </td>
            </tr>
        `;
        return;
    }

    reservationsList.innerHTML = reservations.map(item => {

        const safe = value => String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

        const status = item.status || "در انتظار تأیید";

        return `
            <tr>
                <td>${safe(item.fullName)}</td>
                <td>${safe(item.mobile)}</td>
                <td>${safe(item.date)}</td>
                <td>${safe(item.time)}</td>
                <td>${safe(item.guests)}</td>
                <td>${safe(item.area)}</td>

                <td>
                    ${item.tableNumber
                        ? "میز " + safe(item.tableNumber)
                        : "اختصاص داده نشده"}
                </td>

                <td>
                    <span class="reservation-status">
                        ${safe(status)}
                    </span>
                </td>

                <td>
                    <button class="admin-action-btn approve-btn"
                        data-action="approve"
                        data-id="${safe(item.id)}">
                        تأیید
                    </button>


<button class="admin-action-btn"
    data-action="assign"
    data-id="${safe(item.id)}">
    اختصاص میز
</button>


                    <button class="admin-action-btn reject-btn"
                        data-action="reject"
                        data-id="${safe(item.id)}">
                        رد
                    </button>

                    <button class="admin-action-btn delete-btn"
                        data-action="delete"
                        data-id="${safe(item.id)}">
                        حذف
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}


    
// مدیریت دکمه‌های جدول
if (reservationsList) {

    reservationsList.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        let reservations = getAdminReservations();

        const reservationIndex = reservations.findIndex(
            item => String(item.id) === id
        );

        if (reservationIndex === -1) return;

        const reservation = reservations[reservationIndex];

        // حذف رزرو
        if (action === "delete") {

            if (!confirm("آیا از حذف این رزرو مطمئن هستید؟")) return;

            reservations.splice(reservationIndex, 1);

        }

        // اختصاص میز
        else if (action === "assign") {

            if (reservation.status === "رد شده") {
                alert("برای رزرو رد شده نمی‌توان میز اختصاص داد.");
                return;
            }

            const tables = getLocalStorageArray("coffeeTables");

            // تبدیل محدوده به عنوان فارسی
            const areaNames = {
                indoor: "فضای داخلی",
                window: "کنار پنجره",
                outdoor: "فضای بیرونی"
            };

            // بررسی رزروهای هم‌زمان
            function isTimeOverlapping(time1, time2) {

                const start1 = Number(time1.split(":")[0]) * 60 +
                    Number(time1.split(":")[1]);

                const start2 = Number(time2.split(":")[0]) * 60 +
                    Number(time2.split(":")[1]);

                const end1 = start1 + 120;
                const end2 = start2 + 120;

                return start1 < end2 && start2 < end1;
            }

            // پیدا کردن میزهای مناسب
            console.log("اطلاعات رزرو:", reservation);
console.log("میزهای موجود:", tables);

            // پیدا کردن میزهای مناسب
const availableTables = tables.filter(table => {

    // بررسی فعال بودن میز
    if (table.active !== true) return false;

    // یکسان‌سازی نام محدوده‌ها
    const normalizeArea = area => {
        const areaMap = {
            inside: "indoor",
            indoor: "indoor",
            outside: "outdoor",
            outdoor: "outdoor",
            window: "window"
        };

        return areaMap[area] || area;
    };

    // بررسی یکسان بودن محدوده میز و رزرو
    if (normalizeArea(table.area) !== normalizeArea(reservation.area)) {
        return false;
    }

    // بررسی ظرفیت میز
    if (Number(table.capacity) < Number(reservation.guests)) {
        return false;
    }

    // بررسی تداخل زمانی رزرو
    const isReserved = reservations.some(item => {

        if (String(item.id) === id) return false;

        if (String(item.tableNumber) !== String(table.number)) {
            return false;
        }

        if (item.status !== "تأیید شده") return false;

        if (item.date !== reservation.date) return false;

        return isTimeOverlapping(item.time, reservation.time);
    });

    return !isReserved;
});

// نمایش میزهای مناسب در Console
console.log("محدوده رزرو:", reservation.area);
console.log("میزهای مناسب:", availableTables);

            if (availableTables.length === 0) {
                alert("هیچ میز مناسبی برای این رزرو در دسترس نیست.");
                return;
            }

            const tableOptions = availableTables.map(table =>
                `میز ${table.number} - ظرفیت ${table.capacity} نفر`
            ).join("\n");

            const selectedTable = prompt(
                "شماره میز موردنظر را وارد کنید:\n\n" + tableOptions,
                String(availableTables[0].number)
            );

            if (selectedTable === null) return;

            const chosenTable = availableTables.find(
                table => String(table.number) === selectedTable.trim()
            );

            if (!chosenTable) {
                alert("شماره میز انتخاب‌شده معتبر نیست.");
                return;
            }

            reservation.tableNumber = chosenTable.number;
            reservation.status = "تأیید شده";

            alert(
                "میز شماره " + chosenTable.number +
                " با موفقیت به رزرو اختصاص داده شد."
            );
        }

        // تأیید رزرو
        // تأیید رزرو فقط پس از اختصاص میز
else if (action === "approve") {

    if (!reservation.tableNumber) {
        alert("ابتدا باید یک میز به این رزرو اختصاص دهید.");
        return;
    }

    
}
        // رد رزرو
        else if (action === "reject") {
            reservation.status = "رد شده";
            delete reservation.tableNumber;
        }

        saveAdminReservations(reservations);
        renderAdminReservations();
    });
}

// اجرای اولیه
renderAdminReservations();

} // پایان بخش مدیریت رزروها

// ==========================================
// ADMIN PANEL - CUSTOMER MANAGEMENT
// ==========================================

if (document.querySelector(".admin-page")) {

    const customersList = document.getElementById("adminCustomersList");
    const customersCount = document.getElementById("customersCount");
    const customersReservationsCount = document.getElementById("customersReservationsCount");
    const refreshCustomers = document.getElementById("refreshCustomers");

    // دریافت اطلاعات رزروها
    function getCustomerReservations() {
        return JSON.parse(localStorage.getItem("coffeeReservations")) || [];
    }

    // نمایش مشتریان
    function renderCustomers() {

        const reservations = getCustomerReservations();

        // گروه‌بندی رزروها براساس شماره موبایل
        const customersMap = new Map();

        reservations.forEach(item => {

            const mobile = String(item.mobile || "");

            if (!mobile) return;

            if (!customersMap.has(mobile)) {
                customersMap.set(mobile, {
                    fullName: item.fullName || "بدون نام",
                    mobile: mobile,
                    reservations: []
                });
            }

            customersMap.get(mobile).reservations.push(item);
        });

        const customers = Array.from(customersMap.values());

        // مرتب‌سازی براساس آخرین تاریخ رزرو
        customers.forEach(customer => {
            customer.reservations.sort((a, b) => {
                return String(b.date || "").localeCompare(String(a.date || ""));
            });
        });

        // بروزرسانی آمار
        customersCount.textContent = customers.length;
        customersReservationsCount.textContent = reservations.length;

        // نمایش پیام در صورت نبود مشتری
        if (customers.length === 0) {

            customersList.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-empty">
                        هنوز مشتری‌ای ثبت نشده است.
                    </td>
                </tr>
            `;

            return;
        }

        // نمایش جدول مشتریان
        customersList.innerHTML = customers.map((customer, index) => {

            const escapeHTML = value =>
                String(value).replace(/[&<>"']/g, char => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                })[char]);

            const lastReservation = customer.reservations[0];

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHTML(customer.fullName)}</td>
                    <td>${escapeHTML(customer.mobile)}</td>
                    <td>${customer.reservations.length}</td>
                    <td>${escapeHTML(lastReservation.date || "-")}</td>
                </tr>
            `;

        }).join("");
    }

    // دکمه بروزرسانی
    if (refreshCustomers) {
        refreshCustomers.addEventListener("click", renderCustomers);
    }

    // اجرای اولیه
    renderCustomers();
}

// ======================================
// Tables Management
// ======================================

if (document.querySelector(".admin-page") && document.getElementById("addTableForm")) {

    const addTableForm = document.getElementById("addTableForm");
    const tableNumberInput = document.getElementById("tableNumber");
    const tableCapacityInput = document.getElementById("tableCapacity");
    const tableAreaInput = document.getElementById("tableArea");
    const adminTablesList = document.getElementById("adminTablesList");

    const totalTablesElement = document.getElementById("totalTables");
    const totalCapacityElement = document.getElementById("totalTableCapacity");
    const activeTablesElement = document.getElementById("activeTables");



   
    // دریافت اطلاعات میزها
function getTables() {
    return getLocalStorageArray(TABLES_KEY);
}

    // ذخیره اطلاعات میزها
    function saveTables(tables) {
        localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
    }

    // جلوگیری از ورود کد HTML ناخواسته
    function escapeTableHTML(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    // بروزرسانی آمار میزها
    function updateTableStats(tables) {

        const activeTables = tables.filter(table => table.active);

        const totalCapacity = activeTables.reduce(
            (sum, table) => sum + Number(table.capacity),
            0
        );

        totalTablesElement.textContent = tables.length;
        totalCapacityElement.textContent = totalCapacity;
        activeTablesElement.textContent = activeTables.length;
    }

    // نمایش فهرست میزها
    
function renderTables() {

    const tables = getTables();

    updateTableStats(tables);

    if (tables.length === 0) {
        adminTablesList.innerHTML = `
            <tr>
                <td colspan="5" class="admin-empty">
                    هنوز میزی تعریف نشده است.
                </td>
            </tr>
        `;
        return;
    }

    adminTablesList.innerHTML = tables
        .sort((a, b) => Number(a.number) - Number(b.number))
        .map(table => {

            const statusClass = table.active ? "approved" : "rejected";
            const statusText = table.active ? "فعال" : "غیرفعال";

            const areaText =
                table.area === "indoor" ? "فضای داخلی" :
                table.area === "window" ? "کنار پنجره" :
                table.area === "outdoor" ? "فضای بیرونی" :
                "تعیین نشده";

            return `
                <tr>
                    <td>میز ${escapeTableHTML(table.number)}</td>

                    <td>${escapeTableHTML(table.capacity)} نفر</td>

                    <td>${areaText}</td>

                    <td>
                        <span class="reservation-status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>

                    <td>
                        <button
                            class="admin-action-btn approve-btn"
                            data-table-action="toggle"
                            data-id="${escapeTableHTML(table.id)}"
                            type="button">
                            ${table.active ? "غیرفعال کردن" : "فعال کردن"}
                        </button>

                        <button
                            class="admin-action-btn"
                            data-table-action="edit"
                            data-id="${escapeTableHTML(table.id)}"
                            type="button">
                            ویرایش
                        </button>

                        <button
                            class="admin-action-btn delete-btn"
                            data-table-action="delete"
                            data-id="${escapeTableHTML(table.id)}"
                            type="button">
                            حذف
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
}


    // افزودن میز جدید
    addTableForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const number = Number(tableNumberInput.value);
        const capacity = Number(tableCapacityInput.value);
        const area = tableAreaInput.value;

        if (!Number.isInteger(number) || number < 1) {
            alert("شماره میز باید یک عدد صحیح و بزرگ‌تر از صفر باشد.");
            return;
        }

        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20) {
            alert("ظرفیت میز باید بین ۱ تا ۲۰ نفر باشد.");
            return;
        }

        const tables = getTables();

        if (!["indoor", "window", "outdoor"].includes(area)) {
    alert("لطفاً محدوده میز را انتخاب کنید.");
    return;
}

        const duplicate = tables.some(
            table => Number(table.number) === number
        );

        if (duplicate) {
            alert("این شماره میز قبلاً ثبت شده است.");
            return;
        }

        const newTable = {
    id: Date.now().toString(),
    number: number,
    capacity: capacity,
    area: area,
    active: true
};

        tables.push(newTable);

        saveTables(tables);
        renderTables();

        addTableForm.reset();

        alert("میز جدید با موفقیت ثبت شد.");
    });

    // مدیریت عملیات میزها
    adminTablesList.addEventListener("click", function (event) {

        const button = event.target.closest("[data-table-action]");

        if (!button) return;

        const action = button.dataset.tableAction;
        const tableId = button.dataset.id;

        const tables = getTables();

        const tableIndex = tables.findIndex(
            table => String(table.id) === tableId
        );

        if (tableIndex === -1) return;

        // فعال یا غیرفعال کردن میز
        if (action === "toggle") {

            tables[tableIndex].active = !tables[tableIndex].active;

            saveTables(tables);
            renderTables();
        }

        // ویرایش میز
        
if (action === "edit") {

    const table = tables[tableIndex];

    const newCapacity = prompt(
        "ظرفیت جدید میز را وارد کنید:",
        table.capacity
    );

    if (newCapacity === null) return;

    const capacity = Number(newCapacity);

    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20) {
        alert("ظرفیت باید عددی صحیح بین ۱ تا ۲۰ باشد.");
        return;
    }

    const areaOptions = {
        indoor: "فضای داخلی",
        window: "کنار پنجره",
        outdoor: "فضای بیرونی"
    };

    const currentArea = areaOptions[table.area] ? table.area : "indoor";

    const newArea = prompt(
        "محدوده جدید میز را وارد کنید:\n1- فضای داخلی\n2- کنار پنجره\n3- فضای بیرونی",
        currentArea === "indoor" ? "1" :
        currentArea === "window" ? "2" : "3"
    );

    if (newArea === null) return;

    const areaValues = {
        "1": "indoor",
        "2": "window",
        "3": "outdoor"
    };

    if (!areaValues[newArea.trim()]) {
        alert("لطفاً عدد ۱، ۲ یا ۳ را برای محدوده وارد کنید.");
        return;
    }

    table.capacity = capacity;
    table.area = areaValues[newArea.trim()];

    saveTables(tables);
    renderTables();

    alert("ظرفیت و محدوده میز با موفقیت ویرایش شد.");
}


        // حذف میز
        if (action === "delete") {

            const confirmed = confirm(
                "آیا از حذف این میز اطمینان دارید؟"
            );

            if (!confirmed) return;

            tables.splice(tableIndex, 1);

            saveTables(tables);
            renderTables();

            alert("میز با موفقیت حذف شد.");
        }
    });

    // نمایش اولیه
    renderTables();
}


/* ==============================
   CAFE MAP AREA SELECTION
============================== */

const cafeMap = document.querySelector(".cafe-map");

if (cafeMap) {

    const mapAreas = cafeMap.querySelectorAll(".map-area");
    const areaSelect = document.getElementById("area");

    mapAreas.forEach(button => {

        button.addEventListener("click", function () {

            const selectedArea = this.dataset.area;

            // حذف حالت انتخاب از همه محدوده‌ها
            mapAreas.forEach(item => {
                item.classList.remove("active");
            });

            // فعال کردن محدوده انتخاب‌شده
            this.classList.add("active");

            // ثبت محدوده در فیلد فرم
            areaSelect.value = selectedArea;

        });

    });

    // هماهنگی نقشه با تغییر مستقیم فیلد انتخاب
    areaSelect.addEventListener("change", function () {

        mapAreas.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.area === this.value
            );

        });

    });

}



/* ==============================
   CAFE MAP AREA INFORMATION
============================== */

const areaInfo = document.getElementById("areaInfo");

if (areaInfo) {

    const areaInfoTitle = document.getElementById("areaInfoTitle");
    const areaTableCount = document.getElementById("areaTableCount");
    const areaCapacity = document.getElementById("areaCapacity");

    const areaNames = {
        inside: "فضای داخلی",
        window: "کنار پنجره",
        outside: "فضای بیرونی"
    };

    // نمایش اطلاعات محدوده انتخاب‌شده
    function updateAreaInfo(selectedArea) {

        const tables = getLocalStorageArray("coffeeTables");

        const activeTables = tables.filter(table =>
    table.active === true &&
    (
        table.area === selectedArea ||
        (selectedArea === "inside" && table.area === "indoor") ||
        (selectedArea === "outside" && table.area === "outdoor")
    )
);

        // بررسی وجود میز فعال
        if (activeTables.length === 0) {

            alert("در این محدوده فعلاً میز فعالی برای رزرو وجود ندارد.");

            document.getElementById("area").value = "";

            document.querySelectorAll(".map-area").forEach(button => {
                button.classList.remove("active");
            });

            areaInfo.style.display = "none";

            return;
        }

        const totalCapacity = activeTables.reduce(
            (sum, table) => sum + Number(table.capacity || 0),
            0
        );

        areaInfoTitle.textContent = areaNames[selectedArea];
        areaTableCount.textContent = activeTables.length;
        areaCapacity.textContent = totalCapacity + " نفر";

        areaInfo.style.display = "block";
    }

    // بررسی محدوده‌های دارای میز فعال
    function checkAvailableAreas() {

        const tables = getLocalStorageArray("coffeeTables");
    console.log("میزهای ذخیره‌شده:", tables);

    document.querySelectorAll(".map-area").forEach(button => {

            const selectedArea = button.dataset.area;

            const hasActiveTable = tables.some(table =>
    table.active === true &&
    (
        table.area === selectedArea ||
        (selectedArea === "inside" && table.area === "indoor") ||
        (selectedArea === "outside" && table.area === "outdoor")
    )
);

            button.disabled = !hasActiveTable;

            button.classList.toggle(
                "unavailable",
                !hasActiveTable
            );

            const option = document.querySelector(
                `#area option[value="${selectedArea}"]`
            );

            if (option) {
                option.disabled = !hasActiveTable;
            }
        });
    }

    // کلیک روی محدوده‌های نقشه
    document.querySelectorAll(".map-area").forEach(button => {

        button.addEventListener("click", function () {

            const selectedArea = this.dataset.area;

            const areaSelect = document.getElementById("area");

            areaSelect.value = selectedArea;

            document.querySelectorAll(".map-area").forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            updateAreaInfo(selectedArea);
        });

    });

    // تغییر محدوده از طریق فهرست انتخاب
    document.getElementById("area").addEventListener("change", function () {

        document.querySelectorAll(".map-area").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.area === this.value
            );
        });

        if (this.value) {
            updateAreaInfo(this.value);
        } else {
            areaInfo.style.display = "none";
        }
    });

    // بررسی اولیه وضعیت محدوده‌ها
    checkAvailableAreas();

}

