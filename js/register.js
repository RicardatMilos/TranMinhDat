let inpUsername = document.getElementById('username');
let inpEmail = document.getElementById('email');
let inpPassword = document.getElementById('password');
let inpConfirmPassword = document.getElementById('confirm-password');
let submitButton = document.getElementById('submit-button');
let registerForm = document.querySelector('form');

function handleRegister(e){
    e.preventDefault()

    let username = inpUsername.value;
    let email = inpEmail.value;
    let password = inpPassword.value;
    let confirmPassword = inpConfirmPassword.value;
    let role_id = 2

    if (!username || !email || !password || !confirmPassword) {
        alert("Vui Lòng Điền Đầy Đủ")
        return
    }

    if (password != confirmPassword) {
        alert("Vui lòng nhập lại mật khẩu")
        return
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {

            let user = userCredential.user;

            let userData = {
                username,
                email,
                password,
                role_id: role_id,
                balance: 0,
            }

            db.collection("users").doc(user.uid).set(userData)
                .then((docref) => {
                    alert("Đăng Ký Thành Công");
                    window.location.href = "login.html"
                    console.log(docref.id)
                    return;
                })

                .catch((error) => {
                    alert("Đăng Ký Thất Bại");
                    console.log("error")
                })
        })

        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;

            alert(`Lỗi: ${errorMessage}`);
            console.log(errorMessage)
        })
}

registerForm.addEventListener("submit", handleRegister)