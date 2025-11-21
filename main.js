const DEFAULT_SYMBOL = "NASDAQ:NVDA";

document.addEventListener('DOMContentLoaded', function() {
    console.log("[StockPanel] App started v1.3");
    loadSymbolAndInit();

    const updateBtn = document.getElementById('update-btn');
    const inputField = document.getElementById('symbol-input');

    if (updateBtn && inputField) {
        updateBtn.addEventListener('click', function() {
            const newSymbol = inputField.value.trim();
            if (newSymbol) {
                console.log(`[StockPanel] Updating to: ${newSymbol}`);
                saveSymbol(newSymbol);
                updateAllWidgets(newSymbol); // 両方のウィジェットを更新
            }
        });

        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') updateBtn.click();
        });
    }
});

function loadSymbolAndInit() {
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['symbol'], function(result) {
            const symbol = result.symbol || DEFAULT_SYMBOL;
            const inputField = document.getElementById('symbol-input');
            if (inputField) inputField.value = symbol;
            
            updateAllWidgets(symbol);
        });
    } else {
        updateAllWidgets(DEFAULT_SYMBOL);
    }
}

function saveSymbol(symbol) {
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ symbol: symbol });
    }
}

// まとめて更新する関数
function updateAllWidgets(symbol) {
    updatePriceWidget(symbol);
    initChartWidget(symbol);
}

/**
 * 1. 価格表示ウィジェット（iframe）の更新
 * TradingViewの「Single Ticker Widget」のURLを生成してiframeにセットします
 */
function updatePriceWidget(symbol) {
    const frame = document.getElementById('price-frame');
    if (!frame) return;

    // URLエンコード（記号などをURL用に変換）
    const encodedSymbol = encodeURIComponent(symbol);
    
    // TradingViewの埋め込みURL
    const widgetUrl = `https://s.tradingview.com/embed-widget/single-ticker/?locale=ja&symbol=${encodedSymbol}&colorTheme=light&isTransparent=false&large_chart_url=`;
    
    console.log(`[StockPanel] Loading price frame: ${widgetUrl}`);
    frame.src = widgetUrl;
}

/**
 * 2. チャートウィジェット（tv.js）の更新
 */
function initChartWidget(symbol) {
    const containerId = "tradingview_widget";
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = "";

    if (typeof TradingView !== 'undefined') {
        try {
            new TradingView.widget({
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Asia/Tokyo",
                "theme": "light",
                "style": "1",
                "locale": "ja",
                "toolbar_bg": "#f1f3f4",
                "enable_publishing": false,
                "hide_top_toolbar": true,
                "hide_side_toolbar": true,
                "allow_symbol_change": false,
                "container_id": containerId
            });
        } catch (e) {
            console.error(e);
        }
    }
}