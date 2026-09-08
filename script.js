/* =========================
   ELEMENTS
========================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykoliX4CX5bT5I4v3DP7qeK79SMhk1Guae7J1m7ujye8hozgm2rA1Dd-U6rplWEa4W/exec";

const form = document.getElementById("requestForm");

const requesterName =
    document.getElementById("requesterName");

const itemsContainer =
    document.getElementById("itemsContainer");

const addItemBtn =
    document.getElementById("addItemBtn");

const grandTotal =
    document.getElementById("grandTotal");

const receipt =
    document.getElementById("receipt");

const slip =
    document.getElementById("slip");

const receiptName =
    document.getElementById("receiptName");

const slipName =
    document.getElementById("slipName");

const submitBtn =
    document.getElementById("submitBtn");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(value) {
    return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}


/* =========================
   UPDATE ITEM NUMBERS
========================= */

function updateItemNumbers() {

    const cards =
        itemsContainer.querySelectorAll(".item-card");

    cards.forEach((card, index) => {

        const title =
            card.querySelector(".item-header strong");

        title.textContent =
            `รายการที่ ${index + 1}`;

    });

}


/* =========================
   CALCULATE TOTAL
========================= */

function calculateTotal() {

    const cards =
        itemsContainer.querySelectorAll(".item-card");

    let total = 0;

    cards.forEach(card => {

        const quantity =
            Number(
                card.querySelector(".item-quantity").value
            ) || 0;

        const price =
            Number(
                card.querySelector(".item-price").value
            ) || 0;

        const subtotal =
            quantity * price;

        total += subtotal;

        const itemTotal =
            card.querySelector(".item-total");

        itemTotal.textContent =
            `฿${formatMoney(subtotal)}`;

    });

    grandTotal.textContent =
        `฿${formatMoney(total)}`;

}


/* =========================
   ADD ITEM
========================= */

function createItem() {

    const card =
        document.createElement("div");

    card.className = "item-card";

    card.innerHTML = `

        <div class="item-header">

            <strong>
                รายการ
            </strong>

            <button
                type="button"
                class="remove-item"
            >
                ลบรายการ
            </button>

        </div>


        <div class="item-grid">

            <div class="form-group item-name-group">

                <label>
                    รายการ
                    <span>*</span>
                </label>

                <input
                    type="text"
                    class="item-name"
                    placeholder="เช่น กระดาษ A4"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    จำนวน
                    <span>*</span>
                </label>

                <input
                    type="number"
                    class="item-quantity"
                    min="1"
                    value="1"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    หน่วย
                    <span>*</span>
                </label>

                <select
                    class="item-unit"
                    required
                >

                    <option value="ชิ้น">ชิ้น</option>
                    <option value="อัน">อัน</option>
                    <option value="ชุด">ชุด</option>
                    <option value="กล่อง">กล่อง</option>
                    <option value="แพ็ค">แพ็ค</option>
                    <option value="รีม">รีม</option>
                    <option value="ขวด">ขวด</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>

                </select>

            </div>


            <div class="form-group">

                <label>
                    ราคาประมาณ / หน่วย
                    <span>*</span>
                </label>

                <div class="price-input">

                    <input
                        type="number"
                        class="item-price"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                    >

                    <span>บาท</span>

                </div>

            </div>

        </div>


        <div class="item-subtotal">

            <span>
                รวมรายการนี้
            </span>

            <strong class="item-total">
                ฿0.00
            </strong>

        </div>
    `;

    itemsContainer.appendChild(card);

    updateItemNumbers();
    calculateTotal();

    card
        .querySelector(".remove-item")
        .addEventListener("click", () => {

            card.remove();

            updateItemNumbers();
            updateRemoveButtons();
            calculateTotal();

        });

    card
        .querySelectorAll("input, select")
        .forEach(input => {

            input.addEventListener(
                "input",
                calculateTotal
            );

            input.addEventListener(
                "change",
                calculateTotal
            );

        });

    updateRemoveButtons();

}


/* =========================
   REMOVE BUTTONS
========================= */

function updateRemoveButtons() {

    const cards =
        itemsContainer.querySelectorAll(".item-card");

    cards.forEach(card => {

        const button =
            card.querySelector(".remove-item");

        button.disabled =
            cards.length === 1;

    });

}


/* =========================
   ADD BUTTON
========================= */

addItemBtn.addEventListener(
    "click",
    createItem
);


/* =========================
   EXISTING ITEM EVENTS
========================= */

itemsContainer
    .querySelectorAll("input, select")
    .forEach(input => {

        input.addEventListener(
            "input",
            calculateTotal
        );

        input.addEventListener(
            "change",
            calculateTotal
        );

    });


/* =========================
   FILE NAME
========================= */

receipt.addEventListener(
    "change",
    () => {

        if (receipt.files.length > 0) {

            receiptName.textContent =
                receipt.files[0].name;

        } else {

            receiptName.textContent =
                "ยังไม่ได้เลือกไฟล์";

        }

    }
);


slip.addEventListener(
    "change",
    () => {

        if (slip.files.length > 0) {

            slipName.textContent =
                slip.files[0].name;

        } else {

            slipName.textContent =
                "ยังไม่ได้เลือกไฟล์";

        }

    }
);


/* =========================
   TOAST
========================= */

function showToast(
    title,
    message
) {

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =========================
   GET ITEMS
========================= */

function getItems() {

    const cards =
        itemsContainer.querySelectorAll(".item-card");

    return Array.from(cards).map(card => {

        const name =
            card.querySelector(".item-name").value.trim();

        const quantity =
            Number(
                card.querySelector(".item-quantity").value
            );

        const unit =
            card.querySelector(".item-unit").value;

        const price =
            Number(
                card.querySelector(".item-price").value
            );

        return {
            name,
            quantity,
            unit,
            price,
            subtotal: quantity * price
        };

    });

}


/* =========================
   FILE -> BASE64
========================= */

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        if (!file) {

            resolve(null);
            return;

        }

        const reader = new FileReader();

        reader.onload = () => {

            // ตัด prefix "data:xxx;base64," ออก เหลือแค่ base64 ล้วน
            const base64 =
                reader.result.split(",")[1];

            resolve({
                name: file.name,
                type: file.type,
                data: base64
            });

        };

        reader.onerror = () => {
            reject(new Error("ไม่สามารถอ่านไฟล์ได้: " + file.name));
        };

        reader.readAsDataURL(file);

    });

}


/* =========================
   SUBMIT
========================= */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        const requesterNameValue =
            requesterName.value.trim();


        const department =
            document.getElementById(
                "department"
            ).value;


        const details =
            document.getElementById(
                "details"
            ).value.trim();


        const items =
            getItems();


        const total =
            items.reduce(
                (sum, item) =>
                    sum + item.subtotal,
                0
            );


        submitBtn.disabled = true;

        submitBtn.querySelector("span").textContent =
            "กำลังส่งข้อมูล...";


        try {

            /* แปลงไฟล์แนบเป็น base64 ก่อนส่ง */

            const receiptData =
                await fileToBase64(receipt.files[0]);

            const slipData =
                await fileToBase64(slip.files[0]);


            const data = {

                requesterName: requesterNameValue,

                department,

                items,

                total,

                details,

                receipt: receiptData,

                slip: slipData,

                createdAt:
                    new Date().toISOString()

            };


            console.log(
                "ข้อมูลที่จะส่ง:",
                data
            );


            /* =========================
               ส่งข้อมูลจริงไปที่
               Google Apps Script
            ========================== */

            const response =
                await fetch(GOOGLE_SCRIPT_URL, {

                    method: "POST",

                    // ใช้ text/plain เพื่อเลี่ยงปัญหา CORS preflight
                    // กับ Google Apps Script Web App
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(data)

                });


            const result =
                await response.json();


            console.log(
                "ผลลัพธ์จากเซิร์ฟเวอร์:",
                result
            );


            if (result.success) {

                showToast(
                    "ส่งข้อมูลสำเร็จ",
                    result.message || "บันทึกใบขอซื้อเรียบร้อยแล้ว"
                );

                form.reset();

                receiptName.textContent =
                    "ยังไม่ได้เลือกไฟล์";

                slipName.textContent =
                    "ยังไม่ได้เลือกไฟล์";

                calculateTotal();

            } else {

                showToast(
                    "เกิดข้อผิดพลาด",
                    result.message || "ไม่สามารถบันทึกข้อมูลได้"
                );

            }

        } catch (error) {

            console.error(error);

            showToast(
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง"
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.querySelector("span").textContent =
                "ส่งใบขอซื้อ";

        }

    }
);


/* =========================
   INITIAL
========================= */

updateRemoveButtons();
calculateTotal();
