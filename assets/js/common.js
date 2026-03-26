async function loadHeader() {
    const response = await fetch('header.html');
    const html = await response.text();
    document.getElementById('header-common').innerHTML = html;
}
loadHeader();

async function loadFooter() {
    const response = await fetch('footer.html');
    const html = await response.text();
    document.getElementById('footer-common').innerHTML = html;
}
loadFooter();