import inquirer from "inquirer";
import chalk from "chalk";
class Friend {
    name;
    isFriend;
    constructor(name, isFriend) {
        this.name = name;
        this.isFriend = isFriend;
    }
}
function areFriends(friend1, friend2) {
    return friend1.isFriend && friend2.isFriend;
}
async function playFriendChecker() {
    let playAgain = true;
    while (playAgain) {
        const friends = await promptForFriends();
        displayFriendshipResults(friends);
        playAgain = await askToPlayAgain();
    }
}
async function promptForFriends() {
    const friendCount = await promptForFriendCount();
    const friends = [];
    for (let i = 0; i < friendCount; i++) {
        const name = await promptForFriendName(i + 1);
        const isFriend = await confirmFriendship(name);
        friends.push(new Friend(name, isFriend));
    }
    return friends;
}
async function promptForFriendCount() {
    let friendCount = 0;
    while (friendCount < 2) {
        const response = await inquirer.prompt([
            {
                type: "number",
                name: "friendCount",
                message: "How many friends do you want to check?",
                default: 2,
                validate: (input) => {
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
async function promptForFriendName(order) {
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: `Enter name for friend ${order}:`,
            validate: (input) => {
                return input.trim() ? true : "Please enter a valid name.";
            },
        },
    ]);
    return name;
}
async function confirmFriendship(name) {
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
function displayFriendshipResults(friends) {
    console.log(chalk.red.bold("\nFriendship check results:"));
    for (let i = 0; i < friends.length; i++) {
        for (let j = i + 1; j < friends.length; j++) {
            const friend1 = friends[i];
            const friend2 = friends[j];
            const areTheyFriends = areFriends(friend1, friend2);
            console.log(`${friend1.name} and ${friend2.name} are ${areTheyFriends ? "" : "not "}friends.`);
        }
    }
}
async function askToPlayAgain() {
    const { restart } = await inquirer.prompt([
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
