import Action from 'candycane/dist/http/action';

export default class Version extends Action {
  /**
   * This function can return a promise (or raw POJOs) of data to be looked up
   *
   * @return Object/Promise
   */
  data() {
    return {
      version: `1.0.0`,
    };
  }
}
