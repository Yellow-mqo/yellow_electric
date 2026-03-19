/*
	Alpha by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			wide:      ( '1281px',  '1680px' ),
			normal:    ( '981px',   '1280px' ),
			narrow:    ( '737px',   '980px'  ),
			narrower:  ( '737px',   '840px'  ),
			mobile:    ( '481px',   '736px'  ),
			mobilep:   ( null,      '480px'  )
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right'
		});

	// NavPanel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}
	// Footer
	function copyToClipboard(text, element) {
			    const parent = element.closest('.copy-item'); // 親のliを取得
			
			    navigator.clipboard.writeText(text).then(() => {
			        const tooltip = parent.querySelector('.tooltip');
				
			        // 「コピー済み」状態のクラスを付与
			        parent.classList.add('is-copied');
			        tooltip.innerText = "コピーしました！";
				
			        // 3秒間は表示しっぱなしにして、そのあと消す
			        setTimeout(() => {
			            parent.classList.remove('is-copied');
					
			            // アニメーションが終わる頃にテキストを元に戻す
			            setTimeout(() => {
			                tooltip.innerText = "クリックしてIDをコピー!";
			            }, 300);
			        }, 3000); // ここで表示時間を調整（3000 = 3秒）
			    });
				
			}
	window.copyToClipboard = copyToClipboard;
// --- 1. ユーザー識別用のIDを取得または作成 ---
function getVisitorID() {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
        // 初めての人には「OS情報 + 画面サイズ + ランダム文字列」でIDを作る
        const info = [
            navigator.userAgent.replace(/[^a-zA-Z]/g, '').slice(0, 10), // OS/ブラウザ情報の断片
            screen.width + 'x' + screen.height,                         // 画面解像度
            Math.random().toString(36).substring(2, 10)                 // ランダム
        ].join('-');
        id = 'ID-' + info;
        localStorage.setItem('visitor_id', id);
    }
    return id;
}

// --- 2. フォーム送信処理 ---
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        status.style.display = 'block';
        status.innerText = '送信中...';
    
        const formData = new URLSearchParams(new FormData(form));
        
        // ★ここで識別IDを追加して一緒に送る
        formData.append('visitorID', getVisitorID());
    
        const url = 'https://script.google.com/macros/s/AKfycbyqxjwuzsjE3izlpEefSQ9xvYCIFSJy6Q-H5CaM0DGNNSgFSpSquOf7Sch6ryltxMNT/exec';
    
        fetch(url, {
            method: 'POST',
            body: formData, // URLSearchParams形式で送信
            mode: 'no-cors' // GAS側のCORSエラー回避（必要に応じて）
        })
        .then(() => {
            status.innerText = 'メッセージを受け付けました！ありがとうございます。';
            form.reset();
        })
        .catch(error => {
            status.innerText = 'エラーが発生しました。時間を置いて再度お試しください。';
            console.error(error);
        });
    });
}
})(jQuery);