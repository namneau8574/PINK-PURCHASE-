/* =========================
   ELEMENTS
========================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhnl9hJt6vfHQm5J4GpUs7JnA5INs9nUNbFzr3dGpbvh6wnAnVGfvWEZoQmaliNAuh/exec";

const form = document.getElementById("requestForm");

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
   FILE NAME DISPLAY
   (แสดงชื่อไฟล์ทั้งหมดที่เลือก
    รองรับหลายไฟล์ทั้งใบเสร็จ
    และสลิป)
========================= */

function updateFileNameDisplay(inputEl, displayEl) {

    if (inputEl.files.length > 0) {

        displayEl.innerHTML =
            Array.from(inputEl.files)
                .map(file => `• ${file.name}`)
                .join("<br>");

    } else {

        displayEl.textContent =
            "ยังไม่ได้เลือกไฟล์";

    }

}


receipt.addEventListener(
    "change",
    () => updateFileNameDisplay(receipt, receiptName)
);


slip.addEventListener(
    "change",
    () => updateFileNameDisplay(slip, slipName)
);


/* =========================
   FILE -> BASE64 HELPERS
========================= */

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const result = reader.result;

            // ตัด prefix "data:...;base64," ออก
            // เหลือแต่ตัวข้อมูล base64 ล้วน ๆ
            const base64Data =
                result.split(",")[1];

            resolve({
                name: file.name,
                type: file.type,
                data: base64Data
            });

        };

        reader.onerror = () =>
            reject(new Error("อ่านไฟล์ไม่สำเร็จ: " + file.name));

        reader.readAsDataURL(file);

    });

}


async function filesToBase64(fileList) {

    if (!fileList || fileList.length === 0) {
        return [];
    }

    return Promise.all(
        Array.from(fileList).map(file =>
            fileToBase64(file)
        )
    );

}


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


        const requesterName =
            document.getElementById(
                "requesterName"
            ).value.trim();


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
            "กำลังแปลงไฟล์...";


        // แปลงไฟล์ใบเสร็จและสลิป (หลายไฟล์) เป็น base64
        // เผื่อใช้ส่งต่อไปยัง Google Apps Script
        const [receiptFiles, slipFiles] =
            await Promise.all([
                filesToBase64(receipt.files),
                filesToBase64(slip.files)
            ]);


        const data = {

            requesterName,

            department,

            items,

            total,

            details,

            receipts: receiptFiles,

            slips: slipFiles,

            createdAt:
                new Date().toISOString()

        };


        console.log(
            "ข้อมูลที่จะส่ง:",
            data
        );


        /* =========================
           DEMO SUBMIT
           เปลี่ยนส่วนนี้เป็นการยิง
           fetch(GOOGLE_SCRIPT_URL, {...})
           จริงภายหลัง
        ========================== */

        submitBtn.querySelector("span").textContent =
            "กำลังส่งข้อมูล...";


        await new Promise(
            resolve =>
                setTimeout(resolve, 1000)
        );


        submitBtn.disabled = false;

        submitBtn.querySelector("span").textContent =
            "ส่งใบขอซื้อ";


        showToast(
            "ส่งข้อมูลสำเร็จ",
            "บันทึกใบขอซื้อเรียบร้อยแล้ว"
        );


        console.log(
            "Department:",
            department
        );

        console.log(
            "Items:",
            items
        );

        console.log(
            "Total:",
            total
        );

        console.log(
            "จำนวนไฟล์ใบเสร็จ:",
            receiptFiles.length
        );

        console.log(
            "จำนวนไฟล์สลิป:",
            slipFiles.length
        );

    }
);


/* =========================
   INITIAL
========================= */

updateRemoveButtons();
calculateTotal();
