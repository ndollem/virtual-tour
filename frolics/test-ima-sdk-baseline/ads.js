const adTagUrl =
  "https://pubads.g.doubleclick.net/gampad/ads?iu=/95250053/VIDIO_ANDROID_INSTREAM&description_url=http%3A%2F%2Fexample.com&tfcd=0&npa=0&ad_type=audio_video&sz=480x640%7C640x480&ciu_szs=fluid&min_ad_duration=5000&max_ad_duration=60000&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=";

const contentElement = document.getElementById("contentElement");
const adContainerElement = document.getElementById("adContainer");
const startButton = document.getElementById("startButton");

let adDisplayContainer;
let adsLoader;
let adsManager;
let adsInitialized = false;

const videoEvents = [
  "loadstart",
  "loadedmetadata",
  "canplay",
  "canplaythrough",
  "play",
  "playing",
  "pause",
  "ended",
  "error",
];

function log(...args) {
  console.log("[PLAYER][BASELINE]", ...args);
}

function logAd(...args) {
  console.log("[IMA][BASELINE]", ...args);
}

function getPlayerSize() {
  const rect = adContainerElement.getBoundingClientRect();
  return {
    width: Math.max(1, Math.floor(rect.width)),
    height: Math.max(1, Math.floor(rect.height)),
  };
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
}

function requestAds() {
  const size = getPlayerSize();
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
  logAd("AdDisplayContainer initialized");
}

function onAdsManagerLoaded(event) {
  const settings = new google.ima.AdsRenderingSettings();
  settings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  adsManager = event.getAdsManager(contentElement, settings);
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    () => {
      logAd("CONTENT_PAUSE_REQUESTED");
      contentElement.pause();
    },
  );
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    () => {
      logAd("CONTENT_RESUME_REQUESTED");
      playContent();
    },
  );

  [
    google.ima.AdEvent.Type.LOADED,
    google.ima.AdEvent.Type.STARTED,
    google.ima.AdEvent.Type.FIRST_QUARTILE,
    google.ima.AdEvent.Type.MIDPOINT,
    google.ima.AdEvent.Type.THIRD_QUARTILE,
    google.ima.AdEvent.Type.COMPLETE,
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    google.ima.AdEvent.Type.IMPRESSION,
    google.ima.AdEvent.Type.LOG,
  ].forEach((type) => {
    adsManager.addEventListener(type, (e) => logAd("Event", e.type));
  });

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
    logAd("Ads start failed, play content", error);
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

function attachVideoLogs() {
  videoEvents.forEach((eventName) => {
    contentElement.addEventListener(eventName, () => log("Video event:", eventName));
  });
}

function onResize() {
  if (!adsManager) return;
  const size = getPlayerSize();
  adsManager.resize(size.width, size.height, google.ima.ViewMode.NORMAL);
  logAd("Ads resized", size);
}

function init() {
  attachVideoLogs();
  initializeIMA();

  contentElement.addEventListener("ended", () => {
    if (adsLoader) {
      logAd("Content complete");
      adsLoader.contentComplete();
    }
  });

  startButton.addEventListener("click", () => {
    initializeAdDisplayContainerFromUserAction();
    startButton.style.display = "none";
    startAds();
    playContent();
  });

  window.addEventListener("resize", onResize);

  initializeAdDisplayContainerFromUserAction();
  requestAds();
}

init();
