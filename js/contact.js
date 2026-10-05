/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — CONTACT FORM ENGINE
 * Form Validation, Firestore Transmission & Live Status Feedback
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("contact-submit-btn");
  const statusBox = document.getElementById("contact-status-box");

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validateForm() {
    let isValid = true;
    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = "Please enter your email address.";
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = "Please provide a valid email format.";
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      subjectError.textContent = "Please specify a subject for your message.";
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
      messageError.textContent = "Message must be at least 8 characters long.";
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (window.playUiTone) window.playUiTone(300, "sawtooth", 0.1);
      return;
    }

    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    if (btnText && btnLoader) {
      btnText.style.display = "none";
      btnLoader.style.display = "inline-flex";
    }
    submitBtn.disabled = true;

    const payload = {
      name: nameInput.value,
      email: emailInput.value,
      subject: subjectInput.value,
      message: messageInput.value
    };

    try {
      const res = await window.VH_FIREBASE.sendContactMessage(payload);

      if (window.playUiTone) {
        window.playUiTone(523, "sine", 0.08);
        setTimeout(() => window.playUiTone(659, "sine", 0.08), 80);
        setTimeout(() => window.playUiTone(1046, "sine", 0.15), 160);
      }

      statusBox.className = "contact-status-box success";
      statusBox.innerHTML = `
        <div class="status-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div class="status-content">
          <strong>Message sent successfully ✓</strong>
          <p>Thank you, ${payload.name}! Your transmission has been logged to the console (Ref: <code>${res.id}</code>). I will respond as soon as possible.</p>
        </div>
      `;
      statusBox.style.display = "flex";

      form.reset();

      setTimeout(() => {
        if (btnText && btnLoader) {
          btnText.style.display = "inline-flex";
          btnLoader.style.display = "none";
        }
        submitBtn.disabled = false;
      }, 3500);

    } catch (err) {
      statusBox.className = "contact-status-box error";
      statusBox.innerHTML = `
        <div class="status-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="status-content">
          <strong>Transmission Error</strong>
          <p>${err.message || "Failed to transmit message. Please try again or reach out directly via email."}</p>
        </div>
      `;
      statusBox.style.display = "flex";

      if (btnText && btnLoader) {
        btnText.style.display = "inline-flex";
        btnLoader.style.display = "none";
      }
      submitBtn.disabled = false;
    }
  });
});
