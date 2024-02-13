import { PermissionType, BazaarApp } from "../../src";

function output(id, msg) {
  console.log("adding to " + id + ": " + msg);
  const ul = document.getElementById(id);
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(msg));
  ul.appendChild(li);
}

const config = {
  appId: "test",
  loginRedirectUri: window.location.origin,
  onApiConnectError: function (bzr, msg) {
    console.log("API connection error: " + msg);
    bzr.logOut();
  },
};

const bzr = new BazaarApp(config);

window.login = function () {
  bzr.login();
};

window.modalSocial = function () {
  bzr.social.openModal();
};

window.modalPermission = function () {
  bzr.permissions.openModal({ collectionName: "test", types: ["read"] });
};

window.run = async function () {
  await runTest();
};

window.share = async function () {
  await runShare();
};

window.getContacts = async function () {
  await fetchContacts();
};

let user = {
  id: "",
  email: "",
  name: "",
};

bzr.onLogin(async () => {
  user = await bzr.social.getUser();
  // document.getElementById("login").classList.toggle("hidden");
  // document.getElementById("run").classList.toggle("hidden");
  document.getElementById("login-btn").disabled = true;
  document.getElementById("run-btn").disabled = false;

  const p = document.getElementById("user");
  p.innerText = "Logged in as: " + user.id + " (" + user.email + ")";
  console.log(user);

  // set up shared items
  // const shared = await bzr.sharing.listShared()
  // for (let gp of shared){
  //   const msg = "App: "+gp.appId+" - Owner: "+gp.ownerId+" - Table: "+gp.permission.collectionName+" - Type: "+gp.permission.types[0];
  //   output("shared-output", msg)
  // }

  await bzr.permissions.onGranted({ includeInitial: true }, (gp) => {
    const msg =
      "App: " +
      gp.appId +
      " - Owner: " +
      gp.ownerId +
      " - Table: " +
      gp.permission.collectionName +
      " - Type: " +
      gp.permission.types[0];
    output("shared-output", msg);
  });
});

async function runTest() {
  // document.getElementById("run-p").classList.toggle("hidden");
  document.getElementById("run-btn").disabled = true;

  //
  // Table API
  //

  const c1 = bzr.collection("c1", {
    onCreate: async () => {
      console.log("bzr:", bzr);
      await bzr.permissions.create({
        collectionName: "c1",
        userId: "*",
        types: ["insert"],
        filter: {
          id: "$user",
        },
      });
      return;
    },
  });

  // let d1 = [];
  try {
    // Read
    let resp = await c1.getAll();
    console.log("Read:");
    console.log(resp);
    if (Array.isArray(resp)) {
      output("run-output", "Reading empty collection returns length: " + resp.length);
    } else {
      output("run-output", "Error reading empty collection: " + resp);
    }

    // resp = await bzr.api.collectionRead("t1", { userId: "non-existent" });
    // output(resp.data);

    // t1.insert({ value: d1.length, secondary: 1 });
    // t1.insert({ value: d1.length + 1, secondary: 2 });
    // t1.insert({ value: d1.length + 2, secondary: 3 });
    // t1.insert({ value: d1.length + 3, secondary: 4 });
    // t1.insert({ value: d1.length + 4, secondary: 5 });

    // resp = await t1.read({ startOffset: 0, endOffset: 2, orderBy: { secondary: "desc", value: "asc" } });
    // if (Array.isArray(resp.data)) {
    //   console.log("0-2", resp.data);
    //   output(resp.data);
    // }
    // resp = await t1.read({ startOffset: 2, endOffset: 4 });
    // if (Array.isArray(resp.data)) {
    //   console.log("2-4", resp.data);
    //   output(resp.data);
    // }
    // resp = await t1.read({ endOffset: 2 });
    // if (Array.isArray(resp.data)) {
    //   console.log("-2", resp.data);
    //   output(resp.data);
    // }
    // resp = await t1.read({ startOffset: -2 });
    // if (Array.isArray(resp.data)) {
    //   console.log("2-", resp.data);
    //   output(resp.data);
    // }

    // Insert
    let docId = await c1.insertOne({ height: 100, weight: 20, age: 10 });
    console.log(docId);

    // Insert
    c1.insertOne({ height: 100, weight: 22, age: 14 }); // fails age
    c1.insertOne({ height: 100, weight: 30, age: 10 });
    c1.insertOne({ height: 150, weight: 20, age: 9 });
    c1.insertOne({ height: 150, weight: 33, age: 8 }); // fails height and weight

    // Read with filter
    output(
      "run-output",
      "Read collection with filter ((height > 80 AND height < 140) OR (weight > 10 AND weight < 25)) AND (age < 12)",
    );
    resp = await c1.getAll({
      $or: [{ height: { $gt: 80, $lt: 140 } }, { weight: { $gt: 10, $lt: 25 } }],
      age: { $lt: 12 },
    });
    if (Array.isArray(resp)) {
      output("run-output", "Reading non-empty collection returns length: " + resp.length);
      for (let doc of resp) {
        output("run-output", "- height: " + doc.height + " - weight: " + doc.weight + " - age: " + doc.age);
      }
    } else {
      output("run-output", "Error reading non-empty collection: " + resp);
    }

    // Delete
    resp = await c1.deleteOne(docId);
    console.log(resp);
    output("run-output", resp.message);

    console.log("bzr:", bzr);

    // // Drop collection
    // resp = await bzr.api.collectionsDrop("t1");
    // output(resp.message);

    document.getElementById("share-btn").disabled = false;
  } catch (e) {
    console.log(e.constructor.name);
    console.log(e.type);
    console.log(e);
    output("run-output", e);
  }
}

async function runShare() {
  const userId = document.getElementById("share-input").value;

  if (!userId) {
    output("share-output", "specify user id");
    return;
  }
  document.getElementById("share-btn").disabled = true;

  const s1 = bzr.collection("s1");
  const s2 = bzr.collection("s2");

  try {
    await s1.getAll();
    await s2.getAll();

    let link = await bzr.permissions.links.create({ collectionName: "s1", types: [PermissionType.READ] }, 1);
    output("share-output", "Create sharing link: " + link);

    let msg = await bzr.permissions.create({ collectionName: "s2", types: [PermissionType.READ], userId: userId });
    output("share-output", "Share s2 with user: " + msg.message);

    let share = await bzr.permissions.list();
    for (let s of share) {
      output("share-output", "- Share: " + s.collectionName + " " + s.userId);
    }

    let links = await bzr.permissions.links.list();
    for (let l of links) {
      output("share-output", "- Link: " + l.appId + " " + l.limit);
    }
  } catch (e) {
    console.log(e.constructor.name);
    console.log(e.type);
    console.log(e);
    output("share-output", e);
  }
}

async function fetchContacts() {
  const contacts = await bzr.social.listContacts();
  if (contacts.length == 0) {
    output("contacts-output", "no contacts");
  }
  for (let c of contacts) {
    output("contacts-output", `${c.contactUserId} ${c.connected} ${c.requested}`);
  }
}
