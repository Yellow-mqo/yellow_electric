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

	// --- 1. IPベースの固定IDを取得・作成 ---
	async function getVisitorID() {
    // IDの形式やルールを変えたい時は、ここを 'v2', 'v3' と更新すれば全員リセットされます
    const VERSION = 'v1'; 

    let id = localStorage.getItem('visitor_id');
    let savedVersion = localStorage.getItem('visitor_id_version');

    // IDがない、またはバージョンが古い場合に作成
    if (!id || savedVersion !== VERSION) {
        let ip = "0.0.0.0";
        try {
            // IPアドレスを取得
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ip = data.ip;
        } catch (e) {
            console.error("IP取得失敗", e);
        }

        // IPアドレスをBase64で変換（隠し味なし）
        const encoded = btoa(ip);
        id = 'NET-' + encoded.substring(0, 12); 
        
        // 新しいIDと現在のバージョンを保存
        localStorage.setItem('visitor_id', id);
        localStorage.setItem('visitor_id_version', VERSION);
    }
    return id;

	}

	// --- フォーム送信処理 (連打&空欄防止) ---
	const form = document.getElementById('contact-form');
	const status = document.getElementById('form-status');
	const submitBtn = document.getElementById('submit-button'); // ★ボタンを取得

	if (form) {
	    form.addEventListener('submit', async e => {
	        e.preventDefault();

			// .trim() でスペースを削った後の文字を取得
    		const message = form.message.value.trim(); 

    		// 「何も入力していない」または「スペースだけ」ならここで止まる
    		if (!message) {
    		    status.style.display = 'block';
    		    status.innerText = '⚠️ メッセージを入力してください（空白のみは送信できません）';
    		    status.style.color = 'orange'; // 警告の色
    		    status.style.backgroundColor = '#fff3e0'; // 薄いオレンジ
    		    status.style.border = '1px solid #ffe0b2';
    		    status.style.padding = '12px';
    		    status.style.borderRadius = '4px';
    		    return; // 送信処理へ進まずに終了
    		}

	        // 2. 連打防止（ボタンを無効化）
    	    submitBtn.disabled = true; 
    	    submitBtn.innerText = '送信中...';
			
    	    // --- 送信中のスタイル設定 ---
    	    status.style.display = 'block';
    	    status.innerText = '⏳ 送信しています。少々お待ちください...';
			
    	    status.style.color = '#555';              // 文字色：濃いグレー
    	    status.style.backgroundColor = '#f5f5f5'; // 背景：薄いグレー
    	    status.style.border = '1px solid #ccc';   // 枠線：グレー
    	    status.style.padding = '12px';
    	    status.style.borderRadius = '4px';
			status.style.fontWeight = 'bold';

	        try {
	            const formData = new URLSearchParams(new FormData(form));
	            const vID = await getVisitorID();
	            formData.append('visitorID', vID);
			
	            const url = 'https://script.google.com/macros/s/AKfycbyqxjwuzsjE3izlpEefSQ9xvYCIFSJy6Q-H5CaM0DGNNSgFSpSquOf7Sch6ryltxMNT/exec';
			
	            await fetch(url, {
	                method: 'POST',
	                body: formData,
	                mode: 'no-cors'
	            });

			// 3. 成功時の処理
        	    status.style.display = 'block';
        	    status.innerText = '✅ 送信が完了しました。ありがとうございます！';
				
        	    // スタイルを「成功の緑」に固定
        	    status.style.color = '#2e7d32'; // 濃い緑
        	    status.style.backgroundColor = '#e8f5e9'; // ごく薄い緑
        	    status.style.border = '1px solid #c8e6c9';
        	    status.style.padding = '12px';
        	    status.style.borderRadius = '4px';
        	    status.style.fontWeight = 'bold';

        	    form.reset();
        	    submitBtn.innerText = '続けて送信する';
        	    submitBtn.disabled = false; // 次の入力のために戻す

        	} catch (error) {
        	    // 4. エラー時の処理
        	    status.style.display = 'block';
        	    status.innerText = '❌ エラーが発生しました。ネット接続を確認してください。';
			
        	    // スタイルを「警告の赤」に
        	    status.style.color = '#d32f2f'; // 濃い赤
        	    status.style.backgroundColor = '#ffebee'; // ごく薄い赤
        	    status.style.border = '1px solid #ffcdd2';
        	    status.style.padding = '12px';
        	    status.style.borderRadius = '4px';

        	    console.error(error);
        	    submitBtn.disabled = false;
        	    submitBtn.innerText = '再試行する';
        	}
	    });
	}
})(jQuery);