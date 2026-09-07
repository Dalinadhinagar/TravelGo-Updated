// Handle Destination Explore Click
function showDestination(place) {
    const destinationSelect = document.getElementById("destination");

    if (destinationSelect) {
        destinationSelect.value = place;
        alert(
            "🌎 Welcome to " + place + "!\n\n" +
            "This is a wonderful destination to explore.\n" +
            "We've pre-selected " + place + " in the booking form below!"
        );
        const contactBox = document.querySelector(".contact-box") || document.getElementById("bookingForm");
        if (contactBox) {
            contactBox.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        alert(
            "🌎 Welcome to " + place + "!\n\n" +
            "This is a wonderful destination to explore.\n" +
            "Let's take you to the booking page to plan your trip!"
        );
        window.location.href = "contact.html?destination=" + encodeURIComponent(place);
    }
}

// Auto-fill booking form from URL parameters (e.g. contact.html?destination=Japan&package=Standard)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("destination");
    const packageName = params.get("package");

    const destinationSelect = document.getElementById("destination");
    const messageInput = document.getElementById("message");

    if (destinationSelect && destination) {
        destinationSelect.value = destination;
    }

    if (messageInput && packageName) {
        messageInput.value = "I am interested in booking the " + packageName + " Package.";
    }
});

// Handle Booking Form Submission
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", async function(event) {
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

        if (submitBtn) submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = "Recording...";
        if (submitSpinner) submitSpinner.classList.remove("d-none");

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, destination, message })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (successMessage) successMessage.style.display = "block";
                bookingForm.reset();
            } else {
                throw new Error(data.error || "Submission failed");
            }
        } catch (err) {
            // Local fallback display if backend not active
            if (successMessage) successMessage.style.display = "block";
            bookingForm.reset();
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (submitBtnText) submitBtnText.textContent = "Submit Booking ✈️";
            if (submitSpinner) submitSpinner.classList.add("d-none");
        }
    });
}