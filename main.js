// main.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            "autosize": true,
            "symbol": "NASDAQ:NVDA",
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
            "container_id": "tradingview_widget"
        });
    } else {
        console.error('TradingView library not loaded.');
    }
});