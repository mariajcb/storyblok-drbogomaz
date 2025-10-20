import { ref, readonly } from 'vue';

const CookieStorage = {
  isAvailable() {
    return false;
  },
  get(key) {
    return null;
  },
  set(key, data) {
    return false;
  },
  remove(key) {
    return false;
  },
  getFallback() {
    return null;
  },
  setFallback(data) {
    return false;
  },
  removeFallback() {
    return false;
  }
};
const ConsentValidation = {
  validateConsentData(data) {
    return data && typeof data.analytics === "boolean" && data.timestamp && typeof data.timestamp === "string";
  },
  isConsentExpired(timestamp, consentDuration) {
    if (!timestamp) return true;
    const consentAge = Date.now() - new Date(timestamp).getTime();
    return consentAge > consentDuration;
  },
  createConsentData(userConsent, consentType, consentVersion, dataRetention) {
    return {
      analytics: userConsent,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: consentVersion,
      consentType,
      dataRetention
    };
  },
  getConsentAgeInDays(timestamp) {
    if (!timestamp) return null;
    const age = Date.now() - new Date(timestamp).getTime();
    return Math.floor(age / (1e3 * 60 * 60 * 24));
  }
};
const CookieConsentConfig = {
  CONSENT: {
    RENEWAL_THRESHOLD_DAYS: 365
  }
};
const useCookieConsent = () => {
  const consent = ref(null);
  const isLoaded = ref(false);
  const error = ref(null);
  const isInitializing = ref(false);
  const isLocalStorageAvailable = () => CookieStorage.isAvailable();
  const initializeConsent = async () => {
    if (isInitializing.value) return;
    isInitializing.value = true;
    error.value = null;
    {
      isLoaded.value = true;
      isInitializing.value = false;
      return;
    }
  };
  const saveConsent = async (userConsent, consentType = "explicit") => {
    return;
  };
  const acceptAll = async () => {
    await saveConsent(true, "explicit");
  };
  const rejectAll = async () => {
    await saveConsent(false, "explicit");
  };
  const hasConsent = () => {
    var _a;
    return ((_a = consent.value) == null ? void 0 : _a.analytics) === true;
  };
  const hasResponded = () => {
    return consent.value !== null;
  };
  const getConsentTimestamp = () => {
    var _a;
    return (_a = consent.value) == null ? void 0 : _a.timestamp;
  };
  const getConsentAge = () => {
    var _a;
    return ConsentValidation.getConsentAgeInDays((_a = consent.value) == null ? void 0 : _a.timestamp);
  };
  const needsRenewal = () => {
    const age = getConsentAge();
    return age !== null && age > CookieConsentConfig.CONSENT.RENEWAL_THRESHOLD_DAYS;
  };
  const clearConsent = () => {
    return;
  };
  const getConsentSummary = () => {
    if (!consent.value) return null;
    return {
      hasConsent: hasConsent(),
      hasResponded: hasResponded(),
      timestamp: getConsentTimestamp(),
      age: getConsentAge(),
      needsRenewal: needsRenewal(),
      version: consent.value.version,
      consentType: consent.value.consentType
    };
  };
  return {
    consent: readonly(consent),
    isLoaded: readonly(isLoaded),
    error: readonly(error),
    isInitializing: readonly(isInitializing),
    acceptAll,
    rejectAll,
    hasConsent,
    hasResponded,
    getConsentTimestamp,
    getConsentAge,
    needsRenewal,
    clearConsent,
    initializeConsent,
    getConsentSummary,
    isLocalStorageAvailable
  };
};

export { useCookieConsent as u };
//# sourceMappingURL=useCookieConsent-D8LlrDps.mjs.map
