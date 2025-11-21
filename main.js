// デフォルトの銘柄（最初はNVIDIA）
const DEFAULT_SYMBOL = "NASDAQ:NVDA";

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    console.log("[StockPanel] App started.");

    // 1. 保存されている銘柄を読み込んで表示
    loadSymbolAndInit();

    // 2. 「変更」ボタンが押されたときの処理
    const updateBtn = document.getElementById('update-btn');
    const inputField = document.getElementById('symbol-input');

    if (updateBtn && inputField) {
        updateBtn.addEventListener('click', function() {
            const newSymbol = inputField.value.trim();
            if (newSymbol) {
                console.log(`[StockPanel] Button clicked. Saving new symbol: ${newSymbol}`);
                saveSymbol(newSymbol); // 保存
                initWidget(newSymbol); // チャート更新
            } else {
                console.warn("[StockPanel] Input is empty.");
            }
        });

        // Enterキーでも変更できるようにする
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateBtn.click();
            }
        });
    } else {
        console.error("[StockPanel] Error: Input or Button not found in HTML.");
    }
});

/**
 * 保存された銘柄を読み込む関数
 */
function loadSymbolAndInit() {
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['symbol'], function(result) {
            // 保存データがあればそれを使用、なければデフォルト
            const symbol = result.symbol || DEFAULT_SYMBOL;
            console.log(`[StockPanel] Loaded symbol from storage: ${symbol}`);
            
            // 入力欄にも反映
            const inputField = document.getElementById('symbol-input');
            if (inputField) inputField.value = symbol;

            // チャートを表示
            initWidget(symbol);
        });
    } else {
        console.error("[StockPanel] Error: chrome.storage API is not available.");
        initWidget(DEFAULT_SYMBOL); // エラー時はデフォルトで起動
    }
}

/**
 * 銘柄をChromeに保存する関数
 */
function saveSymbol(symbol) {
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ symbol: symbol }, function() {
            console.log("[StockPanel] Symbol saved successfully.");
        });
    }
}

/**
 * TradingViewウィジェットを描画する関数
 */
function initWidget(symbol) {
    console.log(`[StockPanel] Initializing widget for: ${symbol}`);

    const containerId = "tradingview_widget";
    const container = document.getElementById(containerId);

    // コンテナの中身をクリア（再描画用）
    if (container) container.innerHTML = "";

    if (typeof TradingView !== 'undefined') {
        try {
            new TradingView.widget({
                "autosize": true,          // サイズ自動調整
                "symbol": symbol,          // 指定された銘柄
                "interval": "D",           // 日足
                "timezone": "Asia/Tokyo",
                "theme": "light",          // 白背景
                "style": "1",              // ローソク足
                "locale": "ja",
                "toolbar_bg": "#f1f3f4",
                "enable_publishing": false,
                "hide_top_toolbar": true,  // シンプル化
                "hide_side_toolbar": true, // 左ツールバーも隠す
                "allow_symbol_change": false, // 入力欄で変えるのでウィジェット側はロック
                "container_id": containerId
            });
            console.log("[StockPanel] Widget created.");
        } catch (e) {
            console.error("[StockPanel] Error creating TradingView widget:", e);
        }
    } else {
        console.error("[StockPanel] Critical Error: TradingView library (tv.js) is not loaded.");
        if (container) container.innerHTML = "<p style='color:red; padding:10px;'>エラー: tv.js が読み込まれていません。</p>";
    }
}