/**
 * ===================================================================
 * VAIDEHI // DIGITAL SPACE — ADMIN DASHBOARD CONTROLLER
 * Authentication Guard, Cloud Firestore Telemetry, Message Curation
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Views
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  const authUserTag = document.getElementById("auth-user-tag");
  const adminUserEmail = document.getElementById("admin-user-email");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");

  // Login form
  const loginForm = document.getElementById("admin-login-form");
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const loginErrorBox = document.getElementById("login-error-box");

  // Dashboard KPIs & Controls
  const refreshBtn = document.getElementById("refresh-messages-btn");
  const kpiTotal = document.getElementById("kpi-total");
  const kpiUnread = document.getElementById("kpi-unread");
  const kpiRead = document.getElementById("kpi-read");

  const countAll = document.getElementById("count-all");
  const countUnread = document.getElementById("count-unread");
  const countRead = document.getElementById("count-read");

  const searchInput = document.getElementById("messages-search-input");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const tableBody = document.getElementById("messages-table-body");
  const emptyState = document.getElementById("messages-empty-state");

  // Modal
  const detailModal = document.getElementById("message-detail-modal");
  const closeDetailBtn = document.getElementById("close-detail-modal-btn");
  const detailStatusBadge = document.getElementById("detail-status-badge");
  const detailTimeBadge = document.getElementById("detail-time-badge");
  const detailSubject = document.getElementById("detail-subject");
  const detailName = document.getElementById("detail-name");
  const detailEmail = document.getElementById("detail-email");
  const detailMessageContent = document.getElementById("detail-message-content");
  const detailDocId = document.getElementById("detail-doc-id");
  const toggleReadBtn = document.getElementById("toggle-read-btn");
  const replyEmailBtn = document.getElementById("reply-email-btn");
  const deleteMessageBtn = document.getElementById("delete-message-btn");

  let currentMessages = [];
  let activeFilter = "all";
  let activeSearchQuery = "";
  let currentlyViewedMessage = null;

  // -----------------------------------------------------------------
  // 1. AUTHENTICATION LIFECYCLE
  // -----------------------------------------------------------------
  function checkAuth() {
    window.VH_FIREBASE.getCurrentAdminUser((user) => {
      if (user) {
        showDashboard(user);
      } else {
        showLogin();
      }
    });
  }

  function showDashboard(user) {
    if (loginView) loginView.style.display = "none";
    if (dashboardView) dashboardView.style.display = "block";
    if (authUserTag) authUserTag.style.display = "flex";
    if (adminLogoutBtn) adminLogoutBtn.style.display = "inline-flex";
    if (adminUserEmail) adminUserEmail.textContent = user.email || "Admin";
    loadMessages();
  }

  function showLogin() {
    if (loginView) loginView.style.display = "flex";
    if (dashboardView) dashboardView.style.display = "none";
    if (authUserTag) authUserTag.style.display = "none";
    if (adminLogoutBtn) adminLogoutBtn.style.display = "none";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginErrorBox.style.display = "none";

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value.trim();
      if (!email || !password) return;

      const btnText = loginSubmitBtn.querySelector(".btn-text");
      const btnLoader = loginSubmitBtn.querySelector(".btn-loader");
      if (btnText && btnLoader) {
        btnText.style.display = "none";
        btnLoader.style.display = "inline-flex";
      }
      loginSubmitBtn.disabled = true;

      try {
        const result = await window.VH_FIREBASE.adminSignIn(email, password);
        if (result.success) {
          showDashboard(result.user);
        } else {
          loginErrorBox.style.display = "block";
          loginErrorBox.textContent = result.error || "Authentication failed.";
        }
      } catch (err) {
        loginErrorBox.style.display = "block";
        loginErrorBox.textContent = err.message || "An unexpected error occurred.";
      } finally {
        if (btnText && btnLoader) {
          btnText.style.display = "inline-flex";
          btnLoader.style.display = "none";
        }
        loginSubmitBtn.disabled = false;
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", async () => {
      await window.VH_FIREBASE.adminSignOut();
      showLogin();
    });
  }

  // -----------------------------------------------------------------
  // 2. MESSAGES FETCH & KPI CALCULATIONS
  // -----------------------------------------------------------------
  async function loadMessages() {
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> SYNCING...';
      refreshBtn.disabled = true;
    }

    try {
      const res = await window.VH_FIREBASE.fetchAllMessages();
      currentMessages = res.messages || [];
      updateKPIs();
      renderTable();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> REFRESH DATA';
        refreshBtn.disabled = false;
      }
    }
  }

  if (refreshBtn) refreshBtn.addEventListener("click", loadMessages);

  function updateKPIs() {
    const total = currentMessages.length;
    const unread = currentMessages.filter((m) => m.status === "unread").length;
    const read = currentMessages.filter((m) => m.status === "read").length;

    if (kpiTotal) kpiTotal.textContent = total;
    if (kpiUnread) kpiUnread.textContent = unread;
    if (kpiRead) kpiRead.textContent = read;

    if (countAll) countAll.textContent = total;
    if (countUnread) countUnread.textContent = unread;
    if (countRead) countRead.textContent = read;
  }

  function formatDate(isoStr) {
    if (!isoStr) return "N/A";
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return isoStr;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const q = activeSearchQuery.toLowerCase();
    const filtered = currentMessages.filter((m) => {
      if (activeFilter === "unread" && m.status !== "unread") return false;
      if (activeFilter === "read" && m.status !== "read") return false;

      if (q) {
        const hay = `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      return;
    } else {
      if (emptyState) emptyState.style.display = "none";
    }

    filtered.forEach((msg) => {
      const tr = document.createElement("tr");
      if (msg.status === "unread") tr.className = "row-unread";

      tr.innerHTML = `
        <td>
          <span class="badge-status ${msg.status === "unread" ? "badge-unread" : "badge-read"}">
            ${msg.status ? msg.status.toUpperCase() : "UNREAD"}
          </span>
        </td>
        <td class="row-date">${formatDate(msg.createdAt)}</td>
        <td class="row-sender">${escapeHtml(msg.name || "Anonymous")}</td>
        <td class="row-email">${escapeHtml(msg.email || "No email")}</td>
        <td class="row-subject">${escapeHtml(msg.subject || "(No Subject)")}</td>
        <td class="text-right">
          <div class="action-btn-group">
            <button class="action-btn btn-view" title="View Full Message">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="action-btn btn-toggle" title="Toggle Read/Unread">
              <i class="fa-solid ${msg.status === "unread" ? "fa-envelope-open" : "fa-envelope"}"></i>
            </button>
            <button class="action-btn btn-delete" title="Delete Message">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tr.querySelector(".btn-view").addEventListener("click", () => openDetailModal(msg));
      tr.querySelector(".btn-toggle").addEventListener("click", () => toggleStatus(msg.id));
      tr.querySelector(".btn-delete").addEventListener("click", () => deleteMsg(msg.id));

      tableBody.appendChild(tr);
    });
  }

  // Filter tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-filter");
      renderTable();
    });
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.trim();
      renderTable();
    });
  }

  // -----------------------------------------------------------------
  // 3. DETAIL MODAL & MESSAGE ACTIONS
  // -----------------------------------------------------------------
  function openDetailModal(msg) {
    currentlyViewedMessage = msg;

    detailStatusBadge.className = `modal-status-badge ${msg.status === "unread" ? "badge-unread" : "badge-read"}`;
    detailStatusBadge.textContent = msg.status ? msg.status.toUpperCase() : "UNREAD";
    detailTimeBadge.textContent = formatDate(msg.createdAt);

    detailSubject.textContent = msg.subject || "(No Subject)";
    detailName.textContent = msg.name || "Anonymous";
    detailEmail.textContent = msg.email || "No email";
    detailMessageContent.textContent = msg.message || "No content provided.";
    detailDocId.textContent = msg.id;

    toggleReadBtn.innerHTML =
      msg.status === "unread"
        ? '<i class="fa-solid fa-check"></i> Mark as Read'
        : '<i class="fa-solid fa-envelope"></i> Mark as Unread';

    replyEmailBtn.href = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent("Re: " + (msg.subject || "Your Inquiry"))}`;

    detailModal.style.display = "flex";
  }

  function closeDetailModal() {
    detailModal.style.display = "none";
    currentlyViewedMessage = null;
  }

  if (closeDetailBtn) closeDetailBtn.addEventListener("click", closeDetailModal);
  if (detailModal) {
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) closeDetailModal();
    });
  }

  async function toggleStatus(id) {
    const msg = currentMessages.find((m) => m.id === id);
    if (!msg) return;

    const newStatus = msg.status === "unread" ? "read" : "unread";
    await window.VH_FIREBASE.updateMessageStatus(id, newStatus);
    msg.status = newStatus;
    updateKPIs();
    renderTable();

    if (currentlyViewedMessage && currentlyViewedMessage.id === id) {
      openDetailModal(msg);
    }
  }

  if (toggleReadBtn) {
    toggleReadBtn.addEventListener("click", () => {
      if (currentlyViewedMessage) toggleStatus(currentlyViewedMessage.id);
    });
  }

  async function deleteMsg(id) {
    const confirmed = confirm("Are you sure you want to permanently delete this transmission?");
    if (!confirmed) return;

    await window.VH_FIREBASE.deleteMessage(id);
    currentMessages = currentMessages.filter((m) => m.id !== id);
    updateKPIs();
    renderTable();

    if (currentlyViewedMessage && currentlyViewedMessage.id === id) {
      closeDetailModal();
    }
  }

  if (deleteMessageBtn) {
    deleteMessageBtn.addEventListener("click", () => {
      if (currentlyViewedMessage) deleteMsg(currentlyViewedMessage.id);
    });
  }

  checkAuth();
});
