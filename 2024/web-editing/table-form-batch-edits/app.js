/** Calcite demo application boilerplate functionality - not related to demo content */

const toggleModalEl = document.getElementById("toggle-modal");
const modalEl = document.getElementById("modal");

toggleModalEl.addEventListener("click", () => handleModalChange());

function handleModalChange() {
  modalEl.open = !modalEl.open;
}
