class BusinessLogic {
  /**
   * @param {Api} api
   * @param {Object} options
   */
  constructor(api, options) {
    this.api = api;

    this.pollingInterval = options.pollingInterval;
  }

  /**
   * @public
   * @param {(state: Object | null) => void} listener
   * @returns {void}
   */
  onStateUpdate(listener) {
    this.stateUpdateListener = listener;
  }

  /**
   * @public
   * @param {string} localIp
   * @returns {void}
   */
  setLocalIp(localIp) {
    this.localIp = localIp;
    this.updateApiBaseUrl();
  }

  /**
   * @public
   * @param {string} httpPort
   * @returns {void}
   */
  setHttpPort(httpPort) {
    this.httpPort = httpPort;
    this.updateApiBaseUrl();
  }

  /**
   * @public
   * @param {string} command
   * @param {Object} [parameters={}]
   * @returns {void}
   */
  requestCommand(command, parameters = {}) {
    console.log('requestCommand', command, parameters);
  }

  /**
   * @public
   * @returns {void}
   */
  initialize() {
    // Start polling.
    this.poll();
  }

  /**
   * @public
   * @returns {void}
   */
  stopPolling() {
    clearTimeout(this.pollingTimeout);
  }

  /**
   * @private
   * @returns {void}
   */
  updateApiBaseUrl() {
    this.api.setBaseUrl(`http://${this.localIp}:${this.httpPort}`);
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  async poll() {
    if (this.stateUpdateListener) {
      try {
        const state = await this.api.getState();
        this.stateUpdateListener(state);
      } catch (error) {
        console.warn(error);
        this.stateUpdateListener(null);
      }
    }

    this.pollingTimeout = setTimeout(() => this.poll(), this.pollingInterval);
  }
}
