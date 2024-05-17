const User = require('../models/User');
const bcrypt = require('bcrypt');
class UserService{
    async createUser(newUser){
        const { name, email, password, phoneNumber } = newUser;
        try {
            console.log(name, email, password, phoneNumber)
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                return({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone : phoneNumber
            })
            
            if (createdUser) {
                return({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            console.log(e.message)
            reject(e)
        }
    }
    
    async loginUser(userLogin){
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                return({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                return({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }
            return({
                status: 'OK',
                message: 'SUCCESS',
                data: checkUser.id
        })
        } catch (error) {
            reject(error)
        }    
    }

}

module.exports = new UserService();