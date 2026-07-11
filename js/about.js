let submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    var params = {
        name: document.getElementById('username').value,
        email: document.getElementById('email-address').value,
        title: document.getElementById('title').value,
        message: document.getElementById('message').value
    };

    const serviceId = "service_fo2rn5e";
    const templateId = "template_2xx8v1a";

    emailjs
        .send(serviceId, templateId, params)
        .then((res) => {
            document.getElementById('username').value = "";
            document.getElementById('email-address').value = "";
            document.getElementById('title').value = "";
            document.getElementById('message').value = "";
            alert("Đã gửi email thành công");
        })
        .catch((err) => console.log(err));
});
