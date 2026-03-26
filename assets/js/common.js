async function loadParts() {
    try {
        // 1. ヘッダーとフッターを同時に取得開始（並列処理で速くする）
        const [headerRes, footerRes] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        const headerHtml = await headerRes.text();
        const footerHtml = await footerRes.text();

        // 2. HTMLに流し込む
        const headerContainer = document.getElementById('header-common');
        const footerContainer = document.getElementById('footer-common');

        if (headerContainer) headerContainer.innerHTML = headerHtml;
        if (footerContainer) footerContainer.innerHTML = footerHtml;

        console.log('All parts loaded.');

        // 3. 全パーツが揃った「後」で、main.js を一度だけ読み込む
        // ※ HTML側の <script src="assets/js/main.js"></script> は消しておいてくださいね！
        const script = document.createElement('script');
        script.src = 'assets/js/main.js';
        script.defer = true;
        document.body.appendChild(script);

    } catch (error) {
        console.error('パーツの読み込みに失敗しました:', error);
    }
}

// 実行！
loadParts();