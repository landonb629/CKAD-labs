const getUsers = async (req, res) => { 
    res.status(200).json({msg: 'getUsers'})
}

const createUser = async (req, res) => { 
    res.status(200).json({msg: 'createUser'})
}

const updateUser = async (req, res) => { 
    res.status(200).json({msg: 'updateUser'})
}

const deleteUser = async (req, res) => { 
    res.status(200).json({msg: 'deleteUser'})
}

module.exports = {
    deleteUser,
    updateUser,
    createUser,
    getUsers
}