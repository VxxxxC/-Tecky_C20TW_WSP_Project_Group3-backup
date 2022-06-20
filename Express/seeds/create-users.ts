import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert(
        { username: "TEST", password: "TEST", created_at: "now()", updated_at: "now()", is_admin: "false" }
    )
        .returning("id")
        .then((res) => {
            let result = res;
            let id = result[0].id
            console.log(`image ID is : ${id}`)
        });
};
