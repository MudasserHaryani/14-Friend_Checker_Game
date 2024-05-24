import inquirer from "inquirer";
import chalk from "chalk";

class Friend {
  name: string;
  isFriend: boolean;

  constructor(name: string, isFriend: boolean) {
    this.name = name;
    this.isFriend = isFriend;
  }
}

function areFriends(friend1: Friend, friend2: Friend): boolean {
  return friend1.isFriend && friend2.isFriend;
}

async function playFriendChecker(): Promise<void> {
  let playAgain = true;

  while (playAgain) {
    const friends: Friend[] = await promptForFriends();

    displayFriendshipResults(friends);

    playAgain = await askToPlayAgain();
  }
}

async function promptForFriends(): Promise<Friend[]> {
  const friendCount = await promptForFriendCount();

  const friends: Friend[] = [];

  for (let i = 0; i < friendCount; i++) {
    const name = await promptForFriendName(i + 1);
    const isFriend = await confirmFriendship(name);
    friends.push(new Friend(name, isFriend));
  }

  return friends;
}

async function promptForFriendCount(): Promise<number> {
  let friendCount: number = 0;

  while (friendCount < 2) {
    const response = await inquirer.prompt([
      {
        type: "number",
        name: "friendCount",
        message: "How many friends do you want to check?",
        default: 2, // Set a default value
        validate: (input: any) => {
          const parsedInput = parseInt(input);
          if (isNaN(parsedInput) || parsedInput < 2) {
            return "Please enter a valid number (at least 2).";
          }
          return true;
        },
      },
    ]);

    friendCount = response.friendCount;
  }

  return friendCount;
}

async function promptForFriendName(order: number): Promise<string> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `Enter name for friend ${order}:`,
      validate: (input: string) => {
        return input.trim() ? true : "Please enter a valid name.";
      },
    },
  ]);

  return name;
}

async function confirmFriendship(name: string): Promise<boolean> {
  const { isFriend } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isFriend",
      message: `Is ${name} your friend?`,
      default: true,
    },
  ]);

  return isFriend;
}

function displayFriendshipResults(friends: Friend[]): void {
  console.log(chalk.red.bold("\nFriendship check results:"));
  for (let i = 0; i < friends.length; i++) {
    for (let j = i + 1; j < friends.length; j++) {
      const friend1 = friends[i];
      const friend2 = friends[j];
      const areTheyFriends = areFriends(friend1, friend2);
      console.log(`${friend1.name} and ${friend2.name} are ${
        areTheyFriends ? "" : "not "
      }friends.`);
    }
  }
}


async function askToPlayAgain(): Promise<boolean> {
  const { restart }: { restart: boolean } = await inquirer.prompt([
    {
      type: "confirm",
      name: "restart",
      message: "Do you want to play again?",
      default: false,
    },
  ]);

  return restart;
}

playFriendChecker().catch((err) => console.error("Error:", err));

