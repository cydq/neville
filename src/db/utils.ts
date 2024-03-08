import {
  GuildMember,
  Role,
  type RoleResolvable,
  type Snowflake,
  User,
  type UserResolvable,
} from "discord.js";
import { Option } from "tsfy";
import { tables } from "./database.ts";
import type { Record } from "airtable";
import { cast } from "tsfy/fn";

export const snowflake = (resolvable: { id: Snowflake } | Snowflake | string): Snowflake =>
  typeof resolvable === "string" ? resolvable : resolvable.id;

export type Rank =
  | "Unranked"
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export interface Player {
  [Player.name]: string;
  [Player.status]: "Unverified" | "Omitted" | "Verified" | "Removed";
  [Player.role]: ("Captain" | "Manager" | "Sponsor" | "Player" | "Substitute" | "Import")[];
  [Player.affiliation]: string[];
  [Player.teams]: string[];
  [Player.email]: string;
  [Player.discordTag]: string;
  [Player.discordId]: string;
  [Player.valorantTag]: string;
  [Player.rank]: Rank;
  [Player.peak]: Rank;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Player {
  export const name = "Name" as const;
  export const status = "Status" as const;
  export const role = "Role" as const;
  export const affiliation = "Affiliation" as const;
  export const teams = "Team" as const;
  export const email = "Email" as const;
  export const discordTag = "Discord Tag" as const;
  export const discordId = "Discord ID" as const;
  export const valorantTag = "VALORANT Tag" as const;
  export const rank = "Current Rank" as const;
  export const peak = "Peak Rank" as const;
}

export interface Team {
  [Team.tag]: string;
  [Team.status]: "Registered" | "Pending";
  [Team.name]: string;
  [Team.schools]: string[];
  [Team.roleId]: string;
  [Team.players]: string[];
  [Team.displayName]: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Team {
  export const tag = "Tag" as const;
  export const status = "Status" as const;
  export const name = "Name" as const;
  export const schools = "School" as const;
  export const roleId = "Role ID" as const;
  export const players = "Players" as const;
  export const displayName = "Computed Name" as const;
}

export async function getPlayer(user: UserResolvable): Promise<Option<Record<Player>>> {
  const result = await tables.player
    .select({
      filterByFormula: `{${Player.discordId}} = "${snowflake(user)}"`,
      maxRecords: 1,
    })
    .all();

  const player = Option.from(result.at(0));
  if (player.isSome()) return cast(player);

  if (!(user instanceof GuildMember) && !(user instanceof User)) return player;

  const search = await tables.player
    .select({
      filterByFormula: `{${Player.discordTag}} = "${user instanceof User ? user.tag : user.user.tag}"`,
      maxRecords: 1,
    })
    .all();

  const found = Option.from(search.at(0));
  if (found.isNone()) return found;

  tables.player
    .update([
      {
        id: found.unwrap().id,
        fields: {
          [Player.discordId]: snowflake(user),
        },
      },
    ])
    .then();

  return cast(found);
}

export async function getTeam(role: RoleResolvable): Promise<Option<Record<Team>>> {
  const result = await tables.team
    .select({
      filterByFormula: `{${Team.roleId}} = "${snowflake(role)}"`,
      maxRecords: 1,
    })
    .all();

  const team = Option.from(result.at(0));
  if (team.isSome()) return cast(team);

  if (!(role instanceof Role)) return team;

  const search = await tables.team
    .select({
      filterByFormula: `{${Team.tag}} = "${role.name}"`,
      maxRecords: 1,
    })
    .all();

  const found = Option.from(search.at(0));
  if (found.isNone()) return found;

  tables.team
    .update([
      {
        id: found.unwrap().id,
        fields: {
          [Team.roleId]: snowflake(role),
        },
      },
    ])
    .then();

  return cast(found);
}
