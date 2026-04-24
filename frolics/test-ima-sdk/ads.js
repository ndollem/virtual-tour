const adTagBaseParams = {
  iu: "/95250053/VIDIO_ANDROID_INSTREAM",
  description_url: "http://example.com",
  tfcd: "0",
  npa: "0",
  ad_type: "audio_video",
  ciu_szs: "fluid",
  min_ad_duration: "5000",
  max_ad_duration: "60000",
  gdfp_req: "1",
  unviewed_position_start: "1",
  output: "vast",
  env: "vp",
  impl: "s",
};

const landscapeSources = [
  "//s0.2mdn.net/4253510/google_ddm_animation_480P.mp4",
  "//s0.2mdn.net/4253510/google_ddm_animation_480P.webm",
];
const portraitSource = "frolics-logo.mp4";

const contentElement = document.getElementById("contentElement");
const adContainerElement = document.getElementById("adContainer");
const startButton = document.getElementById("startButton");
const mainContainerElement = document.getElementById("mainContainer");

let adDisplayContainer;
let adsLoader;
let adsManager;
let adsInitialized = false;
let contentCycle = 0;

const videoEvents = [
  "loadstart",
  "loadedmetadata",
  "canplay",
  "canplaythrough",
  "play",
  "playing",
  "pause",
  "timeupdate",
  "seeking",
  "seeked",
  "volumechange",
  "waiting",
  "stalled",
  "ended",
  "error",
];

function log(...args) {
  console.log("[PLAYER]", ...args);
}

function logAd(...args) {
  console.log("[IMA]", ...args);
}

function isPortraitViewport() {
  return window.innerHeight > window.innerWidth;
}

function setVideoSources(sources) {
  contentElement.innerHTML = "";
  sources.forEach((src) => {
    const source = document.createElement("source");
    source.src = src;
    contentElement.appendChild(source);
  });
  contentElement.load();
}

function applyInitialSourceByViewport() {
  if (isPortraitViewport()) {
    setVideoSources([portraitSource]);
    log("Initial source: portrait video", { source: portraitSource });
    return;
  }
  setVideoSources(landscapeSources);
  log("Initial source: landscape video", { sources: landscapeSources });
}

function getPlayerSize() {
  const rect = adContainerElement.getBoundingClientRect();
  return {
    width: Math.max(1, Math.floor(rect.width)),
    height: Math.max(1, Math.floor(rect.height)),
  };
}

function buildResponsiveAdTagUrl(size) {
  const url = new URL("https://pubads.g.doubleclick.net/gampad/ads");
  Object.entries(adTagBaseParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // Keep ad request size aligned with current player viewport.
  url.searchParams.set("sz", `${size.width}x${size.height}`);
  url.searchParams.set("correlator", `${Date.now()}`);

  return url.toString();
}

function applyPlayerAspectRatioByViewport() {
  const isPortrait = isPortraitViewport();
  mainContainerElement.style.aspectRatio = isPortrait ? "9 / 16" : "16 / 9";
  log("Player aspect ratio applied", {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    aspectRatio: mainContainerElement.style.aspectRatio,
  });
}

function initializeIMA() {
  adDisplayContainer = new google.ima.AdDisplayContainer(
    adContainerElement,
    contentElement,
  );
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);

  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded,
    false,
  );

  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError,
    false,
  );

  logAd("IMA initialized");
}

function requestAds() {
  const size = getPlayerSize();
  const adTagUrl = buildResponsiveAdTagUrl(size);
  const adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = adTagUrl;
  adsRequest.linearAdSlotWidth = size.width;
  adsRequest.linearAdSlotHeight = size.height;
  adsRequest.nonLinearAdSlotWidth = size.width;
  adsRequest.nonLinearAdSlotHeight = Math.max(50, Math.floor(size.height / 3));
  adsRequest.setAdWillAutoPlay(true);
  adsRequest.setAdWillPlayMuted(true);

  logAd("Requesting ads", { size, adTagUrl });
  adsLoader.requestAds(adsRequest);
}

function initializeAdDisplayContainerFromUserAction() {
  if (adsInitialized) return;
  adDisplayContainer.initialize();
  adsInitialized = true;
  logAd("AdDisplayContainer initialized from user interaction");
}

function onAdsManagerLoaded(event) {
  logAd("ADS_MANAGER_LOADED");
  const settings = new google.ima.AdsRenderingSettings();
  settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  adsManager = event.getAdsManager(contentElement, settings);

  const adEvents = [
    google.ima.AdEvent.Type.LOADED,
    google.ima.AdEvent.Type.STARTED,
    google.ima.AdEvent.Type.FIRST_QUARTILE,
    google.ima.AdEvent.Type.MIDPOINT,
    google.ima.AdEvent.Type.THIRD_QUARTILE,
    google.ima.AdEvent.Type.COMPLETE,
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    google.ima.AdEvent.Type.CLICK,
    google.ima.AdEvent.Type.SKIPPED,
    google.ima.AdEvent.Type.PAUSED,
    google.ima.AdEvent.Type.RESUMED,
    google.ima.AdEvent.Type.LOG,
    google.ima.AdEvent.Type.IMPRESSION,
    google.ima.AdEvent.Type.USER_CLOSE,
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    google.ima.AdEvent.Type.AD_BREAK_READY,
  ];

  adEvents.forEach((eventType) => {
    adsManager.addEventListener(eventType, onAdEvent);
  });

  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

  startAds();
}

function startAds() {
  if (!adsManager) return;
  const size = getPlayerSize();
  try {
    adsManager.init(size.width, size.height, google.ima.ViewMode.NORMAL);
    adsManager.start();
    logAd("Ads started", size);
  } catch (error) {
    logAd("Ads start failed, fallback to content", error);
    playContent();
  }
}

function onAdEvent(event) {
  const ad = event.getAd ? event.getAd() : null;
  const payload = {
    type: event.type,
    isLinear: ad ? ad.isLinear() : null,
    adId: ad ? ad.getAdId?.() || null : null,
    title: ad ? ad.getTitle?.() || null : null,
    duration: ad ? ad.getDuration?.() || null : null,
  };
  logAd("Event", payload);

  if (event.type === google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED) {
    contentElement.pause();
  }

  if (event.type === google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED) {
    playContent();
  }

  if (event.type === google.ima.AdEvent.Type.ALL_ADS_COMPLETED) {
    playContent();
  }
}

function onAdError(errorEvent) {
  logAd("AD_ERROR", errorEvent.getError());
  if (adsManager) {
    adsManager.destroy();
  }
  playContent();
}

function playContent() {
  contentElement
    .play()
    .then(() => log("Content playback started"))
    .catch((error) => {
      log("Autoplay failed, showing start button", error);
      startButton.style.display = "block";
    });
}

function onResize() {
  applyPlayerAspectRatioByViewport();
  const size = getPlayerSize();
  if (adsManager) {
    adsManager.resize(size.width, size.height, google.ima.ViewMode.NORMAL);
    logAd("Ads resized", size);
  } else {
    log("Player resized", size);
  }
}

function attachVideoLogs() {
  videoEvents.forEach((eventName) => {
    contentElement.addEventListener(eventName, () => {
      log("Video event:", eventName, {
        currentTime: Number(contentElement.currentTime.toFixed(2)),
        muted: contentElement.muted,
        volume: contentElement.volume,
        readyState: contentElement.readyState,
      });
    });
  });
}

function restartCycleWithFreshAdRequest() {
  contentCycle += 1;
  log("Content ended. Starting next playback cycle.", { cycle: contentCycle });
  if (adsLoader) {
    adsLoader.contentComplete();
  }

  if (adsManager) {
    try {
      adsManager.destroy();
    } catch (error) {
      logAd("adsManager destroy warning", error);
    }
    adsManager = null;
  }

  contentElement.currentTime = 0;
  requestAds();
}

function init() {
  applyPlayerAspectRatioByViewport();
  applyInitialSourceByViewport();
  attachVideoLogs();
  initializeIMA();

  contentElement.addEventListener("ended", () => {
    restartCycleWithFreshAdRequest();
  });

  startButton.addEventListener("click", () => {
    initializeAdDisplayContainerFromUserAction();
    startButton.style.display = "none";
    startAds();
    playContent();
  });

  window.addEventListener("resize", onResize);
  document.addEventListener("fullscreenchange", onResize);
  document.addEventListener("webkitfullscreenchange", onResize);

  // Try autoplay-muted flow first (required by modern browsers).
  initializeAdDisplayContainerFromUserAction();
  requestAds();
}

init();
