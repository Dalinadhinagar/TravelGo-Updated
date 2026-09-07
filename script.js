function toggleMenu() {
    const menu = document.getElementById("navMenu");

    if (menu) {
        menu.classList.toggle("show");
    }
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
}

function searchDestinations() {
    const input = document.getElementById("destinationSearch");

    if (!input) {
        return;
    }

    const searchValue = input.value.toLowerCase();

    const cards = document.querySelectorAll(".destination-card");

    cards.forEach(function(card) {

        const text = card.textContent.toLowerCase();

        if (text.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const success = document.getElementById("contactSuccess");

        success.style.display = "block";

        contactForm.reset();

        setTimeout(function() {
            success.style.display = "none";
        }, 4000);

    });

}

const signinForm = document.getElementById("signinForm");

if (signinForm) {

    signinForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("signinEmail").value;
        const password = document.getElementById("signinPassword").value;

        const success = document.getElementById("signinSuccess");

        if (email && password) {

            success.style.display = "block";

            setTimeout(function() {
                success.style.display = "none";
            }, 3000);

        }

    });

}

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const error =
            document.getElementById("signupError");

        const success =
            document.getElementById("signupSuccess");

        error.style.display = "none";
        success.style.display = "none";

        if (password !== confirmPassword) {

            error.style.display = "block";

            return;
        }

        success.style.display = "block";

        signupForm.reset();

        setTimeout(function() {
            success.style.display = "none";
        }, 3000);

    });

}
