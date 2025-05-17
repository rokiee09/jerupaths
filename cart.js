// Modal logic
const modal = document.getElementById('paymentModal');
const closeModalBtn = document.getElementById('closeModal');
const packageBtns = document.querySelectorAll('.package-btn');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const paymentForm = document.getElementById('paymentForm');
const payBtn = document.getElementById('payBtn');
const successMsg = document.getElementById('successMsg');
let selectedPackage = '';
let selectedPrice = 0;

packageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        selectedPackage = this.getAttribute('data-package');
        selectedPrice = this.getAttribute('data-price');
        modalTitle.textContent = `Get the ${selectedPackage} Brochure`;
        modalDesc.innerHTML = `Pay <b>$${selectedPrice}</b> to receive the <b>${selectedPackage}</b> brochure by email.<br>Please enter your email below.`;
        paymentForm.style.display = '';
        successMsg.style.display = 'none';
        modal.classList.add('active');
    });
});

closeModalBtn.onclick = () => modal.classList.remove('active');
window.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };

paymentForm.onsubmit = function(e) {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';
    setTimeout(() => {
        paymentForm.style.display = 'none';
        successMsg.style.display = '';
        payBtn.disabled = false;
        payBtn.textContent = 'Pay & Receive Brochure';
    }, 1500);
};