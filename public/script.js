function showDestination(place) {
    // Select the destination in the booking form
    const destinationSelect = document.getElementById("destination");
    if (destinationSelect) {
        destinationSelect.value = place;
    }

    alert(
        "🌎 Welcome to " + place + "!\n\n" +
        "This is a wonderful destination to explore.\n" +
        "We've pre-selected " + place + " in the booking form below!"
    );

    // Smooth scroll to the booking section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
    }
}

function selectPackage(packageName, defaultDestination) {
    const destinationSelect = document.getElementById("destination");
    const messageInput = document.getElementById("message");

    if (destinationSelect && defaultDestination) {
        destinationSelect.value = defaultDestination;
    }

    if (messageInput) {
        messageInput.value = "I am interested in the " + packageName + " Package.";
    }

    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
    }
}

// Handle Booking Form Submission
document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const destination = document.getElementById("destination").value;
    const message = document.getElementById("message").value.trim();

    const submitBtn = document.getElementById("submitBtn");
    const submitBtnText = document.getElementById("submitBtnText");
    const submitSpinner = document.getElementById("submitSpinner");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const bookingDetailsText = document.getElementById("bookingDetailsText");

    // Form validation
    if (!name) {
        alert("⚠️ Please enter your name.");
        return;
    }
    if (!email) {
        alert("⚠️ Please enter your email.");
        return;
    }
    if (!destination) {
        alert("⚠️ Please select a destination.");
        return;
    }

    // Enter loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = "Processing Booking...";
    submitSpinner.classList.remove("d-none");
    successMessage.style.display = "none";
    errorMessage.classList.add("d-none");

    try {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                destination: destination,
                message: message
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Display rich success message
            const bookingId = data.bookingId ? `#${data.bookingId}` : "";
            bookingDetailsText.innerHTML = `
                Your booking <strong>${bookingId}</strong> for <strong>${destination}</strong> has been saved to the database.<br>
                A confirmation has been recorded for <strong>${name}</strong> (${email}).
            `;
            successMessage.style.display = "block";
            document.getElementById("bookingForm").reset();

            // Refresh modal list in background
            fetchBookings();
        } else {
            throw new Error(data.error || "Failed to submit booking.");
        }
    } catch (err) {
        console.error("Booking error:", err);
        errorMessage.textContent = "⚠️ " + (err.message || "Failed to connect to backend server.");
        errorMessage.classList.remove("d-none");
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        submitBtnText.textContent = "Submit Booking ✈️";
        submitSpinner.classList.add("d-none");
    }
});

// Fetch and render bookings for the Modal Table
async function fetchBookings() {
    const tableBody = document.getElementById("bookingsTableBody");
    const loading = document.getElementById("bookingsLoading");

    if (!tableBody) return;

    if (loading) loading.classList.remove("d-none");

    try {
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (response.ok && data.success) {
            const bookings = data.bookings || [];

            if (bookings.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            No bookings found in database yet. Submit your first trip above!
                        </td>
                    </tr>
                `;
            } else {
                tableBody.innerHTML = bookings.map(b => `
                    <tr>
                        <td class="fw-bold">#${b.id}</td>
                        <td>${escapeHtml(b.name)}</td>
                        <td>${escapeHtml(b.email)}</td>
                        <td><span class="badge bg-primary-subtle text-primary">${escapeHtml(b.destination)}</span></td>
                        <td class="small text-muted">${escapeHtml(b.message || "-")}</td>
                        <td><span class="badge badge-confirmed">${escapeHtml(b.status || "Confirmed")}</span></td>
                        <td class="small text-muted">${formatDate(b.created_at)}</td>
                    </tr>
                `).join("");
            }
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-3">
                        ⚠️ ${escapeHtml(data.error || "Unable to fetch bookings from server.")}
                    </td>
                </tr>
            `;
        }
    } catch (err) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-3">
                    ⚠️ Connection error: Is the backend server running? (${escapeHtml(err.message)})
                </td>
            </tr>
        `;
    } finally {
        if (loading) loading.classList.add("d-none");
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateStr;
    }
}
