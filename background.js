var homepageUrl = browser.runtime.getURL('index.html');

// Inject URL vào Custom Homepage setting của Zen/Firefox
browser.browserSettings.homepageOverride.set({ value: homepageUrl });
browser.browserSettings.newTabPageOverride.set({ value: homepageUrl });

// Fallback: redirect new window nếu setting chưa kịp apply
browser.windows.onCreated.addListener(function(win) {
  if (win.type !== 'normal') return;
  browser.tabs.query({ windowId: win.id }, function(tabs) {
    if (tabs.length === 1) {
      var url = tabs[0].url || '';
      if (url === 'about:blank' || url === 'about:newtab' || url === '') {
        browser.tabs.update(tabs[0].id, { url: homepageUrl });
      }
    }
  });
});
