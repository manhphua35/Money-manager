const UserService = require('../services/UserService');

class UserController{
    async createUser(req,res){
        try {
            const { name, email, password, confirmPassword, phone } = req.body
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!email || !password || !confirmPassword) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            } else if (password !== confirmPassword) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The password is equal confirmPassword'
                })
            }
            const response = await UserService.createUser(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async loginUser(req,res){
        try {
            const { email, password } = req.body
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!email || !password) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            }
            const response = await UserService.loginUser(req.body)
            res.cookie('userId', response.data, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async logout(req,res){
        try {
            res.clearCookie('userId')
            return res.status(200).json({
                status: 'OK',
                message: 'Logout successfully'
            })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

}

module.exports = new UserController();