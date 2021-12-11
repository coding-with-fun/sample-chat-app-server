const users = [];

const addUser = ({ id, room, name }) => {
    name = name.trim().toLowerCase();

    const existingUser = users.find((user) => {
        user.room === room && user.name === name;
    });

    if (existingUser) {
        return {
            error: "User name is already taken!",
        };
    }

    const newUser = {
        id,
        room,
        name,
    };

    users.push(newUser);

    return { user: newUser };
};

const removeUser = (id) => {
    const existingUserId = users.findIndex((user) => {
        user.id === id;
    });

    if (existingUserId > -1) {
        return users.splice(existingUserId, 1)[0];
    }
};

const getUser = (id) => users.find((user) => user.id === id);

const getRoomUsers = (room) => users.find((user) => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers,
};
