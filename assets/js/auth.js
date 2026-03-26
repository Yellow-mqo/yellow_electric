function unlock() {
    const pass = document.getElementById('pass-input').value;
    if (pass === "Shin-Hakushima") {
        document.getElementById('password-screen').style.display = 'none';
        document.getElementById('secret-content').style.display = 'block';
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}