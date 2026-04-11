// import type { API } from "./raw";

// /**
//  * The class that encapsulates the config API
//  *
//  * TODO: this is a proposal
//  * configs are versioned and have internal _version: number, _date: Date fields
//  *
//  * @internal
//  */
// export class ConfigAPI {
//   private api: API;

//   constructor(api: API) {
//     this.api = api;
//   }

//   /**
//    * Sets a new config
//    */
//   async set(config: object) {
//     return this.api.configSet(config);
//   }

//   /**
//    * Get a config (defaults to latest)
//    */
//   async get(version: number | undefined) {
//     return this.api.configGet(version);
//   }
// }
