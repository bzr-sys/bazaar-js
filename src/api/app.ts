// import type { API } from "./raw";
// import { CollectionOptions, Doc } from "../types";
// import { CollectionAPI } from "./collection";

// /**
//  * The class that encapsulates the app API
//  *
//  * TODO: this is a proposal
//  *
//  * @internal
//  */
// export class AppAPI {
//   private api: API;

//   constructor(api: API) {
//     this.api = api;
//   }

//   /**
//    * Gets a collection interface (API access to the specified collection)
//    * @param collectionName - The name of the collection to create the interface for.
//    * @param collectionOptions - An optional object for specifying a user ID & onCreate hook. Specify a user ID to operate on a collection owned by that user ID. Otherwise operates on a collection owned by the authenticated user. The onCreate hook sets up a collection when it is created (e.g., to set up permissions)
//    */
//   collection<T extends Doc>(collectionName: string, collectionOptions?: CollectionOptions): CollectionAPI<T> {
//     return new CollectionAPI<T>(this.api, collectionName, { appOwned: true, ...collectionOptions });
//   }
// }
