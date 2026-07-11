let inpEmail = document.getElementById('email');
let inpPassword = document.getElementById('password');
let submitButton = document.getElementById('submit-button');
let loginForm = document.getElementById('loginForm');


function handleLogin(e){
    e.preventDefault()

    let email = inpEmail.value;
    let password = inpPassword.value;

    if(!email || !password) {
        alert("Vui Lòng Điền Đầy Đủ")
        return
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        let user = userCredential.user;
        alert("Đăng Nhập Thành Công");

        // Lấy thông tin người dùng trong Firestore
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    let data = doc.data();

                    // Tạo session
                    const userSession = {
                        user: user,
                        role_id: data.role_id,
                        expiry: new Date().getTime() + 2 * 60 * 60 * 1000
                    };
                    localStorage.setItem("user_session", JSON.stringify(userSession));

                    // Phân quyền tại đây
                    if (data.role_id === 1) {
                        window.location.href = "../html/admin-product.html"; // admin
                    } else {
                        window.location.href = "main.html"; // client
                    }
                } else {
                    console.log("Không tìm thấy user trong Firestore");
                }
            });
    })
    .catch((error) => {
        alert("Mật khẩu hoặc tài khoản không đúng");
    });

}

loginForm.addEventListener("submit",handleLogin)