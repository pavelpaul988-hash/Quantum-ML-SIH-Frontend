/* =========================================
   HEALTHQML LOGIN
   ========================================= */


const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();


        /* DEMO LOGIN */

        if (
            email === "demo@healthqml.com" &&
            password === "123456"
        ) {

            message.textContent =
                "Login successful! Opening dashboard...";

            message.style.color = "green";


            /*
             * Save login state temporarily.
             * Later Flask/database authentication
             * will replace this.
             */

            localStorage.setItem(
                "healthqmlLoggedIn",
                "true"
            );


            localStorage.setItem(
                "healthqmlUser",
                email
            );


            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }

        else {

            message.textContent =
                "Invalid email or password.";

            message.style.color = "red";

        }

    });

}