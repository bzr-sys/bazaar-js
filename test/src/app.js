import { PermissionType, RethinkID } from "../../src";

function output(id, msg) {
  console.log("adding to "+id+": "+ msg)
  const ul = document.getElementById(id);
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(msg));
  ul.appendChild(li);
}

const config = {
  appId: "test",
  loginRedirectUri: window.location.origin ,
  onApiConnectError: function (rid, msg) {
    console.log("API connection error: "+ msg)
    rid.logOut();
  },
};

const rid = new RethinkID(config);

window.login = function () {
  rid.login();
};

window.run = async function() {
  await runTest();
}

window.share = async function() {
  await runShare();
}

let user = {
  id: "",
  email: "",
  name: "",
};

rid.onLogin(async () => {
  user = await rid.users.getInfo();
  // document.getElementById("login").classList.toggle("hidden");
  // document.getElementById("run").classList.toggle("hidden");
  document.getElementById("login-btn").disabled = true;
  document.getElementById("run-btn").disabled = false;

  const p = document.getElementById("user")
  p.innerText = "Logged in as: "+user.id+" ("+user.email+")"
  console.log(user)

  // set up shared items
  // const shared = await rid.sharing.listShared()
  // for (let gp of shared){
  //   const msg = "App: "+gp.appId+" - Host: "+gp.hostId+" - Table: "+gp.permission.tableName+" - Type: "+gp.permission.types[0];
  //   output("shared-output", msg)
  // }

  await rid.sharing.onShared((gp)=>{
    const msg = "App: "+gp.appId+" - Host: "+gp.hostId+" - Table: "+gp.permission.tableName+" - Type: "+gp.permission.types[0];
    output("shared-output", msg)
  })
});

async function runTest() {
  // document.getElementById("run-p").classList.toggle("hidden");
  document.getElementById("run-btn").disabled = true;

  //
  // Table API
  //

  const t1 = rid.table("t1", {
    onCreate : async () => {
      console.log("RID:", rid);
      await rid.api.permissionsSet([
        {
          tableName: "t1",
          userId: "*",
          type: "insert",
          condition: {
            matchUserId: "id",
          },
        },
      ]);
      return;
    }
  });

  
  // let d1 = [];
  try {
    // Read
    let resp = await t1.read();
    console.log("Read:")
    console.log(resp)
    if (Array.isArray(resp)) {
      output("run-output", "Reading empty table returns length: "+resp.length);
    } else {
      output("run-output", "Error reading empty table: "+resp);
    }

    // resp = await rid.api.tableRead("t1", { userId: "non-existent" });
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


    // Insert 1
    let row = await t1.insert({ height: 100, weight: 20, age: 10 });
    console.log(row)

    // Insert many
    t1.insert([
      { height: 100, weight: 22, age: 14 }, // fails age
      { height: 100, weight: 30, age: 10 },
      { height: 150, weight: 20, age: 9 },
      { height: 150, weight: 33, age: 8 }, // fails height and weight
    ]); 

    // Read with filter
    output("run-output", "Read table with filter ((height > 80 AND height < 140) OR (weight > 10 AND weight < 25)) AND (age < 12)");
    resp = await t1.read({
      filter: {
        $or: [{ height: { $gt: 80, $lt: 140 }}, {weight: { $gt: 10, $lt: 25 } }],
        age: { $lt: 12 },
      },
    });
    if (Array.isArray(resp)) {
      output("run-output", "Reading non-empty table returns length: "+resp.length);
      for (let doc of resp){
        output("run-output", "- height: "+doc.height+" - weight: "+doc.weight+" - age: "+doc.age);
      }
    } else {
      output("run-output", "Error reading non-empty table: "+resp);
    }

    // Delete 
    resp = await t1.delete({ rowId: row[0] });
    console.log(resp)
    output("run-output", resp.message);

    console.log("RID:", rid);


    // // Drop table
    // resp = await rid.api.tablesDrop("t1");
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
  const userId = document.getElementById('share-input').value

  if (!userId){
    output("share-output", "specify user id")
    return;
  }
  document.getElementById("share-btn").disabled = true;

  const s1 = rid.table("s1");
  const s2 = rid.table("s2");

  
  try {

    await s1.read()
    await s2.read()

    let link = await rid.sharing.createLink({tableName: "s1", types: [PermissionType.READ]}, 1)
    output("share-output", "Create sharing link: "+link);

    let msg = await rid.sharing.withUser(userId, {tableName: "s2", types: [PermissionType.READ]})
    output("share-output", "Share s2 with user: "+ msg.message);

    let share = await rid.sharing.list()
    for (let s of share){
      output("share-output", "- Share: "+ s.tableName + " "+ s.userId);
    }
    
    let links = await rid.sharing.listLinks()
    for (let l of links){
      output("share-output", "- Link: "+ l.appId + " "+ l.limit);
    }



    
    
    
  } catch (e) {
    console.log(e.constructor.name);
    console.log(e.type);
    console.log(e);
    output("share-output", e);
  }
}