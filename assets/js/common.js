async function loadHeader() {
    const response = await fetch('header.html');
    const text = await response.json(); // もしくは .text()
    // 実際には text() でHTMLとして流し込む
    const html = await response.text();
    document.getElementById('header-common').innerHTML = html;
}
loadHeader();

async function loadFooter() {
    const response = await fetch('footer.html');
    const text = await response.json(); // もしくは .text()
    // 実際には text() でHTMLとして流し込む
    const html = await response.text();
    document.getElementById('footer-common').innerHTML = html;
}
loadHeader();