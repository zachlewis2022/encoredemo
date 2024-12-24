import { Topic } from "encore.dev/pubsub"
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Subscription } from "encore.dev/pubsub";
import { init } from '@paralleldrive/cuid2';

const createId = init({length: 32, fingerprint: "foo"})

export interface GreetEvent {
    name: string;
}

export const welcome = new Topic<GreetEvent>("welcome", {
    deliveryGuarantee: "at-least-once",
});

export const db1 = new SQLDatabase("db1", { migrations: "./migrations"})

const foo = new Subscription(welcome, "welcome", {
    handler: async (event) => {
        const name = event.name
        const id = createId()
       db1.exec`insert into welcome (id, name) values(${id}, ${name})`
    },
});
