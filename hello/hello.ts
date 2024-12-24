import { api } from "encore.dev/api";
import { welcome } from "./welcome";
import { db1 } from "./welcome";
import { getAuthData } from "~encore/auth";

// Welcome to Encore!
// This is a simple "Hello World" project to get you started.
//
// To run it, execute "encore run" in your favorite shell.

// ==================================================================

// This is a simple REST API that responds with a personalized greeting.
// To call it, run in your terminal:
//
//	curl http://localhost:4000/hello/World
//
export const create = api(
  { expose: true, method: "GET", path: "/hello/:name", auth: true },
  async ({ name }: { name: string }): Promise<Response> => {
    const user = getAuthData()
   
    const messageID = await welcome.publish({name });
    const msg = `Hello ${name} ${messageID} ${user?.userID} !`;
    
    return { message: msg };
  }
);

interface Response {
  message: string;
}

interface Response2 {
  greetings: { id: string, name: string}[]
}

export const list = api({
  expose: true, method: "GET", path: "/hello" , auth: true},
  async  () : Promise<Response2> => {
      const result = db1.query`
      select * from welcome
      `
      const greetings = [] as Response2['greetings']
      for await( const row of result ) {
        greetings.push(row as Response2['greetings'][number] )
      }
      return { greetings }
  }
)




// ==================================================================

// Encore comes with a built-in development dashboard for
// exploring your API, viewing documentation, debugging with
// distributed tracing, and more. Visit your API URL in the browser:
//
//     http://localhost:9400
//

// ==================================================================

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore, check out these topics in docs:
//
//    Building a REST API:   https://encore.dev/docs/ts/tutorials/rest-api
//    Creating Services:      https://encore.dev/docs/ts/primitives/services
//    Creating APIs:         https://encore.dev/docs/ts/primitives/defining-apis
//    Using SQL Databases:        https://encore.dev/docs/ts/primitives/databases
//    Using Pub/Sub:         https://encore.dev/docs/ts/primitives/pubsub
//    Authenticating users:  https://encore.dev/docs/ts/develop/auth
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets
