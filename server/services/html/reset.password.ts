
let serverUrl = String(process.env.SERVER_URL || "");

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    serverUrl += `/${process.env.SERVER_NAMESPACE}`;
}


export const resetPasswordHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Reset Password - Naijaloaded</title>

    <style>
        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
        }

        body {
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Helvetica,
                Arial,
                sans-serif;

            background: #0d0d0d;
            color: #ffffff;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 24px;
        }

        .page {
            width: 100%;
            max-width: 440px;
        }

        .card {
            background: #171717;
            border: 1px solid #292929;
            border-radius: 24px;
            padding: 32px;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.35);
        }

        .logo {
            width: 48px;
            height: 45px;

            border-radius: 17px;

            display: flex;
            align-items: center;
            justify-content: center;


            font-size: 25px;
            font-weight: 900;

            margin-bottom: 26px;
        }

        h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1.15;
            letter-spacing: -0.8px;
        }

        .subtitle {
            margin: 10px 0 30px;

            color: #999999;

            font-size: 15px;
            line-height: 1.6;
        }

        .field {
            margin-bottom: 18px;
        }

        label {
            display: block;

            margin-bottom: 8px;

            font-size: 13px;
            font-weight: 700;

            color: #dddddd;
        }

        .input-wrapper {
            position: relative;
        }

        input {
            width: 100%;
            height: 54px;

            border: 1px solid #303030;
            border-radius: 14px;

            outline: none;

            background: #101010;
            color: #ffffff;

            padding: 0 48px 0 15px;

            font-size: 15px;

            transition:
                border-color 0.2s,
                box-shadow 0.2s;
        }

        input::placeholder {
            color: #666666;
        }

        input:focus {
            border-color: #00b900;

            box-shadow:
                0 0 0 3px rgba(255, 23, 68, 0.12);
        }

        input.error {
            border-color: #ef4444;
        }

        .toggle-password {
            position: absolute;

            right: 14px;
            top: 50%;

            transform: translateY(-50%);

            border: 0;
            background: transparent;

            color: #777777;

            cursor: pointer;

            font-size: 13px;
            font-weight: 700;
        }

        .requirements {
            margin-top: 14px;

            display: flex;
            flex-direction: column;

            gap: 7px;
        }

        .requirement {
            display: flex;
            align-items: center;

            gap: 8px;

            color: #777777;

            font-size: 12px;
        }

        .requirement.valid {
            color: #55d98a;
        }

        .requirement-icon {
            width: 17px;
            height: 17px;

            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid #444444;

            font-size: 10px;
            font-weight: 900;
        }

        .requirement.valid .requirement-icon {
            background: #55d98a;
            border-color: #55d98a;

            color: #0d0d0d;
        }

        .error-message {
            display: none;

            margin-top: 8px;

            color: #ef4444;

            font-size: 12px;
            font-weight: 600;
        }

        .error-message.show {
            display: block;
        }

        button.submit {
            width: 100%;
            height: 56px;

            margin-top: 25px;

            border: 0;
            border-radius: 15px;

            background: #00b900;
            color: #ffffff;

            font-size: 15px;
            font-weight: 800;

            cursor: pointer;

            transition:
                transform 0.15s,
                opacity 0.15s;
        }

        button.submit:hover {
            opacity: 0.92;
        }

        button.submit:active {
            transform: scale(0.98);
        }

        button.submit:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }

        .status {
            display: none;

            margin-top: 20px;

            padding: 14px;

            border-radius: 12px;

            font-size: 13px;
            line-height: 1.5;
        }

        .status.show {
            display: block;
        }

        .status.error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #ff7777;
        }

        .status.success {
            background: rgba(85, 217, 138, 0.1);
            border: 1px solid rgba(85, 217, 138, 0.25);
            color: #55d98a;
        }

        .login-link {
            display: block;

            margin-top: 24px;

            text-align: center;

            color: #888888;

            font-size: 13px;
        }

        .login-link a {
            color: #00b900;
            text-decoration: none;
            font-weight: 700;
        }

        @media (max-width: 480px) {
            body {
                padding: 15px;
            }

            .card {
                padding: 25px 20px;
                border-radius: 20px;
            }

            h1 {
                font-size: 27px;
            }
        }
    </style>
</head>

<body>

<div class="page">

    <div class="card">

        <div class="logo">
            <img 
              style="height: 100%; width: 100%"
               src="https://www.naijailoaded.com.ng/favicon.ico"
             />
        </div>

        <h1>
            Create a new password
        </h1>

        <p class="subtitle">
            Choose a strong password for your Naijaloaded account.
            You'll use this password the next time you log in.
        </p>

        <form id="resetForm">

            <div class="field">

                <label for="password">
                    New password
                </label>

                <div class="input-wrapper">

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your new password"
                        autocomplete="new-password"
                    >

                    <button
                        type="button"
                        class="toggle-password"
                        id="togglePassword"
                    >
                        Show
                    </button>

                </div>

            </div>

            <div class="field">

                <label for="confirmPassword">
                    Confirm password
                </label>

                <div class="input-wrapper">

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Enter your password again"
                        autocomplete="new-password"
                    >

                    <button
                        type="button"
                        class="toggle-password"
                        id="toggleConfirmPassword"
                    >
                        Show
                    </button>

                </div>

                <div
                    id="confirmError"
                    class="error-message"
                >
                    Passwords do not match.
                </div>

            </div>

            <div class="requirements">

                <div
                    class="requirement"
                    id="reqLength"
                >
                    <span class="requirement-icon">×</span>
                    <span>At least 6 characters</span>
                </div>

                <div
                    class="requirement"
                    id="reqUpper"
                >
                    <span class="requirement-icon">×</span>
                    <span>One uppercase letter</span>
                </div>

                <div
                    class="requirement"
                    id="reqLower"
                >
                    <span class="requirement-icon">×</span>
                    <span>One lowercase letter</span>
                </div>

                <div
                    class="requirement"
                    id="reqNumber"
                >
                    <span class="requirement-icon">×</span>
                    <span>One number</span>
                </div>

                <div
                    class="requirement"
                    id="reqSpecial"
                >
                    <span class="requirement-icon">×</span>
                    <span>One special character</span>
                </div>

            </div>

            <button
                type="submit"
                class="submit"
                id="submitButton"
            >
                Reset password
            </button>

        </form>

        <div
            id="status"
            class="status"
        ></div>

    </div>

</div>

<script>

    const form =
        document.getElementById("resetForm");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const submitButton =
        document.getElementById("submitButton");

    const status =
        document.getElementById("status");

    const confirmError =
        document.getElementById("confirmError");


    /*
     * Get token from email URL.
     *
     * /auth/reset-password?token=xxxxx
     */
    const params =
        new URLSearchParams(window.location.search);

    const token =
        params.get("token");


    /*
     * Password requirements.
     */
    const requirements = {
        length: value =>
            value.length >= 6,

        upper: value =>
            /[A-Z]/.test(value),

        lower: value =>
            /[a-z]/.test(value),

        number: value =>
            /\\d/.test(value),

        special: value =>
            /[^A-Za-z0-9]/.test(value)
    };


    function updateRequirement(
        elementId,
        valid
    ) {
        const element =
            document.getElementById(elementId);

        const icon =
            element.querySelector(
                ".requirement-icon"
            );

        if (valid) {

            element.classList.add("valid");

            icon.textContent = "✓";

        } else {

            element.classList.remove("valid");

            icon.textContent = "×";
        }
    }


    function validatePassword(value) {

        const result = {
            length: requirements.length(value),
            upper: requirements.upper(value),
            lower: requirements.lower(value),
            number: requirements.number(value),
            special: requirements.special(value)
        };

        updateRequirement(
            "reqLength",
            result.length
        );

        updateRequirement(
            "reqUpper",
            result.upper
        );

        updateRequirement(
            "reqLower",
            result.lower
        );

        updateRequirement(
            "reqNumber",
            result.number
        );

        updateRequirement(
            "reqSpecial",
            result.special
        );

        return Object.values(result)
            .every(Boolean);
    }


    password.addEventListener(
        "input",
        () => {

            validatePassword(
                password.value
            );

            if (
                confirmPassword.value &&
                password.value !==
                confirmPassword.value
            ) {

                confirmError.classList.add(
                    "show"
                );

            } else {

                confirmError.classList.remove(
                    "show"
                );
            }
        }
    );


    confirmPassword.addEventListener(
        "input",
        () => {

            if (
                confirmPassword.value &&
                password.value !==
                confirmPassword.value
            ) {

                confirmError.classList.add(
                    "show"
                );

            } else {

                confirmError.classList.remove(
                    "show"
                );
            }
        }
    );


    function setupPasswordToggle(
        buttonId,
        input
    ) {

        const button =
            document.getElementById(
                buttonId
            );

        button.addEventListener(
            "click",
            () => {

                const visible =
                    input.type === "text";

                input.type =
                    visible
                        ? "password"
                        : "text";

                button.textContent =
                    visible
                        ? "Show"
                        : "Hide";
            }
        );
    }


    setupPasswordToggle(
        "togglePassword",
        password
    );

    setupPasswordToggle(
        "toggleConfirmPassword",
        confirmPassword
    );


    function showStatus(
        message,
        type
    ) {

        status.textContent =
            message;

        status.className =
            "status show " + type;
    }


    form.addEventListener("submit", async (event) => {

            event.preventDefault();

            if (!token) {

                showStatus(
                    "This password reset link is invalid or incomplete.",
                    "error"
                );

                return;
            }

            const valid =
                validatePassword(
                    password.value
                );

            if (!valid) {

                showStatus(
                    "Please satisfy all password requirements.",
                    "error"
                );

                return;
            }

            if (
                password.value !==
                confirmPassword.value
            ) {

                confirmError.classList.add(
                    "show"
                );

                showStatus(
                    "The passwords do not match.",
                    "error"
                );

                return;
            }

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Resetting password...";

            status.className =
                "status";


            try {

                /*
                 * Call your Express reset endpoint.
                 *
                 * Change this URL if your endpoint
                 * is mounted elsewhere.
                 */
                const response =
                    await fetch(
                        "${serverUrl}/auth/reset-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                token,
                                password:
                                    password.value
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to reset password."
                    );
                }


                showStatus(
                    data.message ||
                    "Your password has been reset successfully.",
                    "success"
                );


                form.style.display =
                    "none";


            } catch (error) {

                console.log("Reset Error from HTML JS: ", error);
                showStatus(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
                    "error"
                );

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Reset password";
            }
        }
    );

</script>

</body>
</html>`;
};